# Interface: PlanValidationResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:525](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L525)

Result of plan validation.

## Properties

### issues

> **issues**: [`PlanValidationIssue`](PlanValidationIssue.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:529](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L529)

Validation issues found

***

### isValid

> **isValid**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:527](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L527)

Whether plan is valid

***

### suggestions

> **suggestions**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:531](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L531)

Suggestions for improvement
