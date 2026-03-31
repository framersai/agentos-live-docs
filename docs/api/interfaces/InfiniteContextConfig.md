# Interface: InfiniteContextConfig

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:16](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L16)

## Properties

### compactionThreshold

> **compactionThreshold**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L22)

Trigger compaction when context reaches this fraction of max tokens (0–1).

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:18](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L18)

Enable infinite context window management.

***

### llmInvoker()?

> `optional` **llmInvoker**: (`prompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:34](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L34)

LLM invoker for summarization. Falls back to Observer/Reflector invokers.

#### Parameters

##### prompt

`string`

#### Returns

`Promise`\<`string`\>

***

### logRetention

> **logRetention**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:28](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L28)

Max compaction log entries retained in memory.

***

### maxSummaryChainTokens

> **maxSummaryChainTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L30)

Token budget for the rolling summary chain header.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:36](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L36)

Model ID for summarization calls.

***

### preserveRecentTurns

> **preserveRecentTurns**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L24)

Never compact the most recent N turns.

***

### strategy

> **strategy**: [`CompactionStrategy`](../type-aliases/CompactionStrategy.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:20](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L20)

Compaction strategy to use.

***

### targetCompressionRatio

> **targetCompressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L32)

Target compression ratio for summaries (e.g. 8 = 8:1).

***

### transparencyLevel

> **transparencyLevel**: [`TransparencyLevel`](../type-aliases/TransparencyLevel.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L26)

Transparency logging level.
