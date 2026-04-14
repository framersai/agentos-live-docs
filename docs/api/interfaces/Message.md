# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L43)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `MessageContent`

Defined in: [packages/agentos/src/api/generateText.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L47)

Content of the message. String for text-only, array for multimodal (images + text).

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L45)

Role of the message author.
