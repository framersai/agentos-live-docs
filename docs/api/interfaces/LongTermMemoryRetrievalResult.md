# Interface: LongTermMemoryRetrievalResult

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L23)

## Properties

### contextText

> **contextText**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L25)

Markdown/plain-text context to inject into the next prompt.

***

### diagnostics?

> `optional` **diagnostics**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:27](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L27)

Optional lightweight diagnostics for UI/debugging.

***

### feedbackPayload?

> `optional` **feedbackPayload**: `unknown`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L32)

Opaque implementation-specific payload used to record used/ignored
feedback after the assistant produces a final response.
