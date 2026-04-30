# Class: CostGuard

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:64](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L64)

## Constructors

### Constructor

> **new CostGuard**(`config?`): `CostGuard`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L69)

#### Parameters

##### config?

`Partial`\<[`CostGuardConfig`](../interfaces/CostGuardConfig.md)\>

#### Returns

`CostGuard`

## Methods

### canAfford()

> **canAfford**(`agentId`, `estimatedCostUsd`): `object`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L73)

#### Parameters

##### agentId

`string`

##### estimatedCostUsd

`number`

#### Returns

`object`

##### allowed

> **allowed**: `boolean`

##### capType?

> `optional` **capType**: [`CostCapType`](../type-aliases/CostCapType.md)

##### reason?

> `optional` **reason**: `string`

***

### getSnapshot()

> **getSnapshot**(`agentId`): [`CostSnapshot`](../interfaces/CostSnapshot.md)

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L139)

#### Parameters

##### agentId

`string`

#### Returns

[`CostSnapshot`](../interfaces/CostSnapshot.md)

***

### recordCost()

> **recordCost**(`agentId`, `costUsd`, `operationId?`, `metadata?`): [`CostRecord`](../interfaces/CostRecord.md)

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:108](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L108)

#### Parameters

##### agentId

`string`

##### costUsd

`number`

##### operationId?

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

#### Returns

[`CostRecord`](../interfaces/CostRecord.md)

***

### resetDailyAll()

> **resetDailyAll**(): `void`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:166](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L166)

#### Returns

`void`

***

### resetSession()

> **resetSession**(`agentId`): `void`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:158](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L158)

#### Parameters

##### agentId

`string`

#### Returns

`void`

***

### setAgentLimits()

> **setAgentLimits**(`agentId`, `overrides`): `void`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CostGuard.ts#L173)

#### Parameters

##### agentId

`string`

##### overrides

`Partial`\<`Pick`\<[`CostGuardConfig`](../interfaces/CostGuardConfig.md), `"maxSessionCostUsd"` \| `"maxDailyCostUsd"`\>\>

#### Returns

`void`
