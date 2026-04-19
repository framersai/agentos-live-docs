# Class: HnswlibVectorStore

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L105)

Vector store implementation using hnswlib-node for fast ANN search.

Features:
- O(log n) query time via HNSW graph structure
- 1-10ms queries for 100K vectors
- File-based persistence
- Configurable HNSW parameters (M, efConstruction, efSearch)
- Full metadata filtering support

## Implements

- [`IVectorStore`](../interfaces/IVectorStore.md)

## Constructors

### Constructor

> **new HnswlibVectorStore**(): `HnswlibVectorStore`

#### Returns

`HnswlibVectorStore`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:861](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L861)

**`Async`**

Checks the operational health of the vector store provider.
This might involve pinging the service, checking connection status, or verifying authentication.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

A promise that resolves with the health status.
`details` can include specific error messages or status information.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`checkHealth`](../interfaces/IVectorStore.md#checkhealth)

***

### collectionExists()

> **collectionExists**(`collectionName`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:574](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L574)

**`Async`**

Checks if a collection with the given name exists in the vector store.

#### Parameters

##### collectionName

`string`

The name of the collection to check.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves with `true` if the collection exists, `false` otherwise.

#### Throws

If the check fails for reasons other than existence (e.g., connection issue).

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`collectionExists`](../interfaces/IVectorStore.md#collectionexists)

***

### createCollection()

> **createCollection**(`collectionName`, `dimension`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:477](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L477)

**`Async`**

Creates a new collection (or index, class, etc.) in the vector store.
This is often necessary before documents can be upserted into it, depending on the provider.

#### Parameters

##### collectionName

`string`

The name of the collection to create.

##### dimension

`number`

The dimensionality of the vector embeddings that will be stored in this collection.

##### options?

[`CreateCollectionOptions`](../interfaces/CreateCollectionOptions.md)

Optional parameters for collection creation, such as similarity metric or provider-specific settings.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is successfully created.

#### Throws

If collection creation fails (e.g., name conflict and not overwriting, invalid parameters).

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`createCollection`](../interfaces/IVectorStore.md#createcollection)

***

### delete()

> **delete**(`collectionName`, `ids?`, `options?`): `Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:782](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L782)

**`Async`**

Deletes documents from a specified collection by their IDs or by a metadata filter.

#### Parameters

##### collectionName

`string`

The name of the collection to delete documents from.

##### ids?

`string`[]

An array of document IDs to delete.

##### options?

[`DeleteOptions`](../interfaces/DeleteOptions.md)

Optional parameters, including metadata filters or a deleteAll flag.
If `ids` are provided, `options.filter` might be ignored or combined,
depending on store behavior. Use with caution.

#### Returns

`Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

A promise that resolves with the result of the delete operation.

#### Throws

If the delete operation fails.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`delete`](../interfaces/IVectorStore.md#delete)

***

### deleteCollection()

> **deleteCollection**(`collectionName`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:548](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L548)

**`Async`**

Deletes an entire collection from the vector store. This is a destructive operation.

#### Parameters

##### collectionName

`string`

The name of the collection to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is successfully deleted.

#### Throws

If collection deletion fails.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`deleteCollection`](../interfaces/IVectorStore.md#deletecollection)

***

### getStats()

> **getStats**(`collectionName?`): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:899](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L899)

**`Async`**

Optional: Retrieves statistics about a specific collection or the store itself.
The structure of the returned statistics is provider-dependent.

#### Parameters

##### collectionName?

`string`

Optional: The name of the collection to get stats for.
If omitted, may return store-wide stats if supported.

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

A promise that resolves with a statistics object.

#### Throws

If fetching statistics fails.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`getStats`](../interfaces/IVectorStore.md#getstats)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L127)

**`Async`**

Initializes the vector store provider with its specific configuration.
This method must be called before any other operations can be performed.
It sets up connections, authenticates, and prepares the store for use.

#### Parameters

##### config

[`VectorStoreProviderConfig`](../interfaces/VectorStoreProviderConfig.md)

The configuration object specific to this vector store provider.
This is typically a more specific type that extends `VectorStoreProviderConfig`.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If initialization fails (e.g., invalid configuration, connection error, authentication failure).

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`initialize`](../interfaces/IVectorStore.md#initialize)

***

### query()

> **query**(`collectionName`, `queryEmbedding`, `options?`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:665](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L665)

**`Async`**

Queries a specified collection for documents similar to the provided query embedding.

#### Parameters

##### collectionName

`string`

The name of the collection to query.

##### queryEmbedding

`number`[]

The query vector embedding.

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Optional parameters for the query operation, including filters and topK.

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

A promise that resolves with the query results.

#### Throws

If the query operation fails.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`query`](../interfaces/IVectorStore.md#query)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:879](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L879)

**`Async`**

Gracefully shuts down the vector store provider, releasing any resources
such as database connections or client instances.

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`shutdown`](../interfaces/IVectorStore.md#shutdown)

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/HnswlibVectorStore.ts:596](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/vector_stores/HnswlibVectorStore.ts#L596)

**`Async`**

Upserts (inserts or updates) a batch of documents into a specified collection.
If a document with the same ID already exists, it is typically updated; otherwise, it's inserted.

#### Parameters

##### collectionName

`string`

The name of the collection (or index, class, etc.) to upsert documents into.

##### documents

[`VectorDocument`](../interfaces/VectorDocument.md)[]

An array of documents to upsert.

##### options?

[`UpsertOptions`](../interfaces/UpsertOptions.md)

Optional parameters for the upsert operation.

#### Returns

`Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

A promise that resolves with the result of the upsert operation.

#### Throws

If the upsert operation fails critically.

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`upsert`](../interfaces/IVectorStore.md#upsert)
