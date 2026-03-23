# Unified Orchestration Layer Design

## Summary

AgentOS has all the raw orchestration primitives — a ReAct loop in GMI, a DAG workflow engine, a planning engine with 6 strategy modes, capability discovery, cognitive memory, personality modeling, and guardrails — but they are fragmented across three disconnected runtimes. This design unifies them under one compiled intermediate representation (IR) and one graph runtime, exposed through three authoring APIs at different abstraction levels.

**Goal**: One runtime, three authoring styles, five differentiators that no other framework offers.

**Ship order**: GraphRuntime + checkpoints (phase 1) → AgentGraph (phase 2) → workflow() (phase 3) → mission() (phase 4).

---

## Motivation

### The Fragmentation Problem

Today AgentOS has:

| Component            | Location                                 | Runtime                                            |
| -------------------- | ---------------------------------------- | -------------------------------------------------- |
| ReAct loop           | `cognitive_substrate/GMI.ts:684`         | Imperative while loop, hardcoded `safetyBreak < 5` |
| Turn planning        | `core/orchestration/TurnPlanner.ts`      | Pre-turn policy, disconnected from workflow engine |
| DAG workflows        | `core/workflows/WorkflowEngine.ts`       | Separate task scheduler with own state machine     |
| Planning engine      | `core/planning/PlanningEngine.ts`        | In-memory checkpoint Map, not wired to workflows   |
| Capability discovery | `discovery/CapabilityDiscoveryEngine.ts` | Only accessible via TurnPlanner                    |
| Cognitive memory     | `memory/CognitiveMemoryManager.ts`       | Only accessible inside GMI                         |
| Guardrails           | `core/guardrails/GuardrailEngine.ts`     | Only on final input/output, not between steps      |

These components cannot compose. A workflow task cannot use capability discovery. A GMI node cannot participate in a DAG. Guardrails cannot run between workflow steps. Memory reads cannot influence routing.

### Competitive Landscape

| Feature                      | LangGraph | Mastra      | AgentOS (current) | AgentOS (proposed)                                |
| ---------------------------- | --------- | ----------- | ----------------- | ------------------------------------------------- |
| Declarative graph            | Yes       | No          | No                | Yes (AgentGraph)                                  |
| Fluent DAG DSL               | No        | Yes         | No                | Yes (workflow)                                    |
| Intent-driven orchestration  | No        | No          | No                | Yes (mission)                                     |
| Checkpointing / time-travel  | Yes       | No          | In-memory only    | Persistent (ICheckpointStore)                     |
| Conditional routing          | Yes       | Branch only | No                | Yes (conditional + discovery + personality edges) |
| Subgraph composition         | Yes       | No          | No                | Yes                                               |
| Memory-aware state           | No        | No          | No                | Yes                                               |
| Capability discovery routing | No        | No          | No                | Yes                                               |
| Personality-driven routing   | No        | No          | No                | Yes                                               |
| Inter-step guardrails        | No        | No          | No                | Yes                                               |
| Streaming at every edge      | Partial   | No          | GMI only          | Yes                                               |
| Typed step I/O (Zod)         | No        | Yes         | JSON Schema only  | Yes (Zod → JSON Schema)                           |

---

## Architecture Overview

```
mission('goal')          workflow('name')         AgentGraph<S>()          YAML/JSON
  .goal(...)               .step().then()           .addNode()              steps:
  .returns(z)              .branch()                .addEdge()                - id: ...
  .anchor(...)             .parallel()              .addConditionalEdge()
       |                        |                        |                      |
       +------------+-----------+------------------------+----------------------+
                    |
                    v
          CompiledExecutionGraph (IR)
          +-------------------------------+
          | nodes: GraphNode[]            |  node types: gmi | tool | extension |
          | edges: GraphEdge[]            |  human | guardrail | router | subgraph
          | stateSchema: JSONSchema       |
          | checkpointPolicy: ...         |  edge types: static | conditional |
          | memoryPolicy: ...             |  discovery | personality
          | reducers: StateReducers       |
          +---------------+---------------+
                          |
                          v
                GraphRuntime (single executor)
                +-- LoopController (extracted from GMI)
                +-- ICheckpointStore (persistent)
                +-- StreamingManager (existing)
                +-- ToolOrchestrator (existing)
                +-- GuardrailEngine (existing)
                +-- CapabilityDiscoveryEngine (existing)
                +-- CognitiveMemoryManager (existing)
```

All three authoring APIs compile to the same `CompiledExecutionGraph` IR. One `GraphRuntime` executes everything. Existing AgentOS components plug in as runtime dependencies.

---

## CompiledExecutionGraph IR

The IR is the single source of truth the runtime executes. It is inspectable and debuggable.

**Serialization model**: The IR is fully serializable to JSON **when authored via YAML/JSON or workflow()**. When authored via AgentGraph with JS function conditions or router nodes, the IR contains opaque function references that are only valid in-process. For cross-process persistence (checkpoint store, Workbench visualization), function references are stored as metadata-only stubs (name, description) — the runtime resolves them from the compiled graph instance at resume time.

### GraphNode

```typescript
interface GraphNode {
  id: string;
  type: 'gmi' | 'tool' | 'extension' | 'human' | 'guardrail' | 'router' | 'subgraph';

  // Execution
  executorConfig: NodeExecutorConfig;
  executionMode: NodeExecutionMode;
  effectClass: EffectClass;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  checkpoint: 'before' | 'after' | 'both' | 'none';

  // Schemas (JSON Schema, lowered from Zod at compile time)
  inputSchema?: JSONSchema;
  outputSchema?: JSONSchema;

  // Policies (AgentOS differentiators)
  memoryPolicy?: MemoryPolicy;
  discoveryPolicy?: DiscoveryPolicy;
  personaPolicy?: PersonaPolicy;
  guardrailPolicy?: GuardrailPolicy;
}
```

