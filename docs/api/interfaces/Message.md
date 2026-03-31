# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L28)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:32](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L32)

Plain-text or serialised-JSON content of the message.

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L30)

Role of the message author.
