# Interface: AgentRequest

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:107](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L107)

A request expecting a response.

## Extends

- `Omit`\<[`AgentMessage`](AgentMessage.md), `"type"` \| `"messageId"` \| `"toAgentId"` \| `"sentAt"`\>

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:85](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L85)

Agency context

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`agencyId`](AgentMessage.md#agencyid)

***

### content

> **content**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:87](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L87)

Message content

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`content`](AgentMessage.md#content)

***

### expiresAt?

> `optional` **expiresAt**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L93)

Expiration time for time-sensitive messages

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`expiresAt`](AgentMessage.md#expiresat)

***

### fromAgentId

> **fromAgentId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L77)

Sender agent ID

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`fromAgentId`](AgentMessage.md#fromagentid)

***

### fromRoleId?

> `optional` **fromRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:79](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L79)

Sender's role in the agency

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`fromRoleId`](AgentMessage.md#fromroleid)

***

### inReplyTo?

> `optional` **inReplyTo**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:95](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L95)

If this is a reply, the original message ID

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`inReplyTo`](AgentMessage.md#inreplyto)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:99](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L99)

Additional metadata

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`metadata`](AgentMessage.md#metadata)

***

### priority

> **priority**: `MessagePriority`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:89](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L89)

Message priority

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`priority`](AgentMessage.md#priority)

***

### requiresAck?

> `optional` **requiresAck**: `boolean`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:101](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L101)

Whether delivery confirmation is required

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`requiresAck`](AgentMessage.md#requiresack)

***

### threadId?

> `optional` **threadId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L97)

Thread/conversation ID for related messages

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`threadId`](AgentMessage.md#threadid)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L111)

Timeout for response in ms

***

### toRoleId?

> `optional` **toRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L83)

Target role (for role-based routing)

#### Inherited from

[`AgentMessage`](AgentMessage.md).[`toRoleId`](AgentMessage.md#toroleid)

***

### type

> **type**: `"task_delegation"` \| `"question"` \| `"critique"`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:109](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/IAgentCommunicationBus.ts#L109)

Request type (subset of message types)
