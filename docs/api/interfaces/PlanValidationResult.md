# Interface: PlanValidationResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:525](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L525)

Result of plan validation.

## Properties

### issues

> **issues**: [`PlanValidationIssue`](PlanValidationIssue.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:529](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L529)

Validation issues found

***

### isValid

> **isValid**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:527](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L527)

Whether plan is valid

***

### suggestions

> **suggestions**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:531](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L531)

Suggestions for improvement
