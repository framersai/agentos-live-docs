# Interface: PlanStepResult

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:113](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L113)

Result of executing a plan step.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L123)

Execution duration in ms

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L119)

Error message if failed

***

### observations

> **observations**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L125)

Observations made during execution

***

### output

> **output**: `unknown`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L117)

Output data from execution

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:115](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L115)

Whether execution succeeded

***

### tokensUsed

> **tokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/IPlanningEngine.ts#L121)

Actual tokens used
