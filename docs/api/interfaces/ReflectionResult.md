# Interface: ReflectionResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:551](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L551)

Result of self-reflection.

## Properties

### adjustments

> **adjustments**: [`PlanAdjustment`](PlanAdjustment.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:557](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L557)

Suggested plan adjustments

***

### confidenceAdjustment

> **confidenceAdjustment**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:559](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L559)

Updated confidence score

***

### insights

> **insights**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:553](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L553)

Key insights from reflection

***

### issues

> **issues**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:555](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L555)

Identified issues

***

### recommendation

> **recommendation**: `"continue"` \| `"adjust"` \| `"replan"` \| `"abort"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:561](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L561)

Whether to continue or replan
