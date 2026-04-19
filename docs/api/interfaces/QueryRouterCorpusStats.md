# Interface: QueryRouterCorpusStats

Defined in: [packages/agentos/src/query-router/types.ts:355](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L355)

Lightweight observability snapshot for router startup logs and host health
checks.

Returned by `router.getCorpusStats()` after or before initialization.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:363](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L363)

Number of loaded markdown chunks in the in-memory corpus.

***

### configuredPathCount

> **configuredPathCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:360](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L360)

Number of configured corpus directories.

***

### deepResearchEnabled

> **deepResearchEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:394](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L394)

Whether deep research is enabled in config.

***

### deepResearchRuntimeMode

> **deepResearchRuntimeMode**: [`QueryRouterToggleableRuntimeMode`](../type-aliases/QueryRouterToggleableRuntimeMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:403](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L403)

Runtime truth for deep research.

***

### embeddingDimension

> **embeddingDimension**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:388](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L388)

Embedding dimension for the active vector index, or `0` when inactive.

***

### embeddingStatus

> **embeddingStatus**: [`QueryRouterEmbeddingStatus`](../type-aliases/QueryRouterEmbeddingStatus.md)

Defined in: [packages/agentos/src/query-router/types.ts:385](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L385)

Whether corpus embeddings are active, missing credentials, or failed during init.

***

### graphEnabled

> **graphEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:391](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L391)

Whether graph expansion is enabled in config.

***

### graphRuntimeMode

> **graphRuntimeMode**: [`QueryRouterToggleableRuntimeMode`](../type-aliases/QueryRouterToggleableRuntimeMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:397](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L397)

Runtime truth for graph expansion.

***

### initialized

> **initialized**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:357](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L357)

Whether `init()` has completed successfully.

***

### platformKnowledge

> **platformKnowledge**: `object`

Defined in: [packages/agentos/src/query-router/types.ts:372](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L372)

Counts for the bundled platform knowledge corpus currently loaded in memory.

#### api

> **api**: `number`

#### faq

> **faq**: `number`

#### skills

> **skills**: `number`

#### tools

> **tools**: `number`

#### total

> **total**: `number`

#### troubleshooting

> **troubleshooting**: `number`

***

### rerankRuntimeMode

> **rerankRuntimeMode**: [`QueryRouterRuntimeMode`](../type-aliases/QueryRouterRuntimeMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:400](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L400)

Runtime truth for reranking.

***

### retrievalMode

> **retrievalMode**: [`QueryRouterRetrievalMode`](../type-aliases/QueryRouterRetrievalMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:382](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L382)

Whether retrieval is vector-backed or keyword-only.

***

### sourceCount

> **sourceCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:369](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L369)

Number of unique source files represented in the loaded corpus.

***

### topicCount

> **topicCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:366](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L366)

Number of extracted topic entries used by the classifier.
