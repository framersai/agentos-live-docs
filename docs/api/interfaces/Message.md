# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L29)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L33)

Plain-text or serialised-JSON content of the message.

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L31)

Role of the message author.
