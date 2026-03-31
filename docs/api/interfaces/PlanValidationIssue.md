# Interface: PlanValidationIssue

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:537](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L537)

A single plan validation issue.

## Properties

### message

> **message**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:543](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L543)

Issue description

***

### severity

> **severity**: `"error"` \| `"warning"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:539](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L539)

Issue severity

***

### stepId?

> `optional` **stepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:541](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L541)

Step ID if issue is step-specific

***

### suggestedFix?

> `optional` **suggestedFix**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:545](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L545)

Suggested fix
