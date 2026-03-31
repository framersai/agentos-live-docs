# Interface: WorkflowCheckpoint

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:271](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L271)

Workflow state for checkpoint review.

## Properties

### checkpointAt

> **checkpointAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:289](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L289)

Timestamp

***

### checkpointId

> **checkpointId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:273](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L273)

Checkpoint identifier

***

### completedWork

> **completedWork**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:281](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L281)

Summary of work completed

***

### currentPhase

> **currentPhase**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:277](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L277)

Current step/phase

***

### issues

> **issues**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:285](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L285)

Any issues or concerns

***

### notes?

> `optional` **notes**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:287](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L287)

Agent's notes

***

### progress

> **progress**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:279](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L279)

Progress (0-1)

***

### upcomingWork

> **upcomingWork**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:283](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L283)

Upcoming work

***

### workflowId

> **workflowId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:275](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L275)

Workflow/plan identifier
