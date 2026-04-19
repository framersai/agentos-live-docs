# Interface: ExecutionFeedback

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:270](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L270)

Feedback from plan execution used for refinement.

## Properties

### details

> **details**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:278](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L278)

Feedback details

***

### feedbackType

> **feedbackType**: [`FeedbackType`](../type-aliases/FeedbackType.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:276](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L276)

Type of feedback

***

### planId

> **planId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:272](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L272)

Plan being executed

***

### severity

> **severity**: `"error"` \| `"critical"` \| `"warning"` \| `"info"`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:282](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L282)

Severity of the issue

***

### stepId

> **stepId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:274](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L274)

Step that generated feedback

***

### suggestedCorrection?

> `optional` **suggestedCorrection**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:280](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L280)

Suggested correction
