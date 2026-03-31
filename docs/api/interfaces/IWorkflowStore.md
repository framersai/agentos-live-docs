# Interface: IWorkflowStore

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L55)

Interface implemented by persistence layers capable of storing workflow state.

## Methods

### appendEvents()

> **appendEvents**(`events`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:90](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L90)

Appends workflow events for auditing/streaming purposes.

#### Parameters

##### events

[`WorkflowEvent`](WorkflowEvent.md)[]

#### Returns

`Promise`\<`void`\>

***

### buildProgressUpdate()

> **buildProgressUpdate**(`workflowId`, `sinceTimestamp?`): `Promise`\<[`WorkflowProgressUpdate`](WorkflowProgressUpdate.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:100](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L100)

Produces a payload representing the current workflow snapshot and optionally recent events.

#### Parameters

##### workflowId

`string`

##### sinceTimestamp?

`string`

#### Returns

`Promise`\<[`WorkflowProgressUpdate`](WorkflowProgressUpdate.md) \| `null`\>

***

### createInstance()

> **createInstance**(`data`, `initialTasks`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md)\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L59)

Persists a newly created workflow instance and its initial tasks snapshot.

#### Parameters

##### data

[`WorkflowCreateInput`](WorkflowCreateInput.md)

##### initialTasks

`Record`\<`string`, [`WorkflowTaskInstance`](WorkflowTaskInstance.md)\>

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md)\>

***

### getInstance()

> **getInstance**(`workflowId`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:67](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L67)

Retrieves a workflow instance by identifier.

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

***

### listInstances()

> **listInstances**(`options?`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md)[]\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L95)

Lists workflow instances matching the supplied filters.

#### Parameters

##### options?

[`WorkflowQueryOptions`](WorkflowQueryOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md)[]\>

***

### updateInstance()

> **updateInstance**(`workflowId`, `patch`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:72](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L72)

Applies a partial update to the workflow instance metadata/state.

#### Parameters

##### workflowId

`string`

##### patch

`Partial`\<`Pick`\<[`WorkflowInstance`](WorkflowInstance.md), `"status"` \| `"updatedAt"` \| `"metadata"` \| `"context"` \| `"roleAssignments"` \| `"agencyState"`\>\>

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

***

### updateTasks()

> **updateTasks**(`workflowId`, `updates`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/IWorkflowStore.ts:85](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/storage/IWorkflowStore.ts#L85)

Applies updates to one or more tasks within a workflow instance atomically.

#### Parameters

##### workflowId

`string`

##### updates

[`WorkflowTaskUpdate`](WorkflowTaskUpdate.md)[]

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>
