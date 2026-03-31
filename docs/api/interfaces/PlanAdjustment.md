# Interface: PlanAdjustment

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:567](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L567)

A suggested adjustment to the plan.

## Properties

### newStepData?

> `optional` **newStepData**: `Partial`\<[`PlanStep`](PlanStep.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:573](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L573)

New step data (for add/modify)

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:575](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L575)

Reason for adjustment

***

### targetStepId?

> `optional` **targetStepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:571](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L571)

Target step ID (for modify/remove)

***

### type

> **type**: `"add_step"` \| `"remove_step"` \| `"modify_step"` \| `"reorder"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:569](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L569)

Type of adjustment
