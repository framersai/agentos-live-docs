# Interface: ChannelMessage

Defined in: [packages/agentos/src/channels/types.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L205)

Inbound message received from an external platform.

## Properties

### content

> **content**: [`MessageContentBlock`](../type-aliases/MessageContentBlock.md)[]

Defined in: [packages/agentos/src/channels/types.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L217)

Message content.

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:211](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L211)

Conversation/chat ID.

***

### conversationType

> **conversationType**: [`ConversationType`](../type-aliases/ConversationType.md)

Defined in: [packages/agentos/src/channels/types.ts:213](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L213)

Conversation type.

***

### messageId

> **messageId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L207)

Unique message ID assigned by the platform.

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/types.ts:209](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L209)

Platform this message came from.

***

### rawEvent?

> `optional` **rawEvent**: `unknown`

Defined in: [packages/agentos/src/channels/types.ts:225](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L225)

Platform-specific raw data (for adapters that need pass-through).

***

### replyToMessageId?

> `optional` **replyToMessageId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L223)

Message being replied to, if this is a reply.

***

### sender

> **sender**: [`RemoteUser`](RemoteUser.md)

Defined in: [packages/agentos/src/channels/types.ts:215](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L215)

Who sent the message.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/channels/types.ts:219](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L219)

Raw text representation (convenience — extracted from content blocks).

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/channels/types.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L221)

ISO timestamp from the platform.
