# Interface: ExecutionState

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:581](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L581)

Current state of plan execution.

## Properties

### completedSteps

> **completedSteps**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:587](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L587)

Completed step IDs

***

### currentStepIndex

> **currentStepIndex**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:585](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L585)

Current step index

***

### failedSteps

> **failedSteps**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:589](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L589)

Failed step IDs

***

### lastUpdatedAt

> **lastUpdatedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:597](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L597)

Last update timestamp

***

### planId

> **planId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:583](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L583)

Plan being executed

***

### results

> **results**: `Map`\<`string`, [`PlanStepResult`](PlanStepResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:591](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L591)

Accumulated results

***

### startedAt

> **startedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:595](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L595)

Start timestamp

***

### tokensUsed

> **tokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:593](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L593)

Total tokens used
