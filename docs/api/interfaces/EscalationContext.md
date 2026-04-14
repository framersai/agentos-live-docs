# Interface: EscalationContext

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:217](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L217)

Context for escalating to human control.

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:225](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L225)

Agent requesting escalation

***

### assessment

> **assessment**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:231](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L231)

Agent's assessment of the situation

***

### attemptedActions

> **attemptedActions**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:229](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L229)

What agent has tried so far

***

### currentState

> **currentState**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:227](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L227)

Current task/goal state

***

### escalatedAt

> **escalatedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:237](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L237)

Timestamp

***

### escalationId

> **escalationId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:219](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L219)

Escalation identifier

***

### explanation

> **explanation**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:223](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L223)

Detailed explanation

***

### reason

> **reason**: [`EscalationReason`](../type-aliases/EscalationReason.md)

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:221](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L221)

Reason for escalation

***

### recommendations?

> `optional` **recommendations**: `string`[]

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:233](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L233)

Recommended human actions

***

### urgency

> **urgency**: `"critical"` \| `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:235](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L235)

Urgency level
