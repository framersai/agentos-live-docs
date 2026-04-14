# Interface: PineconeVectorStoreConfig

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:42](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L42)

Configuration specific to Pinecone.

## Extends

- [`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L45)

Pinecone API key. Required.

***

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`customProps`](VectorStoreProviderConfig.md#customprops)

***

### defaultDimension?

> `optional` **defaultDimension**: `number`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L55)

Default embedding dimensions.

#### Default

```ts
1536
```

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:30](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L30)

A unique identifier for this specific provider instance
(e.g., "pinecone-main-prod", "weaviate-dev-local"). This ID is used by the
VectorStoreManager to retrieve this provider.

#### Inherited from

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`id`](VectorStoreProviderConfig.md#id)

***

### indexHost

> **indexHost**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:51](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L51)

Pinecone index host URL (e.g. 'https://my-index-abc123.svc.aped-1234.pinecone.io').
This is the Data Plane endpoint for a specific index — NOT the control plane URL.
Find it in the Pinecone console under your index details.

***

### namespace?

> `optional` **namespace**: `string`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:53](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L53)

Default namespace for operations.

#### Default

```ts
'' (default namespace)
```

***

### type

> **type**: `"pinecone"`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/vector_stores/PineconeVectorStore.ts#L43)

The type of the vector store provider
(e.g., "pinecone", "weaviate", "in_memory", "lancedb"). This helps in
selecting the correct implementation.

#### Overrides

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md).[`type`](VectorStoreProviderConfig.md#type)
