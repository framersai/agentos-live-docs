# Class: AgentOSTurnPlanner

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:190](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/TurnPlanner.ts#L190)

## Implements

- [`ITurnPlanner`](../interfaces/ITurnPlanner.md)

## Constructors

### Constructor

> **new AgentOSTurnPlanner**(`config?`, `discoveryEngine?`, `logger?`): `AgentOSTurnPlanner`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:194](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/TurnPlanner.ts#L194)

#### Parameters

##### config?

[`TurnPlannerConfig`](../interfaces/TurnPlannerConfig.md)

##### discoveryEngine?

`ICapabilityDiscoveryEngine`

##### logger?

[`ILogger`](../interfaces/ILogger.md)

#### Returns

`AgentOSTurnPlanner`

## Properties

### plannerId

> `readonly` **plannerId**: `"agentos-turn-planner-v1"` = `TURN_PLANNER_VERSION`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:191](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/TurnPlanner.ts#L191)

#### Implementation of

[`ITurnPlanner`](../interfaces/ITurnPlanner.md).[`plannerId`](../interfaces/ITurnPlanner.md#plannerid)

## Methods

### isDiscoveryAvailable()

> **isDiscoveryAvailable**(): `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:209](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/TurnPlanner.ts#L209)

#### Returns

`boolean`

#### Implementation of

[`ITurnPlanner`](../interfaces/ITurnPlanner.md).[`isDiscoveryAvailable`](../interfaces/ITurnPlanner.md#isdiscoveryavailable)

***

### planTurn()

> **planTurn**(`input`): `Promise`\<[`TurnPlan`](../interfaces/TurnPlan.md)\>

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/TurnPlanner.ts#L217)

#### Parameters

##### input

[`TurnPlanningRequestContext`](../interfaces/TurnPlanningRequestContext.md)

#### Returns

`Promise`\<[`TurnPlan`](../interfaces/TurnPlan.md)\>

#### Implementation of

[`ITurnPlanner`](../interfaces/ITurnPlanner.md).[`planTurn`](../interfaces/ITurnPlanner.md#planturn)
