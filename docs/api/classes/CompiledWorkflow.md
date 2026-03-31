# Class: CompiledWorkflow

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:644](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L644)

An execution-ready workflow produced by `WorkflowBuilder.compile()`.

Wraps a `CompiledExecutionGraph` and a `GraphRuntime`, exposing the same
three execution modes as the raw runtime:

- `invoke(input)` — run to completion and return final artifacts.
- `stream(input)` — run while yielding `GraphEvent` values at each step.
- `resume(checkpointId)` — restore an interrupted run from a checkpoint.

## Constructors

### Constructor

> **new CompiledWorkflow**(`ir`, `checkpointStore`): `CompiledWorkflow`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:652](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L652)

#### Parameters

##### ir

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The compiled execution graph (produced by `GraphCompiler`).

##### checkpointStore

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Checkpoint persistence backend.

#### Returns

`CompiledWorkflow`

## Methods

### invoke()

> **invoke**(`input`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:668](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L668)

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

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:688](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L688)

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

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:678](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L678)

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

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:697](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/WorkflowBuilder.ts#L697)

Expose the compiled IR for inspection, serialisation, or subgraph composition.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The underlying `CompiledExecutionGraph`.
