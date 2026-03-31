# Interface: HumanFeedback

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:322](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L322)

Human feedback on agent performance.

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:326](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L326)

Agent receiving feedback

***

### aspect

> **aspect**: `"accuracy"` \| `"style"` \| `"communication"` \| `"speed"` \| `"other"` \| `"judgment"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:330](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L330)

Specific aspect being addressed

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:332](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L332)

Detailed feedback

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:336](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L336)

Context of the feedback

***

### feedbackId

> **feedbackId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:324](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L324)

Feedback identifier

***

### feedbackType

> **feedbackType**: `"preference"` \| `"correction"` \| `"praise"` \| `"guidance"` \| `"complaint"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:328](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L328)

Type of feedback

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:334](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L334)

Severity/importance (1-5)

***

### providedAt

> **providedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:340](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L340)

Timestamp

***

### providedBy

> **providedBy**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:338](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L338)

Who provided feedback
