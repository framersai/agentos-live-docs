# Interface: MemoryView

Defined in: [packages/agentos/src/orchestration/ir/types.ts:380](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L380)

A read-only snapshot of memory state visible to a node during execution.
Populated by the runtime before the node's executor is called; immutable thereafter.

## Properties

### pendingWrites

> **pendingWrites**: readonly `object`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:394](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L394)

Writes staged during this node's execution, not yet committed to the store.

***

### readLatencyMs

> **readLatencyMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:402](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L402)

Wall-clock time in milliseconds spent on the memory read operation.

***

### totalTracesRead

> **totalTracesRead**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:400](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L400)

Total number of traces that matched the read filter (before `maxTraces` capping).

***

### traces

> **traces**: readonly `object`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:382](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L382)

Traces retrieved according to the node's `MemoryPolicy.read` configuration.
