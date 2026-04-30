# Interface: StepExecutionContext

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:603](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L603)

Context for step execution.

## Properties

### conversationContext?

> `optional` **conversationContext**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:609](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L609)

Conversation context

***

### previousResults

> **previousResults**: `Map`\<`string`, [`PlanStepResult`](PlanStepResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:605](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L605)

Results from previous steps

***

### retrieve()?

> `optional` **retrieve**: (`query`) => `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:611](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L611)

RAG retrieval function

#### Parameters

##### query

`string`

#### Returns

`Promise`\<`string`[]\>

***

### tools

> **tools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:607](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L607)

Available tools
