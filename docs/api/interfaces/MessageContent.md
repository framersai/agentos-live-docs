# Interface: MessageContent

Defined in: [packages/agentos/src/channels/types.ts:179](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L179)

Outbound message content — what the agent wants to send.

## Properties

### blocks

> **blocks**: [`MessageContentBlock`](../type-aliases/MessageContentBlock.md)[]

Defined in: [packages/agentos/src/channels/types.ts:181](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L181)

Content blocks to send. At minimum one 'text' block.

***

### platformOptions?

> `optional` **platformOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/types.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L185)

Platform-specific send options.

***

### replyToMessageId?

> `optional` **replyToMessageId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:183](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L183)

Reply to a specific message (platform threading).
