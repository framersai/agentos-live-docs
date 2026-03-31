# Interface: PlanAction

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L82)

The type of action a plan step performs.

## Properties

### content?

> `optional` **content**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:94](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L94)

Content for reasoning/synthesis steps

***

### query?

> `optional` **query**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:92](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L92)

Query for information retrieval

***

### subgoal?

> `optional` **subgoal**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:90](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L90)

Sub-goal to pursue (if type is 'subgoal')

***

### toolArgs?

> `optional` **toolArgs**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:88](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L88)

Arguments for tool call

***

### toolId?

> `optional` **toolId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:86](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L86)

Tool to invoke (if type is 'tool_call')

***

### type

> **type**: [`PlanActionType`](../type-aliases/PlanActionType.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:84](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L84)

Action type
