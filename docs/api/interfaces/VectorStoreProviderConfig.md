# Interface: VectorStoreProviderConfig

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L29)

Base configuration for any vector store provider.
Specific provider configurations (e.g., for Pinecone, Weaviate) should extend this.

## Interface

VectorStoreProviderConfig

## Extended by

- [`SqlVectorStoreConfig`](SqlVectorStoreConfig.md)
- [`HnswlibVectorStoreConfig`](HnswlibVectorStoreConfig.md)
- [`QdrantVectorStoreConfig`](QdrantVectorStoreConfig.md)
- [`PineconeVectorStoreConfig`](PineconeVectorStoreConfig.md)

## Properties

### customProps?

> `optional` **customProps**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L32)

Any other custom properties or
configurations specific to this provider instance not covered by standard fields.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:30](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L30)

A unique identifier for this specific provider instance
(e.g., "pinecone-main-prod", "weaviate-dev-local"). This ID is used by the
VectorStoreManager to retrieve this provider.

***

### type

> **type**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L31)

The type of the vector store provider
(e.g., "pinecone", "weaviate", "in_memory", "lancedb"). This helps in
selecting the correct implementation.
