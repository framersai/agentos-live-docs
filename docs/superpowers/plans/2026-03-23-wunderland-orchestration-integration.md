# Wunderland Orchestration Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Wunderland's manual agentic loop with the AgentOS unified orchestration runtime, add YAML workflow/mission authoring, and expose graph-based orchestration in the CLI, library API, and examples.

**Architecture:** The existing `runToolCallingTurn()` loop is replaced by a `LoopController` adapter that preserves all security/auth/fallback behavior. Sessions become graph-backed with checkpointing. YAML workflows and missions compile to the same `CompiledExecutionGraph` IR. A `judgeNode` builder enables LLM-as-judge patterns.

**Tech Stack:** TypeScript, Vitest, Zod, YAML (Node.js built-in or `yaml` package)

**Spec:** `docs/superpowers/specs/2026-03-23-wunderland-orchestration-integration-design.md`

**Test commands:**

- Wunderland: `cd packages/wunderland && pnpm exec vitest run`
- AgentOS orchestration: `cd packages/agentos && node_modules/.bin/vitest run src/orchestration/__tests__/`

---

## File Structure

### New Files

| File                                                                     | Purpose                                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `packages/wunderland/src/runtime/llm-stream-adapter.ts`                  | `wrapLLMAsGenerator()` — bridges existing LLM call to AsyncGenerator for LoopController |
| `packages/wunderland/src/orchestration/yaml-compiler.ts`                 | `compileWorkflowYaml()` + `compileMissionYaml()`                                        |
| `packages/wunderland/src/orchestration/yaml-schema.ts`                   | YAML schema → Zod conversion (`schemaFromYaml()`)                                       |
| `packages/wunderland/src/orchestration/index.ts`                         | Barrel export for orchestration module                                                  |
| `packages/wunderland/src/cli/commands/mission.ts`                        | `wunderland mission run/explain` CLI command                                            |
| `packages/wunderland/src/cli/commands/graph.ts`                          | `wunderland graph run` CLI command                                                      |
| `packages/wunderland/presets/workflows/research-pipeline.workflow.yaml`  | Prebuilt research workflow                                                              |
| `packages/wunderland/presets/workflows/content-generation.workflow.yaml` | Prebuilt content creation workflow                                                      |
| `packages/wunderland/presets/workflows/data-extraction.workflow.yaml`    | Prebuilt data pipeline workflow                                                         |
| `packages/wunderland/presets/workflows/evaluation.workflow.yaml`         | Prebuilt LLM-as-judge evaluation workflow                                               |
| `packages/wunderland/presets/missions/deep-research.mission.yaml`        | Prebuilt research mission                                                               |
| `packages/wunderland/presets/missions/report-writer.mission.yaml`        | Prebuilt report writing mission                                                         |
| `packages/wunderland/examples/workflow-research.yaml`                    | Example YAML workflow                                                                   |
| `packages/wunderland/examples/mission-deep-research.yaml`                | Example YAML mission                                                                    |
| `packages/wunderland/examples/graph-research-loop.ts`                    | Example AgentGraph with cycles                                                          |
| `packages/wunderland/examples/graph-judge-pipeline.ts`                   | Example LLM-as-judge graph                                                              |
| `packages/wunderland/examples/session-streaming.ts`                      | Example session.stream() usage                                                          |
| `packages/wunderland/examples/checkpoint-resume.ts`                      | Example checkpoint/resume                                                               |

### Modified Files

| File                                                   | Change                                                         |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `packages/agentos/src/orchestration/builders/nodes.ts` | Add `judgeNode()` builder (after line 134)                     |
| `packages/agentos/src/orchestration/builders/index.ts` | Export `judgeNode`                                             |
| `packages/wunderland/src/runtime/tool-calling.ts`      | Replace manual loop with LoopController adapter                |
| `packages/wunderland/src/runtime/graph-runner.ts`      | Wire gmi → LoopController, add subgraph + judge support        |
| `packages/wunderland/src/public/index.ts`              | Graph-back session.sendText(), add loadWorkflow/loadMission    |
| `packages/wunderland/src/public/types.ts`              | Add session.stream/checkpoint/resume, loadWorkflow/loadMission |
| `packages/wunderland/src/cli/commands/workflows.ts`    | Replace stubs with real workflow execution                     |
| `packages/wunderland/src/cli/index.ts`                 | Register mission and graph commands                            |
| `packages/wunderland/src/workflows/index.ts`           | Add YAML compiler re-exports                                   |
| `packages/wunderland/README.md`                        | Add orchestration section                                      |
| `packages/wunderland/docs/CLI_TUI_GUIDE.md`            | Add workflow/mission/graph command docs                        |

---

## Task 1: LLM Stream Adapter

**Files:**

- Create: `packages/wunderland/src/runtime/llm-stream-adapter.ts`
- Test: `packages/wunderland/src/runtime/__tests__/llm-stream-adapter.test.ts`

The critical bridge that wraps Wunderland's existing LLM call (returns a response object) as an `AsyncGenerator<LoopChunk, LoopOutput>` that `LoopController` can consume.

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/src/runtime/__tests__/llm-stream-adapter.test.ts
import { describe, it, expect, vi } from 'vitest';
import { wrapLLMAsGenerator } from '../llm-stream-adapter.js';

