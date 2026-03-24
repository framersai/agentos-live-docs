# Wunderland Orchestration Integration Design

## Summary

Wunderland currently has **zero usage** of the AgentOS unified orchestration layer. All multi-step execution is a manual `runToolCallingTurn()` loop in `packages/wunderland/src/runtime/tool-calling.ts`. This design replaces that manual loop with the orchestration runtime (Deep Integration / Option B), adds YAML + TypeScript workflow/mission authoring, and exposes orchestration as first-class in the CLI, library API, and examples.

**Goal**: Every Wunderland execution path — chat, workflows, missions, agencies — runs through `GraphRuntime`, getting checkpointing, streaming events, memory-aware state, and guardrail edges for free.

**Scope**: `packages/wunderland/` only. AgentOS orchestration layer (`packages/agentos/src/orchestration/`) is already built and tested (267 tests).

---

## Current State

### What Wunderland Uses From AgentOS

- LLM providers (`AIModelProviderManager`)
- Tools (`ITool` interface)
- Safety guards (`CircuitBreaker`, `CostGuard`, `StuckDetector`)
- Memory (`AgentMemory`, `ICognitiveMemoryManager`, `MarkdownWorkingMemory`)
- RAG (`HydeRetriever`, `IVectorStore`, `IGraphRAGEngine`)
- Discovery (`CapabilityDiscoveryResult`, `CapabilityIndex`)
- Channels (`IChannelAdapter`)

### What Wunderland Does NOT Use

- `GraphRuntime` / `CompiledExecutionGraph` / `LoopController`
- `AgentGraph` / `workflow()` / `mission()` builders
- `ICheckpointStore` / checkpointing
- `NodeExecutor` / `NodeScheduler` / `StateManager`
- `GraphEvent` streaming
- Any orchestration types or policies

### Current Execution Path

```
session.sendText(text)
  → createWunderlandChatRuntime()
    → runToolCallingTurn(opts)
      → manual while loop:
        1. Build messages + tools
        2. POST to LLM (with fallback providers)
        3. Parse tool_calls
        4. Step-up auth (Tier 1/2/3)
        5. Content security pipeline
        6. Execute tools with telemetry
        7. Append results to messages
        8. If tool_calls → goto 2
        9. Else → return text
```

This 500-line function contains critical behavior that must be preserved:

- Content security pipeline (sanitization before tool execution)
- Step-up authorization (Tier 1: auto, Tier 2: async review, Tier 3: sync HITL)
- Strict tool-name rewriting (LLM sometimes hallucinates tool names)
- Fallback providers (primary fails → try fallback LLM)
- Discovery-based tool definition planning
- Adaptive telemetry (learn from tool failures)
- `askCheckpoint` hook (human gate after each round)

---

## Architecture

```
session.sendText("research quantum computing")
  │
  ▼
WunderlandApp
  ├─ session.sendText()  → single-node AgentGraph (gmiNode) → GraphRuntime
  ├─ app.workflow(def)   → WorkflowBuilder → CompiledExecutionGraph → GraphRuntime
  ├─ app.mission(def)    → MissionBuilder → CompiledExecutionGraph → GraphRuntime
  ├─ app.loadWorkflow()  → YAML compiler → CompiledExecutionGraph → GraphRuntime
  └─ app.loadMission()   → YAML compiler → CompiledExecutionGraph → GraphRuntime
                                                    │
                                                    ▼
                                              GraphRuntime
                                              ├── LoopController (replaces runToolCallingTurn)
                                              ├── WunderlandNodeExecutor (preserves security/auth/fallback)
                                              ├── InMemoryCheckpointStore (session-scoped)
                                              └── GraphEventEmitter → session.stream()
```

---

## Part 1: LoopController Adapter (Replace runToolCallingTurn)

### Design

The manual loop in `tool-calling.ts` is replaced by `LoopController` from AgentOS. **All existing behavior is preserved** by wrapping it as `LoopContext` callbacks.

