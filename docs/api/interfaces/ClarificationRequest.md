# Interface: ClarificationRequest

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:113](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L113)

A request for clarification from a human.

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L121)

Agent requesting clarification

***

### allowFreeform

> **allowFreeform**: `boolean`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:127](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L127)

Whether free-form response is allowed

***

### clarificationType

> **clarificationType**: `"preference"` \| `"guidance"` \| `"ambiguity"` \| `"missing_info"` \| `"verification"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:123](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L123)

Type of clarification needed

***

### context

> **context**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:119](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L119)

Context for the question

***

### options?

> `optional` **options**: [`ClarificationOption`](ClarificationOption.md)[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:125](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L125)

Suggested options (if multiple choice)

***

### question

> **question**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:117](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L117)

The question needing clarification

***

### requestedAt

> **requestedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:129](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L129)

Timestamp

***

### requestId

> **requestId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:115](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L115)

Unique request identifier

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:131](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L131)

Timeout (ms)
