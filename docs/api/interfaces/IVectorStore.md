# Interface: IVectorStore

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:269](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L269)

## Interface

IVectorStore

## Description

Defines the contract for interacting with a specific vector database or storage backend.
Implementations will wrap specific clients (e.g., Pinecone client, Weaviate client, in-memory store logic).

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:444](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L444)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:434](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L434)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:410](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L410)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:393](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L393)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:424](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L424)

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

### fetchByIds()?

> `optional` **fetchByIds**(`collectionName`, `ids`, `options?`): `Promise`\<[`RetrievedVectorDocument`](RetrievedVectorDocument.md)[]\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:351](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L351)

**`Async`**

Optional: Fetch documents by their primary IDs without similarity ranking.

Used by callers like `HybridSearcher` to hydrate documents that were
ranked by a sparse / lexical index but missed the dense top-K — a
primary-key fetch is the only correct hydration path here because a
second similarity query would surface the next-K dense rows instead
of the specific BM25 winners, misattributing rows under the wrong
fused-score position.

Stores that cannot do efficient PK fetches (e.g. some sparse-only or
remote indexes) may leave this unimplemented; callers must then choose
whether to drop sparse-only winners or fall back to text-content-missing
results.

The returned `RetrievedVectorDocument.similarityScore` is set to 0 as
a sentinel — callers that try to rank these by `similarityScore` will
get an obvious "no similarity" signal rather than a stale cosine number.

#### Parameters

##### collectionName

`string`

The collection to fetch from.

##### ids

`string`[]

Document IDs to fetch. Empty array returns [].

##### options?

Optional inclusion flags (default both true).

###### includeMetadata?

`boolean`

###### includeTextContent?

`boolean`

#### Returns

`Promise`\<[`RetrievedVectorDocument`](RetrievedVectorDocument.md)[]\>

Hydrated documents in
  implementation-defined order (callers should not rely on ordering).

***

### getStats()?

> `optional` **getStats**(`collectionName?`): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:465](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L465)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:365](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L365)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:281](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L281)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:310](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L310)

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

### scanByMetadata()?

> `optional` **scanByMetadata**(`collectionName`, `options?`): `Promise`\<`MetadataScanResult`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:320](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L320)

Optional: Enumerates documents using metadata-only filtering without
requiring a query embedding.

#### Parameters

##### collectionName

`string`

##### options?

`MetadataScanOptions`

#### Returns

`Promise`\<`MetadataScanResult`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:453](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L453)

**`Async`**

Gracefully shuts down the vector store provider, releasing any resources
such as database connections or client instances.

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](UpsertResult.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:294](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/vector-store/IVectorStore.ts#L294)

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