### generateStream Adapter

The critical bridge function. Wraps the existing synchronous LLM call (which returns a response object) as an `AsyncGenerator<LoopChunk, LoopOutput>` that the `LoopController` can consume.

```typescript
// packages/wunderland/src/runtime/llm-stream-adapter.ts

import type { LoopChunk, LoopOutput, ToolCallRequest } from '@framers/agentos/orchestration';

/**
 * Wraps the existing LLM API call (fetch-based, returns full response)
 * as an async generator compatible with LoopController.
 *
 * If the provider supports streaming (SSE), yields text_delta chunks in real-time.
 * If not, makes a single call and yields the full response as one chunk.
 */
export async function* wrapLLMAsGenerator(
  opts: ToolCallingOpts
): AsyncGenerator<LoopChunk, LoopOutput, undefined> {
  // Use existing provider call (handles fallback, API key resolution, model selection)
  const response = await callLLMWithFallback(opts);

  // Extract text content
  const text = response.choices?.[0]?.message?.content ?? '';
  if (text) {
    yield { type: 'text_delta', content: text };
  }

  // Extract tool calls
  const rawToolCalls = response.choices?.[0]?.message?.tool_calls ?? [];
  const toolCalls: ToolCallRequest[] = rawToolCalls.map((tc: any) => ({
    id: tc.id,
    name: tc.function?.name ?? tc.name,
    arguments:
      typeof tc.function?.arguments === 'string'
        ? JSON.parse(tc.function.arguments)
        : (tc.function?.arguments ?? {}),
  }));

  if (toolCalls.length > 0) {
    yield { type: 'tool_call_request', toolCalls };
  }

  // Return final output (captured by LoopController via manual .next())
  return {
    responseText: text,
    toolCalls,
    finishReason: response.choices?.[0]?.finish_reason ?? 'stop',
  };
}
```

When streaming providers are available (OpenAI SSE, Anthropic streaming), a future enhancement can yield `text_delta` chunks incrementally. For v1, this wraps the existing single-response call.

### LoopContext Adapter

```typescript
// packages/wunderland/src/runtime/tool-calling.ts

import { LoopController, type LoopContext, type LoopConfig } from '@framers/agentos/orchestration';
import { wrapLLMAsGenerator } from './llm-stream-adapter.js';

function createLoopContext(opts: ToolCallingOpts): LoopContext {
  return {
    generateStream: () => wrapLLMAsGenerator(opts),
    executeTool: async (tc) => {
      // 1. Tool-name rewriting (existing)
      const rewritten = rewriteToolName(tc, opts.toolMap);

      // 2. Step-up auth — Tier 1/2/3 (existing)
      const approved = await runStepUpAuth(rewritten, opts.stepUpAuthConfig, opts.askPermission);
      if (!approved) return { id: tc.id, name: tc.name, success: false, error: 'denied_by_auth' };

      // 3. Content security pipeline (existing)
      const sanitized = opts.securityPipeline
        ? await opts.securityPipeline.sanitize(rewritten.arguments)
        : rewritten.arguments;

      // 4. Execute with telemetry (existing)
      return executeWithTelemetry(rewritten, sanitized, opts);
    },
    addToolResults: (results) => {
      appendToMessages(opts.messages, results);
      // Adaptive telemetry — learn from failures (existing)
      opts.adaptiveRuntime?.recordToolOutcomes(results);
    },
  };
}

export async function runToolCallingTurn(opts: ToolCallingOpts): Promise<string> {
  const controller = new LoopController();
  const config: LoopConfig = {
    maxIterations: opts.maxRounds,
    parallelTools: opts.parallelTools ?? false,
    failureMode: opts.failOnToolError ? 'fail_closed' : 'fail_open',
    timeout: opts.turnTimeout,
  };
  const context = createLoopContext(opts);
  let finalText = '';

  for await (const event of controller.execute(config, context)) {
    switch (event.type) {
      case 'text_delta':
        finalText += event.content;
        break;
      case 'tool_call_request':
        for (const tc of event.toolCalls) opts.onToolCall?.(tc.name, tc.arguments);
        break;
      case 'tool_result':
        opts.onToolResult?.({ tool: event.toolName, result: event.result });
        break;
      case 'tool_error':
        opts.onFallback?.(new Error(event.error), opts.fallbackProvider);
        break;
      case 'max_iterations_reached':
        // Existing behavior: return whatever text we have
        break;
    }

    // askCheckpoint gate (existing hook) — pause after each ROUND, not each tool
    // LoopController emits 'loop_complete' or 'max_iterations_reached' at round boundaries.
    // We use 'tool_result' for the last tool in a round by tracking pending tool count.
    // Alternatively, LoopController could emit a 'round_complete' event (enhancement).
    // For v1: fire askCheckpoint when we see a text_delta after tool_results (means
    // LLM is generating the next response, so the previous tool round is done).
    if (event.type === 'text_delta' && lastEventWasToolResult && opts.askCheckpoint) {
      const shouldContinue = await opts.askCheckpoint({ round: roundCount });
      if (!shouldContinue) break;
      roundCount++;
    }
    lastEventWasToolResult = event.type === 'tool_result';
  }

  return finalText;
}
```

