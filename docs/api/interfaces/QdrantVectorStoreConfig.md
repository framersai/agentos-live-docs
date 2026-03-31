# Interface: QdrantVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L46)

Base configuration for any vector store provider.
Specific provider configurations (e.g., for Pinecone, Weaviate) should extend this.

## Interface

VectorStoreProviderConfig

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L51)

Optional API key for Qdrant Cloud or secured self-host deployments.

***

### bm25VectorName?

> `optional` **bm25VectorName**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L58)

Named BM25 sparse vector field. Default: `bm25`.

***

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`customProps`](VectorStoreProviderConfig.md#customprops)

***

### denseVectorName?

> `optional` **denseVectorName**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L56)

Named dense vector field. Default: `dense`.

***

### enableBm25?

> `optional` **enableBm25**: `boolean`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L61)

Store BM25 sparse vectors and enable `hybridSearch()`. Default: true.

***

### fetch()?

> `optional` **fetch**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L64)

Optional custom fetch implementation (testing/edge). Defaults to global `fetch`.

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

##### Parameters

###### input

`RequestInfo` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

##### Parameters

###### input

`string` | `Request` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L30)

A unique identifier for this specific provider instance
(e.g., "pinecone-main-prod", "weaviate-dev-local"). This ID is used by the
VectorStoreManager to retrieve this provider.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`id`](VectorStoreProviderConfig.md#id)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L53)

Request timeout in milliseconds. Default: 15_000.

***

### type

> **type**: `"qdrant"`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L47)

The type of the vector store provider
(e.g., "pinecone", "weaviate", "in_memory", "lancedb"). This helps in
selecting the correct implementation.

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)

***

### url

> **url**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/QdrantVectorStore.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/vector_stores/QdrantVectorStore.ts#L49)

Base URL, e.g. `http://localhost:6333` or Qdrant Cloud endpoint.
