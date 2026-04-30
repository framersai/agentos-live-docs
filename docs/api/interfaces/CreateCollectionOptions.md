# Interface: CreateCollectionOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:256](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L256)

Options for creating a new collection/index in the vector store.

## Interface

CreateCollectionOptions

## Properties

### overwriteIfExists?

> `optional` **overwriteIfExists**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:258](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L258)

If a collection with the same name exists, should it be overwritten?

***

### providerSpecificParams?

> `optional` **providerSpecificParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:261](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L261)

Any other parameters specific to the vector store provider
for collection creation (e.g., indexing options, cloud region).

***

### replicas?

> `optional` **replicas**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:259](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L259)

Number of replicas for the collection (if supported).

***

### shards?

> `optional` **shards**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:260](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L260)

Number of shards for the collection (if supported).

***

### similarityMetric?

> `optional` **similarityMetric**: `"cosine"` \| `"euclidean"` \| `"dotproduct"`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:257](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L257)

The similarity metric for the collection.