### What Changes

- The `while` loop body is replaced by `LoopController.execute()` async generator
- `callLLMWithFallback`, `rewriteToolName`, `runStepUpAuth`, `executeWithTelemetry` stay as-is
- Existing hooks (`onToolCall`, `onToolResult`, `onFallback`, `askCheckpoint`) mapped to LoopEvents

### What Stays Exactly The Same

- Provider resolution and API key handling
- Fallback provider logic
- Tool-name rewriting
- Step-up authorization tiers
- Content security pipeline
- Adaptive telemetry
- Message format and conversation history
- Return type (`Promise<string>`)

### Breaking Changes

- None. The function signature is identical.

---

## Part 2: Graph-Backed Sessions

### Design

`session.sendText()` wraps each turn in a single-node `AgentGraph`. This is invisible to consumers — same input, same output — but adds checkpointing and streaming.

### Implementation

```typescript
// packages/wunderland/src/public/index.ts — inside WunderlandSession

async sendText(text: string, opts?): Promise<WunderlandTurnResult> {
  const turnGraph = new AgentGraph({
    input: z.object({ text: z.string(), sessionId: z.string() }),
    scratch: z.object({}),
    artifacts: z.object({ response: z.string(), toolCalls: z.array(z.any()) }),
  })
    .addNode('respond', gmiNode({
      instructions: this.systemPrompt,
      executionMode: 'react_bounded',
      maxInternalIterations: this.config.maxRounds ?? 5,
      parallelTools: this.config.parallelTools ?? false,
    }, {
      memory: this.memoryPolicy,
      discovery: { enabled: true, kind: 'tool' },
    }))
    .addEdge(START, 'respond')
    .addEdge('respond', END)
    .compile({ checkpointStore: this.checkpointStore });

  const result = await turnGraph.invoke({ text, sessionId: this.id });
  return this.formatTurnResult(result);
}
```

### New Session Methods

```typescript
interface WunderlandSession {
  // Existing
  sendText(text: string, opts?): Promise<WunderlandTurnResult>;
  messages(): WunderlandMessage[];

  // New
  stream(text: string, opts?): AsyncIterable<GraphEvent>;
  checkpoint(): Promise<string>;
  resume(checkpointId: string): Promise<void>;
}
```

- `stream()`: returns `GraphEvent` async iterable for real-time UI updates
- `checkpoint()`: saves current session state via `ICheckpointStore`
- `resume()`: restores session from checkpoint (enables conversation replay)

### Checkpoint Store

