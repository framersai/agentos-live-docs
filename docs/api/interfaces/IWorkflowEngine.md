# Interface: IWorkflowEngine

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:38](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L38)

## Methods

### applyTaskUpdates()

> **applyTaskUpdates**(`workflowId`, `updates`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:53](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L53)

#### Parameters

##### workflowId

`string`

##### updates

[`WorkflowTaskUpdate`](WorkflowTaskUpdate.md)[]

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

***

### getWorkflow()

> **getWorkflow**(`workflowId`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:49](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L49)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

***

### getWorkflowProgress()

> **getWorkflowProgress**(`workflowId`, `sinceTimestamp?`): `Promise`\<[`WorkflowProgressUpdate`](WorkflowProgressUpdate.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:60](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L60)

#### Parameters

##### workflowId

`string`

##### sinceTimestamp?

`string`

#### Returns

`Promise`\<[`WorkflowProgressUpdate`](WorkflowProgressUpdate.md) \| `null`\>

***

### initialize()

> **initialize**(`config`, `deps`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:39](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L39)

#### Parameters

##### config

[`WorkflowEngineConfig`](WorkflowEngineConfig.md)

##### deps

[`WorkflowEngineDependencies`](WorkflowEngineDependencies.md)

#### Returns

`Promise`\<`void`\>

***

### listWorkflowDefinitions()

> **listWorkflowDefinitions**(): [`WorkflowDefinition`](WorkflowDefinition.md)[]

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L45)

#### Returns

[`WorkflowDefinition`](WorkflowDefinition.md)[]

***

### listWorkflows()

> **listWorkflows**(`options?`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md)[]\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:58](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L58)

#### Parameters

##### options?

[`WorkflowQueryOptions`](WorkflowQueryOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md)[]\>

***

### offEvent()

> **offEvent**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:64](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L64)

#### Parameters

##### listener

[`WorkflowEngineEventListener`](WorkflowEngineEventListener.md)

#### Returns

`void`

***

### onEvent()

> **onEvent**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:62](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L62)

#### Parameters

##### listener

[`WorkflowEngineEventListener`](WorkflowEngineEventListener.md)

#### Returns

`void`

***

### recordEvents()

> **recordEvents**(`events`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L55)

#### Parameters

##### events

[`WorkflowEvent`](WorkflowEvent.md)[]

#### Returns

`Promise`\<`void`\>

***

### registerWorkflowDescriptor()

> **registerWorkflowDescriptor**(`descriptor`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L41)

#### Parameters

##### descriptor

[`WorkflowDescriptorPayload`](WorkflowDescriptorPayload.md)

#### Returns

`Promise`\<`void`\>

***

### startWorkflow()

> **startWorkflow**(`options`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md)\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L47)

#### Parameters

##### options

[`StartWorkflowOptions`](StartWorkflowOptions.md)

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md)\>

***

### unregisterWorkflowDescriptor()

> **unregisterWorkflowDescriptor**(`workflowDefinitionId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L43)

#### Parameters

##### workflowDefinitionId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateWorkflowAgencyState()

> **updateWorkflowAgencyState**(`workflowId`, `agencyState`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:56](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L56)

#### Parameters

##### workflowId

`string`

##### agencyState

\{ `agencyId`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `seats`: `Record`\<`string`, [`WorkflowAgencySeatSnapshot`](WorkflowAgencySeatSnapshot.md)\>; \} | `undefined`

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

***

### updateWorkflowStatus()

> **updateWorkflowStatus**(`workflowId`, `status`): `Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/workflows/IWorkflowEngine.ts:51](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/workflows/IWorkflowEngine.ts#L51)

#### Parameters

##### workflowId

`string`

##### status

[`WorkflowStatus`](../enumerations/WorkflowStatus.md)

#### Returns

`Promise`\<[`WorkflowInstance`](WorkflowInstance.md) \| `null`\>
