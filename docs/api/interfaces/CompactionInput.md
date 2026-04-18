# Interface: CompactionInput

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:119](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L119)

## Properties

### currentTokens

> **currentTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:125](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L125)

Current total token count.

***

### emotionalContext?

> `optional` **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:129](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L129)

Current emotional context, if available.

***

### maxContextTokens

> **maxContextTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:123](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L123)

Maximum token budget for the entire context window.

***

### messages

> **messages**: [`ContextMessage`](ContextMessage.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:121](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L121)

All messages in the conversation.

***

### recentTraces?

> `optional` **recentTraces**: [`MemoryTrace`](MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:131](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L131)

Recent memory traces for context (hybrid strategy).

***

### summaryChain

> **summaryChain**: [`SummaryChainNode`](SummaryChainNode.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:127](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/context/types.ts#L127)

Existing summary chain (for incremental compaction).
