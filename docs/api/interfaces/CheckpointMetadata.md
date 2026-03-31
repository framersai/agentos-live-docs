# Interface: CheckpointMetadata

Defined in: [packages/agentos/src/orchestration/ir/types.ts:609](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L609)

Lightweight descriptor stored alongside each persisted checkpoint snapshot.
Used by the runtime to enumerate and restore checkpoints without deserialising
the full `GraphState` payload.

## Properties

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:615](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L615)

Id of the `CompiledExecutionGraph` being executed.

***

### hasMemorySnapshot

> **hasMemorySnapshot**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:623](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L623)

Whether a full `MemoryView` snapshot was included in the payload.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:611](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L611)

Unique checkpoint id (UUIDv4 assigned by the runtime).

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:617](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L617)

Id of the node that triggered checkpoint persistence.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:613](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L613)

Id of the graph run that produced this checkpoint.

***

### stateSize

> **stateSize**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:621](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L621)

Serialised byte size of the `GraphState` payload.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:619](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L619)

Unix epoch milliseconds when the checkpoint was persisted.
