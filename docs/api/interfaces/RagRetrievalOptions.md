# Interface: RagRetrievalOptions

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:243](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L243)

## Properties

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:304](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L304)

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

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:319](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L319)

When true, generates a RAGAuditTrail with per-operation transparency.

***

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:296](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L296)

Include chunk embeddings in the response.

***

### metadataFilter?

> `optional` **metadataFilter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:251](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L251)

Metadata filter applied at the vector-store layer.

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:321](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L321)

Optional shared retrieval policy overlay.

***

### queryEmbeddingModelId?

> `optional` **queryEmbeddingModelId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:298](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L298)

Query embedding model override.

***

### rerankerConfig?

> `optional` **rerankerConfig**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:279](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L279)

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

### scope?

> `optional` **scope**: [`RagRetrievalScope`](RagRetrievalScope.md)

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:257](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L257)

Enterprise access scope. Filters chunks by tenant, ACL groups,
classification, lifecycle status, and effective/expiry window before
similarity ranking. See [RagRetrievalScope](RagRetrievalScope.md).

***

### strategy?

> `optional` **strategy**: `"hybrid"` \| `"similarity"` \| `"mmr"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:259](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L259)

Retrieval strategy (defaults to similarity search).

***

### strategyParams?

> `optional` **strategyParams**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:261](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L261)

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

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:247](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L247)

Set of explicit data sources to query.

***

### targetMemoryCategories?

> `optional` **targetMemoryCategories**: [`RagMemoryCategory`](../enumerations/RagMemoryCategory.md)[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:249](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L249)

Memory categories to consult (maps to data sources via config).

***

### tokenBudgetForContext?

> `optional` **tokenBudgetForContext**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:315](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L315)

Advisory token/character budget for final context construction.

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:245](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L245)

Maximum number of chunks per query.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:317](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L317)

Caller identity for logging/billing.
