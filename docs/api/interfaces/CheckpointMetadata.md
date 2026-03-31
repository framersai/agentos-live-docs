# Interface: CheckpointMetadata

Defined in: [packages/agentos/src/orchestration/ir/types.ts:571](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L571)

Lightweight descriptor stored alongside each persisted checkpoint snapshot.
Used by the runtime to enumerate and restore checkpoints without deserialising
the full `GraphState` payload.

## Properties

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:577](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L577)

Id of the `CompiledExecutionGraph` being executed.

***

### hasMemorySnapshot

> **hasMemorySnapshot**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:585](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L585)

Whether a full `MemoryView` snapshot was included in the payload.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:573](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L573)

Unique checkpoint id (UUIDv4 assigned by the runtime).

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:579](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L579)

Id of the node that triggered checkpoint persistence.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:575](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L575)

Id of the graph run that produced this checkpoint.

***

### stateSize

> **stateSize**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:583](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L583)

Serialised byte size of the `GraphState` payload.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:581](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L581)

Unix epoch milliseconds when the checkpoint was persisted.
