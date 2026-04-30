# Interface: PlanValidationIssue

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:537](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L537)

A single plan validation issue.

## Properties

### message

> **message**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:543](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L543)

Issue description

***

### severity

> **severity**: `"error"` \| `"warning"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:539](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L539)

Issue severity

***

### stepId?

> `optional` **stepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:541](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L541)

Step ID if issue is step-specific

***

### suggestedFix?

> `optional` **suggestedFix**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:545](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L545)

Suggested fix
