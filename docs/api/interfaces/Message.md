# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:52](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L52)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `MessageContent`

Defined in: [packages/agentos/src/api/generateText.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L56)

Content of the message. String for text-only, array for multimodal (images + text).

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L54)

Role of the message author.
