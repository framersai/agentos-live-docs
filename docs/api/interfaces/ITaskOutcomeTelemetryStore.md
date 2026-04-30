# Interface: ITaskOutcomeTelemetryStore

Defined in: [packages/agentos/src/api/types/OrchestratorConfig.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/OrchestratorConfig.ts#L102)

## Methods

### loadWindows()

> **loadWindows**(): `Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

Defined in: [packages/agentos/src/api/types/OrchestratorConfig.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/OrchestratorConfig.ts#L103)

#### Returns

`Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

***

### saveWindow()

> **saveWindow**(`scopeKey`, `entries`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/types/OrchestratorConfig.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/OrchestratorConfig.ts#L104)

#### Parameters

##### scopeKey

`string`

##### entries

[`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]

#### Returns

`Promise`\<`void`\>
