# Interface: HnswlibVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L41)

Configuration for HnswlibVectorStore

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`customProps`](VectorStoreProviderConfig.md#customprops)

***

### defaultEmbeddingDimension?

> `optional` **defaultEmbeddingDimension**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L46)

Default embedding dimension for new collections

***

### hnswEfConstruction?

> `optional` **hnswEfConstruction**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L52)

HNSW efConstruction parameter (index build quality, default 200)

***

### hnswEfSearch?

> `optional` **hnswEfSearch**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L54)

HNSW efSearch parameter (search quality, default 100)

***

### hnswM?

> `optional` **hnswM**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L50)

HNSW M parameter (number of connections per node, default 16)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:30](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L30)

A unique identifier for this specific provider instance
(e.g., "pinecone-main-prod", "weaviate-dev-local"). This ID is used by the
VectorStoreManager to retrieve this provider.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`id`](VectorStoreProviderConfig.md#id)

***

### persistDirectory?

> `optional` **persistDirectory**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L44)

Directory to persist index files. If not set, indexes are in-memory only.

***

### similarityMetric?

> `optional` **similarityMetric**: `"cosine"` \| `"euclidean"` \| `"dotproduct"`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L48)

Default similarity metric

***

### type

> **type**: `"hnswlib"`

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/HnswlibVectorStore.ts#L42)

The type of the vector store provider
(e.g., "pinecone", "weaviate", "in_memory", "lancedb"). This helps in
selecting the correct implementation.

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)
