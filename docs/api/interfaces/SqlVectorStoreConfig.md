# Interface: SqlVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L77)

Configuration for SQL-backed vector store.

## Interface

SqlVectorStoreConfig

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### adapter?

> `optional` **adapter**: `StorageAdapter`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:91](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L91)

Pre-initialized storage adapter.
If provided, `storage` config is ignored.

***

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`customProps`](VectorStoreProviderConfig.md#customprops)

***

### defaultEmbeddingDimension?

> `optional` **defaultEmbeddingDimension**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:96](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L96)

Default embedding dimension for new collections.

***

### enableFullTextSearch?

> `optional` **enableFullTextSearch**: `boolean`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:109](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L109)

Enable full-text search index provisioning.
Creates FTS5 virtual tables for SQLite or tsvector columns for PostgreSQL.

#### Default

```ts
true
```

***

### hnswDimensions?

> `optional` **hnswDimensions**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L137)

Embedding dimensions for the HNSW sidecar index.

#### Default

```ts
1536
```

***

### hnswSidecarFactory()?

> `optional` **hnswSidecarFactory**: () => `HnswIndexSidecar`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L144)

Optional custom HNSW sidecar factory.
Primarily useful for tests or advanced hosts that need to provide their
own ANN sidecar implementation.

#### Returns

`HnswIndexSidecar`

***

### hnswThreshold?

> `optional` **hnswThreshold**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:131](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L131)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:30](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L30)

A unique identifier for this specific provider instance
(e.g., "pinecone-main-prod", "weaviate-dev-local"). This ID is used by the
VectorStoreManager to retrieve this provider.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`id`](VectorStoreProviderConfig.md#id)

***

### pipeline?

> `optional` **pipeline**: `TextProcessingPipeline`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:123](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L123)

Optional text processing pipeline for hybrid search tokenization.
Replaces the built-in regex tokenizer with configurable stemming,
lemmatization, and stop word handling.

#### See

createRagPipeline from nlp

***

### similarityMetric?

> `optional` **similarityMetric**: `"cosine"` \| `"euclidean"` \| `"dotproduct"`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:102](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L102)

Default similarity metric.

#### Default

```ts
'cosine'
```

***

### storage?

> `optional` **storage**: `StorageResolutionOptions`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L85)

Storage adapter configuration.
Passed directly to `resolveStorageAdapter()`.

***

### tablePrefix?

> `optional` **tablePrefix**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L115)

Table name prefix for all vector store tables.

#### Default

```ts
'agentos_rag_'
```

***

### type

> **type**: `"sql"`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/vector_stores/SqlVectorStore.ts#L79)

Must be 'sql' for this provider

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)
