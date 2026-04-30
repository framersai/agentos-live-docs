# Interface: CheckpointDecision

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:295](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L295)

Human's decision at a checkpoint.

## Properties

### checkpointId

> **checkpointId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:297](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L297)

Checkpoint ID

***

### decidedAt

> **decidedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L312)

Timestamp

***

### decidedBy

> **decidedBy**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:310](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L310)

Who decided

***

### decision

> **decision**: `"continue"` \| `"abort"` \| `"pause"` \| `"modify"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:299](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L299)

Decision

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:308](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L308)

Instructions for agent

***

### modifications?

> `optional` **modifications**: `object`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:301](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/hitl/IHumanInteractionManager.ts#L301)

Modifications if any

#### addSteps?

> `optional` **addSteps**: `string`[]

#### adjustedGoal?

> `optional` **adjustedGoal**: `string`

#### parameterChanges?

> `optional` **parameterChanges**: `Record`\<`string`, `unknown`\>

#### skipSteps?

> `optional` **skipSteps**: `string`[]