### NodeExecutionMode

Controls whether a GMI node runs an internal ReAct loop. This is the critical distinction that prevents hidden loops in deterministic workflows.

```typescript
type NodeExecutionMode =
  | 'single_turn' // One LLM call, no internal tool loop.
  // DEFAULT for workflow() gmi steps.
  | 'react_bounded' // Internal ReAct loop with maxInternalIterations.
  // DEFAULT for AgentGraph() gmi nodes.
  | 'planner_controlled'; // PlanningEngine decides loop behavior.
// DEFAULT for mission() gmi steps.
```

### EffectClass

Determines replay behavior on resume from checkpoint.

```typescript
type EffectClass =
  | 'pure' // Deterministic, safe to re-execute (format, transform)
  | 'read' // Reads external state, idempotent (DB query, memory read)
  | 'write' // Writes external state, NOT idempotent (DB insert)
  | 'external' // Calls external API, NOT idempotent (web search, Stripe)
  | 'human'; // Requires human input, NOT idempotent

// On resume from checkpoint:
// - pure/read: re-execute (safe, might get fresher data)
// - write/external/human: replay recorded output from checkpoint
```

### GraphEdge

```typescript
interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'static' | 'conditional' | 'discovery' | 'personality';

  // Conditional: routing logic
  // When authored via JS (AgentGraph builder): opaque function reference (in-process only)
  // When authored via YAML/JSON: expression string using GraphExpr DSL
  condition?: GraphCondition;

  // Discovery: target resolved at runtime via CapabilityDiscoveryEngine
  discoveryQuery?: string;
  discoveryKind?: 'tool' | 'skill' | 'extension' | 'any';
  discoveryFallback?: string; // fallback target node ID

  // Personality: routing influenced by HEXACO traits
  personalityCondition?: {
    trait: string; // HEXACO trait name
    threshold: number;
    above: string; // target node ID
    below: string; // target node ID
  };

  // Inter-edge guardrail
  guardrailPolicy?: GuardrailPolicy;
}
```

### GraphCondition

Routing conditions have two representations depending on authoring context:

```typescript
// In-process (AgentGraph builder): JS function reference
type GraphConditionFn = (state: GraphState) => string;

// Serializable (YAML/JSON, workflow DSL): expression DSL
// Uses dot-path state access with comparison operators
// Examples:
//   "scratch.confidence > 0.8"
//   "scratch.selectedPlan == 'pro'"
//   "artifacts.results.length > 0"
type GraphConditionExpr = string;

type GraphCondition =
  | { type: 'function'; fn: GraphConditionFn; description?: string }
  | { type: 'expression'; expr: GraphConditionExpr };

// At compile time:
// - AgentGraph.addConditionalEdge(src, fn) → { type: 'function', fn }
// - YAML condition: "scratch.confidence > 0.8" → { type: 'expression', expr }
// - workflow().branch(fn) → { type: 'function', fn }

// The expression DSL supports:
// - Dot-path access: scratch.foo.bar, input.topic, artifacts.count
// - Comparisons: ==, !=, >, <, >=, <=
// - Logical: &&, ||, !
// - Literals: strings, numbers, booleans, null
// - No function calls, no assignment, no side effects (evaluated in sandbox)
```

### NodeExecutorConfig

Defines what a node actually does, discriminated by node type:

```typescript
type NodeExecutorConfig =
  | {
      type: 'gmi';
      instructions: string;
      maxInternalIterations?: number;
      parallelTools?: boolean;
      temperature?: number;
      maxTokens?: number;
    }
  | { type: 'tool'; toolName: string; args?: Record<string, unknown> }
  | { type: 'extension'; extensionId: string; method: string }
  | { type: 'human'; prompt: string }
  | {
      type: 'guardrail';
      guardrailIds: string[];
      onViolation: 'block' | 'reroute' | 'warn' | 'sanitize';
      rerouteTarget?: string;
    }
  | { type: 'router'; condition: GraphCondition }
  | {
      type: 'subgraph';
      graphId: string;
      inputMapping?: Record<string, string>;
      outputMapping?: Record<string, string>;
    };
```

### RetryPolicy

```typescript
interface RetryPolicy {
  maxAttempts: number; // default: 1 (no retry)
  backoff: 'fixed' | 'linear' | 'exponential';
  backoffMs: number; // base delay
  retryOn?: string[]; // error codes to retry on (default: all)
}
```

### Discovery Edge Semantics

When a `discovery` edge is evaluated at runtime:

1. `CapabilityDiscoveryEngine.discover(discoveryQuery, { kind: discoveryKind })` is called
2. The **top-1 result** is selected
3. A **transient `toolNode`** is instantiated with the discovered tool name and added to the runtime graph
4. The transient node's output edge connects to **all outgoing edges of the discovery edge's source** that are not the discovery edge itself (fan-through)
5. If discovery returns 0 results and `discoveryFallback` is set, route to the fallback node
6. If discovery returns 0 results and no fallback, emit `error` event with code `DISCOVERY_NO_RESULTS`

### MemoryView

Read-only interface for accessing cognitive memory traces within graph state:

```typescript
interface MemoryView {
  /** Traces fetched by the MemoryPolicy.read config for the current node */
  traces: ReadonlyArray<{
    traceId: string;
    type: MemoryTraceType;
    content: string;
    strength: number;
    scope: MemoryScope;
    createdAt: number;
    metadata?: Record<string, unknown>;
  }>;

  /** Pending writes queued by MemoryPolicy.write (committed on node success) */
  pendingWrites: ReadonlyArray<{
    type: MemoryTraceType;
    content: string;
    scope: MemoryScope;
  }>;

  /** Summary stats */
  totalTracesRead: number;
  readLatencyMs: number;
}

// MemoryTraceType and MemoryScope are re-exported from CognitiveMemoryManager:
type MemoryTraceType = 'episodic' | 'semantic' | 'procedural' | 'prospective';
type MemoryScope = 'global' | 'persona' | 'session' | 'conversation';
```

