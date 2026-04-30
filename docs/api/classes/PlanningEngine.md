# Class: PlanningEngine

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L194)

Implementation of the AgentOS Planning Engine.

Features:
- ReAct (Reasoning + Acting) pattern for interleaved planning and execution
- Plan-and-Execute for upfront planning
- Tree-of-Thought for exploring multiple reasoning paths
- Self-reflection and plan refinement
- Checkpoint and rollback support
- Human-in-the-loop integration points

## Implements

## Implements

- [`IPlanningEngine`](../interfaces/IPlanningEngine.md)

## Constructors

### Constructor

> **new PlanningEngine**(`config`): `PlanningEngine`

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:212](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L212)

Creates a new PlanningEngine instance.

#### Parameters

##### config

[`PlanningEngineConfig`](../interfaces/PlanningEngineConfig.md)

Engine configuration

#### Returns

`PlanningEngine`

## Methods

### decomposeTask()

> **decomposeTask**(`task`, `depth?`): `Promise`\<[`TaskDecomposition`](../interfaces/TaskDecomposition.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:294](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L294)

Decomposes a complex task into simpler subtasks.

#### Parameters

##### task

`string`

The task description to decompose

##### depth?

`number` = `3`

Maximum decomposition depth

#### Returns

`Promise`\<[`TaskDecomposition`](../interfaces/TaskDecomposition.md)\>

Task decomposition result

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`decomposeTask`](../interfaces/IPlanningEngine.md#decomposetask)

***

### executeStep()

> **executeStep**(`step`, `context?`): `Promise`\<[`PlanStepResult`](../interfaces/PlanStepResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:513](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L513)

Executes a single plan step.

#### Parameters

##### step

[`PlanStep`](../interfaces/PlanStep.md)

Step to execute

##### context?

[`StepExecutionContext`](../interfaces/StepExecutionContext.md)

Execution context

#### Returns

`Promise`\<[`PlanStepResult`](../interfaces/PlanStepResult.md)\>

Step execution result

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`executeStep`](../interfaces/IPlanningEngine.md#executestep)

***

### generatePlan()

> **generatePlan**(`goal`, `context?`, `options?`): `Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:243](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L243)

Generates a multi-step execution plan from a high-level goal.

#### Parameters

##### goal

`string`

The high-level goal to achieve

##### context?

[`PlanningContext`](../interfaces/PlanningContext.md)

Additional context for planning

##### options?

[`PlanningOptions`](../interfaces/PlanningOptions.md)

Planning configuration options

#### Returns

`Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

Generated execution plan

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`generatePlan`](../interfaces/IPlanningEngine.md#generateplan)

***

### getExecutionState()

> **getExecutionState**(`planId`): [`ExecutionState`](../interfaces/ExecutionState.md) \| `null`

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:789](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L789)

Gets the current execution state for a plan.

#### Parameters

##### planId

`string`

Plan identifier

#### Returns

[`ExecutionState`](../interfaces/ExecutionState.md) \| `null`

Current execution state or null

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`getExecutionState`](../interfaces/IPlanningEngine.md#getexecutionstate)

***

### refinePlan()

> **refinePlan**(`plan`, `feedback`): `Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:418](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L418)

Refines an existing plan based on execution feedback.

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

Original plan to refine

##### feedback

[`ExecutionFeedback`](../interfaces/ExecutionFeedback.md)

Feedback from execution

#### Returns

`Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

Refined execution plan

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`refinePlan`](../interfaces/IPlanningEngine.md#refineplan)

***

### reflect()

> **reflect**(`plan`, `executionState`): `Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:465](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L465)

Performs self-reflection on plan execution state.

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

Current plan

##### executionState

[`ExecutionState`](../interfaces/ExecutionState.md)

Current execution state

#### Returns

`Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

Reflection insights and suggested adjustments

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`reflect`](../interfaces/IPlanningEngine.md#reflect)

***

### restoreCheckpoint()

> **restoreCheckpoint**(`checkpointId`): `Promise`\<\{ `plan`: [`ExecutionPlan`](../interfaces/ExecutionPlan.md); `state`: [`ExecutionState`](../interfaces/ExecutionState.md); \}\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:766](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L766)

Restores execution state from a checkpoint.

#### Parameters

##### checkpointId

`string`

Checkpoint to restore

#### Returns

`Promise`\<\{ `plan`: [`ExecutionPlan`](../interfaces/ExecutionPlan.md); `state`: [`ExecutionState`](../interfaces/ExecutionState.md); \}\>

Restored plan and state

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`restoreCheckpoint`](../interfaces/IPlanningEngine.md#restorecheckpoint)

***

### runAutonomousLoop()

> **runAutonomousLoop**(`goal`, `options?`): `AsyncGenerator`\<[`LoopProgress`](../interfaces/LoopProgress.md), [`ExecutionSummary`](../interfaces/ExecutionSummary.md), `undefined`\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:605](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L605)

Runs an autonomous goal pursuit loop.

#### Parameters

##### goal

`string`

Goal to pursue

##### options?

[`AutonomousLoopOptions`](../interfaces/AutonomousLoopOptions.md)

Loop configuration

#### Returns

`AsyncGenerator`\<[`LoopProgress`](../interfaces/LoopProgress.md), [`ExecutionSummary`](../interfaces/ExecutionSummary.md), `undefined`\>

Final execution summary

#### Yields

Progress updates

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`runAutonomousLoop`](../interfaces/IPlanningEngine.md#runautonomousloop)

***

### saveCheckpoint()

> **saveCheckpoint**(`plan`, `state`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:747](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L747)

Saves current execution state for checkpointing.

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

Plan being executed

##### state

[`ExecutionState`](../interfaces/ExecutionState.md)

Current execution state

#### Returns

`Promise`\<`string`\>

Checkpoint identifier

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`saveCheckpoint`](../interfaces/IPlanningEngine.md#savecheckpoint)

***

### validatePlan()

> **validatePlan**(`plan`): `Promise`\<[`PlanValidationResult`](../interfaces/PlanValidationResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:325](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/planner/PlanningEngine.ts#L325)

Validates a plan for feasibility and completeness.

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

Plan to validate

#### Returns

`Promise`\<[`PlanValidationResult`](../interfaces/PlanValidationResult.md)\>

Validation result with any issues found

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`validatePlan`](../interfaces/IPlanningEngine.md#validateplan)
