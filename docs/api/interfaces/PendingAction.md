# Interface: PendingAction

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L45)

A pending action awaiting human approval.

## Properties

### actionId

> **actionId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L47)

Unique action identifier

***

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L55)

Agent requesting approval

***

### alternatives?

> `optional` **alternatives**: [`AlternativeAction`](AlternativeAction.md)[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:69](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L69)

Alternative actions available

***

### category?

> `optional` **category**: `"system"` \| `"communication"` \| `"data_modification"` \| `"external_api"` \| `"financial"` \| `"other"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:53](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L53)

Category of action

***

### context

> **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L57)

Context/parameters of the action

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L49)

Human-readable description of the action

***

### estimatedCost?

> `optional` **estimatedCost**: `object`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:63](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L63)

Estimated cost (if applicable)

#### amount

> **amount**: `number`

#### currency

> **currency**: `string`

***

### potentialConsequences?

> `optional` **potentialConsequences**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L59)

Potential consequences if approved

***

### requestedAt

> **requestedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:65](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L65)

Timestamp when request was made

***

### reversible

> **reversible**: `boolean`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:61](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L61)

Reversibility of the action

***

### severity

> **severity**: [`ActionSeverity`](../type-aliases/ActionSeverity.md)

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:51](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L51)

Action severity/risk level

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:67](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L67)

Timeout for approval (ms)
