# Interface: LongTermMemoryRetrievalResult

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:25](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L25)

## Properties

### contextText

> **contextText**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:27](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L27)

Markdown/plain-text context to inject into the next prompt.

***

### diagnostics?

> `optional` **diagnostics**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:29](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L29)

Optional lightweight diagnostics for UI/debugging.

***

### feedbackPayload?

> `optional` **feedbackPayload**: `unknown`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L34)

Opaque implementation-specific payload used to record used/ignored
feedback after the assistant produces a final response.
