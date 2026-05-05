# Class: CompiledAgentGraph\<TState\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:350](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L350)

A compiled, execution-ready agent graph.

Returned by `AgentGraph.compile()` — do not instantiate directly.

Wraps a `CompiledExecutionGraph` IR object and a `GraphRuntime` instance, exposing
the three execution modes: synchronous `invoke()`, streaming `stream()`, and
checkpoint-based `resume()`.

## Type Parameters

### TState

`TState` *extends* [`GraphState`](../interfaces/GraphState.md) = [`GraphState`](../interfaces/GraphState.md)

Type parameter threaded from the parent `AgentGraph`.

## Constructors

### Constructor

> **new CompiledAgentGraph**\<`TState`\>(`ir`, `checkpointStore`, `deps?`): `CompiledAgentGraph`\<`TState`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:360](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L360)

#### Parameters

##### ir

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Compiled execution graph IR produced by `GraphCompiler`.

##### checkpointStore

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Persistence backend for checkpoint snapshots.

##### deps?

`NodeExecutorDeps` = `{}`

Optional runtime executors forwarded to `NodeExecutor`.
                         See WorkflowRuntimeDeps.

#### Returns

`CompiledAgentGraph`\<`TState`\>

## Methods

### inspect()

> **inspect**(`_runId`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:427](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L427)

Inspect execution state for a completed or in-progress run.

#### Parameters

##### \_runId

`string`

The unique run identifier assigned at `stream()` call-time.

#### Returns

`Promise`\<`unknown`\>

A stub object — full inspection support is tracked separately.

Full runtime inspection is not implemented yet; this currently returns a
stub object until the run-registry subsystem lands.

***

### invoke()

> **invoke**(`input`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:384](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L384)

Execute the graph to completion and return the final `artifacts` payload.

This is the simplest execution mode — it buffers all events internally and returns
only the terminal output.  Use `stream()` when you need real-time progress updates.

#### Parameters

##### input

`unknown`

Initial user-provided input frozen into `GraphState.input`.

#### Returns

`Promise`\<`unknown`\>

The `GraphState.artifacts` value after the last node completes.

***

### resume()

> **resume**(`checkpointId`, `patch?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:412](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L412)

Resume a previously interrupted run from its latest persisted checkpoint.

The `patch` argument is accepted for API compatibility with future resume-with-patch
support; it is not forwarded to the runtime in the current implementation.

#### Parameters

##### checkpointId

`string`

Either the original run id or an exact checkpoint id.

##### patch?

`Partial`\<`TState`\>

Reserved for future use: optional partial state override.

#### Returns

`Promise`\<`unknown`\>

The final `GraphState.artifacts` value after resumption completes.

#### Throws

When no checkpoint exists for the given identifier.

***

### stream()

> **stream**(`input`): `AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:397](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L397)

Execute the graph while yielding `GraphEvent` values at each significant step.

Events are emitted in strict causal order:
`run_start` → (`node_start` → `node_end` → `edge_transition`?)+ → `run_end`

#### Parameters

##### input

`unknown`

Initial user-provided input frozen into `GraphState.input`.

#### Returns

`AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Yields

Runtime events in causal order.

***

### toIR()

> **toIR**(): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:437](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/AgentGraph.ts#L437)

Return the underlying `CompiledExecutionGraph` IR.

Useful for serialisation, debugging, or forwarding to external tooling.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)
