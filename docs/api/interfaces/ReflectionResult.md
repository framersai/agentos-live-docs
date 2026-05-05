# Interface: ReflectionResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:551](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L551)

Result of self-reflection.

## Properties

### adjustments

> **adjustments**: [`PlanAdjustment`](PlanAdjustment.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:557](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L557)

Suggested plan adjustments

***

### confidenceAdjustment

> **confidenceAdjustment**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:559](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L559)

Updated confidence score

***

### insights

> **insights**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:553](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L553)

Key insights from reflection

***

### issues

> **issues**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:555](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L555)

Identified issues

***

### recommendation

> **recommendation**: `"abort"` \| `"continue"` \| `"adjust"` \| `"replan"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:561](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/planner/IPlanningEngine.ts#L561)

Whether to continue or replan
