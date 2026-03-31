# Interface: ITurnPlanner

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:99](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L99)

## Properties

### plannerId

> `readonly` **plannerId**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:100](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L100)

## Methods

### isDiscoveryAvailable()

> **isDiscoveryAvailable**(): `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:102](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L102)

#### Returns

`boolean`

***

### planTurn()

> **planTurn**(`input`): `Promise`\<[`TurnPlan`](TurnPlan.md)\>

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L101)

#### Parameters

##### input

[`TurnPlanningRequestContext`](TurnPlanningRequestContext.md)

#### Returns

`Promise`\<[`TurnPlan`](TurnPlan.md)\>
