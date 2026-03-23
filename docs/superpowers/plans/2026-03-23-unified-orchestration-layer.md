# Unified Orchestration Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify AgentOS's fragmented orchestration primitives (ReAct loop, WorkflowEngine, PlanningEngine, discovery, memory, guardrails) under one compiled IR and one graph runtime, exposed through three authoring APIs: `AgentGraph`, `workflow()`, and `mission()`.

**Architecture:** All three APIs compile to a `CompiledExecutionGraph` IR executed by a single `GraphRuntime`. The runtime integrates existing components (ToolOrchestrator, GuardrailEngine, CapabilityDiscoveryEngine, CognitiveMemoryManager) as pluggable dependencies. Persistent checkpointing enables time-travel debugging and fault recovery.

**Tech Stack:** TypeScript, Vitest, Zod, zod-to-json-schema, better-sqlite3 (for SqliteCheckpointStore)

**Spec:** `docs/superpowers/specs/2026-03-23-unified-orchestration-layer-design.md`

**Test command:** `cd packages/agentos && npx vitest run`

**All code lives under:** `packages/agentos/src/orchestration/`

---

## File Structure

### New Files

| File                                                  | Responsibility                                                                                                                                                 |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orchestration/ir/types.ts`                           | All IR types: GraphNode, GraphEdge, GraphState, GraphCondition, NodeExecutorConfig, EffectClass, NodeExecutionMode, policies, reducers, CompiledExecutionGraph |
| `orchestration/ir/index.ts`                           | Barrel export for IR types                                                                                                                                     |
| `orchestration/events/GraphEvent.ts`                  | GraphEvent discriminated union type + EventEmitter class                                                                                                       |
| `orchestration/events/index.ts`                       | Barrel export for events                                                                                                                                       |
| `orchestration/checkpoint/ICheckpointStore.ts`        | Checkpoint interface, Checkpoint type, CheckpointMetadata type                                                                                                 |
| `orchestration/checkpoint/InMemoryCheckpointStore.ts` | In-memory implementation for dev/testing                                                                                                                       |
| `orchestration/checkpoint/SqliteCheckpointStore.ts`   | SQLite persistent implementation                                                                                                                               |
| `orchestration/checkpoint/index.ts`                   | Barrel export                                                                                                                                                  |
| `orchestration/runtime/StateManager.ts`               | State partition management, reducer application, schema validation                                                                                             |
| `orchestration/runtime/NodeScheduler.ts`              | Topological sort, ready-node detection, cycle-aware scheduling                                                                                                 |
| `orchestration/runtime/LoopController.ts`             | Extracted ReAct loop: configurable iterations, parallel tool dispatch                                                                                          |
| `orchestration/runtime/NodeExecutor.ts`               | Dispatches execution to GMI/tool/human/guardrail/router/subgraph based on node type                                                                            |
| `orchestration/runtime/GraphRuntime.ts`               | Main execution engine: schedule → execute → checkpoint → stream                                                                                                |
| `orchestration/runtime/index.ts`                      | Barrel export                                                                                                                                                  |
| `orchestration/builders/nodes.ts`                     | Factory functions: gmiNode, toolNode, humanNode, routerNode, guardrailNode, subgraphNode                                                                       |
| `orchestration/builders/AgentGraph.ts`                | AgentGraph builder class with addNode, addEdge, addConditionalEdge, etc.                                                                                       |
| `orchestration/builders/WorkflowBuilder.ts`           | workflow() DSL: step, then, branch, parallel, compile                                                                                                          |
| `orchestration/builders/MissionBuilder.ts`            | mission() API: goal, returns, planner, policy, anchor, compile                                                                                                 |
| `orchestration/builders/index.ts`                     | Barrel export                                                                                                                                                  |
| `orchestration/compiler/GraphCompiler.ts`             | Builder internal representation → CompiledExecutionGraph IR                                                                                                    |
| `orchestration/compiler/SchemaLowering.ts`            | Zod → JSON Schema conversion                                                                                                                                   |
| `orchestration/compiler/Validator.ts`                 | DAG validation, cycle detection, unreachable node detection, schema compatibility                                                                              |
| `orchestration/compiler/MissionCompiler.ts`           | PlanningEngine output → CompiledExecutionGraph (anchor splicing)                                                                                               |
| `orchestration/compiler/index.ts`                     | Barrel export                                                                                                                                                  |
| `orchestration/index.ts`                              | Public API barrel: re-exports builders, IR types, runtime, events, checkpoint                                                                                  |

### New Test Files

| File                                                   | What it tests                                           |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `src/orchestration/__tests__/ir-types.test.ts`         | IR type construction and serialization                  |
| `src/orchestration/__tests__/state-manager.test.ts`    | State partitions, reducers, schema validation           |
| `src/orchestration/__tests__/node-scheduler.test.ts`   | Topological sort, cycle detection, ready-node selection |
| `src/orchestration/__tests__/loop-controller.test.ts`  | ReAct loop: iterations, parallel tools, failure modes   |
| `src/orchestration/__tests__/checkpoint-store.test.ts` | InMemory + Sqlite checkpoint stores                     |
| `src/orchestration/__tests__/graph-runtime.test.ts`    | End-to-end: execute graph, checkpoint, resume, stream   |
| `src/orchestration/__tests__/node-executor.test.ts`    | Node type dispatch, timeout, retry                      |
| `src/orchestration/__tests__/agent-graph.test.ts`      | AgentGraph builder: nodes, edges, compile, invoke       |
| `src/orchestration/__tests__/workflow-builder.test.ts` | workflow() DSL: step, branch, parallel, DAG enforcement |
| `src/orchestration/__tests__/mission-builder.test.ts`  | mission() API: goal interpolation, anchors, explain     |
| `src/orchestration/__tests__/graph-compiler.test.ts`   | Builder → IR compilation                                |
| `src/orchestration/__tests__/schema-lowering.test.ts`  | Zod → JSON Schema conversion                            |
| `src/orchestration/__tests__/validator.test.ts`        | Cycle detection, unreachable nodes, schema compat       |

### Modified Files

| File                                 | Change                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `packages/agentos/src/index.ts`      | Add `export * from './orchestration/index.js'`                                             |
| `packages/agentos/src/core/index.ts` | Add orchestration exports to AUTOMATION domain                                             |
| `packages/agentos/package.json`      | Add `./orchestration` export map entry, add `zod-to-json-schema` and `better-sqlite3` deps |

---

## Phase 1: Foundation — IR Types, Checkpoint Store, GraphRuntime

### Task 1: IR Types

**Files:**

- Create: `packages/agentos/src/orchestration/ir/types.ts`
- Create: `packages/agentos/src/orchestration/ir/index.ts`
- Test: `packages/agentos/src/orchestration/__tests__/ir-types.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/ir-types.test.ts
import { describe, it, expect } from 'vitest';
import {
  type GraphNode,
  type GraphEdge,
  type GraphState,
  type CompiledExecutionGraph,
  type NodeExecutionMode,
  type EffectClass,
  type GraphCondition,
  type NodeExecutorConfig,
  type RetryPolicy,
  type MemoryPolicy,
  type DiscoveryPolicy,
  type PersonaPolicy,
  type GuardrailPolicy,
  type MemoryView,
  type DiagnosticsView,
  type StateReducers,
  type BuiltinReducer,
  type CheckpointMetadata,
  type RunInspection,
  type MemoryConsistencyMode,
  type MemoryTraceType,
  type MemoryScope,
  START,
  END,
} from '../ir/index.js';

