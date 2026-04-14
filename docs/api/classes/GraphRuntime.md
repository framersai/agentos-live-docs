# Class: GraphRuntime

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L152)

Main execution engine for compiled AgentOS graphs.

Instantiate once and reuse across multiple runs — the runtime itself is stateless
between calls. Each `invoke()` / `stream()` / `resume()` call creates isolated local
state tracked via closures.

## Example

```ts
const runtime = new GraphRuntime({ checkpointStore, nodeExecutor });
const result = await runtime.invoke(compiledGraph, { query: 'hello' });
```

## Constructors

### Constructor

> **new GraphRuntime**(`config`): `GraphRuntime`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:156](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L156)

#### Parameters

##### config

[`GraphRuntimeConfig`](../interfaces/GraphRuntimeConfig.md)

Injected dependencies shared across all runs handled by this instance.

#### Returns

`GraphRuntime`

## Methods

### invoke()

> **invoke**(`graph`, `input`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:172](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L172)

Execute the graph to completion and return the final `artifacts` payload.

This is a convenience wrapper around `stream()` that discards intermediate events
and awaits the terminal `run_end` event.

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Compiled execution graph to run.

##### input

`unknown`

Initial user-provided input; frozen into `GraphState.input`.

#### Returns

`Promise`\<`unknown`\>

The `GraphState.artifacts` value after the last node completes.

***

### resume()

> **resume**(`graph`, `runOrCheckpointId`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:745](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L745)

Resume a previously interrupted run from its latest persisted checkpoint.

The runtime restores `GraphState` from the checkpoint and re-executes any nodes
that had not yet completed when the run was suspended. Nodes recorded as
`write`, `external`, or `human` effect-class are replayed from their stored
outputs to avoid duplicate side-effects; all other nodes are re-executed.

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The same compiled graph that was originally invoked.

##### runOrCheckpointId

`string`

Either the original run id or an exact checkpoint id.

#### Returns

`Promise`\<`unknown`\>

The final `GraphState.artifacts` value after resumption completes.

#### Throws

When no checkpoint exists for the given identifier.

***

### stream()

> **stream**(`graph`, `input`): `AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:194](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L194)

Execute the graph while yielding `GraphEvent` values at each significant step.

Events are emitted in strict causal order:
`run_start` → (`node_start` → `node_end` → `edge_transition`?)+ → `run_end`

Checkpoints are saved according to both the graph-wide `checkpointPolicy` and
per-node `checkpoint` settings. An `interrupt` event causes immediate suspension
followed by a terminal `run_end`.

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Compiled execution graph to run.

##### input

`unknown`

Initial user-provided input; frozen into `GraphState.input`.

#### Returns

`AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Yields

Runtime events in causal order.

***

### streamResume()

> **streamResume**(`graph`, `runOrCheckpointId`): `AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:765](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L765)

Resume a previously interrupted run and stream runtime events from the restore point.

Accepts either the original run id or an exact checkpoint id. The resolved checkpoint
is used to reconstruct `GraphState`, then execution continues through the same event
stream contract as [()](#stream).

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Compiled execution graph to resume.

##### runOrCheckpointId

`string`

Either the original run id or an exact checkpoint id.

#### Returns

`AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Yields

Runtime events in causal order from the checkpoint onward.

#### Throws

When no checkpoint exists for the given identifier.
