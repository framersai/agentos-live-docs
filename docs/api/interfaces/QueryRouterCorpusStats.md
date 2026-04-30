# Interface: QueryRouterCorpusStats

Defined in: [packages/agentos/src/query-router/types.ts:357](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L357)

Lightweight observability snapshot for router startup logs and host health
checks.

Returned by `router.getCorpusStats()` after or before initialization.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:365](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L365)

Number of loaded markdown chunks in the in-memory corpus.

***

### configuredPathCount

> **configuredPathCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:362](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L362)

Number of configured corpus directories.

***

### deepResearchEnabled

> **deepResearchEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:396](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L396)

Whether deep research is enabled in config.

***

### deepResearchRuntimeMode

> **deepResearchRuntimeMode**: [`QueryRouterToggleableRuntimeMode`](../type-aliases/QueryRouterToggleableRuntimeMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:405](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L405)

Runtime truth for deep research.

***

### embeddingDimension

> **embeddingDimension**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:390](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L390)

Embedding dimension for the active vector index, or `0` when inactive.

***

### embeddingStatus

> **embeddingStatus**: [`QueryRouterEmbeddingStatus`](../type-aliases/QueryRouterEmbeddingStatus.md)

Defined in: [packages/agentos/src/query-router/types.ts:387](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L387)

Whether corpus embeddings are active, missing credentials, or failed during init.

***

### graphEnabled

> **graphEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:393](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L393)

Whether graph expansion is enabled in config.

***

### graphRuntimeMode

> **graphRuntimeMode**: [`QueryRouterToggleableRuntimeMode`](../type-aliases/QueryRouterToggleableRuntimeMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:399](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L399)

Runtime truth for graph expansion.

***

### initialized

> **initialized**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:359](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L359)

Whether `init()` has completed successfully.

***

### platformKnowledge

> **platformKnowledge**: `object`

Defined in: [packages/agentos/src/query-router/types.ts:374](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L374)

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

Defined in: [packages/agentos/src/query-router/types.ts:402](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L402)

Runtime truth for reranking.

***

### retrievalMode

> **retrievalMode**: [`QueryRouterRetrievalMode`](../type-aliases/QueryRouterRetrievalMode.md)

Defined in: [packages/agentos/src/query-router/types.ts:384](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L384)

Whether retrieval is vector-backed or keyword-only.

***

### sourceCount

> **sourceCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:371](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L371)

Number of unique source files represented in the loaded corpus.

***

### topicCount

> **topicCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:368](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L368)

Number of extracted topic entries used by the classifier.
