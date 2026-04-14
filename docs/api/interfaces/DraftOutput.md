# Interface: DraftOutput

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:169](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L169)

Draft output for human review/editing.

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:177](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L177)

Agent that generated it

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:183](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L183)

Agent's confidence in the output

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:175](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L175)

The draft content

***

### contentType

> **contentType**: `"text"` \| `"json"` \| `"markdown"` \| `"html"` \| `"code"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:173](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L173)

Type of content

***

### draftId

> **draftId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:171](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L171)

Draft identifier

***

### generatedAt

> **generatedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:185](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L185)

Timestamp

***

### purpose

> **purpose**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:179](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L179)

Purpose/context of the output

***

### reviewFocus?

> `optional` **reviewFocus**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:181](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L181)

Specific areas to review

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:187](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L187)

Timeout (ms)
