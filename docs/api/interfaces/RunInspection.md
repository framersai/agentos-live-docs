# Interface: RunInspection

Defined in: [packages/agentos/src/orchestration/ir/types.ts:592](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L592)

Complete inspection record for an in-progress or finished graph run.
Returned by the runtime's run-management API.

## Properties

### checkpoints

> **checkpoints**: [`CheckpointMetadata`](CheckpointMetadata.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:606](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L606)

All checkpoint snapshots persisted during the run.

***

### currentNodeId?

> `optional` **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:600](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L600)

Id of the node currently executing; absent when `status` is terminal.

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:608](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L608)

Accumulated diagnostic telemetry.

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:612](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L612)

Structured error detail; only present when `status` is `'errored'`.

#### code

> **code**: `string`

#### message

> **message**: `string`

#### nodeId?

> `optional` **nodeId**: `string`

***

### events

> **events**: `unknown`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:604](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L604)

Ordered stream of runtime events emitted during the run (type: `GraphEvent[]`).

***

### finalOutput?

> `optional` **finalOutput**: `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:610](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L610)

Final output value; only present when `status` is `'completed'`.

***

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:596](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L596)

Id of the `CompiledExecutionGraph` being executed.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:594](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L594)

Unique run id (UUIDv4 assigned when the run was started).

***

### status

> **status**: `"completed"` \| `"running"` \| `"interrupted"` \| `"errored"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:598](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L598)

Current lifecycle phase of the run.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:602](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L602)

Ordered list of node ids that have completed execution.
