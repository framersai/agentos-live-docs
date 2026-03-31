# Interface: PlanValidationIssue

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:537](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L537)

A single plan validation issue.

## Properties

### message

> **message**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:543](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L543)

Issue description

***

### severity

> **severity**: `"error"` \| `"warning"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:539](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L539)

Issue severity

***

### stepId?

> `optional` **stepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:541](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L541)

Step ID if issue is step-specific

***

### suggestedFix?

> `optional` **suggestedFix**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:545](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L545)

Suggested fix
