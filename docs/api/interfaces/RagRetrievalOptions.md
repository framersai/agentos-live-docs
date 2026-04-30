# Interface: RagRetrievalOptions

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:164](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L164)

Options controlling retrieval behavior.

## Properties

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:219](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L219)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L234)

When true, generates a RAGAuditTrail with per-operation transparency.

***

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:211](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L211)

Include chunk embeddings in the response.

***

### metadataFilter?

> `optional` **metadataFilter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:172](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L172)

Metadata filter applied at the vector-store layer.

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L236)

Optional shared retrieval policy overlay.

***

### queryEmbeddingModelId?

> `optional` **queryEmbeddingModelId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:213](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L213)

Query embedding model override.

***

### rerankerConfig?

> `optional` **rerankerConfig**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L194)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:174](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L174)

Retrieval strategy (defaults to similarity search).

***

### strategyParams?

> `optional` **strategyParams**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:176](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L176)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L168)

Set of explicit data sources to query.

***

### targetMemoryCategories?

> `optional` **targetMemoryCategories**: [`RagMemoryCategory`](../enumerations/RagMemoryCategory.md)[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L170)

Memory categories to consult (maps to data sources via config).

***

### tokenBudgetForContext?

> `optional` **tokenBudgetForContext**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:230](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L230)

Advisory token/character budget for final context construction.

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:166](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L166)

Maximum number of chunks per query.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L232)

Caller identity for logging/billing.