Each `WunderlandApp` gets an `InMemoryCheckpointStore` by default. Configurable:

```typescript
const app = await createWunderland({
  llm: { provider: 'openai', model: 'gpt-4o' },
  checkpointStore: new SqliteCheckpointStore('./wunderland-checkpoints.db'),
});
```

---

## Part 3: WunderlandNodeExecutor

### Existing Bridge

Codex already built `packages/wunderland/src/runtime/graph-runner.ts` (~317 lines) which implements:

- `WunderlandNodeExecutor` — overrides the public `execute(node, state)` method (not protected sub-methods)
- `createWunderlandGraphRuntime()` — factory wiring Wunderland's toolMap, security, and LLM config
- `invokeWunderlandGraph()` / `streamWunderlandGraph()` — convenience wrappers

**This is the starting point, not a from-scratch design.** The existing bridge overrides `execute()` directly because `NodeExecutor.executeNode()` is private. This pattern is correct — we extend it rather than redesigning.

### Changes Needed to graph-runner.ts

1. Wire the `gmi` case to use the new `runToolCallingTurn()` (which is now LoopController-backed)
2. Wire the `subgraph` case to recursively call `invokeWunderlandGraph()`
3. Ensure `judge` node type routes through `gmi` with structured output enforcement

```typescript
// packages/wunderland/src/runtime/graph-runner.ts — extend existing

// In the execute() override's switch statement:
case 'gmi': {
  // Delegate to LoopController-backed runToolCallingTurn
  const text = await runToolCallingTurn({
    ...this.wunderlandOpts,
    messages: buildMessagesFromState(state),
    maxRounds: config.maxInternalIterations ?? 5,
  });
  return { success: true, output: text, artifactsUpdate: { response: text } };
}

case 'subgraph': {
  const result = await invokeWunderlandGraph(config.subgraphIR, state.input, this.wunderlandOpts);
  return { success: true, output: result };
}
```

### No AgentOS NodeExecutor Changes Required

The existing override-`execute()` pattern works. No need to refactor `NodeExecutor` internals to add protected methods.

---

## Part 4: YAML Workflow & Mission Compiler

### Workflow YAML Format

```yaml
# Strictly DAG — no cycles allowed
name: research-pipeline
description: 'Search, evaluate, judge, and summarize research sources'

input:
  topic: { type: string, required: true }

returns:
  summary: { type: string }
  sources: { type: array, items: { type: string } }

steps:
  - id: search
    tool: web_search
    effectClass: external

  - id: evaluate
    gmi:
      instructions: 'Evaluate source quality, assign confidence score 0-1'
      executionMode: single_turn
    memory:
      read: { types: [semantic] }
      write: { autoEncode: true }

  - id: judge
    judge:
      rubric: 'Score factual accuracy (1-10) and source credibility (1-10)'
      schema:
        accuracy: { type: number }
        credibility: { type: number }
      threshold: 7

  - id: branch
    condition: 'scratch.passed'
    routes:
      true: summarize
      false: flag-for-review

  - id: flag-for-review
    human:
      prompt: 'Sources scored below threshold. Review and approve or reject.'

  - id: summarize
    gmi:
      instructions: 'Write a cited summary from the evaluated sources'
    guardrails:
      output: [grounding-guard, pii-redaction]
      onViolation: sanitize
```

### Mission YAML Format

```yaml
name: deep-research
description: 'Intent-driven research with automatic planning'

goal: 'Research {topic} thoroughly and produce a cited summary'

input:
  topic: { type: string, required: true }

returns:
  summary: { type: string }
  sources: { type: array, items: { type: object } }
  confidence: { type: number }

planner:
  strategy: plan_and_execute
  maxSteps: 8
  maxIterationsPerNode: 3

policy:
  memory:
    consistency: snapshot
    read: { types: [semantic, episodic], scope: persona }
    write: auto
  discovery:
    kind: tool
    fallback: all
  guardrails: [grounding-guard, pii-redaction]

anchors:
  - id: fact-check
    tool: grounding_verifier
    phase: validate
    required: true
    before: { phase: deliver }

  - id: human-review
    human:
      prompt: 'Verify these sources are credible'
    phase: validate
    after: fact-check
    required: true
```

