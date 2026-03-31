# Class: InMemoryWorkflowStore

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:23](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L23)

Interface implemented by persistence layers capable of storing workflow state.

## Implements

- [`IWorkflowStore`](../interfaces/IWorkflowStore.md)

## Constructors

### Constructor

> **new InMemoryWorkflowStore**(): `InMemoryWorkflowStore`

#### Returns

`InMemoryWorkflowStore`

## Methods

### appendEvents()

> **appendEvents**(`events`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:111](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L111)

Appends workflow events for auditing/streaming purposes.

#### Parameters

##### events

[`WorkflowEvent`](../interfaces/WorkflowEvent.md)[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`appendEvents`](../interfaces/IWorkflowStore.md#appendevents)

***

### buildProgressUpdate()

> **buildProgressUpdate**(`workflowId`, `sinceTimestamp?`): `Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:146](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L146)

Produces a payload representing the current workflow snapshot and optionally recent events.

#### Parameters

##### workflowId

`string`

##### sinceTimestamp?

`string`

#### Returns

`Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`buildProgressUpdate`](../interfaces/IWorkflowStore.md#buildprogressupdate)

***

### createInstance()

> **createInstance**(`data`, `initialTasks`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:27](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L27)

Persists a newly created workflow instance and its initial tasks snapshot.

#### Parameters

##### data

[`WorkflowCreateInput`](../interfaces/WorkflowCreateInput.md)

##### initialTasks

`Record`\<`string`, [`WorkflowTaskInstance`](../interfaces/WorkflowTaskInstance.md)\>

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`createInstance`](../interfaces/IWorkflowStore.md#createinstance)

***

### getInstance()

> **getInstance**(`workflowId`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L51)

Retrieves a workflow instance by identifier.

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`getInstance`](../interfaces/IWorkflowStore.md#getinstance)

***

### listInstances()

> **listInstances**(`options?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L122)

Lists workflow instances matching the supplied filters.

#### Parameters

##### options?

[`WorkflowQueryOptions`](../interfaces/WorkflowQueryOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`listInstances`](../interfaces/IWorkflowStore.md#listinstances)

***

### updateInstance()

> **updateInstance**(`workflowId`, `patch`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L56)

Applies a partial update to the workflow instance metadata/state.

#### Parameters

##### workflowId

`string`

##### patch

`Partial`\<`Pick`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md), `"status"` \| `"updatedAt"` \| `"metadata"` \| `"context"` \| `"roleAssignments"` \| `"agencyState"`\>\>

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`updateInstance`](../interfaces/IWorkflowStore.md#updateinstance)

***

### updateTasks()

> **updateTasks**(`workflowId`, `updates`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts:74](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/storage/InMemoryWorkflowStore.ts#L74)

Applies updates to one or more tasks within a workflow instance atomically.

#### Parameters

##### workflowId

`string`

##### updates

[`WorkflowTaskUpdate`](../interfaces/WorkflowTaskUpdate.md)[]

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowStore`](../interfaces/IWorkflowStore.md).[`updateTasks`](../interfaces/IWorkflowStore.md#updatetasks)
