# Class: WorkflowEngine

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L133)

## Implements

- [`IWorkflowEngine`](../interfaces/IWorkflowEngine.md)

## Constructors

### Constructor

> **new WorkflowEngine**(): `WorkflowEngine`

#### Returns

`WorkflowEngine`

## Methods

### applyTaskUpdates()

> **applyTaskUpdates**(`workflowId`, `updates`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:285](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L285)

#### Parameters

##### workflowId

`string`

##### updates

[`WorkflowTaskUpdate`](../interfaces/WorkflowTaskUpdate.md)[]

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`applyTaskUpdates`](../interfaces/IWorkflowEngine.md#applytaskupdates)

***

### getWorkflow()

> **getWorkflow**(`workflowId`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:248](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L248)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`getWorkflow`](../interfaces/IWorkflowEngine.md#getworkflow)

***

### getWorkflowProgress()

> **getWorkflowProgress**(`workflowId`, `sinceTimestamp?`): `Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:382](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L382)

#### Parameters

##### workflowId

`string`

##### sinceTimestamp?

`string`

#### Returns

`Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`getWorkflowProgress`](../interfaces/IWorkflowEngine.md#getworkflowprogress)

***

### initialize()

> **initialize**(`config`, `deps`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:145](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L145)

#### Parameters

##### config

[`WorkflowEngineConfig`](../interfaces/WorkflowEngineConfig.md)

##### deps

[`WorkflowEngineDependencies`](../interfaces/WorkflowEngineDependencies.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`initialize`](../interfaces/IWorkflowEngine.md#initialize)

***

### listWorkflowDefinitions()

> **listWorkflowDefinitions**(): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:177](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L177)

#### Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)[]

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`listWorkflowDefinitions`](../interfaces/IWorkflowEngine.md#listworkflowdefinitions)

***

### listWorkflows()

> **listWorkflows**(`options?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:376](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L376)

#### Parameters

##### options?

[`WorkflowQueryOptions`](../interfaces/WorkflowQueryOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`listWorkflows`](../interfaces/IWorkflowEngine.md#listworkflows)

***

### offEvent()

> **offEvent**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:394](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L394)

#### Parameters

##### listener

[`WorkflowEngineEventListener`](../interfaces/WorkflowEngineEventListener.md)

#### Returns

`void`

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`offEvent`](../interfaces/IWorkflowEngine.md#offevent)

***

### onEvent()

> **onEvent**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:390](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L390)

#### Parameters

##### listener

[`WorkflowEngineEventListener`](../interfaces/WorkflowEngineEventListener.md)

#### Returns

`void`

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`onEvent`](../interfaces/IWorkflowEngine.md#onevent)

***

### recordEvents()

> **recordEvents**(`events`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:366](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L366)

#### Parameters

##### events

[`WorkflowEvent`](../interfaces/WorkflowEvent.md)[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`recordEvents`](../interfaces/IWorkflowEngine.md#recordevents)

***

### registerWorkflowDescriptor()

> **registerWorkflowDescriptor**(`descriptor`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:163](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L163)

#### Parameters

##### descriptor

[`WorkflowDescriptorPayload`](../interfaces/WorkflowDescriptorPayload.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`registerWorkflowDescriptor`](../interfaces/IWorkflowEngine.md#registerworkflowdescriptor)

***

### startWorkflow()

> **startWorkflow**(`options`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L182)

#### Parameters

##### options

[`StartWorkflowOptions`](../interfaces/StartWorkflowOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`startWorkflow`](../interfaces/IWorkflowEngine.md#startworkflow)

***

### unregisterWorkflowDescriptor()

> **unregisterWorkflowDescriptor**(`workflowDefinitionId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L171)

#### Parameters

##### workflowDefinitionId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`unregisterWorkflowDescriptor`](../interfaces/IWorkflowEngine.md#unregisterworkflowdescriptor)

***

### updateWorkflowAgencyState()

> **updateWorkflowAgencyState**(`workflowId`, `agencyState`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:347](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L347)

#### Parameters

##### workflowId

`string`

##### agencyState

\{ `agencyId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `seats`: `Record`\<`string`, [`WorkflowAgencySeatSnapshot`](../interfaces/WorkflowAgencySeatSnapshot.md)\>; \} | `undefined`

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`updateWorkflowAgencyState`](../interfaces/IWorkflowEngine.md#updateworkflowagencystate)

***

### updateWorkflowStatus()

> **updateWorkflowStatus**(`workflowId`, `status`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowEngine.ts:254](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowEngine.ts#L254)

#### Parameters

##### workflowId

`string`

##### status

[`WorkflowStatus`](../enumerations/WorkflowStatus.md)

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

#### Implementation of

[`IWorkflowEngine`](../interfaces/IWorkflowEngine.md).[`updateWorkflowStatus`](../interfaces/IWorkflowEngine.md#updateworkflowstatus)