### DiagnosticsView

```typescript
interface DiagnosticsView {
  totalTokensUsed: number;
  totalDurationMs: number;
  nodeTimings: Record<string, { startMs: number; endMs: number; tokensUsed: number }>;
  discoveryResults: Record<string, { query: string; toolsFound: string[]; latencyMs: number }>;
  guardrailResults: Record<
    string,
    { guardrailId: string; passed: boolean; action: string; latencyMs: number }
  >;
  checkpointsSaved: number;
  memoryReads: number;
  memoryWrites: number;
}
```

### CheckpointMetadata

```typescript
interface CheckpointMetadata {
  id: string;
  runId: string;
  graphId: string;
  nodeId: string;
  timestamp: number;
  stateSize: number; // bytes
  hasMemorySnapshot: boolean;
}
```

### RunInspection

```typescript
interface RunInspection {
  runId: string;
  graphId: string;
  status: 'running' | 'completed' | 'errored' | 'interrupted';
  currentNodeId?: string;
  visitedNodes: string[];
  events: GraphEvent[];
  checkpoints: CheckpointMetadata[];
  diagnostics: DiagnosticsView;
  finalOutput?: unknown;
  error?: { message: string; code: string; nodeId?: string };
}
```

### GraphState

```typescript
interface GraphState<TInput = unknown, TScratch = unknown, TArtifacts = unknown> {
  input: Readonly<TInput>; // Immutable, set at start
  scratch: TScratch; // Mutable working memory between nodes
  memory: MemoryView; // Reads from cognitive memory, writes queued
  artifacts: TArtifacts; // Produced outputs
  diagnostics: DiagnosticsView; // Token usage, latency, discovery results

  // Runtime metadata (managed by GraphRuntime)
  currentNodeId: string;
  visitedNodes: string[];
  iteration: number;
  checkpointId?: string;
}
```

### State Ownership Rules

| Partition     | Who writes               | Who reads                 | Checkpointed                                   |
| ------------- | ------------------------ | ------------------------- | ---------------------------------------------- |
| `input`       | Caller (once, immutable) | All nodes                 | Yes                                            |
| `scratch`     | Any node via reducers    | Any node                  | Yes                                            |
| `memory`      | MemoryPolicy (auto)      | Nodes with memory.read    | Yes (when consistency = snapshot or journaled) |
| `artifacts`   | Nodes with outputSchema  | Downstream nodes + caller | Yes                                            |
| `diagnostics` | Runtime (auto)           | Workbench / debugging     | Yes                                            |

### State Reducers

Required for parallel execution and resume correctness. Define how state partitions merge when multiple branches write to the same field.

```typescript
interface StateReducers {
  [fieldPath: string]: ReducerFn | BuiltinReducer;
}

type BuiltinReducer =
  | 'concat' // Arrays: [...existing, ...incoming]
  | 'merge' // Objects: { ...existing, ...incoming }
  | 'max' // Numbers: Math.max(existing, incoming)
  | 'min' // Numbers: Math.min(existing, incoming)
  | 'avg' // Numbers: average
  | 'sum' // Numbers: sum
  | 'last' // Any: take incoming (last-write-wins)
  | 'first' // Any: keep existing (first-write-wins)
  | 'longest'; // Strings: keep longer string

type ReducerFn = (existing: unknown, incoming: unknown) => unknown;
```

---

## Policy Types (AgentOS Differentiators)

These are the capabilities no other framework has. They attach to nodes and edges as first-class policies, not hidden inside GMI.

### MemoryPolicy

```typescript
interface MemoryPolicy {
  consistency: MemoryConsistencyMode;

  read?: {
    types?: MemoryTraceType[]; // episodic, semantic, procedural, prospective
    scope?: MemoryScope;
    maxTraces?: number;
    minStrength?: number;
    semanticQuery?: string; // static, or template like '{input.topic}'
  };

  write?: {
    autoEncode?: boolean; // encode node output as memory trace
    type?: MemoryTraceType;
    scope?: MemoryScope;
  };
}

type MemoryConsistencyMode =
  | 'live' // Read/write directly. Fast, nondeterministic replay.
  | 'snapshot' // Snapshot reads at checkpoint. Deterministic replay. DEFAULT.
  | 'journaled'; // Append-only journal, commit-on-success, rollback-on-failure.
```

### DiscoveryPolicy

```typescript
interface DiscoveryPolicy {
  enabled: boolean;
  query?: string; // static query, or template from state
  kind?: 'tool' | 'skill' | 'extension' | 'any';
  maxResults?: number;
  fallback?: 'all' | 'error'; // what if discovery finds nothing
}
```

### PersonaPolicy

```typescript
interface PersonaPolicy {
  traits?: Partial<HEXACOProfile>; // override traits for this node
  mood?: string; // set mood context (GMIMood)
  adaptStyle?: boolean; // use StyleAdaptation for output
}
```

### GuardrailPolicy

```typescript
interface GuardrailPolicy {
  input?: string[]; // guardrail IDs to run on node input
  output?: string[]; // guardrail IDs to run on node output
  onViolation: 'block' | 'reroute' | 'warn' | 'sanitize';
  rerouteTarget?: string; // node ID to reroute to on violation
}
```

---

## Checkpoint Model

### Checkpoint Structure

```typescript
interface Checkpoint {
  id: string;
  graphId: string;
  runId: string;
  nodeId: string; // which node was just completed
  timestamp: number;

  // Full state snapshot
  state: {
    input: unknown;
    scratch: unknown;
    artifacts: unknown;
    diagnostics: DiagnosticsView;
  };

  // Memory snapshot (when consistency is 'snapshot' or 'journaled')
  memorySnapshot?: {
    reads: Array<{ traceId: string; content: string; strength: number }>;
    pendingWrites: Array<{ type: string; content: string; scope: string }>;
  };

  // Recorded outputs for replay (for non-pure nodes)
  nodeResults: Record<
    string,
    {
      effectClass: EffectClass;
      output: unknown;
      durationMs: number;
    }
  >;

  // Graph position
  visitedNodes: string[];
  pendingEdges: string[];
}
```

