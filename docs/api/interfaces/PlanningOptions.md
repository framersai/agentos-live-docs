# Interface: PlanningOptions

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:184](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L184)

Configuration for plan generation.

## Properties

### allowToolUse?

> `optional` **allowToolUse**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:192](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L192)

Allow tool usage in plan

***

### availableTools?

> `optional` **availableTools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:194](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L194)

Available tools for planning

***

### checkpointFrequency?

> `optional` **checkpointFrequency**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:200](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L200)

Checkpoint frequency (every N steps)

***

### enableCheckpoints?

> `optional` **enableCheckpoints**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:198](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L198)

Enable human checkpoints

***

### maxIterations?

> `optional` **maxIterations**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:188](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L188)

Maximum planning iterations

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:186](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L186)

Maximum steps allowed in plan

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:202](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L202)

Maximum tokens for entire plan execution

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:190](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L190)

Minimum confidence threshold

***

### planningTimeoutMs?

> `optional` **planningTimeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:204](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L204)

Time limit for planning phase in ms

***

### strategy?

> `optional` **strategy**: [`PlanningStrategy`](../type-aliases/PlanningStrategy.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:196](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/planner/IPlanningEngine.ts#L196)

Planning strategy to use
