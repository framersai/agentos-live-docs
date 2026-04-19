# Interface: WorkflowTaskUpdate

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:37](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L37)

Atomic update payload for a task within a workflow.

## Properties

### assignedExecutorId?

> `optional` **assignedExecutorId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:40](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L40)

***

### completedAt?

> `optional` **completedAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:42](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L42)

***

### error?

> `optional` **error**: \{ `code?`: `string`; `details?`: `unknown`; `message`: `string`; \} \| `null`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:44](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L44)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L49)

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L43)

***

### startedAt?

> `optional` **startedAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L41)

***

### status?

> `optional` **status**: [`WorkflowTaskStatus`](../enumerations/WorkflowTaskStatus.md)

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:39](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L39)

***

### taskId

> **taskId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/storage/IWorkflowStore.ts#L38)