### ICheckpointStore

```typescript
interface ICheckpointStore {
  save(checkpoint: Checkpoint): Promise<void>;
  load(runId: string, nodeId?: string): Promise<Checkpoint | null>;
  latest(runId: string): Promise<Checkpoint | null>;
  list(
    graphId: string,
    options?: { limit?: number; runId?: string }
  ): Promise<CheckpointMetadata[]>;
  delete(checkpointId: string): Promise<void>;

  // Time-travel
  fork(checkpointId: string, patchState?: Partial<GraphState>): Promise<string>;
}
```

### Implementations

| Store                     | Use case                                              |
| ------------------------- | ----------------------------------------------------- |
| `InMemoryCheckpointStore` | Development, testing                                  |
| `SqliteCheckpointStore`   | Local agents, CLI, Workbench                          |
| `ICheckpointStore`        | Interface for custom backends (Postgres, Redis, etc.) |

### Resume Semantics

On `graph.resume(checkpointId)`:

1. Load checkpoint state
2. Identify pending edges (next nodes to execute)
3. For each node that needs re-execution:
   - If `effectClass` is `pure` or `read`: re-execute normally
   - If `effectClass` is `write`, `external`, or `human`: replay recorded output from `nodeResults`
4. Continue graph execution from that point

---

## Authoring API 1: AgentGraph (Full Graph Control)

The lowest-level API. Explicit nodes, edges, reducers, subgraphs, and cycles. For power users building custom agent architectures.

### Node Builders

Typed factory functions instead of config bags:

```typescript
import {
  AgentGraph, START, END,
  gmiNode, toolNode, humanNode, routerNode,
  guardrailNode, subgraphNode
} from '@framers/agentos/orchestration';

// GMI node — LLM reasoning with optional internal ReAct loop
gmiNode(config: {
  instructions: string;
  executionMode?: NodeExecutionMode;      // default: 'react_bounded'
  maxInternalIterations?: number;         // default: 5
  parallelTools?: boolean;                // default: false
  temperature?: number;
  maxTokens?: number;
}, policies?: NodePolicies): GraphNode;

// Tool node — execute a registered tool
toolNode(toolName: string, config?: {
  timeout?: number;
  retryPolicy?: RetryPolicy;
}, policies?: NodePolicies): GraphNode;

// Human node — pause for human input
humanNode(config: {
  prompt: string;
  timeout?: number;
}, policies?: NodePolicies): GraphNode;

// Router node — pure routing logic, no execution
// Accepts JS function (in-process) or expression string (serializable)
routerNode(routeFn: ((state: GraphState) => string) | string): GraphNode;
// JS function stored as { type: 'function', fn }
// String stored as { type: 'expression', expr }

// Guardrail node — run guardrails as an explicit step
guardrailNode(guardrailIds: string[], config: {
  onViolation: 'block' | 'reroute' | 'warn' | 'sanitize';
  rerouteTarget?: string;
}): GraphNode;

// Subgraph node — embed a compiled graph
subgraphNode(compiledGraph: CompiledExecutionGraph, config?: {
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
}): GraphNode;
```

### NodePolicies

Common policy config shared by all node builders:

```typescript
interface NodePolicies {
  memory?: MemoryPolicy;
  discovery?: DiscoveryPolicy;
  persona?: PersonaPolicy;
  guardrails?: GuardrailPolicy;
  checkpoint?: 'before' | 'after' | 'both' | 'none';
  effectClass?: EffectClass;
}
```

### Builder API

```typescript
class AgentGraph<TState extends GraphState> {
  constructor(
    stateSchema: {
      input: ZodSchema;
      scratch: ZodSchema;
      artifacts: ZodSchema;
    },
    config?: {
      reducers?: StateReducers;
      memoryConsistency?: MemoryConsistencyMode;
      checkpointPolicy?: 'every_node' | 'explicit' | 'none';
    }
  );

  // Node management
  addNode(id: string, node: GraphNode): this;

  // Edge types
  addEdge(source: string, target: string): this;
  addConditionalEdge(source: string, condition: (state: TState) => string): this;
  addDiscoveryEdge(
    source: string,
    config: {
      query: string;
      kind?: 'tool' | 'skill' | 'extension' | 'any';
      fallbackTarget?: string;
    }
  ): this;
  addPersonalityEdge(
    source: string,
    config: {
      trait: string;
      threshold: number;
      above: string;
      below: string;
    }
  ): this;

  // Compile
  compile(options?: {
    checkpointStore?: ICheckpointStore;
    validate?: boolean; // default: true, checks for unreachable nodes etc.
  }): CompiledAgentGraph<TState>;
}
```

### Compiled Graph (Executable)

```typescript
interface CompiledAgentGraph<TState> {
  invoke(input: TState['input']): Promise<TState['artifacts']>;
  stream(input: TState['input']): AsyncIterable<GraphEvent>;
  resume(checkpointId: string, patch?: Partial<TState>): Promise<TState['artifacts']>;
  inspect(runId: string): Promise<RunInspection>;
  toIR(): CompiledExecutionGraph;
}
```

### Example

