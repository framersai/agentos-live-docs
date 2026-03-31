# Interface: AgentMessage

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L71)

A message sent between agents.

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L85)

Agency context

***

### content

> **content**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:87](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L87)

Message content

***

### expiresAt?

> `optional` **expiresAt**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:93](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L93)

Expiration time for time-sensitive messages

***

### fromAgentId

> **fromAgentId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L77)

Sender agent ID

***

### fromRoleId?

> `optional` **fromRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L79)

Sender's role in the agency

***

### inReplyTo?

> `optional` **inReplyTo**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:95](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L95)

If this is a reply, the original message ID

***

### messageId

> **messageId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L73)

Unique message identifier

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:99](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L99)

Additional metadata

***

### priority

> **priority**: `MessagePriority`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L89)

Message priority

***

### requiresAck?

> `optional` **requiresAck**: `boolean`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L101)

Whether delivery confirmation is required

***

### sentAt

> **sentAt**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:91](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L91)

Timestamp when sent

***

### threadId?

> `optional` **threadId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:97](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L97)

Thread/conversation ID for related messages

***

### toAgentId?

> `optional` **toAgentId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:81](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L81)

Target agent ID (null for broadcasts)

***

### toRoleId?

> `optional` **toRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:83](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L83)

Target role (for role-based routing)

***

### type

> **type**: [`AgentMessageType`](../type-aliases/AgentMessageType.md)

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:75](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/IAgentCommunicationBus.ts#L75)

Type of message
