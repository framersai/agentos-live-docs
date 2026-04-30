# Interface: Checkpoint

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:24](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L24)

A complete, serialisable snapshot of a graph run captured at a node boundary.

The store persists one `Checkpoint` per `save()` call and makes them queryable
by `runId` (latest or by `nodeId`) so the runtime can restore execution state
after a crash or perform time-travel debugging.

## Properties

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:28](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L28)

Id of the `CompiledExecutionGraph` being executed.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:26](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L26)

Unique checkpoint identifier (UUIDv4 assigned by the runtime).

***

### memorySnapshot?

> `optional` **memorySnapshot**: `object`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L55)

Optional snapshot of the memory subsystem state at this checkpoint.
When present the runtime can restore memory context without re-reading from the store.

#### pendingWrites

> **pendingWrites**: `object`[]

Writes that were staged but not yet committed when the checkpoint was taken.

#### reads

> **reads**: `object`[]

Memory traces that were read before or during the checkpointed node.

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L32)

Id of the node at whose boundary this checkpoint was captured.

***

### nodeResults

> **nodeResults**: `Record`\<`string`, \{ `durationMs`: `number`; `effectClass`: [`EffectClass`](../type-aliases/EffectClass.md); `output`: `unknown`; \}\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L80)

Results from every node that completed execution before this checkpoint was taken.
Keyed by node id.

***

### pendingEdges

> **pendingEdges**: `string`[]

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L103)

Ids of edges that had been emitted but whose target nodes had not yet started.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:30](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L30)

Id of the graph run that produced this checkpoint.

***

### skippedNodes?

> `optional` **skippedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L100)

Ordered list of node ids that were explicitly bypassed by routing decisions
(for example, the non-selected arm of a conditional branch).

Persisting this list is required for correct resume semantics on branched
graphs: otherwise a resumed run cannot distinguish "not run yet" from
"intentionally skipped" and may stall on dead branches.

***

### state

> **state**: `object`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L40)

Serialised `GraphState` partitions captured at the checkpoint boundary.
`memory` is excluded because it is always rehydrated fresh on resume.

#### artifacts

> **artifacts**: `unknown`

Accumulated external outputs at the checkpoint boundary.

#### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Accumulated diagnostic telemetry up to this checkpoint.

#### input

> **input**: `unknown`

The original user-provided input frozen at graph start.

#### scratch

> **scratch**: `unknown`

Node-to-node communication bag value at the checkpoint boundary.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:34](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L34)

Unix epoch milliseconds when the checkpoint was persisted.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/checkpoint/ICheckpointStore.ts#L90)

Ordered list of node ids that had completed execution when this checkpoint was taken.