```typescript
const ResearchState = {
  input: z.object({ topic: z.string() }),
  scratch: z.object({
    sources: z.array(z.string()).default([]),
    confidence: z.number().default(0),
  }),
  artifacts: z.object({ summary: z.string(), sources: z.array(z.string()) }),
};

const graph = new AgentGraph(ResearchState, {
  reducers: { 'scratch.sources': 'concat' },
  memoryConsistency: 'snapshot',
})
  .addNode(
    'plan',
    gmiNode(
      {
        instructions: 'Break this research topic into sub-questions',
        executionMode: 'single_turn',
      },
      {
        memory: {
          consistency: 'snapshot',
          read: { types: ['semantic'], semanticQuery: '{input.topic}' },
        },
        discovery: { enabled: true, kind: 'tool' },
        checkpoint: 'after',
      }
    )
  )
  .addNode(
    'search',
    toolNode(
      'web_search',
      { timeout: 10_000 },
      {
        effectClass: 'external',
        guardrails: { output: ['pii-redaction'], onViolation: 'sanitize' },
      }
    )
  )
  .addNode(
    'evaluate',
    gmiNode(
      {
        instructions: 'Evaluate source quality and assign confidence score',
        executionMode: 'single_turn',
      },
      {
        memory: { consistency: 'snapshot', write: { autoEncode: true, type: 'episodic' } },
      }
    )
  )
  .addNode(
    'summarize',
    gmiNode(
      {
        instructions: 'Write final summary from gathered sources',
        executionMode: 'single_turn',
      },
      {
        guardrails: {
          output: ['grounding-guard'],
          onViolation: 'reroute',
          rerouteTarget: 'search',
        },
      }
    )
  )
  .addNode('review', humanNode({ prompt: 'Does this summary look accurate?' }))

  .addEdge(START, 'plan')
  .addEdge('plan', 'search')
  .addEdge('search', 'evaluate')
  .addConditionalEdge('evaluate', (state) =>
    state.scratch.confidence > 0.8 ? 'summarize' : 'search'
  )
  .addPersonalityEdge('summarize', {
    trait: 'conscientiousness',
    threshold: 0.7,
    above: 'review',
    below: END,
  })
  .addEdge('review', END)

  .compile({ checkpointStore: new SqliteCheckpointStore('./checkpoints.db') });

// Execute
const result = await graph.invoke({ topic: 'quantum computing' });

// Stream events
for await (const event of graph.stream({ topic: 'quantum computing' })) {
  console.log(event.type, event.nodeId, event.data);
}

// Time-travel: fork from a checkpoint with modified state
const forkedResult = await graph.resume(checkpointId, {
  scratch: { confidence: 0.95 },
});
```

---

## Authoring API 2: workflow() (Deterministic DAG DSL)

A constrained API for deterministic business workflows. Always acyclic. GMI steps default to `single_turn` (no hidden loops). Zod schemas enforced between steps.

### Builder API

```typescript
function workflow(name: string): WorkflowBuilder;

class WorkflowBuilder {
  input(schema: ZodSchema): this;
  returns(schema: ZodSchema): this;

  // Linear steps
  step(id: string, config: StepConfig): this;
  then(id: string, config: StepConfig): this;

  // Branching (deterministic, no cycles)
  // All branches implicitly join before the next chained call.
  // Condition receives GraphState (same type as AgentGraph state).
  branch(
    condition: (state: GraphState) => string,
    routes: {
      [value: string]: StepConfig | StepConfig[];
    }
  ): this;

  // Parallel execution with explicit join semantics
  parallel(
    steps: StepConfig[],
    join: {
      strategy: 'all' | 'any' | 'quorum';
      quorumCount?: number;
      merge: Record<string, BuiltinReducer | ReducerFn>;
      timeout?: number;
    }
  ): this;

  // Compile (produces same IR as AgentGraph)
  compile(options?: { checkpointStore?: ICheckpointStore }): CompiledWorkflow;
}
```

### StepConfig

```typescript
interface StepConfig {
  // Executor (exactly one required)
  tool?: string;
  gmi?: {
    instructions: string;
    executionMode?: 'single_turn'; // ONLY single_turn allowed in workflow()
    maxTokens?: number;
  };
  human?: { prompt: string };
  extension?: { extensionId: string; method: string };
  subgraph?: CompiledExecutionGraph; // escape hatch to AgentGraph

  // Policies
  memory?: MemoryPolicy;
  discovery?: DiscoveryPolicy;
  guardrails?: GuardrailPolicy;

  // Execution
  requiresApproval?: boolean; // HITL gate
  onFailure?: 'abort' | 'skip' | 'retry';
  retryPolicy?: RetryPolicy;
  timeout?: number;
  effectClass?: EffectClass;
}
```

### Example

```typescript
const onboarding = workflow('user-onboarding')
  .input(z.object({ email: z.string().email(), name: z.string() }))
  .returns(z.object({ userId: z.string(), plan: z.enum(['free', 'pro']) }))

  .step('validate-email', {
    tool: 'email_validator',
    guardrails: { input: ['pii-redaction'], onViolation: 'sanitize' },
    effectClass: 'external',
  })
  .then('present-plans', {
    gmi: { instructions: 'Present pricing plans conversationally' },
    memory: {
      consistency: 'snapshot',
      read: { types: ['semantic'], semanticQuery: 'pricing objections' },
    },
  })
  .branch((state) => state.scratch.selectedPlan, {
    pro: {
      tool: 'stripe_checkout',
      requiresApproval: true,
      onFailure: 'abort',
      effectClass: 'external',
    },
    free: { tool: 'user_service', effectClass: 'write' },
  })
  .parallel(
    [
      { tool: 'email_sender', effectClass: 'external' },
      { tool: 'preference_service', effectClass: 'write' },
      { tool: 'slack_notify', effectClass: 'external' },
    ],
    {
      strategy: 'all',
      merge: { 'scratch.results': 'concat' },
      timeout: 30_000,
    }
  )
  .compile({ checkpointStore: sqliteStore });

const result = await onboarding.invoke({ email: 'j@x.com', name: 'John' });
```

### Boundary Rules

