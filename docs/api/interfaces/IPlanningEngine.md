# Interface: IPlanningEngine

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:393](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L393)

Interface for the AgentOS Planning Engine.

The Planning Engine provides sophisticated cognitive capabilities for
autonomous agents, including:

- **Goal Decomposition**: Break complex goals into manageable subtasks
- **Plan Generation**: Create multi-step execution plans with ReAct pattern
- **Self-Correction**: Refine plans based on execution feedback
- **Autonomous Loops**: Pursue goals with minimal human intervention

## Example

```typescript
// Generate and execute a plan
const engine = new PlanningEngine(llmProvider);
const plan = await engine.generatePlan('Build a REST API', {
  strategy: 'plan_and_execute',
  maxSteps: 20,
});

for (const step of plan.steps) {
  const result = await engine.executeStep(step);
  if (!result.success) {
    const refined = await engine.refinePlan(plan, {
      planId: plan.planId,
      stepId: step.stepId,
      feedbackType: 'step_failed',
      details: result.error!,
      severity: 'error',
    });
  }
}
```

## Methods

### decomposeTask()

> **decomposeTask**(`task`, `depth?`): `Promise`\<[`TaskDecomposition`](TaskDecomposition.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:428](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L428)

Decomposes a complex task into simpler subtasks.

#### Parameters

##### task

`string`

The task description to decompose

##### depth?

`number`

Maximum decomposition depth (default: 3)

#### Returns

`Promise`\<[`TaskDecomposition`](TaskDecomposition.md)\>

Task decomposition result

***

### executeStep()

> **executeStep**(`step`, `context?`): `Promise`\<[`PlanStepResult`](PlanStepResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:472](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L472)

Executes a single plan step.

#### Parameters

##### step

[`PlanStep`](PlanStep.md)

Step to execute

##### context?

[`StepExecutionContext`](StepExecutionContext.md)

Execution context including previous results

#### Returns

`Promise`\<[`PlanStepResult`](PlanStepResult.md)\>

Step execution result

***

### generatePlan()

> **generatePlan**(`goal`, `context?`, `options?`): `Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:415](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L415)

Generates a multi-step execution plan from a high-level goal.

#### Parameters

##### goal

`string`

The high-level goal to achieve

##### context?

[`PlanningContext`](PlanningContext.md)

Additional context for planning

##### options?

[`PlanningOptions`](PlanningOptions.md)

Planning configuration options

#### Returns

`Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

Generated execution plan

#### Example

```typescript
const plan = await engine.generatePlan(
  'Analyze customer feedback and generate a report',
  { domainContext: 'E-commerce platform' },
  { strategy: 'react', maxSteps: 15 }
);
```

***

### getExecutionState()

> **getExecutionState**(`planId`): [`ExecutionState`](ExecutionState.md) \| `null`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:515](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L515)

Gets the current execution state for a plan.

#### Parameters

##### planId

`string`

Plan identifier

#### Returns

[`ExecutionState`](ExecutionState.md) \| `null`

Current execution state or null if not found

***

### refinePlan()

> **refinePlan**(`plan`, `feedback`): `Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:450](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L450)

Refines an existing plan based on execution feedback.
Uses self-reflection to identify issues and generate corrections.

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

Original plan to refine

##### feedback

[`ExecutionFeedback`](ExecutionFeedback.md)

Feedback from execution

#### Returns

`Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

Refined execution plan

***

### reflect()

> **reflect**(`plan`, `executionState`): `Promise`\<[`ReflectionResult`](ReflectionResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:459](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L459)

Performs self-reflection on plan execution state.

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

Current plan

##### executionState

[`ExecutionState`](ExecutionState.md)

Current execution state

#### Returns

`Promise`\<[`ReflectionResult`](ReflectionResult.md)\>

Reflection insights and suggested adjustments

***

### restoreCheckpoint()

> **restoreCheckpoint**(`checkpointId`): `Promise`\<\{ `plan`: [`ExecutionPlan`](ExecutionPlan.md); `state`: [`ExecutionState`](ExecutionState.md); \}\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:507](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L507)

Restores execution state from a checkpoint.

#### Parameters

##### checkpointId

`string`

Checkpoint to restore

#### Returns

`Promise`\<\{ `plan`: [`ExecutionPlan`](ExecutionPlan.md); `state`: [`ExecutionState`](ExecutionState.md); \}\>

Restored execution state

***

### runAutonomousLoop()

> **runAutonomousLoop**(`goal`, `options?`): `AsyncGenerator`\<[`LoopProgress`](LoopProgress.md), [`ExecutionSummary`](ExecutionSummary.md), `undefined`\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:483](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L483)

Runs an autonomous goal pursuit loop.
Yields progress updates and handles self-correction automatically.

#### Parameters

##### goal

`string`

Goal to pursue

##### options?

[`AutonomousLoopOptions`](AutonomousLoopOptions.md)

Loop configuration

#### Returns

`AsyncGenerator`\<[`LoopProgress`](LoopProgress.md), [`ExecutionSummary`](ExecutionSummary.md), `undefined`\>

Final execution summary

#### Yields

Progress updates including current step and observations

***

### saveCheckpoint()

> **saveCheckpoint**(`plan`, `state`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:499](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L499)

Saves current execution state for checkpointing/rollback.

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

Plan being executed

##### state

[`ExecutionState`](ExecutionState.md)

Current execution state

#### Returns

`Promise`\<`string`\>

Checkpoint identifier

***

### validatePlan()

> **validatePlan**(`plan`): `Promise`\<[`PlanValidationResult`](PlanValidationResult.md)\>

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:436](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planner/IPlanningEngine.ts#L436)

Validates a plan for feasibility and completeness.

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

Plan to validate

#### Returns

`Promise`\<[`PlanValidationResult`](PlanValidationResult.md)\>

Validation result with any issues found
