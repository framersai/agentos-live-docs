# Interface: SqlVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L79)

Configuration for SQL-backed vector store.

## Interface

SqlVectorStoreConfig

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### adapter?

> `optional` **adapter**: `StorageAdapter`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L93)

Pre-initialized storage adapter.
If provided, `storage` config is ignored.

***

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L98)

Default embedding dimension for new collections.

***

### enableFullTextSearch?

> `optional` **enableFullTextSearch**: `boolean`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L111)

Enable full-text search index provisioning.
Creates FTS5 virtual tables for SQLite or tsvector columns for PostgreSQL.

#### Default

```ts
true
```

***

### hnswDimensions?

> `optional` **hnswDimensions**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L139)

Embedding dimensions for the HNSW sidecar index.

#### Default

```ts
1536
```

***

### hnswSidecarFactory()?

> `optional` **hnswSidecarFactory**: () => `HnswIndexSidecar`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:146](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L146)

Optional custom HNSW sidecar factory.
Primarily useful for tests or advanced hosts that need to provide their
own ANN sidecar implementation.

#### Returns

`HnswIndexSidecar`

***

### hnswThreshold?

> `optional` **hnswThreshold**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L133)

Document count threshold before HNSW sidecar activates.
Below this count, brute-force cosine similarity is used.
Set to 0 to disable HNSW. Set to Infinity to always use brute-force.

#### Default

```ts
1000
```

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

### pipeline?

> `optional` **pipeline**: `TextProcessingPipeline`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:125](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L125)

Optional text processing pipeline for hybrid search tokenization.
Replaces the built-in regex tokenizer with configurable stemming,
lemmatization, and stop word handling.

#### See

createRagPipeline from nlp

***

### similarityMetric?

> `optional` **similarityMetric**: `"cosine"` \| `"euclidean"` \| `"dotproduct"`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L104)

Default similarity metric.

#### Default

```ts
'cosine'
```

***

### storage?

> `optional` **storage**: `StorageResolutionOptions`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L87)

Storage adapter configuration.
Passed directly to `resolveStorageAdapter()`.

***

### tablePrefix?

> `optional` **tablePrefix**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L117)

Table name prefix for all vector store tables.

#### Default

```ts
'agentos_rag_'
```

***

### type

> **type**: `"sql"`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:81](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L81)

Must be 'sql' for this provider

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)
