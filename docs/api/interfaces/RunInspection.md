# Interface: RunInspection

Defined in: [packages/agentos/src/orchestration/ir/types.ts:630](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L630)

Complete inspection record for an in-progress or finished graph run.
Returned by the runtime's run-management API.

## Properties

### checkpoints

> **checkpoints**: [`CheckpointMetadata`](CheckpointMetadata.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:644](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L644)

All checkpoint snapshots persisted during the run.

***

### currentNodeId?

> `optional` **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:638](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L638)

Id of the node currently executing; absent when `status` is terminal.

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:646](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L646)

Accumulated diagnostic telemetry.

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:650](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L650)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:642](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L642)

Ordered stream of runtime events emitted during the run (type: `GraphEvent[]`).

***

### finalOutput?

> `optional` **finalOutput**: `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:648](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L648)

Final output value; only present when `status` is `'completed'`.

***

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:634](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L634)

Id of the `CompiledExecutionGraph` being executed.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:632](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L632)

Unique run id (UUIDv4 assigned when the run was started).

***

### status

> **status**: `"completed"` \| `"running"` \| `"interrupted"` \| `"errored"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:636](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L636)

Current lifecycle phase of the run.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:640](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L640)

Ordered list of node ids that have completed execution.
