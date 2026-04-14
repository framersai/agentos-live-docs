# Interface: HITLNotification

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:605](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L605)

A notification sent to humans.

## Properties

### actionUrl?

> `optional` **actionUrl**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:619](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L619)

Deep link to handle the request

***

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:611](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L611)

Agent ID

***

### expiresAt?

> `optional` **expiresAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:617](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L617)

Expiration time

***

### requestId

> **requestId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:609](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L609)

Request ID

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:613](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L613)

Summary

***

### type

> **type**: `"escalation"` \| `"checkpoint"` \| `"approval_required"` \| `"clarification_needed"` \| `"edit_requested"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:607](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L607)

Notification type

***

### urgency

> **urgency**: `"critical"` \| `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:615](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L615)

Urgency
