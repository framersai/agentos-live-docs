# Interface: HandoffResult

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:165](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L165)

Result of a handoff operation.

## Properties

### accepted

> **accepted**: `boolean`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:167](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L167)

Whether handoff was accepted

***

### acknowledgment?

> `optional` **acknowledgment**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L175)

Acknowledgment message

***

### handoffAt

> **handoffAt**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:177](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L177)

Timestamp

***

### newOwnerId?

> `optional` **newOwnerId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:169](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L169)

New owner agent ID

***

### newOwnerRoleId?

> `optional` **newOwnerRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:171](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L171)

New owner role

***

### rejectionReason?

> `optional` **rejectionReason**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:173](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/IAgentCommunicationBus.ts#L173)

Rejection reason if not accepted
