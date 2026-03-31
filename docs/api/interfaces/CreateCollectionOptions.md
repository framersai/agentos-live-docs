# Interface: CreateCollectionOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:234](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L234)

Options for creating a new collection/index in the vector store.

## Interface

CreateCollectionOptions

## Properties

### overwriteIfExists?

> `optional` **overwriteIfExists**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:236](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L236)

If a collection with the same name exists, should it be overwritten?

***

### providerSpecificParams?

> `optional` **providerSpecificParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:239](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L239)

Any other parameters specific to the vector store provider
for collection creation (e.g., indexing options, cloud region).

***

### replicas?

> `optional` **replicas**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:237](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L237)

Number of replicas for the collection (if supported).

***

### shards?

> `optional` **shards**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:238](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L238)

Number of shards for the collection (if supported).

***

### similarityMetric?

> `optional` **similarityMetric**: `"cosine"` \| `"euclidean"` \| `"dotproduct"`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:235](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L235)

The similarity metric for the collection.
