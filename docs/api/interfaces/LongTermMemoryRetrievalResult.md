# Interface: LongTermMemoryRetrievalResult

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:23](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L23)

## Properties

### contextText

> **contextText**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:25](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L25)

Markdown/plain-text context to inject into the next prompt.

***

### diagnostics?

> `optional` **diagnostics**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:27](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L27)

Optional lightweight diagnostics for UI/debugging.

***

### feedbackPayload?

> `optional` **feedbackPayload**: `unknown`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:32](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L32)

Opaque implementation-specific payload used to record used/ignored
feedback after the assistant produces a final response.
