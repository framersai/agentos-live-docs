# Interface: PineconeVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L52)

Configuration specific to Pinecone.

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L55)

Pinecone API key. Required.

***

### apiVersion?

> `optional` **apiVersion**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L57)

Explicit Pinecone API version header. Defaults to the current stable version used by this adapter.

***

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`customProps`](VectorStoreProviderConfig.md#customprops)

***

### defaultDimension?

> `optional` **defaultDimension**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L67)

Default embedding dimensions.

#### Default

```ts
1536
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

### indexHost

> **indexHost**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L63)

Pinecone index host URL (e.g. 'https://my-index-abc123.svc.aped-1234.pinecone.io').
This is the Data Plane endpoint for a specific index — NOT the control plane URL.
Find it in the Pinecone console under your index details.

***

### namespace?

> `optional` **namespace**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L65)

Default namespace for operations.

#### Default

```ts
'' (default namespace)
```

***

### type

> **type**: `"pinecone"`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L53)

The type of the vector store provider
(e.g., "pinecone", "weaviate", "in_memory", "lancedb"). This helps in
selecting the correct implementation.

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)
