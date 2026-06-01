# Class: CompiledWorkflow

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:692](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L692)

An execution-ready workflow produced by `WorkflowBuilder.compile()`.

Wraps a `CompiledExecutionGraph` and a `GraphRuntime`, exposing the same
three execution modes as the raw runtime:

- `invoke(input)` — run to completion and return final artifacts.
- `stream(input)` — run while yielding `GraphEvent` values at each step.
- `resume(checkpointId)` — restore an interrupted run from a checkpoint.

## Constructors

### Constructor

> **new CompiledWorkflow**(`ir`, `checkpointStore`, `deps?`): `CompiledWorkflow`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:704](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L704)

#### Parameters

##### ir

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The compiled execution graph (produced by `GraphCompiler`).

##### checkpointStore

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Checkpoint persistence backend.

##### deps?

`NodeExecutorDeps` = `{}`

Optional runtime executors forwarded to `NodeExecutor`.
                         Defaults to an empty object (no executors), in which
                         case `tool` / `gmi` / `extension` nodes degrade to
                         `success: false`. See WorkflowRuntimeDeps.

#### Returns

`CompiledWorkflow`

## Methods

### invoke()

> **invoke**(`input`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:721](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L721)

Execute the workflow to completion and return the final `artifacts` payload.

#### Parameters

##### input

`unknown`

Must conform to the schema declared via `.input()`.

#### Returns

`Promise`\<`unknown`\>

The `GraphState.artifacts` value after all nodes complete.

***

### resume()

> **resume**(`checkpointId`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:741](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L741)

Resume a previously interrupted workflow run from its latest checkpoint.

#### Parameters

##### checkpointId

`string`

Either the original run id or an exact checkpoint id.

#### Returns

`Promise`\<`unknown`\>

The final `GraphState.artifacts` value after resumption completes.

***

### stream()

> **stream**(`input`): `AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:731](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L731)

Execute the workflow while yielding `GraphEvent` values at each step boundary.

#### Parameters

##### input

`unknown`

Must conform to the schema declared via `.input()`.

#### Returns

`AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Yields

Runtime events in causal order.

***

### toIR()

> **toIR**(): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:750](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L750)

Expose the compiled IR for inspection, serialisation, or subgraph composition.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The underlying `CompiledExecutionGraph`.