- **No cycles.** The compiler rejects any topology with back-edges.
- **No hidden loops.** GMI steps only allow `executionMode: 'single_turn'`.
- **Schema validation required.** `.input()` and `.returns()` are mandatory.
- **Deterministic routing only.** `branch()` conditions are pure functions of state, not LLM decisions.
- **Subgraph escape hatch.** Any step can use `subgraph:` to embed a compiled AgentGraph (which may contain cycles).

---

## Authoring API 3: mission() (Intent-Driven, AgentOS-Native)

The highest-level API. Developers declare WHAT they want (goal, constraints, quality requirements). The PlanningEngine decides HOW (decomposes into steps, selects tools via discovery, routes based on personality).

### Builder API

```typescript
function mission(name: string): MissionBuilder;

class MissionBuilder {
  // Intent (WHAT)
  input(schema: ZodSchema): this; // Declare input shape (required)
  goal(description: string): this; // Template string: {fieldName} interpolates from input
  returns(schema: ZodSchema): this;

  // Execution knobs (HOW — separated from intent)
  planner(config: {
    strategy:
      | 'react'
      | 'plan_and_execute'
      | 'tree_of_thought'
      | 'least_to_most'
      | 'self_consistency'
      | 'reflexion';
    maxSteps: number;
    maxIterationsPerNode?: number; // default: 3
    parallelTools?: boolean; // default: false
  }): this;

  // Policies (AgentOS differentiators)
  policy(config: {
    memory?: {
      consistency?: MemoryConsistencyMode;
      read?: MemoryReadConfig;
      write?: 'auto' | MemoryWriteConfig;
    };
    discovery?: {
      kind?: 'tool' | 'skill' | 'extension' | 'any';
      fallback?: 'all' | 'error';
    };
    personality?: {
      traitRouting?: boolean;
      adaptStyle?: boolean;
      mood?: string;
    };
    guardrails?: string[];
  }): this;

  // Deterministic anchors
  anchor(
    id: string,
    node: GraphNode,
    constraints: {
      required: boolean;
      phase?: 'gather' | 'process' | 'validate' | 'deliver';
      after?: AnchorConstraint;
      before?: AnchorConstraint;
    }
  ): this;

  // Compile
  compile(options?: { checkpointStore?: ICheckpointStore }): CompiledMission;
}

// Anchor constraints match by tags/kinds, not generated step IDs
type AnchorConstraint =
  | { phase: string } // "before phase: deliver"
  | { tags: string[] } // "after steps tagged 'research'"
  | { kind: GraphNode['type'] } // "before any human node"
  | string; // node ID (for pinned-to-pinned ordering)
```

### CompiledMission (extends common surface + explain)

```typescript
interface CompiledMission<TInput, TOutput> {
  invoke(input: TInput): Promise<TOutput>;
  stream(input: TInput): AsyncIterable<GraphEvent>;
  resume(checkpointId: string, patch?: Partial<GraphState>): Promise<TOutput>;
  inspect(runId: string): Promise<RunInspection>;
  toIR(): CompiledExecutionGraph;

  // Mission-specific
  explain(input: TInput): Promise<ExecutionPlan>;
  toWorkflow(): CompiledExecutionGraph; // export planner's DAG as static IR
}
```

### Example

```typescript
const researcher = mission('deep-research')
  .input(z.object({ topic: z.string() }))
  .goal('Research {topic} thoroughly and produce a cited summary') // {topic} interpolates from input
  .returns(
    z.object({
      summary: z.string(),
      sources: z.array(z.object({ url: z.string(), title: z.string() })),
      confidence: z.number(),
    })
  )

  .planner({
    strategy: 'plan_and_execute',
    maxSteps: 8,
    maxIterationsPerNode: 3,
    parallelTools: true,
  })

  .policy({
    memory: {
      consistency: 'snapshot',
      read: { types: ['semantic', 'episodic'], scope: 'persona' },
      write: 'auto',
    },
    discovery: { kind: 'tool', fallback: 'all' },
    personality: { traitRouting: true, adaptStyle: true },
    guardrails: ['grounding-guard', 'pii-redaction'],
  })

  .anchor('fact-check', toolNode('grounding_verifier'), {
    required: true,
    phase: 'validate',
    after: { tags: ['research'] },
    before: { phase: 'deliver' },
  })
  .anchor('human-review', humanNode({ prompt: 'Verify sources are credible' }), {
    required: true,
    phase: 'validate',
    after: 'fact-check',
  })

  .compile({ checkpointStore: sqliteStore });

// Execute — PlanningEngine decomposes goal into steps at runtime
const result = await researcher.invoke({ topic: 'quantum computing' });

// Introspect the generated plan
const plan = await researcher.explain({ topic: 'quantum computing' });
// Returns ExecutionPlan showing what steps the planner chose and why

// Graduate to deterministic workflow
const staticIR = await researcher.toWorkflow();
```

### Boundary Rules (v1)

- **DAG only.** mission() v1 does not generate arbitrary cyclic graphs.
- **Bounded internal loops.** Individual GMI nodes may run internal ReAct loops up to `maxIterationsPerNode`, but the graph-level topology is acyclic.
- **Anchors are deterministic.** Pinned steps always execute at their declared phase.
- **Planner transparency.** `.explain()` always returns the generated plan before execution.

### Note: YAML/JSON Authoring Path

The architecture diagram shows a fourth authoring path (YAML/JSON). This is deferred to a future phase (post-phase 4). It would parse declarative YAML workflow definitions, resolve `condition` fields as `GraphConditionExpr` strings, and compile to the same `CompiledExecutionGraph` IR. The existing `agent.config.json` format in Wunderland presets is a natural starting point. This path is fully serializable by design since it uses the expression DSL, not JS function references.

---

## GraphRuntime

The single execution engine for all three APIs.

### Core Responsibilities

