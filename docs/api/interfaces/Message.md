# Interface: Message

Defined in: [packages/agentos/src/api/generateText.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L46)

A single chat message in a conversation history.
Mirrors the OpenAI / Anthropic message shape accepted by provider adapters.

## Properties

### content

> **content**: `MessageContent`

Defined in: [packages/agentos/src/api/generateText.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L50)

Content of the message. String for text-only, array for multimodal (images + text).

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/api/generateText.ts:48](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L48)

Role of the message author.
