# Interface: MemoryView

Defined in: [packages/agentos/src/orchestration/ir/types.ts:342](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L342)

A read-only snapshot of memory state visible to a node during execution.
Populated by the runtime before the node's executor is called; immutable thereafter.

## Properties

### pendingWrites

> **pendingWrites**: readonly `object`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:356](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L356)

Writes staged during this node's execution, not yet committed to the store.

***

### readLatencyMs

> **readLatencyMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:364](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L364)

Wall-clock time in milliseconds spent on the memory read operation.

***

### totalTracesRead

> **totalTracesRead**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:362](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L362)

Total number of traces that matched the read filter (before `maxTraces` capping).

***

### traces

> **traces**: readonly `object`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:344](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L344)

Traces retrieved according to the node's `MemoryPolicy.read` configuration.