describe('wrapLLMAsGenerator', () => {
  it('yields text_delta for text-only response', async () => {
    const mockCallLLM = vi.fn().mockResolvedValue({
      choices: [{ message: { content: 'Hello world', tool_calls: [] }, finish_reason: 'stop' }],
    });

    const gen = wrapLLMAsGenerator(mockCallLLM);
    const chunks = [];
    let finalOutput;

    while (true) {
      const { value, done } = await gen.next();
      if (done) {
        finalOutput = value;
        break;
      }
      chunks.push(value);
    }

    expect(chunks).toHaveLength(1);
    expect(chunks[0].type).toBe('text_delta');
    expect(chunks[0].content).toBe('Hello world');
    expect(finalOutput.responseText).toBe('Hello world');
    expect(finalOutput.toolCalls).toHaveLength(0);
    expect(finalOutput.finishReason).toBe('stop');
  });

  it('yields tool_call_request for tool-calling response', async () => {
    const mockCallLLM = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: '',
            tool_calls: [
              {
                id: 'tc-1',
                function: { name: 'web_search', arguments: '{"query":"test"}' },
              },
            ],
          },
          finish_reason: 'tool_calls',
        },
      ],
    });

    const gen = wrapLLMAsGenerator(mockCallLLM);
    const chunks = [];
    let finalOutput;

    while (true) {
      const { value, done } = await gen.next();
      if (done) {
        finalOutput = value;
        break;
      }
      chunks.push(value);
    }

    expect(chunks.some((c) => c.type === 'tool_call_request')).toBe(true);
    expect(finalOutput.toolCalls).toHaveLength(1);
    expect(finalOutput.toolCalls[0].name).toBe('web_search');
    expect(finalOutput.finishReason).toBe('tool_calls');
  });

  it('yields both text and tool calls when response has both', async () => {
    const mockCallLLM = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Let me search for that',
            tool_calls: [{ id: 'tc-1', function: { name: 'search', arguments: '{}' } }],
          },
          finish_reason: 'tool_calls',
        },
      ],
    });

    const gen = wrapLLMAsGenerator(mockCallLLM);
    const chunks = [];
    let finalOutput;

    while (true) {
      const { value, done } = await gen.next();
      if (done) {
        finalOutput = value;
        break;
      }
      chunks.push(value);
    }

    expect(chunks.some((c) => c.type === 'text_delta')).toBe(true);
    expect(chunks.some((c) => c.type === 'tool_call_request')).toBe(true);
    expect(finalOutput.responseText).toBe('Let me search for that');
  });

  it('handles empty response gracefully', async () => {
    const mockCallLLM = vi.fn().mockResolvedValue({
      choices: [{ message: { content: '' }, finish_reason: 'stop' }],
    });

    const gen = wrapLLMAsGenerator(mockCallLLM);
    let finalOutput;
    while (true) {
      const { value, done } = await gen.next();
      if (done) {
        finalOutput = value;
        break;
      }
    }

    expect(finalOutput.responseText).toBe('');
    expect(finalOutput.toolCalls).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/wunderland && pnpm exec vitest run src/runtime/__tests__/llm-stream-adapter.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement wrapLLMAsGenerator**

Create `packages/wunderland/src/runtime/llm-stream-adapter.ts`:

```typescript
import type { LoopChunk, LoopOutput, ToolCallRequest } from '@framers/agentos/orchestration';

/**
 * Wraps a single-response LLM call as an async generator compatible with LoopController.
 *
 * The callLLM function returns a full response object (OpenAI-compatible format).
 * This adapter yields LoopChunk events and returns a LoopOutput as the generator's
 * return value (captured via manual .next() when done=true).
 *
 * @param callLLM - Function that makes the LLM API call and returns the full response
 * @returns AsyncGenerator yielding LoopChunk events, returning LoopOutput
 */
export async function* wrapLLMAsGenerator(
  callLLM: () => Promise<any>
): AsyncGenerator<LoopChunk, LoopOutput, undefined> {
  const response = await callLLM();

  const message = response?.choices?.[0]?.message ?? {};
  const text = message.content ?? '';
  const finishReason = response?.choices?.[0]?.finish_reason ?? 'stop';

  // Yield text content if present
  if (text) {
    yield { type: 'text_delta', content: text };
  }

  // Extract and normalize tool calls
  const rawToolCalls = message.tool_calls ?? [];
  const toolCalls: ToolCallRequest[] = rawToolCalls.map((tc: any) => ({
    id: tc.id ?? `tc-${Date.now()}`,
    name: tc.function?.name ?? tc.name ?? 'unknown',
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
    finishReason,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/wunderland && pnpm exec vitest run src/runtime/__tests__/llm-stream-adapter.test.ts`
Expected: PASS — all 4 tests green

- [ ] **Step 5: Commit**

```bash
cd packages/wunderland
git add src/runtime/llm-stream-adapter.ts src/runtime/__tests__/llm-stream-adapter.test.ts
git commit -m "feat(runtime): add LLM stream adapter for LoopController bridge"
git push origin master
```

---

## Task 2: LoopController Adapter in tool-calling.ts

**Files:**

- Modify: `packages/wunderland/src/runtime/tool-calling.ts`
- Test: `packages/wunderland/src/runtime/__tests__/tool-calling-adapter.test.ts`

Replace the manual while loop with `LoopController.execute()`, preserving all existing behavior (security pipeline, step-up auth, tool-name rewriting, fallback, adaptive telemetry).

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/src/runtime/__tests__/tool-calling-adapter.test.ts
import { describe, it, expect, vi } from 'vitest';
import { runToolCallingTurn } from '../tool-calling.js';

describe('runToolCallingTurn (LoopController-backed)', () => {
  it('returns text for non-tool-calling response', async () => {
    // This test verifies the adapter works for the simplest case
    // Mock the LLM to return a text-only response
    const result = await runToolCallingTurn({
      apiKey: 'test-key',
      model: 'test-model',
      messages: [{ role: 'user', content: 'hello' }],
      toolMap: new Map(),
      toolContext: {},
      maxRounds: 5,
      dangerouslySkipPermissions: true,
      askPermission: async () => true,
      // Override the LLM call for testing
      _testLLMOverride: async () => ({
        choices: [{ message: { content: 'Hi there!', tool_calls: [] }, finish_reason: 'stop' }],
      }),
    });
    expect(result).toBe('Hi there!');
  });
});
```

Note: The actual implementation may need a `_testLLMOverride` hook or we test via the existing test patterns in the codebase. Read the existing tests first to understand the mock pattern.

- [ ] **Step 2: Implement the LoopController adapter**

Modify `packages/wunderland/src/runtime/tool-calling.ts`:

1. Add imports at top:

```typescript
import { LoopController, type LoopConfig } from '@framers/agentos/orchestration';
import { wrapLLMAsGenerator } from './llm-stream-adapter.js';
```

2. Extract the existing LLM call logic into a standalone function `callLLMForTurn(opts)` that returns the raw response object (this is the function we wrap with `wrapLLMAsGenerator`).

3. Extract tool execution logic into `executeToolWithContext(tc, opts)` that handles:
   - Tool-name rewriting (`strictToolNames`)
   - Step-up auth (tier 1/2/3)
   - Content security pipeline
   - Telemetry recording

4. Replace the main `while` loop body (lines ~266-862) with:

```typescript
const controller = new LoopController();
const config: LoopConfig = {
  maxIterations: opts.maxRounds,
  parallelTools: false, // preserve existing sequential behavior
  failureMode: opts.toolFailureMode ?? 'fail_open',
};

let finalText = '';
let roundCount = 0;
let lastEventWasToolResult = false;

for await (const event of controller.execute(config, {
  generateStream: () => wrapLLMAsGenerator(() => callLLMForTurn(opts)),
  executeTool: (tc) => executeToolWithContext(tc, opts),
  addToolResults: (results) => {
    appendToolResultsToMessages(opts.messages, results);
    opts.adaptiveRuntime?.recordToolOutcomes?.(results);
  },
})) {
  switch (event.type) {
    case 'text_delta':
      finalText += event.content;
      // askCheckpoint fires per-round (after tool results, when LLM generates next response)
      if (lastEventWasToolResult && opts.askCheckpoint) {
        const shouldContinue = await opts.askCheckpoint({ round: roundCount, toolCalls: [] });
        if (!shouldContinue) return finalText;
        roundCount++;
      }
      lastEventWasToolResult = false;
      break;
    case 'tool_call_request':
      for (const tc of event.toolCalls) opts.onToolCall?.(tc as any, tc.arguments);
      break;
    case 'tool_result':
      opts.onToolResult?.({ toolName: event.toolName, args: {}, success: true, durationMs: 0 });
      lastEventWasToolResult = true;
      break;
    case 'tool_error':
      opts.onToolResult?.({
        toolName: event.toolName,
        args: {},
        success: false,
        error: event.error,
        durationMs: 0,
      });
      lastEventWasToolResult = true;
      break;
  }
}

return finalText;
```

- [ ] **Step 3: Run existing tests to verify no regression**

Run: `cd packages/wunderland && pnpm exec vitest run`
Expected: All existing tests pass (the function signature is unchanged)

- [ ] **Step 4: Commit**

```bash
cd packages/wunderland
git add src/runtime/tool-calling.ts src/runtime/__tests__/tool-calling-adapter.test.ts
git commit -m "refactor(runtime): replace manual loop with LoopController adapter"
git push origin master
```

---

## Task 3: judgeNode Builder in AgentOS

**Files:**

- Modify: `packages/agentos/src/orchestration/builders/nodes.ts` (add after line 134)
- Modify: `packages/agentos/src/orchestration/builders/index.ts` (add export)
- Test: `packages/agentos/src/orchestration/__tests__/judge-node.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/judge-node.test.ts
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { judgeNode } from '../builders/nodes.js';

describe('judgeNode', () => {
  it('creates a gmi node with judge instructions', () => {
    const node = judgeNode({
      rubric: 'Score accuracy (1-10) and credibility (1-10)',
      schema: z.object({ accuracy: z.number(), credibility: z.number() }),
    });
    expect(node.type).toBe('gmi');
    expect(node.executionMode).toBe('single_turn');
    expect(node.effectClass).toBe('read');
    expect(node.executorConfig.type).toBe('gmi');
    if (node.executorConfig.type === 'gmi') {
      expect(node.executorConfig.instructions).toContain('evaluation judge');
      expect(node.executorConfig.instructions).toContain('Score accuracy');
    }
  });

  it('includes threshold in instructions when provided', () => {
    const node = judgeNode({
      rubric: 'Score quality 1-10',
      schema: z.object({ quality: z.number() }),
      threshold: 7,
    });
    if (node.executorConfig.type === 'gmi') {
      expect(node.executorConfig.instructions).toContain('7');
      expect(node.executorConfig.instructions).toContain('Pass Threshold');
    }
  });

  it('sets outputSchema from Zod schema', () => {
    const node = judgeNode({
      rubric: 'Rate it',
      schema: z.object({ score: z.number() }),
    });
    expect(node.outputSchema).toBeDefined();
    expect(node.outputSchema?.type).toBe('object');
  });

  it('generates unique ID with judge prefix', () => {
    const a = judgeNode({ rubric: 'r', schema: z.object({}) });
    const b = judgeNode({ rubric: 'r', schema: z.object({}) });
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^judge-/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && node_modules/.bin/vitest run src/orchestration/__tests__/judge-node.test.ts`
Expected: FAIL — judgeNode not exported

- [ ] **Step 3: Implement judgeNode**

Add to `packages/agentos/src/orchestration/builders/nodes.ts` after `subgraphNode`:

```typescript
/**
 * Creates an LLM-as-judge evaluation node with structured rubric output.
 *
 * The judge node is a specialized gmiNode that:
 * - Uses single_turn execution (judges don't tool-call)
 * - Enforces structured JSON output via outputSchema
 * - Includes rubric instructions and optional pass/fail threshold
 *
 * @param config.rubric - Evaluation criteria description
 * @param config.schema - Zod schema for the structured score output
 * @param config.threshold - Optional minimum score for passing (per dimension)
 * @param config.model - Optional model override for the judge LLM
 */
export function judgeNode(
  config: {
    rubric: string;
    schema: any; // ZodSchema — accepts any Zod schema
    threshold?: number;
    model?: string;
  },
  policies?: NodePolicies
): GraphNode {
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

  const base = gmiNode(
    {
      instructions,
      executionMode: 'single_turn',
    },
    policies
  );

  // Override ID prefix and add output schema
  return {
    ...base,
    id: `judge-${++nodeCounter}`,
    outputSchema: lowerZodToJsonSchema(config.schema),
  };
}
```

Add import at top of file: `import { lowerZodToJsonSchema } from '../compiler/SchemaLowering.js';`

Make `nodeCounter` accessible (it's already a module-level `let` variable).

Add to `packages/agentos/src/orchestration/builders/index.ts`:

```typescript
export {
  gmiNode,
  toolNode,
  humanNode,
  routerNode,
  guardrailNode,
  subgraphNode,
  judgeNode,
} from './nodes.js';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && node_modules/.bin/vitest run src/orchestration/__tests__/judge-node.test.ts`
Expected: PASS — all 4 tests green

- [ ] **Step 5: Run all orchestration tests**

Run: `cd packages/agentos && node_modules/.bin/vitest run src/orchestration/__tests__/`
Expected: All 267+ tests pass

- [ ] **Step 6: Commit**

```bash
cd packages/agentos
git add src/orchestration/builders/nodes.ts src/orchestration/builders/index.ts src/orchestration/__tests__/judge-node.test.ts
git commit -m "feat(orchestration): add judgeNode builder for LLM-as-judge evaluation"
git push origin master
```

---

## Task 4: YAML Schema Converter

**Files:**

- Create: `packages/wunderland/src/orchestration/yaml-schema.ts`
- Test: `packages/wunderland/src/orchestration/__tests__/yaml-schema.test.ts`

Converts simplified YAML schema definitions to Zod schemas.

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/src/orchestration/__tests__/yaml-schema.test.ts
import { describe, it, expect } from 'vitest';
import { schemaFromYaml } from '../yaml-schema.js';
import { z } from 'zod';

describe('schemaFromYaml', () => {
  it('converts string type', () => {
    const schema = schemaFromYaml({ name: { type: 'string' } });
    expect(schema.parse({ name: 'test' })).toEqual({ name: 'test' });
  });

  it('converts number type', () => {
    const schema = schemaFromYaml({ count: { type: 'number' } });
    expect(schema.parse({ count: 42 })).toEqual({ count: 42 });
  });

  it('converts boolean type', () => {
    const schema = schemaFromYaml({ active: { type: 'boolean' } });
    expect(schema.parse({ active: true })).toEqual({ active: true });
  });

  it('converts array type', () => {
    const schema = schemaFromYaml({ tags: { type: 'array', items: { type: 'string' } } });
    expect(schema.parse({ tags: ['a', 'b'] })).toEqual({ tags: ['a', 'b'] });
  });

  it('converts object type', () => {
    const schema = schemaFromYaml({ meta: { type: 'object' } });
    expect(schema.parse({ meta: { foo: 'bar' } })).toEqual({ meta: { foo: 'bar' } });
  });

  it('makes fields without required: true optional', () => {
    const schema = schemaFromYaml({
      name: { type: 'string', required: true },
      bio: { type: 'string' },
    });
    expect(schema.parse({ name: 'test' })).toEqual({ name: 'test' });
    expect(() => schema.parse({})).toThrow(); // name is required
  });

  it('applies default values', () => {
    const schema = schemaFromYaml({
      depth: { type: 'number', default: 3 },
    });
    expect(schema.parse({})).toEqual({ depth: 3 });
  });
});
```

- [ ] **Step 2: Implement schemaFromYaml**

Create `packages/wunderland/src/orchestration/yaml-schema.ts`:

```typescript
import { z, type ZodTypeAny } from 'zod';

/**
 * Converts a simplified YAML schema definition to a Zod object schema.
 *
 * YAML format:
 *   fieldName: { type: string|number|boolean|array|object, required?: boolean, default?: any, items?: {...} }
 *
 * Fields without `required: true` are optional.
 */
export function schemaFromYaml(yamlSchema: Record<string, YamlFieldDef>): z.ZodObject<any> {
  const shape: Record<string, ZodTypeAny> = {};

  for (const [key, def] of Object.entries(yamlSchema)) {
    let fieldSchema = yamlTypeToZod(def);

    if (def.default !== undefined) {
      fieldSchema = fieldSchema.default(def.default);
    } else if (!def.required) {
      fieldSchema = fieldSchema.optional();
    }

    shape[key] = fieldSchema;
  }

  return z.object(shape);
}

interface YamlFieldDef {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: any;
  items?: YamlFieldDef;
}

function yamlTypeToZod(def: YamlFieldDef): ZodTypeAny {
  switch (def.type) {
    case 'string':
      return z.string();
    case 'number':
      return z.number();
    case 'boolean':
      return z.boolean();
    case 'array':
      return z.array(def.items ? yamlTypeToZod(def.items) : z.unknown());
    case 'object':
      return z.record(z.unknown());
    default:
      return z.unknown();
  }
}
```

- [ ] **Step 3: Run tests, commit**

```bash
cd packages/wunderland
pnpm exec vitest run src/orchestration/__tests__/yaml-schema.test.ts
git add src/orchestration/yaml-schema.ts src/orchestration/__tests__/yaml-schema.test.ts
git commit -m "feat(orchestration): add YAML schema to Zod converter"
git push origin master
```

---

## Task 5: YAML Workflow & Mission Compiler

**Files:**

- Create: `packages/wunderland/src/orchestration/yaml-compiler.ts`
- Create: `packages/wunderland/src/orchestration/index.ts`
- Test: `packages/wunderland/src/orchestration/__tests__/yaml-compiler.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/src/orchestration/__tests__/yaml-compiler.test.ts
import { describe, it, expect } from 'vitest';
import { compileWorkflowYaml, compileMissionYaml } from '../yaml-compiler.js';

const SIMPLE_WORKFLOW_YAML = `
name: test-flow
input:
  topic: { type: string, required: true }
returns:
  result: { type: string }
steps:
  - id: search
    tool: web_search
  - id: summarize
    gmi:
      instructions: "Summarize the results"
`;

const BRANCH_WORKFLOW_YAML = `
name: branch-flow
input:
  query: { type: string, required: true }
returns:
  answer: { type: string }
steps:
  - id: classify
    tool: classifier
  - id: branch
    condition: "scratch.type == 'simple'"
    routes:
      true: quick-answer
      false: deep-research
  - id: quick-answer
    gmi:
      instructions: "Give a quick answer"
  - id: deep-research
    gmi:
      instructions: "Do deep research"
`;

const SIMPLE_MISSION_YAML = `
name: test-mission
goal: "Research {topic} thoroughly"
input:
  topic: { type: string, required: true }
returns:
  summary: { type: string }
planner:
  strategy: plan_and_execute
  maxSteps: 5
`;

describe('compileWorkflowYaml', () => {
  it('compiles a simple linear workflow', () => {
    const compiled = compileWorkflowYaml(SIMPLE_WORKFLOW_YAML);
    const ir = compiled.toIR();
    expect(ir.name).toBe('test-flow');
    expect(ir.nodes.length).toBeGreaterThanOrEqual(2);
  });

  it('compiles a workflow with branches', () => {
    const compiled = compileWorkflowYaml(BRANCH_WORKFLOW_YAML);
    const ir = compiled.toIR();
    expect(ir.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ir.edges.some((e) => e.type === 'conditional')).toBe(true);
  });
});

describe('compileMissionYaml', () => {
  it('compiles a simple mission', () => {
    const compiled = compileMissionYaml(SIMPLE_MISSION_YAML);
    expect(compiled.toIR).toBeDefined();
    expect(compiled.explain).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement YAML compiler**

Create `packages/wunderland/src/orchestration/yaml-compiler.ts`:

```typescript
import { parse as parseYaml } from 'yaml';
import {
  workflow,
  mission,
  toolNode,
  gmiNode,
  humanNode,
  judgeNode,
  type CompiledWorkflow,
  type CompiledMission,
} from '@framers/agentos/orchestration';
import { schemaFromYaml } from './yaml-schema.js';

/**
 * Compiles a YAML workflow definition string into a CompiledWorkflow.
 * YAML workflows are strictly DAG — no cycles allowed.
 */
export function compileWorkflowYaml(yamlContent: string): any {
  const def = parseYaml(yamlContent);

  let builder = workflow(def.name)
    .input(schemaFromYaml(def.input))
    .returns(schemaFromYaml(def.returns));

  for (const step of def.steps) {
    if (step.condition) {
      // Branch step
      const routes: Record<string, any> = {};
      for (const [key, targetId] of Object.entries(step.routes)) {
        const targetStep = def.steps.find((s: any) => s.id === targetId);
        if (targetStep) {
          routes[key] = stepToConfig(targetStep);
        }
      }
      builder = builder.branch(createConditionFn(step.condition), routes);
    } else {
      builder = builder.step(step.id, stepToConfig(step));
    }
  }

  return builder.compile();
}

/**
 * Compiles a YAML mission definition string into a CompiledMission.
 */
export function compileMissionYaml(yamlContent: string): any {
  const def = parseYaml(yamlContent);

  let builder = mission(def.name)
    .input(schemaFromYaml(def.input))
    .goal(def.goal)
    .returns(schemaFromYaml(def.returns))
    .planner(def.planner);

  if (def.policy) {
    builder = builder.policy(def.policy);
  }

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

function stepToConfig(step: any): any {
  if (step.tool) return { tool: step.tool, effectClass: step.effectClass };
  if (step.gmi) return { gmi: step.gmi, memory: step.memory, guardrails: step.guardrails };
  if (step.human) return { human: step.human };
  if (step.judge)
    return { gmi: { instructions: `Judge: ${step.judge.rubric}`, executionMode: 'single_turn' } };
  return { tool: 'unknown' };
}

function createConditionFn(expr: string): (state: any) => string {
  // Safe expression evaluator using dot-path access (no `with` — forbidden in ESM strict mode)
  // Supports: "scratch.confidence > 0.8", "scratch.type == 'simple'", "scratch.passed"
  return (state: any) => {
    try {
      // Replace dot-path references with state property access
      const rewritten = expr.replace(
        /\b(scratch|input|artifacts|memory)\b\.(\w+(?:\.\w+)*)/g,
        (_, partition, path) => {
          const parts = path.split('.');
          let access = `state.${partition}`;
          for (const p of parts) access += `?.${p}`;
          return access;
        }
      );
      // Use Function constructor with explicit state parameter (no `with`)
      const fn = new Function('state', `return String(${rewritten});`);
      return fn(state);
    } catch {
      return 'false';
    }
  };
}
```

Create `packages/wunderland/src/orchestration/index.ts`:

```typescript
export { compileWorkflowYaml, compileMissionYaml } from './yaml-compiler.js';
export { schemaFromYaml } from './yaml-schema.js';
```

Note: Add `yaml` package if not already a dependency: `pnpm add yaml`

- [ ] **Step 3: Run tests, commit**

```bash
cd packages/wunderland
pnpm exec vitest run src/orchestration/__tests__/yaml-compiler.test.ts
git add src/orchestration/
git commit -m "feat(orchestration): add YAML workflow and mission compiler"
git push origin master
```

---

## Task 6: Graph-Backed Sessions

**Files:**

- Modify: `packages/wunderland/src/public/types.ts`
- Modify: `packages/wunderland/src/public/index.ts`
- Test: `packages/wunderland/src/public/__tests__/session-graph.test.ts`

Add `session.stream()`, `session.checkpoint()`, `session.resume()` and wire `sendText()` through a single-node graph.

- [ ] **Step 1: Update types**

Add to `packages/wunderland/src/public/types.ts` WunderlandSession type:

```typescript
/** Stream graph events for real-time UI updates */
stream: (text: string, opts?: WunderlandSendTextOpts) =>
  AsyncIterable<import('@framers/agentos/orchestration').GraphEvent>;
/** Save current session state for later resume */
checkpoint: () => Promise<string>;
/** Restore session from a checkpoint */
resume: (checkpointId: string) => Promise<void>;
```

Add `loadWorkflow` and `loadMission` to WunderlandApp type:

```typescript
loadWorkflow: (yamlPath: string) => Promise<any>;
loadMission: (yamlPath: string) => Promise<any>;
listWorkflows: () => Array<{ name: string; path: string; type: 'workflow' | 'mission' }>;
```

- [ ] **Step 2: Implement in public/index.ts**

In the session factory (around line 699), add the new methods:

```typescript
stream: async function* (text, opts) {
  // Use the same graph as sendText but yield events instead of collecting
  const { streamWunderlandGraph } = await import('../runtime/graph-runner.js');
  // Build single-node graph for this turn (same as sendText)
  // Yield GraphEvents from streamWunderlandGraph
},

checkpoint: async () => {
  // Save session messages + state to checkpoint store
  const store = checkpointStore ?? new InMemoryCheckpointStore();
  const cpId = `session-${sessionId}-${Date.now()}`;
  await store.save({ id: cpId, graphId: 'session', runId: sessionId, nodeId: 'turn', timestamp: Date.now(), state: { input: {}, scratch: {}, artifacts: {}, diagnostics: emptyDiagnostics() }, nodeResults: {}, visitedNodes: [], pendingEdges: [] });
  return cpId;
},

resume: async (checkpointId) => {
  // Load checkpoint and restore session state
  const store = checkpointStore ?? new InMemoryCheckpointStore();
  const cp = await store.load(checkpointId);
  if (cp) { /* restore messages from checkpoint */ }
},
```

Add `loadWorkflow` and `loadMission` to the app object:

```typescript
loadWorkflow: async (yamlPath: string) => {
  const { readFile } = await import('node:fs/promises');
  const { compileWorkflowYaml } = await import('../orchestration/yaml-compiler.js');
  const content = await readFile(yamlPath, 'utf-8');
  return compileWorkflowYaml(content);
},

loadMission: async (yamlPath: string) => {
  const { readFile } = await import('node:fs/promises');
  const { compileMissionYaml } = await import('../orchestration/yaml-compiler.js');
  const content = await readFile(yamlPath, 'utf-8');
  return compileMissionYaml(content);
},
```

- [ ] **Step 3: Test and commit**

```bash
cd packages/wunderland
pnpm exec vitest run
git add src/public/
git commit -m "feat(public): add session.stream/checkpoint/resume and loadWorkflow/loadMission"
git push origin master
```

---

## Task 7: CLI Commands — workflow run, mission, graph

**Files:**

- Modify: `packages/wunderland/src/cli/commands/workflows.ts`
- Create: `packages/wunderland/src/cli/commands/mission.ts`
- Create: `packages/wunderland/src/cli/commands/graph.ts`
- Modify: `packages/wunderland/src/cli/index.ts`

- [ ] **Step 1: Implement real workflow run command**

Replace the stub in `workflows.ts` with:

```typescript
// 'run' subcommand
case 'run': {
  const target = args[1];
  if (!target) { console.error('Usage: wunderland workflow run <file|name>'); return; }

  const { readFile } = await import('node:fs/promises');
  const { compileWorkflowYaml } = await import('../../orchestration/yaml-compiler.js');
  const { invokeWunderlandGraph } = await import('../../runtime/graph-runner.js');

  const yamlPath = await resolveWorkflowPath(target);
  const content = await readFile(yamlPath, 'utf-8');
  const compiled = compileWorkflowYaml(content);
  const ir = compiled.toIR();

  console.log(`\n  ● ${ir.name}`);
  const result = await invokeWunderlandGraph(ir, parseInput(args), runtimeOpts);
  console.log(`  └── ✓ complete\n`);
  console.log(JSON.stringify(result, null, 2));
  break;
}
```

- [ ] **Step 2: Create mission command**

Create `packages/wunderland/src/cli/commands/mission.ts`:

```typescript
export default async function missionCommand(args: string[], opts: any): Promise<void> {
  const subcommand = args[0] ?? 'help';

  switch (subcommand) {
    case 'run': {
      const { readFile } = await import('node:fs/promises');
      const { compileMissionYaml } = await import('../../orchestration/yaml-compiler.js');
      const content = await readFile(args[1], 'utf-8');
      const compiled = compileMissionYaml(content);
      const result = await compiled.invoke(parseInput(args));
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'explain': {
      const { readFile } = await import('node:fs/promises');
      const { compileMissionYaml } = await import('../../orchestration/yaml-compiler.js');
      const content = await readFile(args[1], 'utf-8');
      const compiled = compileMissionYaml(content);
      const plan = await compiled.explain(parseInput(args));
      console.log('Generated Plan:');
      for (const step of plan.steps) {
        console.log(`  ${step.id} (${step.type})`);
      }
      break;
    }
    default:
      console.log('Usage: wunderland mission <run|explain> <file>');
  }
}
```

- [ ] **Step 3: Create graph command**

Create `packages/wunderland/src/cli/commands/graph.ts`:

```typescript
export default async function graphCommand(args: string[], opts: any): Promise<void> {
  if (args[0] !== 'run' || !args[1]) {
    console.log('Usage: wunderland graph run <file.ts>');
    return;
  }
  // Dynamic import of TypeScript graph file
  const graphModule = await import(args[1]);
  const graph = graphModule.default ?? graphModule.graph;
  const result = await graph.invoke(parseInput(args));
  console.log(JSON.stringify(result, null, 2));
}
```

- [ ] **Step 4: Register commands in CLI index**

Add to `packages/wunderland/src/cli/index.ts` COMMANDS map:

```typescript
mission: () => import('./commands/mission.js'),
graph: () => import('./commands/graph.js'),
```

- [ ] **Step 5: Commit**

```bash
cd packages/wunderland
git add src/cli/commands/workflows.ts src/cli/commands/mission.ts src/cli/commands/graph.ts src/cli/index.ts
git commit -m "feat(cli): add workflow run, mission, and graph commands"
git push origin master
```

---

## Task 8: Prebuilt YAML Templates

**Files:**

- Create: `packages/wunderland/presets/workflows/research-pipeline.workflow.yaml`
- Create: `packages/wunderland/presets/workflows/content-generation.workflow.yaml`
- Create: `packages/wunderland/presets/workflows/data-extraction.workflow.yaml`
- Create: `packages/wunderland/presets/workflows/evaluation.workflow.yaml`
- Create: `packages/wunderland/presets/missions/deep-research.mission.yaml`
- Create: `packages/wunderland/presets/missions/report-writer.mission.yaml`

- [ ] **Step 1: Create all 6 template files**

Each YAML file follows the format from the spec. Use realistic tool names that exist in the Wunderland ecosystem (web_search, summarize, etc.).

- [ ] **Step 2: Test templates compile**

```typescript
// packages/wunderland/src/orchestration/__tests__/yaml-templates.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compileWorkflowYaml, compileMissionYaml } from '../yaml-compiler.js';

const PRESETS_DIR = join(__dirname, '../../../presets');

describe('Prebuilt YAML templates', () => {
  for (const name of ['research-pipeline', 'content-generation', 'data-extraction', 'evaluation']) {
    it(`compiles ${name}.workflow.yaml`, () => {
      const content = readFileSync(join(PRESETS_DIR, `workflows/${name}.workflow.yaml`), 'utf-8');
      const compiled = compileWorkflowYaml(content);
      expect(compiled.toIR().nodes.length).toBeGreaterThan(0);
    });
  }

  for (const name of ['deep-research', 'report-writer']) {
    it(`compiles ${name}.mission.yaml`, () => {
      const content = readFileSync(join(PRESETS_DIR, `missions/${name}.mission.yaml`), 'utf-8');
      const compiled = compileMissionYaml(content);
      expect(compiled.toIR().nodes.length).toBeGreaterThan(0);
    });
  }
});
```

- [ ] **Step 3: Commit**

```bash
cd packages/wunderland
git add presets/ src/orchestration/__tests__/yaml-templates.test.ts
git commit -m "feat: add 6 prebuilt workflow and mission YAML templates"
git push origin master
```

---

## Task 9: Examples

**Files:**

- Create: 6 example files in `packages/wunderland/examples/`

- [ ] **Step 1: Create all example files**

| File                         | Content                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `workflow-research.yaml`     | Copy from presets/workflows/research-pipeline.workflow.yaml (runnable example) |
| `mission-deep-research.yaml` | Copy from presets/missions/deep-research.mission.yaml                          |
| `graph-research-loop.ts`     | TypeScript AgentGraph with conditional retry cycle                             |
| `graph-judge-pipeline.ts`    | LLM-as-judge with judgeNode structured rubric                                  |
| `session-streaming.ts`       | session.stream() with event rendering                                          |
| `checkpoint-resume.ts`       | session.checkpoint() + resume()                                                |

Each TypeScript example should be runnable with `npx tsx examples/graph-research-loop.ts`.

- [ ] **Step 2: Commit**

```bash
cd packages/wunderland
git add examples/
git commit -m "docs: add orchestration examples (workflow, mission, graph, judge, streaming)"
git push origin master
```

---

## Task 10: Documentation & README

**Files:**

- Modify: `packages/wunderland/README.md`
- Modify: `packages/wunderland/docs/CLI_TUI_GUIDE.md`
- Modify: `packages/wunderland/src/cli/help/topics.ts`

- [ ] **Step 1: Update README**

Add "Orchestration" section to README after the existing Quick Start section:

````markdown
## Orchestration

Wunderland supports three levels of workflow orchestration, all powered by the AgentOS unified orchestration layer:

### YAML Workflows (Deterministic DAGs)

```yaml
# research-pipeline.workflow.yaml
name: research-pipeline
steps:
  - id: search
    tool: web_search
  - id: summarize
    gmi: { instructions: 'Summarize results' }
```
````

```bash
wunderland workflow run research-pipeline.workflow.yaml --input '{"topic": "AI"}'
```

### YAML Missions (Intent-Driven)

```bash
wunderland mission run deep-research.mission.yaml --input '{"topic": "quantum computing"}'
wunderland mission explain deep-research.mission.yaml  # preview plan without executing
```

### TypeScript Graphs (Full Control)

```typescript
import { createWunderland } from 'wunderland';
const app = await createWunderland({ llm: { provider: 'openai', model: 'gpt-4o' } });
const flow = await app.loadWorkflow('./research-pipeline.workflow.yaml');
const result = await flow.invoke({ topic: 'quantum computing' });
```

See `examples/` for complete working examples.

````

- [ ] **Step 2: Update CLI guide**

Add workflow/mission/graph command documentation to `docs/CLI_TUI_GUIDE.md`.

- [ ] **Step 3: Add help topics**

Add orchestration help topics to `src/cli/help/topics.ts`.

- [ ] **Step 4: Commit**

```bash
cd packages/wunderland
git add README.md docs/CLI_TUI_GUIDE.md src/cli/help/topics.ts
git commit -m "docs: add orchestration docs to README, CLI guide, and help topics"
git push origin master
````

---

## Verification Checklist

After all tasks complete:

1. `cd packages/wunderland && pnpm exec vitest run` — all tests pass
2. `cd packages/agentos && node_modules/.bin/vitest run src/orchestration/__tests__/` — all tests pass (including new judgeNode)
3. `wunderland workflow list` — shows prebuilt templates
4. `wunderland workflow run presets/workflows/research-pipeline.workflow.yaml` — compiles and attempts execution
5. `wunderland mission explain presets/missions/deep-research.mission.yaml` — shows generated plan
6. Library API: `app.loadWorkflow()` returns a compiled workflow
7. Library API: `session.stream()` yields GraphEvents
8. Examples: `npx tsx examples/graph-judge-pipeline.ts` — runs without import errors
