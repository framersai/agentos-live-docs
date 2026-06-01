# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:74](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L74)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `MessageContent`

Defined in: [packages/agentos/src/api/generateText.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L78)

Content of the message. String for text-only, array for multimodal (images + text).

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L76)

Role of the message author.
