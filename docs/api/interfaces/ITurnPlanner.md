# Interface: ITurnPlanner

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/TurnPlanner.ts#L99)

## Properties

### plannerId

> `readonly` **plannerId**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/TurnPlanner.ts#L100)

## Methods

### isDiscoveryAvailable()

> **isDiscoveryAvailable**(): `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/TurnPlanner.ts#L102)

#### Returns

`boolean`

***

### planTurn()

> **planTurn**(`input`): `Promise`\<[`TurnPlan`](TurnPlan.md)\>

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/TurnPlanner.ts#L101)

#### Parameters

##### input

[`TurnPlanningRequestContext`](TurnPlanningRequestContext.md)

#### Returns

`Promise`\<[`TurnPlan`](TurnPlan.md)\>