### YAML Edge Inference Rules

Steps connect implicitly based on ordering and step type:

1. **Linear steps**: Step N → Step N+1 (sequential edge)
2. **Branch steps**: Previous step → router node → each route target. **Branch terminals auto-join to the next non-branch step** in the list. If a branch target is the last step, it connects to END.
3. **Parallel steps** (future): Previous step → all parallel steps → next non-parallel step (with join semantics).
4. **Final step**: Last step in the list → END.
5. **Explicit `next` field** (optional): Any step can declare `next: stepId` to override implicit sequencing.
6. **Human steps with no successor**: Connect to END (terminal).

Example: In the research-pipeline YAML, `branch` routes to `summarize` or `flag-for-review`. `flag-for-review` is a human step and has no declared successor, so it connects to END. `summarize` connects to END (it's the last non-branch step after the branch).

### YAML Schema Defaults

- **Fields without `required: true` are optional.** This matches Zod's default behavior where `.optional()` is explicit. The YAML convention is: everything is optional unless marked `required: true`.

### YAML Compiler

```typescript
// packages/wunderland/src/orchestration/yaml-compiler.ts

import yaml from 'yaml'; // or use existing yaml parser
import {
  workflow,
  mission,
  toolNode,
  gmiNode,
  humanNode,
  judgeNode,
} from '@framers/agentos/orchestration';

export function compileWorkflowYaml(content: string): CompiledWorkflow {
  const def = yaml.parse(content);

  let builder = workflow(def.name)
    .input(schemaFromYaml(def.input))
    .returns(schemaFromYaml(def.returns));

  for (const step of def.steps) {
    if (step.tool) {
      builder = builder.step(step.id, { tool: step.tool, effectClass: step.effectClass });
    } else if (step.gmi) {
      builder = builder.step(step.id, {
        gmi: step.gmi,
        memory: step.memory,
        guardrails: step.guardrails,
      });
    } else if (step.judge) {
      builder = builder.step(step.id, { judge: step.judge });
    } else if (step.human) {
      builder = builder.step(step.id, { human: step.human });
    } else if (step.condition) {
      builder = builder.branch(
        createConditionFn(step.condition),
        mapRoutes(step.routes, def.steps)
      );
    }
  }

  return builder.compile();
}

export function compileMissionYaml(content: string): CompiledMission {
  const def = yaml.parse(content);

  let builder = mission(def.name)
    .input(schemaFromYaml(def.input))
    .goal(def.goal)
    .returns(schemaFromYaml(def.returns))
    .planner(def.planner)
    .policy(def.policy);

  for (const anchor of def.anchors ?? []) {
    const node = anchor.tool
      ? toolNode(anchor.tool)
      : anchor.human
        ? humanNode(anchor.human)
        : anchor.gmi
          ? gmiNode(anchor.gmi)
          : null;
    if (node) {
      builder = builder.anchor(anchor.id, node, {
        required: anchor.required ?? false,
        phase: anchor.phase,
        after: anchor.after,
        before: anchor.before,
      });
    }
  }

  return builder.compile();
}
```

### Schema Conversion

YAML schemas use a simplified format that compiles to Zod:

```yaml
# YAML schema
input:
  topic: { type: string, required: true }
  depth: { type: number, default: 3 }
  tags: { type: array, items: { type: string } }
```

→ Compiles to:

```typescript
z.object({
  topic: z.string(),
  depth: z.number().default(3),
  tags: z.array(z.string()).optional(),
});
```

---

## Part 5: judgeNode Builder

A specialized node for LLM-as-judge evaluation with structured rubric output.

```typescript
// packages/agentos/src/orchestration/builders/nodes.ts — new export

export function judgeNode(config: {
  rubric: string;
  schema: ZodSchema;
  threshold?: number;
  model?: string; // optional: use a different model for judging
}): GraphNode {
  const instructions = [
    'You are an evaluation judge. Your task is to score content against a rubric.',
    '',
    '## Rubric',
    config.rubric,
    '',
    '## Instructions',
    '1. Read the content in the conversation carefully.',
    '2. Score each dimension in the rubric on a scale of 1-10.',
    '3. Respond with ONLY a JSON object matching the required schema.',
    '4. Do not include any other text, explanation, or commentary.',
    config.threshold
      ? `\n## Pass Threshold\nA score of ${config.threshold} or higher on each dimension is required to pass.`
      : '',
  ].join('\n');

  return {
    ...gmiNode({
      instructions,
      executionMode: 'single_turn',
    }),
    type: 'gmi',
    outputSchema: lowerZodToJsonSchema(config.schema),
    // Runtime uses structured output enforcement to guarantee JSON conformance
  };
}
```

Usage in graphs:

```typescript
graph.addNode(
  'judge',
  judgeNode({
    rubric: 'Score factual accuracy (1-10) and source credibility (1-10)',
    schema: z.object({
      accuracy: z.number().min(1).max(10),
      credibility: z.number().min(1).max(10),
    }),
    threshold: 7,
  })
);
```

Usage in YAML:

```yaml
- id: judge
  judge:
    rubric: 'Score accuracy (1-10) and credibility (1-10)'
    schema:
      accuracy: { type: number }
      credibility: { type: number }
    threshold: 7
