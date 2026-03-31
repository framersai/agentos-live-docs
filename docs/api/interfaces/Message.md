# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:28](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L28)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:32](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L32)

Plain-text or serialised-JSON content of the message.

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:30](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L30)

Role of the message author.
