# Interface: LongTermMemoryRetrievalInput

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:4](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L4)

## Properties

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:7](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L7)

***

### maxContextChars?

> `optional` **maxContextChars**: `number`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:17](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L17)

Advisory character budget for the returned context string.
Implementations may truncate to stay within this budget.

***

### memoryPolicy

> **memoryPolicy**: [`ResolvedLongTermMemoryPolicy`](ResolvedLongTermMemoryPolicy.md)

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:11](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L11)

***

### mode

> **mode**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:9](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L9)

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:6](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L6)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:8](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L8)

***

### queryText

> **queryText**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:10](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L10)

***

### retrievalPolicy?

> `optional` **retrievalPolicy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:12](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L12)

***

### topKByScope?

> `optional` **topKByScope**: `Partial`\<`Record`\<`"user"` \| `"persona"` \| `"organization"`, `number`\>\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:22](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L22)

Optional per-scope retrieval caps.
Implementations are free to ignore/override.

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:5](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/ILongTermMemoryRetriever.ts#L5)