1. **Node scheduling**: Topological sort for DAGs, cycle-aware scheduling for graphs
2. **Edge evaluation**: Static, conditional, discovery, personality — evaluated in order
3. **State management**: Partition reads/writes, reducer application, schema validation
4. **Checkpoint lifecycle**: Save/load/fork per checkpoint policy
5. **Memory integration**: Read/write per memory policy and consistency mode
6. **Streaming**: Emit `GraphEvent` at every node start/end, edge transition, tool call
7. **Error handling**: Per-node retry policies, fail_open/fail_closed, rerouting

### GraphEvent (Streaming Protocol)

```typescript
type GraphEvent =
  | { type: 'run_start'; runId: string; graphId: string }
  | { type: 'node_start'; nodeId: string; state: GraphState }
  | { type: 'node_end'; nodeId: string; output: unknown; durationMs: number }
  | { type: 'edge_transition'; sourceId: string; targetId: string; edgeType: string }
  | { type: 'text_delta'; nodeId: string; content: string }
  | { type: 'tool_call'; nodeId: string; toolName: string; args: unknown }
  | { type: 'tool_result'; nodeId: string; toolName: string; result: unknown }
  | {
      type: 'guardrail_result';
      nodeId: string;
      guardrailId: string;
      passed: boolean;
      action: string;
    }
  | { type: 'checkpoint_saved'; checkpointId: string; nodeId: string }
  | {
      type: 'interrupt';
      nodeId: string;
      reason: 'human_approval' | 'error' | 'guardrail_violation';
    }
  | { type: 'memory_read'; nodeId: string; traceCount: number }
  | { type: 'memory_write'; nodeId: string; traceType: string }
  | { type: 'discovery_result'; nodeId: string; toolsFound: string[] }
  | { type: 'run_end'; runId: string; finalOutput: unknown; totalDurationMs: number }
  | { type: 'node_timeout'; nodeId: string; timeoutMs: number }
  | { type: 'error'; nodeId?: string; error: { message: string; code: string } };
```

### LoopController (Extracted from GMI)

The ReAct loop logic currently hardcoded in `GMI.ts:684` is extracted into a reusable, configurable component:

```typescript
interface ILoopController {
  execute(config: LoopConfig, context: LoopContext): AsyncGenerator<LoopEvent>;
}

interface LoopConfig {
  maxIterations: number; // replaces hardcoded safetyBreak < 5
  parallelTools: boolean; // replaces sequential for-loop
  failureMode: 'fail_open' | 'fail_closed';
  timeout?: number;
}

// Parallel tool dispatch semantics:
// - Uses Promise.allSettled() (NOT Promise.all()) to avoid fail-fast
// - Each tool result is individually checked:
//   - If failureMode == 'fail_closed': any rejected tool throws, partial results discarded
//   - If failureMode == 'fail_open': rejected tools produce error ToolCallResult,
//     successful results and error results ALL enter conversation history,
//     LLM sees which tools failed and can decide to retry or proceed
// - Tool results are added to conversation history in original request order (stable)

interface LoopContext {
  gmi: IGMI;
  toolOrchestrator: IToolOrchestrator;
  conversationHistory: ChatMessage[];
  turnPlan?: TurnPlan;
}
```

This enables:

- Configurable max iterations (not hardcoded 5)
- Parallel tool dispatch via `Promise.allSettled()` (not sequential)
- Reuse in both AgentGraph `react_bounded` nodes and mission() `planner_controlled` nodes
- Testable in isolation

---

## Schema Lowering

```
Zod (author-time)
  |  zodToJsonSchema()
  v
JSON Schema (compile-time, stored in IR)
  |  ajv.validate()
  v
Runtime validation (step input/output)
```

- Public builder APIs accept Zod schemas
- Compiler lowers to JSON Schema via `zod-to-json-schema`
- Runtime validates against JSON Schema (reuses existing `WorkflowTypes` patterns)
- Existing `inputSchema` / `outputSchema` on `WorkflowTaskDefinition` already use JSON Schema — no conflict

---

## Workbench Integration

The Workbench (apps/agentos-workbench/) gains:

1. **Graph Visualizer**: Render `CompiledExecutionGraph` as interactive node/edge diagram
2. **Run Inspector**: Show `GraphEvent` stream in real-time, highlight active node
3. **Checkpoint Browser**: List checkpoints per run, inspect state at each, fork/resume
4. **Time-Travel Debugger**: Select a checkpoint, modify state, re-execute from that point
5. **Plan Viewer**: For mission() runs, show the PlanningEngine's generated plan alongside the execution

All powered by the same `GraphEvent` streaming protocol and `ICheckpointStore`.

---

## Migration Path

### Existing GMI ReAct Loop

The current `GMI.processTurnStream()` continues to work unchanged. It is wrapped by the new runtime when used as a `gmiNode()`:

```
gmiNode({ executionMode: 'react_bounded', maxInternalIterations: 5 })
  → GraphRuntime calls GMI.processTurnStream() internally
  → LoopController manages the iteration limit and tool dispatch
  → GMI no longer needs its own hardcoded safetyBreak
```

### Existing WorkflowEngine

The existing `WorkflowEngine` and `WorkflowRuntime` continue to work for current consumers. The new `workflow()` DSL compiles to the same `CompiledExecutionGraph` IR but uses the new `GraphRuntime` executor. Migration is opt-in.

### Existing PlanningEngine

The existing `PlanningEngine.generatePlan()` and checkpoint APIs are reused by `mission()`. The in-memory checkpoint Map is replaced by `ICheckpointStore`.

---

## Reused Existing Code

