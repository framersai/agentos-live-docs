# Interface: CreateMissionExpansionHandlerOptions

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:768](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L768)

## Properties

### autonomy

> **autonomy**: [`AutonomyMode`](../type-aliases/AutonomyMode.md)

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:769](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L769)

***

### availableProviders?

> `optional` **availableProviders**: `string`[]

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:775](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L775)

***

### availableTools?

> `optional` **availableTools**: `object`[]

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:774](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L774)

#### description

> **description**: `string`

#### name

> **name**: `string`

***

### costCap

> **costCap**: `number`

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:772](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L772)

***

### defaultLlm?

> `optional` **defaultLlm**: [`NodeLlmConfig`](NodeLlmConfig.md)

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:777](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L777)

***

### initialEstimatedCost?

> `optional` **initialEstimatedCost**: `number`

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:778](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L778)

***

### initialExpansions?

> `optional` **initialExpansions**: `number`

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:779](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L779)

***

### initialToolForges?

> `optional` **initialToolForges**: `number`

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:780](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L780)

***

### llmCaller()

> **llmCaller**: (`system`, `user`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:771](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L771)

#### Parameters

##### system

`string`

##### user

`string`

#### Returns

`Promise`\<`string`\>

***

### maxAgents

> **maxAgents**: `number`

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:773](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L773)

***

### providerStrategy?

> `optional` **providerStrategy**: [`ProviderStrategyConfig`](ProviderStrategyConfig.md)

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:776](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L776)

***

### thresholds

> **thresholds**: [`GuardrailThresholds`](GuardrailThresholds.md)

Defined in: [packages/agentos/src/orchestration/planning/MissionExpansionHandler.ts:770](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planning/MissionExpansionHandler.ts#L770)
