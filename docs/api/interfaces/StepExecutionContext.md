# Interface: StepExecutionContext

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:603](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L603)

Context for step execution.

## Properties

### conversationContext?

> `optional` **conversationContext**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:609](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L609)

Conversation context

***

### previousResults

> **previousResults**: `Map`\<`string`, [`PlanStepResult`](PlanStepResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:605](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L605)

Results from previous steps

***

### retrieve()?

> `optional` **retrieve**: (`query`) => `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:611](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L611)

RAG retrieval function

#### Parameters

##### query

`string`

#### Returns

`Promise`\<`string`[]\>

***

### tools

> **tools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:607](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/planner/IPlanningEngine.ts#L607)

Available tools
