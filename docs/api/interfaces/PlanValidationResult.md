# Interface: PlanValidationResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:525](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L525)

Result of plan validation.

## Properties

### issues

> **issues**: [`PlanValidationIssue`](PlanValidationIssue.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:529](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L529)

Validation issues found

***

### isValid

> **isValid**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:527](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L527)

Whether plan is valid

***

### suggestions

> **suggestions**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:531](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L531)

Suggestions for improvement
