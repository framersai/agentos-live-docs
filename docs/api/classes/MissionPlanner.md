# Class: MissionPlanner

Defined in: [packages/agentos/src/orchestration/planning/MissionPlanner.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/MissionPlanner.ts#L65)

Tree of Thought mission planner.

Generates N candidate execution graphs, evaluates them on four dimensions,
selects the best (or synthesizes a hybrid), and refines it before
compiling to `CompiledExecutionGraph`.

## Constructors

### Constructor

> **new MissionPlanner**(`config`): `MissionPlanner`

Defined in: [packages/agentos/src/orchestration/planning/MissionPlanner.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/MissionPlanner.ts#L73)

#### Parameters

##### config

[`PlannerConfig`](../interfaces/PlannerConfig.md)

#### Returns

`MissionPlanner`

## Methods

### plan()

> **plan**(`goal`, `context`, `onEvent?`): `Promise`\<[`PlanResult`](../interfaces/PlanResult.md)\>

Defined in: [packages/agentos/src/orchestration/planning/MissionPlanner.ts:88](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/MissionPlanner.ts#L88)

Run the full planning pipeline: explore → evaluate → refine.

#### Parameters

##### goal

`string`

Natural language mission goal.

##### context

[`PlanContext`](../interfaces/PlanContext.md)

Available tools and providers.

##### onEvent?

(`event`) => `void`

Optional callback for streaming planning progress events.

#### Returns

`Promise`\<[`PlanResult`](../interfaces/PlanResult.md)\>