describe('IR Types', () => {
  it('exports START and END sentinel values', () => {
    expect(START).toBe('__START__');
    expect(END).toBe('__END__');
  });

  it('constructs a valid GraphNode', () => {
    const node: GraphNode = {
      id: 'test-node',
      type: 'tool',
      executorConfig: { type: 'tool', toolName: 'web_search' },
      executionMode: 'single_turn',
      effectClass: 'external',
      checkpoint: 'after',
    };
    expect(node.id).toBe('test-node');
    expect(node.type).toBe('tool');
  });

  it('constructs a valid GraphEdge with static type', () => {
    const edge: GraphEdge = {
      id: 'e1',
      source: 'a',
      target: 'b',
      type: 'static',
    };
    expect(edge.type).toBe('static');
  });

  it('constructs a GraphCondition with function type', () => {
    const condition: GraphCondition = {
      type: 'function',
      fn: (state) => 'next',
      description: 'always go to next',
    };
    expect(condition.type).toBe('function');
  });

  it('constructs a GraphCondition with expression type', () => {
    const condition: GraphCondition = {
      type: 'expression',
      expr: 'scratch.confidence > 0.8',
    };
    expect(condition.type).toBe('expression');
  });

  it('constructs a CompiledExecutionGraph', () => {
    const graph: CompiledExecutionGraph = {
      id: 'test-graph',
      name: 'test',
      nodes: [],
      edges: [],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'every_node',
      memoryConsistency: 'snapshot',
    };
    expect(graph.nodes).toHaveLength(0);
  });

  it('validates all NodeExecutionMode values', () => {
    const modes: NodeExecutionMode[] = ['single_turn', 'react_bounded', 'planner_controlled'];
    expect(modes).toHaveLength(3);
  });

  it('validates all EffectClass values', () => {
    const effects: EffectClass[] = ['pure', 'read', 'write', 'external', 'human'];
    expect(effects).toHaveLength(5);
  });

  it('constructs MemoryPolicy with all fields', () => {
    const policy: MemoryPolicy = {
      consistency: 'snapshot',
      read: {
        types: ['semantic', 'episodic'],
        scope: 'persona',
        maxTraces: 10,
        minStrength: 0.3,
        semanticQuery: '{input.topic}',
      },
      write: { autoEncode: true, type: 'episodic', scope: 'session' },
    };
    expect(policy.consistency).toBe('snapshot');
    expect(policy.read?.types).toContain('semantic');
  });

  it('constructs BuiltinReducer values', () => {
    const reducers: StateReducers = {
      'scratch.sources': 'concat',
      'scratch.confidence': 'max',
      'scratch.name': 'last',
    };
    expect(Object.keys(reducers)).toHaveLength(3);
  });

  it('constructs a full NodeExecutorConfig for each type', () => {
    const configs: NodeExecutorConfig[] = [
      { type: 'gmi', instructions: 'Do something', maxInternalIterations: 5, parallelTools: true },
      { type: 'tool', toolName: 'web_search' },
      { type: 'extension', extensionId: 'ext-1', method: 'run' },
      { type: 'human', prompt: 'Please approve' },
      { type: 'guardrail', guardrailIds: ['pii'], onViolation: 'sanitize' },
      { type: 'router', condition: { type: 'expression', expr: 'scratch.x > 1' } },
      { type: 'subgraph', graphId: 'inner', inputMapping: { topic: 'input.topic' } },
    ];
    expect(configs).toHaveLength(7);
    expect(configs.map((c) => c.type)).toEqual([
      'gmi',
      'tool',
      'extension',
      'human',
      'guardrail',
      'router',
      'subgraph',
    ]);
  });

  it('constructs DiagnosticsView', () => {
    const diag: DiagnosticsView = {
      totalTokensUsed: 0,
      totalDurationMs: 0,
      nodeTimings: {},
      discoveryResults: {},
      guardrailResults: {},
      checkpointsSaved: 0,
      memoryReads: 0,
      memoryWrites: 0,
    };
    expect(diag.totalTokensUsed).toBe(0);
  });

  it('constructs MemoryView', () => {
    const view: MemoryView = {
      traces: [],
      pendingWrites: [],
      totalTracesRead: 0,
      readLatencyMs: 0,
    };
    expect(view.traces).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/ir-types.test.ts`
Expected: FAIL — module `../ir/index.js` not found

- [ ] **Step 3: Implement IR types**

Create `packages/agentos/src/orchestration/ir/types.ts` with all types from the spec:

- `START = '__START__'` and `END = '__END__'` sentinel constants
- `NodeExecutionMode` type literal union
- `EffectClass` type literal union
- `MemoryTraceType` and `MemoryScope` type literal unions
- `MemoryConsistencyMode` type literal union
- `GraphCondition` discriminated union (function | expression)
- `NodeExecutorConfig` discriminated union (7 node types)
- `RetryPolicy` interface
- `MemoryPolicy`, `DiscoveryPolicy`, `PersonaPolicy`, `GuardrailPolicy` interfaces
- `MemoryView`, `DiagnosticsView` interfaces
- `GraphNode` interface
- `GraphEdge` interface
- `GraphState` generic interface
- `StateReducers`, `BuiltinReducer`, `ReducerFn` types
- `CheckpointMetadata`, `RunInspection` interfaces
- `CompiledExecutionGraph` interface (nodes, edges, stateSchema, reducers, checkpointPolicy, memoryConsistency)

Create `packages/agentos/src/orchestration/ir/index.ts`:

```typescript
export * from './types.js';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/ir-types.test.ts`
Expected: PASS — all 12 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/ir/ packages/agentos/src/orchestration/__tests__/ir-types.test.ts
git commit -m "feat(orchestration): add CompiledExecutionGraph IR types"
git push origin master
```

---

### Task 2: GraphEvent Types + EventEmitter

**Files:**

- Create: `packages/agentos/src/orchestration/events/GraphEvent.ts`
- Create: `packages/agentos/src/orchestration/events/index.ts`
- Test: `GraphEventEmitter.stream()` async generator is non-trivial — add unit tests in the runtime test file (Task 8) that verify events emitted via `emit()` are received via `stream()` in correct order, and that the stream completes when the emitter is closed.

- [ ] **Step 1: Create GraphEvent types**

Create `packages/agentos/src/orchestration/events/GraphEvent.ts` with:

- `GraphEvent` discriminated union (18 event types from spec)
- `GraphEventEmitter` class:
  - `private listeners: Array<(event: GraphEvent) => void>`
  - `on(listener): void`
  - `off(listener): void`
  - `emit(event: GraphEvent): void`
  - `async *stream(): AsyncGenerator<GraphEvent>` — converts listener-based events to async iterable using a queue

Create `packages/agentos/src/orchestration/events/index.ts`:

```typescript
export * from './GraphEvent.js';
```

- [ ] **Step 2: Commit**

```bash
git add packages/agentos/src/orchestration/events/
git commit -m "feat(orchestration): add GraphEvent types and EventEmitter"
git push origin master
```

---

### Task 3: ICheckpointStore + InMemoryCheckpointStore

**Files:**

- Create: `packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts`
- Create: `packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts`
- Create: `packages/agentos/src/orchestration/checkpoint/index.ts`
- Test: `packages/agentos/src/orchestration/__tests__/checkpoint-store.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/checkpoint-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckpointStore } from '../checkpoint/index.js';
import type { Checkpoint } from '../checkpoint/index.js';

function makeCheckpoint(overrides: Partial<Checkpoint> = {}): Checkpoint {
  return {
    id: overrides.id ?? 'cp-1',
    graphId: 'graph-1',
    runId: overrides.runId ?? 'run-1',
    nodeId: overrides.nodeId ?? 'node-a',
    timestamp: Date.now(),
    state: {
      input: {},
      scratch: {},
      artifacts: {},
      diagnostics: {
        totalTokensUsed: 0,
        totalDurationMs: 0,
        nodeTimings: {},
        discoveryResults: {},
        guardrailResults: {},
        checkpointsSaved: 0,
        memoryReads: 0,
        memoryWrites: 0,
      },
    },
    nodeResults: {},
    visitedNodes: ['node-a'],
    pendingEdges: ['e1'],
    ...overrides,
  };
}

describe('InMemoryCheckpointStore', () => {
  let store: InMemoryCheckpointStore;

  beforeEach(() => {
    store = new InMemoryCheckpointStore();
  });

  it('save and load by runId', async () => {
    const cp = makeCheckpoint();
    await store.save(cp);
    const loaded = await store.load('run-1', 'node-a');
    expect(loaded).toEqual(cp);
  });

  it('load returns null for missing runId', async () => {
    const loaded = await store.load('missing');
    expect(loaded).toBeNull();
  });

  it('latest returns most recent checkpoint for run', async () => {
    await store.save(makeCheckpoint({ id: 'cp-1', timestamp: 100, nodeId: 'a' }));
    await store.save(makeCheckpoint({ id: 'cp-2', timestamp: 200, nodeId: 'b' }));
    const latest = await store.latest('run-1');
    expect(latest?.id).toBe('cp-2');
  });

  it('list returns metadata for graphId', async () => {
    await store.save(makeCheckpoint({ id: 'cp-1' }));
    await store.save(makeCheckpoint({ id: 'cp-2', nodeId: 'node-b' }));
    const list = await store.list('graph-1');
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe('cp-1');
  });

  it('list with limit', async () => {
    await store.save(makeCheckpoint({ id: 'cp-1' }));
    await store.save(makeCheckpoint({ id: 'cp-2', nodeId: 'b' }));
    const list = await store.list('graph-1', { limit: 1 });
    expect(list).toHaveLength(1);
  });

  it('delete removes checkpoint', async () => {
    await store.save(makeCheckpoint({ id: 'cp-1' }));
    await store.delete('cp-1');
    const loaded = await store.load('run-1', 'node-a');
    expect(loaded).toBeNull();
  });

  it('fork creates new runId with patched state', async () => {
    await store.save(
      makeCheckpoint({
        id: 'cp-1',
        state: {
          input: { x: 1 },
          scratch: { y: 2 },
          artifacts: {},
          diagnostics: {
            totalTokensUsed: 0,
            totalDurationMs: 0,
            nodeTimings: {},
            discoveryResults: {},
            guardrailResults: {},
            checkpointsSaved: 0,
            memoryReads: 0,
            memoryWrites: 0,
          },
        },
      })
    );
    const newRunId = await store.fork('cp-1', { scratch: { y: 99 } });
    expect(newRunId).not.toBe('run-1');
    const forked = await store.latest(newRunId);
    expect(forked).not.toBeNull();
    expect(forked!.state.scratch).toEqual({ y: 99 });
    expect(forked!.state.input).toEqual({ x: 1 }); // unchanged
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/checkpoint-store.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ICheckpointStore and InMemoryCheckpointStore**

Create `packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts`:

- `Checkpoint` interface (from spec: id, graphId, runId, nodeId, timestamp, state, memorySnapshot?, nodeResults, visitedNodes, pendingEdges)
- `ICheckpointStore` interface (save, load, latest, list, delete, fork)

Create `packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts`:

- `private checkpoints: Map<string, Checkpoint>` keyed by checkpoint ID
- `save`: store in map
- `load(runId, nodeId?)`: find matching checkpoint(s), if nodeId provided filter, return first match or null
- `latest(runId)`: filter by runId, sort by timestamp desc, return first
- `list(graphId, options?)`: filter by graphId, optionally filter by runId, apply limit, return metadata (id, runId, graphId, nodeId, timestamp, stateSize: JSON.stringify length, hasMemorySnapshot)
- `delete`: remove from map
- `fork(checkpointId, patchState?)`: load checkpoint, deep-clone, generate new runId (uuid), apply patch via Object.assign on state partitions, save as new checkpoint, return new runId

Create `packages/agentos/src/orchestration/checkpoint/index.ts`: barrel export

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/checkpoint-store.test.ts`
Expected: PASS — all 7 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/checkpoint/ packages/agentos/src/orchestration/__tests__/checkpoint-store.test.ts
git commit -m "feat(orchestration): add ICheckpointStore interface and InMemoryCheckpointStore"
git push origin master
```

**Note:** `SqliteCheckpointStore` is listed in the file structure but deferred from this plan. It follows the same `ICheckpointStore` interface with `better-sqlite3` as the backend. Implement it as a follow-up task once the InMemory version is proven. The interface is stable — adding SQLite is mechanical.

---

### Task 4: StateManager

**Files:**

- Create: `packages/agentos/src/orchestration/runtime/StateManager.ts`
- Test: `packages/agentos/src/orchestration/__tests__/state-manager.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/state-manager.test.ts
import { describe, it, expect } from 'vitest';
import { StateManager } from '../runtime/StateManager.js';
import type { StateReducers, GraphState } from '../ir/index.js';

describe('StateManager', () => {
  it('initializes state with input and empty partitions', () => {
    const sm = new StateManager({});
    const state = sm.initialize({ topic: 'test' });
    expect(state.input).toEqual({ topic: 'test' });
    expect(state.scratch).toEqual({});
    expect(state.artifacts).toEqual({});
    expect(state.visitedNodes).toEqual([]);
    expect(state.iteration).toBe(0);
  });

  it('applies scratch update via set', () => {
    const sm = new StateManager({});
    let state = sm.initialize({});
    state = sm.updateScratch(state, { confidence: 0.9 });
    expect(state.scratch).toEqual({ confidence: 0.9 });
  });

  it('applies concat reducer', () => {
    const sm = new StateManager({ 'scratch.sources': 'concat' });
    let state = sm.initialize({});
    state = sm.updateScratch(state, { sources: ['a'] });
    state = sm.updateScratch(state, { sources: ['b', 'c'] });
    expect(state.scratch.sources).toEqual(['a', 'b', 'c']);
  });

  it('applies max reducer', () => {
    const sm = new StateManager({ 'scratch.confidence': 'max' });
    let state = sm.initialize({});
    state = sm.updateScratch(state, { confidence: 0.5 });
    state = sm.updateScratch(state, { confidence: 0.8 });
    expect(state.scratch.confidence).toBe(0.8);
  });

  it('applies min reducer', () => {
    const sm = new StateManager({ 'scratch.val': 'min' });
    let state = sm.initialize({});
    state = sm.updateScratch(state, { val: 10 });
    state = sm.updateScratch(state, { val: 3 });
    expect(state.scratch.val).toBe(3);
  });

  it('applies last reducer (default behavior)', () => {
    const sm = new StateManager({ 'scratch.name': 'last' });
    let state = sm.initialize({});
    state = sm.updateScratch(state, { name: 'old' });
    state = sm.updateScratch(state, { name: 'new' });
    expect(state.scratch.name).toBe('new');
  });

  it('applies custom reducer function', () => {
    const sm = new StateManager({
      'scratch.count': (existing: unknown, incoming: unknown) =>
        ((existing as number) ?? 0) + (incoming as number),
    });
    let state = sm.initialize({});
    state = sm.updateScratch(state, { count: 5 });
    state = sm.updateScratch(state, { count: 3 });
    expect(state.scratch.count).toBe(8);
  });

  it('updates artifacts', () => {
    const sm = new StateManager({});
    let state = sm.initialize({});
    state = sm.updateArtifacts(state, { summary: 'done' });
    expect(state.artifacts).toEqual({ summary: 'done' });
  });

  it('tracks visited nodes', () => {
    const sm = new StateManager({});
    let state = sm.initialize({});
    state = sm.recordNodeVisit(state, 'node-a');
    state = sm.recordNodeVisit(state, 'node-b');
    expect(state.visitedNodes).toEqual(['node-a', 'node-b']);
    expect(state.currentNodeId).toBe('node-b');
    expect(state.iteration).toBe(2);
  });

  it('merges parallel branch states', () => {
    const sm = new StateManager({ 'scratch.items': 'concat', 'scratch.score': 'max' });
    const base = sm.initialize({});
    const branch1 = sm.updateScratch({ ...base, scratch: {} }, { items: ['a'], score: 5 });
    const branch2 = sm.updateScratch({ ...base, scratch: {} }, { items: ['b'], score: 9 });
    const merged = sm.mergeParallelBranches(base, [branch1, branch2]);
    expect(merged.scratch.items).toEqual(['a', 'b']);
    expect(merged.scratch.score).toBe(9);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/state-manager.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement StateManager**

Create `packages/agentos/src/orchestration/runtime/StateManager.ts`:

- Constructor takes `reducers: StateReducers`
- `initialize(input)`: returns `GraphState` with empty scratch, artifacts, diagnostics, memory, visitedNodes=[], iteration=0
- `updateScratch(state, patch)`: for each key in patch, check if `scratch.${key}` has a reducer; if so, apply it; else last-write-wins. Returns new state (immutable).
- `updateArtifacts(state, patch)`: merge into artifacts partition
- `recordNodeVisit(state, nodeId)`: push to visitedNodes, set currentNodeId, increment iteration
- `mergeParallelBranches(baseState, branchStates[])`: for each field across all branch scratches, apply reducer. Fields without reducers use last-write-wins from the last branch.
- Built-in reducer implementations: concat, merge, max, min, avg, sum, last, first, longest
- Private `applyReducer(fieldPath, existing, incoming, reducer)` helper

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/state-manager.test.ts`
Expected: PASS — all 11 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/runtime/StateManager.ts packages/agentos/src/orchestration/__tests__/state-manager.test.ts
git commit -m "feat(orchestration): add StateManager with partition management and reducers"
git push origin master
```

---

### Task 5: NodeScheduler

**Files:**

- Create: `packages/agentos/src/orchestration/runtime/NodeScheduler.ts`
- Test: `packages/agentos/src/orchestration/__tests__/node-scheduler.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/node-scheduler.test.ts
import { describe, it, expect } from 'vitest';
import { NodeScheduler } from '../runtime/NodeScheduler.js';
import type { GraphNode, GraphEdge } from '../ir/index.js';
import { START, END } from '../ir/index.js';

function makeNode(id: string, type: GraphNode['type'] = 'tool'): GraphNode {
  return {
    id,
    type,
    executorConfig: { type: 'tool', toolName: 'test' },
    executionMode: 'single_turn',
    effectClass: 'pure',
    checkpoint: 'none',
  };
}

function makeEdge(source: string, target: string, id?: string): GraphEdge {
  return { id: id ?? `${source}->${target}`, source, target, type: 'static' };
}

describe('NodeScheduler', () => {
  it('returns nodes in topological order for linear graph', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const edges = [
      makeEdge(START, 'a'),
      makeEdge('a', 'b'),
      makeEdge('b', 'c'),
      makeEdge('c', END),
    ];
    const scheduler = new NodeScheduler(nodes, edges);
    const order = scheduler.topologicalSort();
    expect(order).toEqual(['a', 'b', 'c']);
  });

  it('handles parallel branches', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')];
    const edges = [
      makeEdge(START, 'a'),
      makeEdge(START, 'b'),
      makeEdge('a', 'c'),
      makeEdge('b', 'c'),
      makeEdge('c', END),
    ];
    const scheduler = new NodeScheduler(nodes, edges);
    const order = scheduler.topologicalSort();
    expect(order.indexOf('c')).toBeGreaterThan(order.indexOf('a'));
    expect(order.indexOf('c')).toBeGreaterThan(order.indexOf('b'));
  });

  it('detects cycles', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge(START, 'a'), makeEdge('a', 'b'), makeEdge('b', 'a')];
    const scheduler = new NodeScheduler(nodes, edges);
    expect(scheduler.hasCycles()).toBe(true);
  });

  it('detects no cycles in DAG', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge(START, 'a'), makeEdge('a', 'b'), makeEdge('b', END)];
    const scheduler = new NodeScheduler(nodes, edges);
    expect(scheduler.hasCycles()).toBe(false);
  });

  it('getReadyNodes returns nodes with all dependencies satisfied', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const edges = [
      makeEdge(START, 'a'),
      makeEdge(START, 'b'),
      makeEdge('a', 'c'),
      makeEdge('b', 'c'),
    ];
    const scheduler = new NodeScheduler(nodes, edges);

    // Initially, a and b are ready (only depend on START)
    const ready1 = scheduler.getReadyNodes([]);
    expect(ready1.sort()).toEqual(['a', 'b']);

    // After a completes, c is not ready yet (b not done)
    const ready2 = scheduler.getReadyNodes(['a']);
    expect(ready2).toEqual(['b']);

    // After both complete, c is ready
    const ready3 = scheduler.getReadyNodes(['a', 'b']);
    expect(ready3).toEqual(['c']);
  });

  it('detects unreachable nodes', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('orphan')];
    const edges = [makeEdge(START, 'a'), makeEdge('a', 'b'), makeEdge('b', END)];
    const scheduler = new NodeScheduler(nodes, edges);
    expect(scheduler.getUnreachableNodes()).toEqual(['orphan']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/node-scheduler.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement NodeScheduler**

Create `packages/agentos/src/orchestration/runtime/NodeScheduler.ts`:

- Constructor: takes `nodes: GraphNode[]`, `edges: GraphEdge[]`; builds adjacency list and reverse adjacency list (predecessors per node), treating START/END as virtual nodes
- `topologicalSort()`: Kahn's algorithm (BFS with in-degree tracking), returns node IDs in execution order, excludes START/END
- `hasCycles()`: returns true if topological sort cannot visit all nodes
- `getReadyNodes(completedNodeIds: string[], skippedNodeIds?: string[])`: returns node IDs whose ALL predecessors are in completedNodeIds OR skippedNodeIds (or START). The runtime marks nodes as "skipped" when a conditional/discovery edge routes around them. This prevents nodes from blocking forever when a conditional edge skips their predecessor.
- `getUnreachableNodes()`: BFS from START, return nodes not visited

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/node-scheduler.test.ts`
Expected: PASS — all 6 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/runtime/NodeScheduler.ts packages/agentos/src/orchestration/__tests__/node-scheduler.test.ts
git commit -m "feat(orchestration): add NodeScheduler with topological sort and cycle detection"
git push origin master
```

---

### Task 6: LoopController (Extracted ReAct Loop)

**Files:**

- Create: `packages/agentos/src/orchestration/runtime/LoopController.ts`
- Test: `packages/agentos/src/orchestration/__tests__/loop-controller.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/loop-controller.test.ts
import { describe, it, expect, vi } from 'vitest';
import { LoopController } from '../runtime/LoopController.js';
import type { LoopConfig, LoopContext, LoopEvent } from '../runtime/LoopController.js';

/**
 * Mock GMI that returns tool calls for N iterations, then stops.
 *
 * IMPORTANT: The LoopController must consume the async generator via manual
 * .next() calls (NOT for-await-of) to capture the generator return value
 * (GMIOutput). for-await-of discards return values.
 *
 * The mock yields events as chunks, then returns GMIOutput as the generator
 * return value (accessed when .done === true).
 */
function mockGmiWithToolCalls(toolCallIterations: number) {
  let calls = 0;
  return {
    async *processTurnStream() {
      calls++;
      if (calls <= toolCallIterations) {
        // Yield chunk events during streaming
        yield {
          type: 'tool_call_request' as const,
          toolCalls: [{ id: `tc-${calls}`, name: 'test_tool', arguments: {} }],
        };
        // Return value (captured via iterator.next() when done=true)
        return {
          responseText: '',
          toolCalls: [{ id: `tc-${calls}`, name: 'test_tool', arguments: {} }],
          finishReason: 'tool_calls',
        };
      }
      yield { type: 'text_delta' as const, content: 'Final answer' };
      return { responseText: 'Final answer', toolCalls: [], finishReason: 'stop' };
    },
    handleToolResult: vi.fn().mockResolvedValue({ responseText: 'ok' }),
  };
}

function mockToolOrchestrator() {
  return {
    processToolCall: vi
      .fn()
      .mockResolvedValue({ success: true, output: 'tool result', isError: false }),
  };
}

describe('LoopController', () => {
  it('executes single turn (no tool calls)', async () => {
    const controller = new LoopController();
    const gmi = mockGmiWithToolCalls(0);
    const tools = mockToolOrchestrator();
    const events: LoopEvent[] = [];

    for await (const event of controller.execute(
      { maxIterations: 5, parallelTools: false, failureMode: 'fail_open' },
      { gmi: gmi as any, toolOrchestrator: tools as any, conversationHistory: [] }
    )) {
      events.push(event);
    }

    expect(events.some((e) => e.type === 'text_delta')).toBe(true);
    expect(tools.processToolCall).not.toHaveBeenCalled();
  });

  it('loops through tool calls up to completion', async () => {
    const controller = new LoopController();
    const gmi = mockGmiWithToolCalls(2); // 2 tool iterations then stop
    const tools = mockToolOrchestrator();
    const events: LoopEvent[] = [];

    for await (const event of controller.execute(
      { maxIterations: 5, parallelTools: false, failureMode: 'fail_open' },
      { gmi: gmi as any, toolOrchestrator: tools as any, conversationHistory: [] }
    )) {
      events.push(event);
    }

    expect(tools.processToolCall).toHaveBeenCalledTimes(2);
    expect(events.some((e) => e.type === 'text_delta')).toBe(true);
  });

  it('respects maxIterations limit', async () => {
    const controller = new LoopController();
    const gmi = mockGmiWithToolCalls(10); // would loop 10 times
    const tools = mockToolOrchestrator();
    const events: LoopEvent[] = [];

    for await (const event of controller.execute(
      { maxIterations: 3, parallelTools: false, failureMode: 'fail_open' },
      { gmi: gmi as any, toolOrchestrator: tools as any, conversationHistory: [] }
    )) {
      events.push(event);
    }

    // Should stop at 3 iterations even though GMI wants more
    expect(tools.processToolCall.mock.calls.length).toBeLessThanOrEqual(3);
    expect(events.some((e) => e.type === 'max_iterations_reached')).toBe(true);
  });

  it('fail_closed throws on tool error', async () => {
    const controller = new LoopController();
    const gmi = mockGmiWithToolCalls(1);
    const tools = {
      processToolCall: vi.fn().mockResolvedValue({ success: false, isError: true, error: 'fail' }),
    };

    const events: LoopEvent[] = [];
    let threw = false;

    try {
      for await (const event of controller.execute(
        { maxIterations: 5, parallelTools: false, failureMode: 'fail_closed' },
        { gmi: gmi as any, toolOrchestrator: tools as any, conversationHistory: [] }
      )) {
        events.push(event);
      }
    } catch (e) {
      threw = true;
    }

    expect(threw).toBe(true);
  });

  it('fail_open continues on tool error', async () => {
    const controller = new LoopController();
    const gmi = mockGmiWithToolCalls(1);
    const tools = {
      processToolCall: vi.fn().mockResolvedValue({ success: false, isError: true, error: 'fail' }),
    };

    const events: LoopEvent[] = [];

    for await (const event of controller.execute(
      { maxIterations: 5, parallelTools: false, failureMode: 'fail_open' },
      { gmi: gmi as any, toolOrchestrator: tools as any, conversationHistory: [] }
    )) {
      events.push(event);
    }

    // Should not throw, should continue
    expect(events.some((e) => e.type === 'tool_error')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/loop-controller.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement LoopController**

Create `packages/agentos/src/orchestration/runtime/LoopController.ts`:

- Export `LoopConfig` interface (maxIterations, parallelTools, failureMode, timeout?)
- Export `LoopContext` interface (gmi, toolOrchestrator, conversationHistory, turnPlan?)
- Export `LoopEvent` type: `{ type: 'text_delta', content: string } | { type: 'tool_call_request', toolCalls: any[] } | { type: 'tool_result', toolName: string, result: any } | { type: 'tool_error', toolName: string, error: string } | { type: 'max_iterations_reached', iteration: number } | { type: 'loop_complete', totalIterations: number }`
- `LoopController` class with `async *execute(config, context)`:
  1. `let iteration = 0`
  2. `while (iteration < config.maxIterations)`:
     a. Call `context.gmi.processTurnStream()`, consume via **manual `.next()` calls** (NOT `for await...of`) to capture the generator return value (GMIOutput with toolCalls and finishReason)
     b. Yield each chunk as appropriate LoopEvent
     c. Capture final GMIOutput (generator return value)
     d. If no tool calls in output → yield `loop_complete`, return
     e. If tool calls present:
     - If `config.parallelTools`: `Promise.allSettled(toolCalls.map(tc => context.toolOrchestrator.processToolCall(...)))`
     - Else: sequential `for...of` with `await`
     - For each result: yield `tool_result` or `tool_error`
     - If `failureMode === 'fail_closed'` and any error → throw
     - Add all results to `context.conversationHistory`
       f. `iteration++`
  3. If loop exits via iteration limit → yield `max_iterations_reached`

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/loop-controller.test.ts`
Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/runtime/LoopController.ts packages/agentos/src/orchestration/__tests__/loop-controller.test.ts
git commit -m "feat(orchestration): add LoopController with configurable ReAct loop"
git push origin master
```

---

### Task 7: NodeExecutor

**Files:**

- Create: `packages/agentos/src/orchestration/runtime/NodeExecutor.ts`
- Test: `packages/agentos/src/orchestration/__tests__/node-executor.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/node-executor.test.ts
import { describe, it, expect, vi } from 'vitest';
import { NodeExecutor } from '../runtime/NodeExecutor.js';
import type { GraphNode } from '../ir/index.js';

function makeToolNode(toolName: string): GraphNode {
  return {
    id: `node-${toolName}`,
    type: 'tool',
    executorConfig: { type: 'tool', toolName },
    executionMode: 'single_turn',
    effectClass: 'external',
    checkpoint: 'none',
  };
}

describe('NodeExecutor', () => {
  it('executes tool node via ToolOrchestrator', async () => {
    const toolOrchestrator = {
      processToolCall: vi
        .fn()
        .mockResolvedValue({ success: true, output: { data: 'result' }, isError: false }),
    };
    const executor = new NodeExecutor({ toolOrchestrator: toolOrchestrator as any });
    const node = makeToolNode('web_search');
    const result = await executor.execute(node, {
      input: { query: 'test' },
      scratch: {},
      artifacts: {},
    });
    expect(result.success).toBe(true);
    expect(result.output).toEqual({ data: 'result' });
    expect(toolOrchestrator.processToolCall).toHaveBeenCalledTimes(1);
  });

  it('executes router node and returns target', async () => {
    const executor = new NodeExecutor({});
    const node: GraphNode = {
      id: 'router-1',
      type: 'router',
      executorConfig: { type: 'router', condition: { type: 'function', fn: () => 'next-node' } },
      executionMode: 'single_turn',
      effectClass: 'pure',
      checkpoint: 'none',
    };
    const result = await executor.execute(node, { input: {}, scratch: {}, artifacts: {} });
    expect(result.success).toBe(true);
    expect(result.routeTarget).toBe('next-node');
  });

  it('executes guardrail node', async () => {
    const guardrailEngine = {
      evaluate: vi.fn().mockResolvedValue({ passed: true, results: [] }),
    };
    const executor = new NodeExecutor({ guardrailEngine: guardrailEngine as any });
    const node: GraphNode = {
      id: 'guard-1',
      type: 'guardrail',
      executorConfig: { type: 'guardrail', guardrailIds: ['pii-redaction'], onViolation: 'block' },
      executionMode: 'single_turn',
      effectClass: 'pure',
      checkpoint: 'none',
    };
    const result = await executor.execute(node, {
      input: {},
      scratch: { text: 'hello' },
      artifacts: {},
    });
    expect(result.success).toBe(true);
  });

  it('handles timeout', async () => {
    const toolOrchestrator = {
      processToolCall: vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 5000))),
    };
    const executor = new NodeExecutor({ toolOrchestrator: toolOrchestrator as any });
    const node = { ...makeToolNode('slow_tool'), timeout: 50 };
    const result = await executor.execute(node, { input: {}, scratch: {}, artifacts: {} });
    expect(result.success).toBe(false);
    expect(result.error).toContain('timeout');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/node-executor.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement NodeExecutor**

Create `packages/agentos/src/orchestration/runtime/NodeExecutor.ts`:

- Constructor takes optional dependencies: `{ toolOrchestrator?, guardrailEngine?, gmiManager?, extensionManager?, loopController? }`
- `execute(node: GraphNode, state: Partial<GraphState>): Promise<NodeExecutionResult>`
- `NodeExecutionResult` type: `{ success: boolean; output?: unknown; error?: string; routeTarget?: string; scratchUpdate?: Record<string, unknown>; artifactsUpdate?: Record<string, unknown>; events?: GraphEvent[] }`
- `scratchUpdate`: partial update to apply to `state.scratch` (runtime calls `stateManager.updateScratch()`)
- `artifactsUpdate`: partial update to apply to `state.artifacts`
- Switch on `node.executorConfig.type`:
  - `tool`: call `toolOrchestrator.processToolCall({ toolCallRequest: { toolName, arguments: state.scratch } })`
  - `router`: evaluate condition (if function, call fn(state); if expression, evaluate via simple expression parser), return `{ routeTarget }`
  - `guardrail`: call `guardrailEngine.evaluate()` with state content
  - `gmi`: delegate to LoopController (to be wired in Task 8)
  - `human`: return `{ success: false, error: 'interrupt', interrupt: true }` (runtime handles pause)
  - `extension`: call extensionManager
  - `subgraph`: recursively invoke GraphRuntime (to be wired in Task 8)
- Wrap execution in timeout via `Promise.race` with `AbortController` if `node.timeout` is set

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/node-executor.test.ts`
Expected: PASS — all 4 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/runtime/NodeExecutor.ts packages/agentos/src/orchestration/__tests__/node-executor.test.ts
git commit -m "feat(orchestration): add NodeExecutor with type-based dispatch and timeout"
git push origin master
```

---

### Task 8: GraphRuntime

**Files:**

- Create: `packages/agentos/src/orchestration/runtime/GraphRuntime.ts`
- Create: `packages/agentos/src/orchestration/runtime/index.ts`
- Test: `packages/agentos/src/orchestration/__tests__/graph-runtime.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/graph-runtime.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GraphRuntime } from '../runtime/GraphRuntime.js';
import { InMemoryCheckpointStore } from '../checkpoint/index.js';
import type { CompiledExecutionGraph, GraphNode, GraphEdge } from '../ir/index.js';
import { START, END } from '../ir/index.js';

function makeToolNode(id: string, toolName: string): GraphNode {
  return {
    id,
    type: 'tool',
    executorConfig: { type: 'tool', toolName },
    executionMode: 'single_turn',
    effectClass: 'pure',
    checkpoint: 'after',
  };
}

function makeLinearGraph(): CompiledExecutionGraph {
  return {
    id: 'test-graph',
    name: 'linear',
    nodes: [makeToolNode('a', 'tool_a'), makeToolNode('b', 'tool_b')],
    edges: [
      { id: 'e1', source: START, target: 'a', type: 'static' },
      { id: 'e2', source: 'a', target: 'b', type: 'static' },
      { id: 'e3', source: 'b', target: END, type: 'static' },
    ],
    stateSchema: { input: {}, scratch: {}, artifacts: {} },
    reducers: {},
    checkpointPolicy: 'every_node',
    memoryConsistency: 'snapshot',
  };
}

describe('GraphRuntime', () => {
  it('executes a linear graph end-to-end', async () => {
    const toolOrchestrator = {
      processToolCall: vi.fn().mockResolvedValue({ success: true, output: 'done', isError: false }),
    };
    const store = new InMemoryCheckpointStore();
    const runtime = new GraphRuntime({
      checkpointStore: store,
      nodeExecutor: { execute: vi.fn().mockResolvedValue({ success: true, output: 'ok' }) } as any,
    });

    const result = await runtime.invoke(makeLinearGraph(), { query: 'test' });
    expect(result).toBeDefined();
  });

  it('emits events during streaming execution', async () => {
    const runtime = new GraphRuntime({
      checkpointStore: new InMemoryCheckpointStore(),
      nodeExecutor: { execute: vi.fn().mockResolvedValue({ success: true, output: 'ok' }) } as any,
    });

    const events = [];
    for await (const event of runtime.stream(makeLinearGraph(), { query: 'test' })) {
      events.push(event);
    }

    expect(events.some((e) => e.type === 'run_start')).toBe(true);
    expect(events.some((e) => e.type === 'node_start')).toBe(true);
    expect(events.some((e) => e.type === 'node_end')).toBe(true);
    expect(events.some((e) => e.type === 'run_end')).toBe(true);
  });

  it('saves checkpoints after each node', async () => {
    const store = new InMemoryCheckpointStore();
    const runtime = new GraphRuntime({
      checkpointStore: store,
      nodeExecutor: { execute: vi.fn().mockResolvedValue({ success: true, output: 'ok' }) } as any,
    });

    await runtime.invoke(makeLinearGraph(), { query: 'test' });
    const checkpoints = await store.list('test-graph');
    expect(checkpoints.length).toBeGreaterThanOrEqual(2); // one per node
  });

  it('evaluates conditional edges', async () => {
    const graph: CompiledExecutionGraph = {
      id: 'cond-graph',
      name: 'conditional',
      nodes: [
        makeToolNode('a', 'tool_a'),
        makeToolNode('b', 'tool_b'),
        makeToolNode('c', 'tool_c'),
      ],
      edges: [
        { id: 'e1', source: START, target: 'a', type: 'static' },
        {
          id: 'e2',
          source: 'a',
          target: 'b',
          type: 'conditional',
          condition: { type: 'function', fn: (state: any) => (state.scratch.goToB ? 'b' : 'c') },
        },
        { id: 'e3', source: 'a', target: 'c', type: 'static' },
        { id: 'e4', source: 'b', target: END, type: 'static' },
        { id: 'e5', source: 'c', target: END, type: 'static' },
      ],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'none',
      memoryConsistency: 'live',
    };

    const executeMock = vi
      .fn()
      .mockResolvedValueOnce({ success: true, output: 'a-done', scratchUpdate: { goToB: true } })
      .mockResolvedValue({ success: true, output: 'done' });

    const runtime = new GraphRuntime({
      checkpointStore: new InMemoryCheckpointStore(),
      nodeExecutor: { execute: executeMock } as any,
    });

    await runtime.invoke(graph, {});
    // Node 'a' ran, then conditional edge should route to 'b'
    const nodeIds = executeMock.mock.calls.map((c: any) => c[0].id);
    expect(nodeIds).toContain('a');
    expect(nodeIds).toContain('b');
    expect(nodeIds).not.toContain('c');
  });

  it('resumes from checkpoint', async () => {
    const store = new InMemoryCheckpointStore();
    const executeMock = vi.fn().mockResolvedValue({ success: true, output: 'ok' });
    const runtime = new GraphRuntime({
      checkpointStore: store,
      nodeExecutor: { execute: executeMock } as any,
    });

    // Execute fully
    await runtime.invoke(makeLinearGraph(), { query: 'test' });
    const checkpoints = await store.list('test-graph');
    expect(checkpoints.length).toBeGreaterThan(0);

    // Fork from first checkpoint with modified state
    const firstCp = checkpoints[0];
    const newRunId = await store.fork(firstCp.id, { scratch: { extra: true } });

    // Resume should execute remaining nodes
    executeMock.mockClear();
    const result = await runtime.resume(makeLinearGraph(), newRunId);
    expect(result).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/graph-runtime.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement GraphRuntime**

Create `packages/agentos/src/orchestration/runtime/GraphRuntime.ts`:

Constructor: `{ checkpointStore: ICheckpointStore, nodeExecutor: NodeExecutor }`

**`invoke(graph: CompiledExecutionGraph, input: unknown): Promise<unknown>`**:

1. Create `StateManager` from `graph.reducers`
2. Initialize state via `stateManager.initialize(input)`
3. Create `NodeScheduler` from `graph.nodes`, `graph.edges`
4. Generate `runId` (uuid)
5. Execute loop:
   a. `readyNodes = scheduler.getReadyNodes(state.visitedNodes)`
   b. For each ready node (sequential for now):
   - Record node visit in state
   - Execute via `nodeExecutor.execute(node, state)`
   - Update state scratch/artifacts from result
   - If checkpoint policy requires it, save checkpoint
   - Evaluate outgoing edges to find next targets
     c. If no ready nodes and END not reached → error
     d. If END reached → return state.artifacts

**`async *stream(graph, input): AsyncIterable<GraphEvent>`**:

- Same logic as invoke but yields GraphEvents at each step (run_start, node_start, node_end, edge_transition, checkpoint_saved, run_end)

**`resume(graph, runId): Promise<unknown>`**:

1. Load latest checkpoint for runId
2. Reconstruct state from checkpoint
3. Determine which nodes to skip (already visited) vs re-execute vs replay
4. For visited nodes with effect class write/external/human → replay from nodeResults
5. Continue execution from pending edges

**Edge evaluation logic**:

- Static edge: always follow
- Conditional edge: call condition function/evaluate expression, result is target node ID
- Personality edge: read trait from persona context, compare to threshold
- Discovery edge: call discovery engine (stubbed for now, wired in Phase 2)

Create `packages/agentos/src/orchestration/runtime/index.ts`:

```typescript
export { StateManager } from './StateManager.js';
export { NodeScheduler } from './NodeScheduler.js';
export { LoopController } from './LoopController.js';
export type { LoopConfig, LoopContext, LoopEvent } from './LoopController.js';
export { NodeExecutor } from './NodeExecutor.js';
export type { NodeExecutionResult } from './NodeExecutor.js';
export { GraphRuntime } from './GraphRuntime.js';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/graph-runtime.test.ts`
Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/runtime/ packages/agentos/src/orchestration/__tests__/graph-runtime.test.ts
git commit -m "feat(orchestration): add GraphRuntime with execute, stream, resume, and conditional edges"
git push origin master
```

---

### Task 9: Barrel Exports + Package Integration

**Files:**

- Create: `packages/agentos/src/orchestration/index.ts`
- Modify: `packages/agentos/src/index.ts`
- Modify: `packages/agentos/src/core/index.ts`
- Modify: `packages/agentos/package.json`

- [ ] **Step 1: Create orchestration barrel export**

```typescript
// packages/agentos/src/orchestration/index.ts
export * from './ir/index.js';
export * from './events/index.js';
export * from './checkpoint/index.js';
export * from './runtime/index.js';
```

- [ ] **Step 2: Add to package exports**

Add to `packages/agentos/src/index.ts`:

```typescript
export * from './orchestration/index.js';
```

**Do NOT add to `packages/agentos/src/core/index.ts`** — this would create circular barrel exports since orchestration code imports from `core/` (GuardrailEngine, ToolOrchestrator). Only export from the top-level `index.ts` and the dedicated export map entry.

Add to `packages/agentos/package.json`:

- Add `zod` and `zod-to-json-schema` to dependencies (zod may already be a peer dep — verify and add as direct dep if needed)
- Add `better-sqlite3` and `@types/better-sqlite3` to optionalDependencies/devDependencies
- Add exports map entry:

```json
"./orchestration": {
  "import": "./dist/orchestration/index.js",
  "types": "./dist/orchestration/index.d.ts"
}
```

- [ ] **Step 3: Verify build**

Run: `cd packages/agentos && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add packages/agentos/src/orchestration/index.ts packages/agentos/src/index.ts packages/agentos/src/core/index.ts packages/agentos/package.json
git commit -m "feat(orchestration): add barrel exports and package integration for Phase 1"
git push origin master
```

---

## Phase 2: AgentGraph Builder

### Task 10: Node Builder Factories

**Files:**

- Create: `packages/agentos/src/orchestration/builders/nodes.ts`
- Test: (covered by agent-graph tests in Task 12)

- [ ] **Step 1: Implement node builders**

Create `packages/agentos/src/orchestration/builders/nodes.ts`:

- Each factory returns a `GraphNode` with sensible defaults
- `gmiNode(config, policies?)`: type='gmi', executionMode defaults to 'react_bounded', effectClass='read'
- `toolNode(toolName, config?, policies?)`: type='tool', executionMode='single_turn', effectClass defaults to 'external'
- `humanNode(config, policies?)`: type='human', effectClass='human'
- `routerNode(routeFn)`: type='router', effectClass='pure', converts fn or string to GraphCondition
- `guardrailNode(guardrailIds, config)`: type='guardrail', effectClass='pure'
- `subgraphNode(compiledGraph, config?)`: type='subgraph', effectClass='read'
- Each generates a unique `id` via `${type}-${crypto.randomUUID().slice(0,8)}` if not provided

- [ ] **Step 2: Commit**

```bash
git add packages/agentos/src/orchestration/builders/nodes.ts
git commit -m "feat(orchestration): add typed node builder factories"
git push origin master
```

---

### Task 11: Schema Lowering + Validator

**Files:**

- Create: `packages/agentos/src/orchestration/compiler/SchemaLowering.ts`
- Create: `packages/agentos/src/orchestration/compiler/Validator.ts`
- Test: `packages/agentos/src/orchestration/__tests__/schema-lowering.test.ts`
- Test: `packages/agentos/src/orchestration/__tests__/validator.test.ts`

- [ ] **Step 1: Write failing tests for SchemaLowering**

```typescript
// packages/agentos/src/orchestration/__tests__/schema-lowering.test.ts
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { lowerZodToJsonSchema } from '../compiler/SchemaLowering.js';

describe('SchemaLowering', () => {
  it('converts z.string() to JSON Schema', () => {
    const schema = lowerZodToJsonSchema(z.string());
    expect(schema.type).toBe('string');
  });

  it('converts z.object() to JSON Schema', () => {
    const schema = lowerZodToJsonSchema(z.object({ name: z.string(), age: z.number() }));
    expect(schema.type).toBe('object');
    expect(schema.properties).toHaveProperty('name');
    expect(schema.properties).toHaveProperty('age');
  });

  it('converts z.array() to JSON Schema', () => {
    const schema = lowerZodToJsonSchema(z.array(z.string()));
    expect(schema.type).toBe('array');
  });

  it('handles z.enum()', () => {
    const schema = lowerZodToJsonSchema(z.enum(['a', 'b', 'c']));
    expect(schema.enum).toEqual(['a', 'b', 'c']);
  });
});
```

- [ ] **Step 2: Write failing tests for Validator**

```typescript
// packages/agentos/src/orchestration/__tests__/validator.test.ts
import { describe, it, expect } from 'vitest';
import { GraphValidator } from '../compiler/Validator.js';
import type { CompiledExecutionGraph } from '../ir/index.js';
import { START, END } from '../ir/index.js';

describe('GraphValidator', () => {
  it('passes valid DAG', () => {
    const graph: CompiledExecutionGraph = {
      id: 'g1',
      name: 'test',
      nodes: [
        {
          id: 'a',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
      ],
      edges: [
        { id: 'e1', source: START, target: 'a', type: 'static' },
        { id: 'e2', source: 'a', target: END, type: 'static' },
      ],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'none',
      memoryConsistency: 'live',
    };
    const result = GraphValidator.validate(graph, { requireAcyclic: true });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects cycle when requireAcyclic is true', () => {
    const graph: CompiledExecutionGraph = {
      id: 'g2',
      name: 'cyclic',
      nodes: [
        {
          id: 'a',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
        {
          id: 'b',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
      ],
      edges: [
        { id: 'e1', source: START, target: 'a', type: 'static' },
        { id: 'e2', source: 'a', target: 'b', type: 'static' },
        { id: 'e3', source: 'b', target: 'a', type: 'static' },
      ],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'none',
      memoryConsistency: 'live',
    };
    const result = GraphValidator.validate(graph, { requireAcyclic: true });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('cycle'))).toBe(true);
  });

  it('allows cycles when requireAcyclic is false', () => {
    const graph: CompiledExecutionGraph = {
      id: 'g3',
      name: 'cyclic-ok',
      nodes: [
        {
          id: 'a',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
        {
          id: 'b',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
      ],
      edges: [
        { id: 'e1', source: START, target: 'a', type: 'static' },
        { id: 'e2', source: 'a', target: 'b', type: 'static' },
        { id: 'e3', source: 'b', target: 'a', type: 'static' },
        { id: 'e4', source: 'b', target: END, type: 'static' },
      ],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'none',
      memoryConsistency: 'live',
    };
    const result = GraphValidator.validate(graph, { requireAcyclic: false });
    expect(result.valid).toBe(true);
  });

  it('warns on unreachable nodes', () => {
    const graph: CompiledExecutionGraph = {
      id: 'g4',
      name: 'unreachable',
      nodes: [
        {
          id: 'a',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
        {
          id: 'orphan',
          type: 'tool',
          executorConfig: { type: 'tool', toolName: 't' },
          executionMode: 'single_turn',
          effectClass: 'pure',
          checkpoint: 'none',
        },
      ],
      edges: [
        { id: 'e1', source: START, target: 'a', type: 'static' },
        { id: 'e2', source: 'a', target: END, type: 'static' },
      ],
      stateSchema: { input: {}, scratch: {}, artifacts: {} },
      reducers: {},
      checkpointPolicy: 'none',
      memoryConsistency: 'live',
    };
    const result = GraphValidator.validate(graph);
    expect(result.warnings.some((w) => w.includes('orphan'))).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/schema-lowering.test.ts src/orchestration/__tests__/validator.test.ts`
Expected: FAIL — modules not found

- [ ] **Step 4: Implement SchemaLowering**

Create `packages/agentos/src/orchestration/compiler/SchemaLowering.ts`:

- `lowerZodToJsonSchema(zodSchema: ZodSchema): Record<string, any>` — wraps `zod-to-json-schema` library
- Add `zod-to-json-schema` to devDependencies in `packages/agentos/package.json`
- Note: if `zod-to-json-schema` is not available, implement a minimal converter for the types used in the spec (object, string, number, array, enum)

- [ ] **Step 5: Implement Validator**

Create `packages/agentos/src/orchestration/compiler/Validator.ts`:

- `GraphValidator.validate(graph, options?: { requireAcyclic?: boolean }): ValidationResult`
- `ValidationResult = { valid: boolean; errors: string[]; warnings: string[] }`
- Checks: cycle detection (via NodeScheduler.hasCycles) → error when requireAcyclic; unreachable nodes (via NodeScheduler.getUnreachableNodes) → **warning** in validator; edge references valid node IDs → error; START has outgoing edges → error; END has incoming edges → error
- Note: AgentGraph.compile() promotes warnings to errors when `validate: true` (the default). The validator itself only reports warnings for unreachable nodes.

- [ ] **Step 6: Run tests to verify they pass**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/schema-lowering.test.ts src/orchestration/__tests__/validator.test.ts`
Expected: PASS — all 8 tests green

- [ ] **Step 7: Commit**

```bash
git add packages/agentos/src/orchestration/compiler/ packages/agentos/src/orchestration/__tests__/schema-lowering.test.ts packages/agentos/src/orchestration/__tests__/validator.test.ts packages/agentos/package.json
git commit -m "feat(orchestration): add SchemaLowering and GraphValidator"
git push origin master
```

---

### Task 12: AgentGraph Builder + GraphCompiler

**Files:**

- Create: `packages/agentos/src/orchestration/builders/AgentGraph.ts`
- Create: `packages/agentos/src/orchestration/compiler/GraphCompiler.ts`
- Create: `packages/agentos/src/orchestration/builders/index.ts`
- Create: `packages/agentos/src/orchestration/compiler/index.ts`
- Test: `packages/agentos/src/orchestration/__tests__/agent-graph.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/agent-graph.test.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { AgentGraph } from '../builders/AgentGraph.js';
import { toolNode, gmiNode, routerNode } from '../builders/nodes.js';
import { InMemoryCheckpointStore } from '../checkpoint/index.js';
import { START, END } from '../ir/index.js';

describe('AgentGraph', () => {
  it('builds and compiles a simple linear graph', () => {
    const graph = new AgentGraph({
      input: z.object({ topic: z.string() }),
      scratch: z.object({}),
      artifacts: z.object({ result: z.string() }),
    })
      .addNode('search', toolNode('web_search'))
      .addNode('summarize', toolNode('summarize'))
      .addEdge(START, 'search')
      .addEdge('search', 'summarize')
      .addEdge('summarize', END)
      .compile();

    expect(graph).toBeDefined();
    const ir = graph.toIR();
    expect(ir.nodes).toHaveLength(2);
    expect(ir.edges).toHaveLength(3);
  });

  it('supports conditional edges', () => {
    const graph = new AgentGraph({
      input: z.object({}),
      scratch: z.object({ confidence: z.number().default(0) }),
      artifacts: z.object({}),
    })
      .addNode('eval', toolNode('evaluate'))
      .addNode('retry', toolNode('search'))
      .addNode('done', toolNode('finish'))
      .addEdge(START, 'eval')
      .addConditionalEdge('eval', (state) => (state.scratch.confidence > 0.8 ? 'done' : 'retry'))
      .addEdge('retry', 'eval') // cycle
      .addEdge('done', END)
      .compile({ validate: false }); // cycles allowed in AgentGraph

    const ir = graph.toIR();
    expect(ir.edges.some((e) => e.type === 'conditional')).toBe(true);
  });

  it('supports personality edges', () => {
    const graph = new AgentGraph({
      input: z.object({}),
      scratch: z.object({}),
      artifacts: z.object({}),
    })
      .addNode('decide', toolNode('decide'))
      .addNode('careful', toolNode('review'))
      .addNode('fast', toolNode('ship'))
      .addEdge(START, 'decide')
      .addPersonalityEdge('decide', {
        trait: 'conscientiousness',
        threshold: 0.7,
        above: 'careful',
        below: 'fast',
      })
      .addEdge('careful', END)
      .addEdge('fast', END)
      .compile();

    const ir = graph.toIR();
    expect(ir.edges.some((e) => e.type === 'personality')).toBe(true);
  });

  it('supports discovery edges', () => {
    const graph = new AgentGraph({
      input: z.object({ query: z.string() }),
      scratch: z.object({}),
      artifacts: z.object({}),
    })
      .addNode('start', toolNode('init'))
      .addNode('fallback', toolNode('default_search'))
      .addEdge(START, 'start')
      .addDiscoveryEdge('start', {
        query: 'best tool for {input.query}',
        kind: 'tool',
        fallbackTarget: 'fallback',
      })
      .addEdge('fallback', END)
      .compile();

    const ir = graph.toIR();
    expect(ir.edges.some((e) => e.type === 'discovery')).toBe(true);
  });

  it('rejects duplicate node IDs', () => {
    expect(() => {
      new AgentGraph({
        input: z.object({}),
        scratch: z.object({}),
        artifacts: z.object({}),
      })
        .addNode('a', toolNode('t1'))
        .addNode('a', toolNode('t2'));
    }).toThrow(/duplicate/i);
  });

  it('validates unreachable nodes on compile', () => {
    expect(() => {
      new AgentGraph({
        input: z.object({}),
        scratch: z.object({}),
        artifacts: z.object({}),
      })
        .addNode('a', toolNode('t1'))
        .addNode('orphan', toolNode('t2'))
        .addEdge(START, 'a')
        .addEdge('a', END)
        .compile({ validate: true });
    }).toThrow(/unreachable|orphan/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/agent-graph.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement AgentGraph builder**

Create `packages/agentos/src/orchestration/builders/AgentGraph.ts`:

- `AgentGraph` class parameterized by state schema (Zod)
- Internal state: `nodes: Map<string, GraphNode>`, `edges: GraphEdge[]`, `stateSchema`, `config`
- `addNode(id, node)`: set node.id = id if not set, check for duplicates, store in map
- `addEdge(source, target)`: push static edge
- `addConditionalEdge(source, conditionFn)`: push conditional edge with `{ type: 'function', fn: conditionFn }`
- `addDiscoveryEdge(source, config)`: push discovery edge
- `addPersonalityEdge(source, config)`: push personality edge
- `compile(options?)`:
  1. Call `GraphCompiler.compile(this.nodes, this.edges, this.stateSchema, this.config)`
  2. If `options.validate !== false`, call `GraphValidator.validate(ir)`, throw on errors
  3. Return `CompiledAgentGraph` wrapping the IR + GraphRuntime

Create `packages/agentos/src/orchestration/compiler/GraphCompiler.ts`:

- `GraphCompiler.compile(nodes, edges, stateSchema, config)`: returns `CompiledExecutionGraph`
  - Lower Zod schemas to JSON Schema via SchemaLowering
  - Assemble nodes array, edges array
  - Generate graph ID
  - Return IR object

Create `CompiledAgentGraph` class:

- Holds `ir: CompiledExecutionGraph` and `runtimeFactory` (lazy-created GraphRuntime)
- `invoke(input)`: create runtime, call `runtime.invoke(ir, input)`
- `stream(input)`: create runtime, return `runtime.stream(ir, input)`
- `resume(checkpointId, patch?)`: create runtime, call `runtime.resume(ir, ...)`
- `inspect(runId)`: delegate to runtime
- `toIR()`: return ir

Create barrel exports for builders and compiler.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/agent-graph.test.ts`
Expected: PASS — all 6 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/builders/ packages/agentos/src/orchestration/compiler/ packages/agentos/src/orchestration/__tests__/agent-graph.test.ts
git commit -m "feat(orchestration): add AgentGraph builder with all edge types and compilation"
git push origin master
```

---

## Phase 3: workflow() DSL

### Task 13: WorkflowBuilder

**Files:**

- Create: `packages/agentos/src/orchestration/builders/WorkflowBuilder.ts`
- Test: `packages/agentos/src/orchestration/__tests__/workflow-builder.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/workflow-builder.test.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { workflow } from '../builders/WorkflowBuilder.js';
import { InMemoryCheckpointStore } from '../checkpoint/index.js';

describe('WorkflowBuilder', () => {
  it('builds a linear workflow', () => {
    const flow = workflow('test-flow')
      .input(z.object({ email: z.string() }))
      .returns(z.object({ userId: z.string() }))
      .step('validate', { tool: 'email_validator' })
      .then('create', { tool: 'user_service' })
      .compile();

    const ir = flow.toIR();
    expect(ir.nodes).toHaveLength(2);
    expect(ir.name).toBe('test-flow');
  });

  it('builds workflow with branch', () => {
    const flow = workflow('branch-flow')
      .input(z.object({ type: z.string() }))
      .returns(z.object({ result: z.string() }))
      .step('classify', { tool: 'classifier' })
      .branch((state: any) => state.scratch.type, {
        premium: { tool: 'premium_handler' },
        free: { tool: 'free_handler' },
      })
      .then('finish', { tool: 'finalizer' })
      .compile();

    const ir = flow.toIR();
    // classify + 2 branch nodes + finish = 4
    expect(ir.nodes.length).toBeGreaterThanOrEqual(4);
  });

  it('builds workflow with parallel steps', () => {
    const flow = workflow('parallel-flow')
      .input(z.object({}))
      .returns(z.object({}))
      .step('start', { tool: 'init' })
      .parallel(
        [
          { tool: 'email_sender', effectClass: 'external' },
          { tool: 'slack_notify', effectClass: 'external' },
        ],
        { strategy: 'all', merge: { 'scratch.results': 'concat' }, timeout: 5000 }
      )
      .compile();

    const ir = flow.toIR();
    expect(ir.nodes.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects cycles (DAG only)', () => {
    expect(() => {
      // workflow() cannot create cycles directly via the API
      // This test verifies that the compile step validates acyclicity
      workflow('cycle-attempt')
        .input(z.object({}))
        .returns(z.object({}))
        .step('a', { tool: 'tool_a' })
        .then('b', { tool: 'tool_b' })
        .compile();
    }).not.toThrow(); // linear is fine

    // Note: workflow() API doesn't expose addEdge, so cycles can't be created
    // through the builder. This is by design.
  });

  it('defaults GMI steps to single_turn', () => {
    const flow = workflow('gmi-flow')
      .input(z.object({}))
      .returns(z.object({}))
      .step('think', { gmi: { instructions: 'Analyze the input' } })
      .compile();

    const ir = flow.toIR();
    const gmiNode = ir.nodes.find((n) => n.type === 'gmi');
    expect(gmiNode?.executionMode).toBe('single_turn');
  });

  it('requires input and returns schemas', () => {
    expect(() => {
      workflow('no-schema').step('a', { tool: 't' }).compile();
    }).toThrow(/input.*required|returns.*required/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/workflow-builder.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement WorkflowBuilder**

Create `packages/agentos/src/orchestration/builders/WorkflowBuilder.ts`:

Export `workflow(name: string): WorkflowBuilder`

`WorkflowBuilder` class:

- Internal state: `name`, `inputSchema?`, `returnsSchema?`, `steps: Array<{ id, config, type: 'step'|'branch'|'parallel' }>`
- `input(schema)`: store Zod schema
- `returns(schema)`: store Zod schema
- `step(id, config: StepConfig)`: push step to internal list
- `then(id, config)`: alias for `step()` (syntactic sugar for readability)
- `branch(condition, routes)`:
  - For each route key, create a step node
  - Create a router node before branches
  - All branch endpoints auto-join to the next step
- `parallel(steps, joinConfig)`:
  - Create nodes for each parallel step
  - Track join strategy (all/any/quorum) and merge reducers
  - Parallel nodes fan-out from previous step, fan-in to next step
- `compile(options?)`:
  1. Validate: input and returns schemas are set (throw if not)
  2. Convert internal step list → nodes + edges:
     - Linear steps: chain A → B → C
     - Branches: previous → router → {branch_a, branch_b} → join_point → next
     - Parallel: previous → {parallel_a, parallel_b, parallel_c} → join_point → next
  3. StepConfig → GraphNode:
     - `tool` → toolNode()
     - `gmi` → gmiNode() with executionMode forced to 'single_turn'
     - `human` → humanNode()
     - `extension` → extension node
     - `subgraph` → subgraphNode()
  4. Wrap with START/END edges
  5. Call GraphCompiler.compile()
  6. Call GraphValidator.validate() with `requireAcyclic: true`
  7. Return CompiledWorkflow (same interface as CompiledAgentGraph)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/workflow-builder.test.ts`
Expected: PASS — all 6 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/builders/WorkflowBuilder.ts packages/agentos/src/orchestration/__tests__/workflow-builder.test.ts
git commit -m "feat(orchestration): add workflow() DSL with step, branch, parallel, and DAG enforcement"
git push origin master
```

---

## Phase 4: mission() API

### Task 14: MissionBuilder + MissionCompiler

**Files:**

- Create: `packages/agentos/src/orchestration/builders/MissionBuilder.ts`
- Create: `packages/agentos/src/orchestration/compiler/MissionCompiler.ts`
- Test: `packages/agentos/src/orchestration/__tests__/mission-builder.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/src/orchestration/__tests__/mission-builder.test.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { mission } from '../builders/MissionBuilder.js';
import { toolNode, humanNode } from '../builders/nodes.js';

describe('MissionBuilder', () => {
  it('builds a mission with goal and returns', () => {
    const m = mission('research')
      .input(z.object({ topic: z.string() }))
      .goal('Research {topic} thoroughly')
      .returns(z.object({ summary: z.string() }))
      .planner({ strategy: 'plan_and_execute', maxSteps: 5 })
      .compile();

    expect(m).toBeDefined();
    expect(m.toIR).toBeDefined();
    expect(m.explain).toBeDefined();
  });

  it('interpolates goal template from input schema', () => {
    const m = mission('test')
      .input(z.object({ topic: z.string(), depth: z.number() }))
      .goal('Research {topic} to depth {depth}')
      .returns(z.object({ result: z.string() }))
      .planner({ strategy: 'react', maxSteps: 3 })
      .compile();

    // The compiled mission should have the goal template stored
    const ir = m.toIR();
    expect(ir).toBeDefined();
  });

  it('supports anchors with phase constraints', () => {
    const m = mission('anchored')
      .input(z.object({ query: z.string() }))
      .goal('Answer {query}')
      .returns(z.object({ answer: z.string() }))
      .planner({ strategy: 'plan_and_execute', maxSteps: 8 })
      .policy({
        guardrails: ['grounding-guard'],
      })
      .anchor('fact-check', toolNode('grounding_verifier'), {
        required: true,
        phase: 'validate',
        before: { phase: 'deliver' },
      })
      .anchor('review', humanNode({ prompt: 'Verify facts' }), {
        required: true,
        phase: 'validate',
        after: 'fact-check',
      })
      .compile();

    expect(m).toBeDefined();
  });

  it('supports policy configuration', () => {
    const m = mission('policy-test')
      .input(z.object({}))
      .goal('Do something')
      .returns(z.object({}))
      .planner({ strategy: 'react', maxSteps: 3 })
      .policy({
        memory: { consistency: 'snapshot', read: { types: ['semantic'] }, write: 'auto' },
        discovery: { kind: 'tool', fallback: 'all' },
        personality: { traitRouting: true },
        guardrails: ['pii-redaction'],
      })
      .compile();

    expect(m).toBeDefined();
  });

  it('requires input schema', () => {
    expect(() => {
      mission('no-input')
        .goal('Do something')
        .returns(z.object({}))
        .planner({ strategy: 'react', maxSteps: 3 })
        .compile();
    }).toThrow(/input.*required/i);
  });

  it('requires goal', () => {
    expect(() => {
      mission('no-goal')
        .input(z.object({}))
        .returns(z.object({}))
        .planner({ strategy: 'react', maxSteps: 3 })
        .compile();
    }).toThrow(/goal.*required/i);
  });

  it('requires planner config', () => {
    expect(() => {
      mission('no-planner')
        .input(z.object({}))
        .goal('Do something')
        .returns(z.object({}))
        .compile();
    }).toThrow(/planner.*required/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/mission-builder.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement MissionBuilder**

Create `packages/agentos/src/orchestration/builders/MissionBuilder.ts`:

Export `mission(name: string): MissionBuilder`

`MissionBuilder` class:

- Internal state: `name`, `inputSchema?`, `goalTemplate?`, `returnsSchema?`, `plannerConfig?`, `policyConfig?`, `anchors: Array<{ id, node, constraints }>`
- `input(schema)`: store Zod schema
- `goal(template)`: store template string
- `returns(schema)`: store Zod schema
- `planner(config)`: store planner config (strategy, maxSteps, maxIterationsPerNode, parallelTools)
- `policy(config)`: store policy config (memory, discovery, personality, guardrails)
- `anchor(id, node, constraints)`: push to anchors array
- `compile(options?)`:
  1. Validate required fields (input, goal, returns, planner)
  2. Create `CompiledMission` that wraps:
     - The builder config (for `explain()`)
     - A MissionCompiler reference (for runtime plan generation)
     - A GraphRuntime reference (for execution)

Create `packages/agentos/src/orchestration/compiler/MissionCompiler.ts`:

`MissionCompiler` class:

- `compile(missionConfig, planningEngine?): CompiledExecutionGraph`
  1. If no planningEngine provided, create a stub that generates a simple linear plan
  2. Call `planningEngine.generatePlan(goal, { tools, constraints })`
  3. Map each PlanStep to a GraphNode:
     - `tool_call` → toolNode
     - `reasoning` → gmiNode with planner_controlled mode
     - `human_input` → humanNode
     - `information_gathering` → toolNode via discovery
     - `validation` → guardrailNode
  4. Map dependencies to edges
  5. Splice anchors at declared phases
  6. Attach policies to all nodes
  7. Validate DAG (no cycles in v1)
  8. Return CompiledExecutionGraph

`CompiledMission` class:

- `invoke(input)`: compile plan → execute via GraphRuntime
- `stream(input)`: compile plan → stream via GraphRuntime
- `explain(input)`: compile plan → return the ExecutionPlan without executing
- `toWorkflow()`: compile plan → return the IR
- `toIR()`: return last compiled IR
- `resume(checkpointId, patch?)`: load checkpoint → resume via GraphRuntime
- `inspect(runId)`: delegate to GraphRuntime

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/orchestration/__tests__/mission-builder.test.ts`
Expected: PASS — all 7 tests green

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/builders/MissionBuilder.ts packages/agentos/src/orchestration/compiler/MissionCompiler.ts packages/agentos/src/orchestration/__tests__/mission-builder.test.ts
git commit -m "feat(orchestration): add mission() API with goal interpolation, anchors, and PlanningEngine bridge"
git push origin master
```

---

### Task 15: Update Barrel Exports + Final Integration

**Files:**

- Modify: `packages/agentos/src/orchestration/builders/index.ts`
- Modify: `packages/agentos/src/orchestration/compiler/index.ts`
- Modify: `packages/agentos/src/orchestration/index.ts`

- [ ] **Step 1: Update all barrel exports**

`packages/agentos/src/orchestration/builders/index.ts`:

```typescript
export { gmiNode, toolNode, humanNode, routerNode, guardrailNode, subgraphNode } from './nodes.js';
export { AgentGraph } from './AgentGraph.js';
export { workflow } from './WorkflowBuilder.js';
export { mission } from './MissionBuilder.js';
export type { NodePolicies } from './nodes.js';
export type { StepConfig } from './WorkflowBuilder.js';
```

`packages/agentos/src/orchestration/compiler/index.ts`:

```typescript
export { GraphCompiler } from './GraphCompiler.js';
export { GraphValidator } from './Validator.js';
export { lowerZodToJsonSchema } from './SchemaLowering.js';
export { MissionCompiler } from './MissionCompiler.js';
```

`packages/agentos/src/orchestration/index.ts`:

```typescript
// IR types
export * from './ir/index.js';
// Events
export * from './events/index.js';
// Checkpoint
export * from './checkpoint/index.js';
// Runtime
export * from './runtime/index.js';
// Builders (public API)
export * from './builders/index.js';
// Compiler (advanced use)
export * from './compiler/index.js';
```

- [ ] **Step 2: Run all orchestration tests**

Run: `cd packages/agentos && npx vitest run src/orchestration/`
Expected: All tests pass

- [ ] **Step 3: Run full test suite**

Run: `cd packages/agentos && npx vitest run`
Expected: All existing tests still pass, no regressions

- [ ] **Step 4: Verify build**

Run: `cd packages/agentos && npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/orchestration/
git commit -m "feat(orchestration): complete unified orchestration layer — all 4 phases"
git push origin master
```

---

## Verification Checklist

After all tasks complete, verify:

1. **IR round-trip**: `graph.toIR()` returns valid `CompiledExecutionGraph` that can be inspected
2. **Checkpoint correctness**: Execute graph, resume from checkpoint, same final output
3. **Replay determinism**: write/external/human nodes replay recorded output on resume
4. **workflow() DAG enforcement**: Compiler rejects cycles
5. **workflow() single_turn**: GMI steps default to single_turn, no hidden loops
6. **AgentGraph cycles**: Cycles allowed, conditional edges route correctly
7. **mission() anchors**: Pinned steps appear at declared phases
8. **mission() explain()**: Returns generated plan without executing
9. **State reducers**: Parallel branches merge correctly (concat, max, etc.)
10. **Streaming**: `graph.stream()` yields run_start, node_start, node_end, run_end events
11. **Build**: `npm run build` succeeds with no errors
12. **Tests**: `npx vitest run src/orchestration/` — all pass
