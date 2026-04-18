# Interface: ExecutionSummary

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:617](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L617)

Final summary after autonomous loop completion.

## Properties

### finalConfidence

> **finalConfidence**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:621](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L621)

Final confidence score

***

### finalResult?

> `optional` **finalResult**: `unknown`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:631](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L631)

Final synthesized result

***

### goalAchieved

> **goalAchieved**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:619](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L619)

Whether goal was achieved

***

### iterations

> **iterations**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:623](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L623)

Total iterations

***

### outcomes

> **outcomes**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:629](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L629)

Key outcomes

***

### totalDurationMs

> **totalDurationMs**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:627](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L627)

Total duration in ms

***

### totalTokensUsed

> **totalTokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:625](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L625)

Total tokens used

***

### unresolvedIssues

> **unresolvedIssues**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:633](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L633)

Any unresolved issues
