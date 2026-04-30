# Interface: TaskDecomposition

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L232)

Result of decomposing a complex task into subtasks.

## Properties

### executionOrder

> **executionOrder**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:242](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L242)

Suggested execution order

***

### isComplete

> **isComplete**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L240)

Whether decomposition is complete

***

### originalTask

> **originalTask**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L234)

Original task

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:238](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L238)

Decomposition reasoning

***

### subtasks

> **subtasks**: [`SubTask`](SubTask.md)[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/IPlanningEngine.ts#L236)

Decomposed subtasks
