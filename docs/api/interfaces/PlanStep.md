# Interface: PlanStep

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L42)

Represents a single step in an execution plan.
Each step contains the reasoning, action, and expected outcome.

## Properties

### action

> **action**: [`PlanAction`](PlanAction.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L48)

The action to take (tool call, reasoning, etc.)

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L58)

Confidence score (0-1) in this step's success

***

### dependsOn

> **dependsOn**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L54)

Dependencies on other step IDs

***

### estimatedTokens

> **estimatedTokens**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L56)

Estimated token cost for this step

***

### expectedOutcome

> **expectedOutcome**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:52](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L52)

Expected outcome description

***

### index

> **index**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L46)

Zero-based step index

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:50](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L50)

Chain-of-thought reasoning for this step

***

### requiresHumanApproval

> **requiresHumanApproval**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L60)

Whether this step requires human approval

***

### result?

> `optional` **result**: [`PlanStepResult`](PlanStepResult.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L64)

Actual result after execution

***

### status

> **status**: [`PlanStepStatus`](../type-aliases/PlanStepStatus.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L62)

Current execution status

***

### stepId

> **stepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L44)

Unique step identifier
