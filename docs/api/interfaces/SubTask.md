# Interface: SubTask

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:248](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L248)

A subtask resulting from decomposition.

## Properties

### complexity

> **complexity**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:254](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L254)

Complexity estimate (1-10)

***

### dependsOn

> **dependsOn**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:256](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L256)

Dependencies on other subtasks

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:252](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L252)

Subtask description

***

### estimatedTokens

> **estimatedTokens**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:258](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L258)

Estimated tokens to complete

***

### parallelizable

> **parallelizable**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:260](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L260)

Can this be parallelized with others?

***

### subtaskId

> **subtaskId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:250](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planner/IPlanningEngine.ts#L250)

Unique subtask identifier
