# Interface: RagRetrievalOptions

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:157](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L157)

Options controlling retrieval behavior.

## Properties

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:212](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L212)

HyDE (Hypothetical Document Embedding) configuration.
When enabled, generates a hypothetical answer before embedding for
improved retrieval quality. Adds one LLM call per retrieval.

#### enabled?

> `optional` **enabled**: `boolean`

Enable HyDE for this retrieval. Default: false.

#### hypothesis?

> `optional` **hypothesis**: `string`

Pre-generated hypothesis (skip LLM call if provided).

#### initialThreshold?

> `optional` **initialThreshold**: `number`

Initial similarity threshold for adaptive thresholding. Default: 0.7.

#### minThreshold?

> `optional` **minThreshold**: `number`

Minimum threshold to step down to. Default: 0.3.

***

### includeAudit?

> `optional` **includeAudit**: `boolean`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:227](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L227)

When true, generates a RAGAuditTrail with per-operation transparency.

***

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L204)

Include chunk embeddings in the response.

***

### metadataFilter?

> `optional` **metadataFilter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:165](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L165)

Metadata filter applied at the vector-store layer.

***

### queryEmbeddingModelId?

> `optional` **queryEmbeddingModelId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:206](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L206)

Query embedding model override.

***

### rerankerConfig?

> `optional` **rerankerConfig**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:187](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L187)

Cross-encoder reranking configuration.

When enabled, retrieved chunks are re-scored using a cross-encoder model
for improved relevance ranking. **Disabled by default** due to added latency.

Recommended use cases:
- Background analysis tasks (accuracy over speed)
- Batch processing (no user waiting)
- Knowledge-intensive tasks (reduces hallucination)

NOT recommended for real-time chat (latency sensitive).

#### enabled?

> `optional` **enabled**: `boolean`

Enable cross-encoder reranking. Default: false

#### maxDocuments?

> `optional` **maxDocuments**: `number`

Max documents to send to reranker (limits cost/latency). Default: 100

#### modelId?

> `optional` **modelId**: `string`

Reranker model ID (e.g., 'rerank-v3.5', 'cross-encoder/ms-marco-MiniLM-L-6-v2')

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

Provider-specific parameters

#### providerId?

> `optional` **providerId**: `string`

Provider ID ('cohere', 'local')

#### timeoutMs?

> `optional` **timeoutMs**: `number`

Request timeout in ms. Default: 30000

#### topN?

> `optional` **topN**: `number`

Number of top results to return after reranking

***

### strategy?

> `optional` **strategy**: `"hybrid"` \| `"similarity"` \| `"mmr"`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:167](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L167)

Retrieval strategy (defaults to similarity search).

***

### strategyParams?

> `optional` **strategyParams**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:169](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L169)

Strategy-specific parameters (MMR lambda, hybrid alpha, etc.).

#### custom?

> `optional` **custom**: `Record`\<`string`, `any`\>

#### hybridAlpha?

> `optional` **hybridAlpha**: `number`

#### mmrLambda?

> `optional` **mmrLambda**: `number`

***

### targetDataSourceIds?

> `optional` **targetDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:161](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L161)

Set of explicit data sources to query.

***

### targetMemoryCategories?

> `optional` **targetMemoryCategories**: [`RagMemoryCategory`](../enumerations/RagMemoryCategory.md)[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:163](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L163)

Memory categories to consult (maps to data sources via config).

***

### tokenBudgetForContext?

> `optional` **tokenBudgetForContext**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:223](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L223)

Advisory token/character budget for final context construction.

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:159](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L159)

Maximum number of chunks per query.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:225](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L225)

Caller identity for logging/billing.
