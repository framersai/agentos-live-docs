# Interface: IVectorStore

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:247](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L247)

## Interface

IVectorStore

## Description

Defines the contract for interacting with a specific vector database or storage backend.
Implementations will wrap specific clients (e.g., Pinecone client, Weaviate client, in-memory store logic).

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:381](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L381)

**`Async`**

Checks the operational health of the vector store provider.
This might involve pinging the service, checking connection status, or verifying authentication.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

A promise that resolves with the health status.
`details` can include specific error messages or status information.

***

### collectionExists()?

> `optional` **collectionExists**(`collectionName`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:371](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L371)

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

***

### createCollection()?

> `optional` **createCollection**(`collectionName`, `dimension`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:347](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L347)

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

[`CreateCollectionOptions`](CreateCollectionOptions.md)

Optional parameters for collection creation, such as similarity metric or provider-specific settings.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is successfully created.

#### Throws

If collection creation fails (e.g., name conflict and not overwriting, invalid parameters).

***

### delete()

> **delete**(`collectionName`, `ids?`, `options?`): `Promise`\<[`DeleteResult`](DeleteResult.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:330](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L330)

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

[`DeleteOptions`](DeleteOptions.md)

Optional parameters, including metadata filters or a deleteAll flag.
If `ids` are provided, `options.filter` might be ignored or combined,
depending on store behavior. Use with caution.

#### Returns

`Promise`\<[`DeleteResult`](DeleteResult.md)\>

A promise that resolves with the result of the delete operation.

#### Throws

If the delete operation fails.

***

### deleteCollection()?

> `optional` **deleteCollection**(`collectionName`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:361](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L361)

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

***

### getStats()?

> `optional` **getStats**(`collectionName?`): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:402](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L402)

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

***

### hybridSearch()?

> `optional` **hybridSearch**(`collectionName`, `queryEmbedding`, `queryText`, `options?`): `Promise`\<[`QueryResult`](QueryResult.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:302](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L302)

Optional: Hybrid retrieval combining dense vector similarity with lexical search.

This is typically implemented using a store-native full-text index (e.g., SQLite FTS5),
or a store-side BM25 implementation, then fusing dense and lexical rankings (e.g., RRF).

If not implemented, callers should fall back to `query()` (dense similarity).

#### Parameters

##### collectionName

`string`

##### queryEmbedding

`number`[]

##### queryText

`string`

##### options?

[`QueryOptions`](QueryOptions.md) & `object`

#### Returns

`Promise`\<[`QueryResult`](QueryResult.md)\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:259](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L259)

**`Async`**

Initializes the vector store provider with its specific configuration.
This method must be called before any other operations can be performed.
It sets up connections, authenticates, and prepares the store for use.

#### Parameters

##### config

[`VectorStoreProviderConfig`](VectorStoreProviderConfig.md)

The configuration object specific to this vector store provider.
This is typically a more specific type that extends `VectorStoreProviderConfig`.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If initialization fails (e.g., invalid configuration, connection error, authentication failure).

***

### query()

> **query**(`collectionName`, `queryEmbedding`, `options?`): `Promise`\<[`QueryResult`](QueryResult.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:288](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L288)

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

[`QueryOptions`](QueryOptions.md)

Optional parameters for the query operation, including filters and topK.

#### Returns

`Promise`\<[`QueryResult`](QueryResult.md)\>

A promise that resolves with the query results.

#### Throws

If the query operation fails.

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:390](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L390)

**`Async`**

Gracefully shuts down the vector store provider, releasing any resources
such as database connections or client instances.

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](UpsertResult.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:272](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L272)

**`Async`**

Upserts (inserts or updates) a batch of documents into a specified collection.
If a document with the same ID already exists, it is typically updated; otherwise, it's inserted.

#### Parameters

##### collectionName

`string`

The name of the collection (or index, class, etc.) to upsert documents into.

##### documents

[`VectorDocument`](VectorDocument.md)[]

An array of documents to upsert.

##### options?

[`UpsertOptions`](UpsertOptions.md)

Optional parameters for the upsert operation.

#### Returns

`Promise`\<[`UpsertResult`](UpsertResult.md)\>

A promise that resolves with the result of the upsert operation.

#### Throws

If the upsert operation fails critically.
