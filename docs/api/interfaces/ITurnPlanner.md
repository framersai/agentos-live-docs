# Interface: ITurnPlanner

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:99](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/turn-planner/TurnPlanner.ts#L99)

## Properties

### plannerId

> `readonly` **plannerId**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:100](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/turn-planner/TurnPlanner.ts#L100)

## Methods

### isDiscoveryAvailable()

> **isDiscoveryAvailable**(): `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/turn-planner/TurnPlanner.ts#L102)

#### Returns

`boolean`

***

### planTurn()

> **planTurn**(`input`): `Promise`\<[`TurnPlan`](TurnPlan.md)\>

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:101](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/turn-planner/TurnPlanner.ts#L101)

#### Parameters

##### input

[`TurnPlanningRequestContext`](TurnPlanningRequestContext.md)

#### Returns

`Promise`\<[`TurnPlan`](TurnPlan.md)\>
