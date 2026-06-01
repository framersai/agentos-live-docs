# Interface: RunInspection

Defined in: [packages/agentos/src/orchestration/ir/types.ts:643](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L643)

Complete inspection record for an in-progress or finished graph run.
Returned by the runtime's run-management API.

## Properties

### checkpoints

> **checkpoints**: [`CheckpointMetadata`](CheckpointMetadata.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:657](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L657)

All checkpoint snapshots persisted during the run.

***

### currentNodeId?

> `optional` **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:651](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L651)

Id of the node currently executing; absent when `status` is terminal.

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:659](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L659)

Accumulated diagnostic telemetry.

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:663](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L663)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:655](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L655)

Ordered stream of runtime events emitted during the run (type: `GraphEvent[]`).

***

### finalOutput?

> `optional` **finalOutput**: `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:661](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L661)

Final output value; only present when `status` is `'completed'`.

***

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:647](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L647)

Id of the `CompiledExecutionGraph` being executed.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:645](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L645)

Unique run id (UUIDv4 assigned when the run was started).

***

### status

> **status**: `"completed"` \| `"running"` \| `"interrupted"` \| `"errored"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:649](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L649)

Current lifecycle phase of the run.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:653](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L653)

Ordered list of node ids that have completed execution.