```

---

## Part 6: CLI Commands

### `wunderland workflow`

```
wunderland workflow list                    List .workflow.yaml files from presets/workflows/ and ~/.wunderland/workflows/
wunderland workflow run <file|name>         Execute a workflow YAML or TypeScript file
wunderland workflow explain <file|name>     Show execution plan (nodes + edges) without running
wunderland workflow status <runId>          Check run status from checkpoint store
```

### `wunderland mission`

```
wunderland mission run <file|name>          Execute a mission YAML file
wunderland mission explain <file|name>      Show PlanningEngine's generated plan without executing
```

### `wunderland graph`

```
wunderland graph run <file.ts>             Execute a TypeScript AgentGraph file (supports cycles)
```

### Execution Flow

```
wunderland workflow run research-pipeline.yaml
  │
  ├── 1. Read YAML file
  ├── 2. compileWorkflowYaml() → CompiledExecutionGraph
  ├── 3. Create WunderlandNodeExecutor with current config
  ├── 4. Create GraphRuntime
  ├── 5. runtime.stream(graph, input) → GraphEvent stream
  ├── 6. Render events in TUI (node progress, tool calls, checkpoints)
  └── 7. Print final artifacts
```

### TUI Rendering

```
$ wunderland workflow run research-pipeline.yaml --input '{"topic": "quantum computing"}'

  ● research-pipeline
  ├── ✓ search         web_search → 12 results      [2.3s]
  ├── ✓ evaluate       confidence: 0.85              [1.1s]
  ├── ✓ judge          accuracy: 8, credibility: 9   [0.8s]
  ├── ✓ branch         → summarize (passed)
  ├── ✓ summarize      1,247 tokens                  [3.2s]
  │   └── guardrail    grounding-guard: passed ✓
  └── ✓ complete       7.4s total

  Summary:
  Quantum computing leverages quantum mechanical phenomena...
```

---

## Part 7: WunderlandApp API

### New Methods

```typescript
interface WunderlandApp {
  // Existing
  session(sessionId?: string): WunderlandSession;
  diagnostics(): WunderlandDiagnostics;
  memory?: AgentMemory;
  close(): Promise<void>;

