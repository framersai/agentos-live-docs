# Class: CompiledMission

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:358](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L358)

Execution wrapper for a compiled mission.

Lazily re-compiles the IR on each call so that changes to the underlying
config are reflected without needing to rebuild the mission object.  In
production callers typically compile once and reuse the `CompiledMission`
for many invocations.

## Constructors

### Constructor

> **new CompiledMission**(`config`, `checkpointStore`): `CompiledMission`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:363](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L363)

#### Parameters

##### config

[`MissionConfig`](../interfaces/MissionConfig.md)

Frozen mission configuration snapshot.

##### checkpointStore

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Checkpoint persistence backend.

#### Returns

`CompiledMission`

## Methods

### explain()

> **explain**(`_input`): `Promise`\<\{ `ir`: [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md); `steps`: `any`[]; \}\>

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:456](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L456)

Return a human-readable execution plan without actually running the mission.

Useful for debugging, testing, and displaying "what will happen" summaries in UIs.

#### Parameters

##### \_input

`unknown`

Input payload (currently unused; reserved for future goal interpolation).

#### Returns

`Promise`\<\{ `ir`: [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md); `steps`: `any`[]; \}\>

An object containing:
  - `steps`: flat array of `{ id, type, config }` descriptors for each node.
  - `ir`: the full `CompiledExecutionGraph` for deeper inspection.

***

### inspect()

> **inspect**(`_runId`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:437](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L437)

Retrieve a diagnostic snapshot of a completed or in-progress run.

#### Parameters

##### \_runId

`string`

Run id assigned by the runtime at invocation time.

#### Returns

`Promise`\<`unknown`\>

A `RunInspection`-shaped object (stub — full implementation in Task 17+).

***

### invoke()

> **invoke**(`input`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L401)

Execute the mission to completion and return the final artifacts.

#### Parameters

##### input

`unknown`

Input payload conforming to the mission's `inputSchema`.

#### Returns

`Promise`\<`unknown`\>

The final `GraphState.artifacts` value once all nodes have completed.

***

### resume()

> **resume**(`checkpointId`, `_patch?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:426](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L426)

Resume a previously interrupted run from its latest checkpoint.

#### Parameters

##### checkpointId

`string`

Either the original run id or an exact checkpoint id.

##### \_patch?

`Partial`\<[`GraphState`](../interfaces/GraphState.md)\<`unknown`, `unknown`, `unknown`\>\>

Optional partial `GraphState` to merge before resuming (reserved).

#### Returns

`Promise`\<`unknown`\>

The final `GraphState.artifacts` value once execution completes.

***

### stream()

> **stream**(`input`): `AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:414](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L414)

Execute the mission while yielding `GraphEvent` values at each step.

Useful for streaming progress updates to a UI or logging pipeline.

#### Parameters

##### input

`unknown`

Input payload conforming to the mission's `inputSchema`.

#### Returns

`AsyncIterable`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Yields

`GraphEvent` objects emitted by the runtime at each node lifecycle point.

***

### toIR()

> **toIR**(): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:485](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L485)

Alias of `toWorkflow()` — returns the compiled `CompiledExecutionGraph` IR.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The compiled IR.

***

### toWorkflow()

> **toWorkflow**(): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:476](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/MissionBuilder.ts#L476)

Export the compiled plan as a static `CompiledExecutionGraph`.

Allows callers to "graduate" a dynamically-planned mission to a fixed workflow or
graph for performance-sensitive deployments where replanning is not desired.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The compiled IR, suitable for passing directly to `GraphRuntime`.
