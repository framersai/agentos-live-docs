# Interface: LongTermMemoryRetrievalInput

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:3](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L3)

## Properties

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:6](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L6)

***

### maxContextChars?

> `optional` **maxContextChars**: `number`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:15](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L15)

Advisory character budget for the returned context string.
Implementations may truncate to stay within this budget.

***

### memoryPolicy

> **memoryPolicy**: [`ResolvedLongTermMemoryPolicy`](ResolvedLongTermMemoryPolicy.md)

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:10](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L10)

***

### mode

> **mode**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:8](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L8)

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:5](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L5)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:7](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L7)

***

### queryText

> **queryText**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:9](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L9)

***

### topKByScope?

> `optional` **topKByScope**: `Partial`\<`Record`\<`"user"` \| `"persona"` \| `"organization"`, `number`\>\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:20](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L20)

Optional per-scope retrieval caps.
Implementations are free to ignore/override.

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:4](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L4)
