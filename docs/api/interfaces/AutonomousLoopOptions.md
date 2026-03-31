# Interface: AutonomousLoopOptions

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:304](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L304)

Options for autonomous goal pursuit loop.

## Properties

### enableReflection?

> `optional` **enableReflection**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:310](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L310)

Enable self-reflection between iterations

***

### goalConfidenceThreshold?

> `optional` **goalConfidenceThreshold**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:308](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L308)

Stop when goal confidence exceeds this

***

### maxIterations?

> `optional` **maxIterations**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:306](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L306)

Maximum iterations before stopping

***

### onApprovalRequired()?

> `optional` **onApprovalRequired**: (`request`) => `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:318](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L318)

Callback for human approval requests

#### Parameters

##### request

`ApprovalRequest`

#### Returns

`Promise`\<`boolean`\>

***

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:316](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L316)

Callback for progress updates

#### Parameters

##### progress

[`LoopProgress`](LoopProgress.md)

#### Returns

`void`

***

### reflectionFrequency?

> `optional` **reflectionFrequency**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:312](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L312)

Reflection frequency (every N iterations)

***

### requireApprovalFor?

> `optional` **requireApprovalFor**: [`PlanActionType`](../type-aliases/PlanActionType.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:314](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L314)

Human approval required for certain actions