  // New — orchestration
  workflow(definition: WorkflowDefinition | string): CompiledWorkflow;
  mission(definition: MissionDefinition | string): CompiledMission;
  loadWorkflow(yamlPath: string): Promise<CompiledWorkflow>;
  loadMission(yamlPath: string): Promise<CompiledMission>;
  listWorkflows(): WorkflowInfo[];

  // New — low-level graph access
  agentGraph(stateSchema): AgentGraph;
  runGraph(graph: CompiledExecutionGraph, input: unknown): Promise<unknown>;
  streamGraph(graph: CompiledExecutionGraph, input: unknown): AsyncIterable<GraphEvent>;
}
```

### Usage Example

```typescript
import { createWunderland } from 'wunderland';

const app = await createWunderland({
  llm: { provider: 'openai', model: 'gpt-4o' },
  tools: 'curated',
});

// Chat (graph-backed, with checkpointing)
const session = app.session();
const result = await session.sendText('Research quantum computing');

// Stream events
for await (const event of session.stream('Tell me more')) {
  if (event.type === 'text_delta') process.stdout.write(event.content);
}

// Workflow from YAML
const flow = await app.loadWorkflow('./research-pipeline.workflow.yaml');
const output = await flow.invoke({ topic: 'quantum computing' });

// Mission from YAML
const m = await app.loadMission('./deep-research.mission.yaml');
const plan = await m.explain({ topic: 'AI safety' }); // preview plan
const result2 = await m.invoke({ topic: 'AI safety' }); // execute

