# Interface: LoopProgress

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:324](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L324)

Progress update during autonomous loop.

## Properties

### currentStep

> **currentStep**: [`PlanStep`](PlanStep.md)

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:328](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L328)

Current step being executed

***

### goalConfidence

> **goalConfidence**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:334](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L334)

Current confidence in goal achievement

***

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:326](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L326)

Current iteration

***

### observations

> **observations**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:332](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L332)

Accumulated observations

***

### progress

> **progress**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:330](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L330)

Overall progress (0-1)

***

### tokensUsed

> **tokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:336](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L336)

Tokens used so far
