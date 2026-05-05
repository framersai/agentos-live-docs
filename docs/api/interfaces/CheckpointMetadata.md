# Interface: CheckpointMetadata

Defined in: [packages/agentos/src/orchestration/ir/types.ts:622](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L622)

Lightweight descriptor stored alongside each persisted checkpoint snapshot.
Used by the runtime to enumerate and restore checkpoints without deserialising
the full `GraphState` payload.

## Properties

### graphId

> **graphId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:628](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L628)

Id of the `CompiledExecutionGraph` being executed.

***

### hasMemorySnapshot

> **hasMemorySnapshot**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:636](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L636)

Whether a full `MemoryView` snapshot was included in the payload.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:624](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L624)

Unique checkpoint id (UUIDv4 assigned by the runtime).

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:630](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L630)

Id of the node that triggered checkpoint persistence.

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:626](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L626)

Id of the graph run that produced this checkpoint.

***

### stateSize

> **stateSize**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:634](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L634)

Serialised byte size of the `GraphState` payload.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:632](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L632)

Unix epoch milliseconds when the checkpoint was persisted.