// Checkpoint / resume
const cpId = await session.checkpoint();
// ... later ...
await session.resume(cpId);
```

---

## Part 8: Prebuilt Workflow Templates

Ship in `packages/wunderland/presets/workflows/`:

| File                               | Pattern                                        | Description                                |
| ---------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `research-pipeline.workflow.yaml`  | search → evaluate → judge → branch → summarize | Multi-source research with quality scoring |
| `content-generation.workflow.yaml` | draft → judge → revise → publish               | Content creation with iterative review     |
| `data-extraction.workflow.yaml`    | fetch → parse → validate → store               | Structured data pipeline                   |
| `evaluation.workflow.yaml`         | generate → judge(rubric) → aggregate           | LLM-as-judge evaluation harness            |

Ship in `packages/wunderland/presets/missions/`:

| File                         | Pattern                                        | Description                         |
| ---------------------------- | ---------------------------------------------- | ----------------------------------- |
| `deep-research.mission.yaml` | Planner-driven research with fact-check anchor | Open-ended research with guardrails |
| `report-writer.mission.yaml` | Planner-driven report with human review anchor | Long-form content with review gate  |

---

## Part 9: Examples

### New Example Files

| File                                  | What it demonstrates                                    |
| ------------------------------------- | ------------------------------------------------------- |
| `examples/workflow-research.yaml`     | YAML workflow with search, evaluate, judge, summarize   |
| `examples/workflow-onboarding.yaml`   | YAML workflow with branch and parallel steps            |
| `examples/mission-deep-research.yaml` | YAML mission with anchors and guardrails                |
| `examples/graph-research-loop.ts`     | TypeScript AgentGraph with conditional retry cycle      |
| `examples/graph-judge-pipeline.ts`    | LLM-as-judge with structured rubric output              |
| `examples/graph-multi-agent.ts`       | Subgraph composition with agent handoffs                |
| `examples/session-streaming.ts`       | session.stream() with real-time event rendering         |
| `examples/checkpoint-resume.ts`       | session.checkpoint() + resume() for conversation replay |

---

## File Structure

### New Files

| File                                      | Purpose                                       |
| ----------------------------------------- | --------------------------------------------- |
| `src/runtime/wunderland-node-executor.ts` | WunderlandNodeExecutor extending NodeExecutor |
| `src/orchestration/yaml-compiler.ts`      | compileWorkflowYaml + compileMissionYaml      |
| `src/orchestration/yaml-schema.ts`        | YAML schema → Zod conversion                  |
| `src/orchestration/index.ts`              | Barrel export for orchestration module        |
| `src/cli/commands/mission.ts`             | `wunderland mission` CLI command              |
| `src/cli/commands/graph.ts`               | `wunderland graph run` CLI command            |
| `presets/workflows/*.workflow.yaml`       | 4 prebuilt workflow templates                 |
| `presets/missions/*.mission.yaml`         | 2 prebuilt mission templates                  |
| 8 example files                           | See Part 9                                    |

### Modified Files

| File                            | Change                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `src/runtime/tool-calling.ts`   | Replace manual loop with LoopController adapter                                    |
| `src/public/index.ts`           | Add workflow/mission/graph methods to WunderlandApp, graph-back session.sendText() |
| `src/public/types.ts`           | Add session.stream/checkpoint/resume, WunderlandApp orchestration methods          |
| `src/api/chat-runtime.ts`       | Wire WunderlandNodeExecutor                                                        |
| `src/cli/commands/workflows.ts` | Replace stubs with real workflow execution                                         |
| `src/cli/commands/index.ts`     | Register mission and graph commands                                                |
| `src/workflows/index.ts`        | Re-export orchestration types + YAML compiler                                      |
| `README.md`                     | Add orchestration section                                                          |
| `docs/CLI_TUI_GUIDE.md`         | Add workflow/mission/graph command docs                                            |

### Modified in AgentOS (minor)

| File                                                         | Change                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| `packages/agentos/src/orchestration/builders/nodes.ts`       | Add `judgeNode()` builder                                   |
| `packages/agentos/src/orchestration/runtime/NodeExecutor.ts` | Make gmi/subgraph execution overridable (protected methods) |

---

## Implementation Order

1. **LoopController adapter** — Replace `runToolCallingTurn()` internals while preserving all security/auth/fallback behavior
2. **WunderlandNodeExecutor** — Concrete gmi + subgraph execution using Wunderland's runtime
3. **Graph-backed sessions** — `session.sendText()` through single-node graph, add `session.stream()` / `checkpoint()` / `resume()`
4. **judgeNode builder** — Add to AgentOS orchestration builders
5. **YAML compiler** — `compileWorkflowYaml()` + `compileMissionYaml()` + schema conversion
6. **WunderlandApp methods** — `app.workflow()`, `app.mission()`, `app.loadWorkflow()`, `app.loadMission()`
7. **CLI commands** — `wunderland workflow run/list/explain`, `wunderland mission run/explain`, `wunderland graph run`
8. **Prebuilt templates** — 4 workflow YAMLs + 2 mission YAMLs
9. **Examples** — 8 example files demonstrating all patterns
10. **Docs + README** — Update CLI guide, README, help topics

---

## Testing Strategy

- **LoopController adapter**: Verify same output as manual loop for identical inputs. Regression test the existing `tool-calling.test.ts`.
- **Graph-backed sessions**: Verify `session.sendText()` returns identical `WunderlandTurnResult`. Verify checkpoints saved.
- **YAML compiler**: Parse each prebuilt template, verify valid `CompiledExecutionGraph` with correct node/edge counts.
- **judgeNode**: Verify structured output schema enforcement, threshold logic.
- **CLI commands**: Smoke test `workflow run` with a simple YAML file.
- **Integration**: End-to-end test running a workflow YAML through the full stack.

---

## Boundary Rules

- **Workflow YAML is strictly DAG.** No cycles. Use AgentGraph (TypeScript) for cyclic graphs.
- **Mission YAML generates DAGs in v1.** Planner does not produce cycles.
- **`session.sendText()` is backwards-compatible.** Same signature, same return type. Graph runtime is an internal detail.
- **No new required dependencies.** YAML parsing uses Node.js built-in or the existing `yaml` package.
- **Existing tests must not break.** The LoopController adapter is a refactor, not a rewrite.