| Component                        | Current Location                               | How Reused                                     |
| -------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| GMI ReAct loop                   | `cognitive_substrate/GMI.ts`                   | Wrapped by LoopController, called from gmiNode |
| TurnPlanner                      | `core/orchestration/TurnPlanner.ts`            | Feeds DiscoveryPolicy per-node                 |
| PlanningEngine                   | `core/planning/PlanningEngine.ts`              | Powers mission() goal decomposition            |
| WorkflowEngine DAG validation    | `core/workflows/WorkflowEngine.ts:hasCycles()` | Reused in compile-time validation              |
| WorkflowRuntime ConcurrencyQueue | `core/workflows/runtime/WorkflowRuntime.ts`    | Reused for parallel node scheduling            |
| ToolOrchestrator                 | `core/tools/ToolOrchestrator.ts`               | Runtime dependency, unchanged                  |
| GuardrailEngine                  | `core/guardrails/GuardrailEngine.ts`           | Called at nodes and edges per GuardrailPolicy  |
| CapabilityDiscoveryEngine        | `discovery/CapabilityDiscoveryEngine.ts`       | Called per DiscoveryPolicy                     |
| CognitiveMemoryManager           | `memory/CognitiveMemoryManager.ts`             | Called per MemoryPolicy                        |
| StreamingManager                 | `core/streaming/StreamingManager.ts`           | Emits GraphEvents to clients                   |

---

## File Structure

All new code lives under `packages/agentos/src/orchestration/`:

```
packages/agentos/src/orchestration/
  ir/
    CompiledExecutionGraph.ts     // IR types
    GraphNode.ts                  // Node types and policies
    GraphEdge.ts                  // Edge types
    GraphState.ts                 // State partitions, reducers
  runtime/
    GraphRuntime.ts               // Single execution engine
    LoopController.ts             // Extracted ReAct loop
    NodeScheduler.ts              // Topological sort, cycle-aware scheduling
    StateManager.ts               // Partition management, reducer application
    CheckpointManager.ts          // Checkpoint lifecycle
  checkpoint/
    ICheckpointStore.ts           // Interface
    InMemoryCheckpointStore.ts    // Dev/testing
    SqliteCheckpointStore.ts      // Production
  builders/
    AgentGraph.ts                 // Low-level graph builder
    WorkflowBuilder.ts            // Deterministic DAG DSL
    MissionBuilder.ts             // Intent-driven builder
    nodes.ts                      // gmiNode, toolNode, humanNode, etc.
  compiler/
    GraphCompiler.ts              // Builder → IR compilation
    SchemaLowering.ts             // Zod → JSON Schema
    Validator.ts                  // Cycle detection, unreachable nodes, schema compat
  events/
    GraphEvent.ts                 // Event types
    EventEmitter.ts               // Streaming protocol
  index.ts                        // Public exports
```

---

## Implementation Phases

### Phase 1: GraphRuntime + Checkpoints (Foundation)

- Extract `LoopController` from `GMI.ts`
- Define `CompiledExecutionGraph` IR types
- Implement `GraphRuntime` with node scheduling, state management, edge evaluation
- Implement `ICheckpointStore` + `SqliteCheckpointStore`
- Implement `GraphEvent` streaming
- Wire existing components (ToolOrchestrator, GuardrailEngine, etc.) as runtime dependencies

### Phase 2: AgentGraph Builder

- Implement typed node builders (`gmiNode`, `toolNode`, etc.)
- Implement `AgentGraph` builder with all edge types
- Implement `GraphCompiler` (builder → IR)
- Implement `Validator` (cycle detection, schema compatibility)
- Implement subgraph composition
- Wire memory, discovery, persona policies to runtime

### Phase 3: workflow() DSL

- Implement `WorkflowBuilder` with step/then/branch/parallel
- Implement parallel join semantics (all/any/quorum + merge reducers)
- Enforce DAG-only constraint at compile time
- Enforce `single_turn` default for GMI steps
- Schema lowering (Zod → JSON Schema)

### Phase 4: mission() API

- Implement `MissionBuilder` with input/goal/returns/planner/policy/anchor
- Implement `MissionCompiler` — the bridge from PlanningEngine output to IR:
  1. Call `PlanningEngine.generatePlan(goal, { tools: discoveredTools, constraints })`
  2. Receives `ExecutionPlan { steps: PlanStep[], dependencies: Map<string, string[]> }`
  3. For each `PlanStep`:
     - `action: 'tool_call'` → create `toolNode(step.toolName)` with discovered tool
     - `action: 'reasoning'` → create `gmiNode({ instructions: step.reasoning, executionMode: 'planner_controlled' })`
     - `action: 'human_input'` → create `humanNode({ prompt: step.expectedOutcome })`
     - `action: 'information_gathering'` → create `toolNode` via DiscoveryPolicy (top-1 match)
     - `action: 'validation'` → create `guardrailNode` from mission's guardrail list
  4. For each dependency in `ExecutionPlan.dependencies` → create `static` GraphEdge
  5. Splice anchors: match anchor constraints (phase, tags, kind) against generated steps, insert anchor nodes at resolved positions, rewire edges
  6. Attach mission-level policies (memory, discovery, persona, guardrails) to all generated nodes
  7. Validate DAG (no cycles in v1), compile to `CompiledExecutionGraph`
- Implement anchor constraint resolution (phase, tags, kind matching)
- Implement `.explain()` (runs steps 1-7 but returns the plan without executing) and `.toWorkflow()` (returns the compiled IR as a static artifact)
- Enforce DAG-only topology for v1

---

## Testing Strategy

- **IR round-trip**: Compile → serialize → deserialize → execute, verify identical results
- **Checkpoint correctness**: Execute graph, resume from every checkpoint, verify same final output
- **Replay determinism**: For snapshot memory mode, verify replayed runs produce identical state
- **Effect class compliance**: Verify write/external/human nodes replay recorded output, not re-execute
- **Boundary enforcement**: Verify workflow() rejects cycles, mission() v1 rejects cycles
- **Reducer correctness**: Parallel branches with conflicting writes, verify merge rules applied
- **Schema validation**: Invalid step I/O caught at compile time and runtime
- **Streaming completeness**: Every node/edge transition produces the expected GraphEvent sequence
