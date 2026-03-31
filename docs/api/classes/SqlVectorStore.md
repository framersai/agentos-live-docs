# Class: SqlVectorStore

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L221)

SQL-backed vector store implementation.

Uses `@framers/sql-storage-adapter` for cross-platform persistence.
Stores embeddings as base64-encoded Float32 payloads and computes similarity
in application code.

## Implements

## Example

```typescript
const store = new SqlVectorStore();

await store.initialize({
  id: 'sql-vector-store',
  type: 'sql',
  storage: {
    filePath: './vectors.db',
    priority: ['better-sqlite3', 'sqljs']
  },
  enableFullTextSearch: true
});

// Create a collection
await store.createCollection('documents', 1536);

// Upsert documents
await store.upsert('documents', [{
  id: 'doc-1',
  embedding: [...], // 1536-dim vector
  textContent: 'Example document content',
  metadata: { author: 'Alice', category: 'tech' }
}]);

// Query by similarity
const results = await store.query('documents', queryEmbedding, { topK: 5 });
```

## Implements

- [`IVectorStore`](../interfaces/IVectorStore.md)

## Constructors

### Constructor

> **new SqlVectorStore**(): `SqlVectorStore`

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:243](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L243)

Constructs a SqlVectorStore instance.
The store is not operational until `initialize()` is called.

#### Returns

`SqlVectorStore`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1139](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L1139)

Checks the health of the vector store.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Health status

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`checkHealth`](../interfaces/IVectorStore.md#checkhealth)

***

### collectionExists()

> **collectionExists**(`collectionName`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:423](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L423)

Checks if a collection exists.

#### Parameters

##### collectionName

`string`

Collection name to check

#### Returns

`Promise`\<`boolean`\>

True if collection exists

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`collectionExists`](../interfaces/IVectorStore.md#collectionexists)

***

### createCollection()

> **createCollection**(`collectionName`, `dimension`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:376](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L376)

Creates a new collection for storing vectors.

#### Parameters

##### collectionName

`string`

Unique name for the collection

##### dimension

`number`

Vector embedding dimension

##### options?

[`CreateCollectionOptions`](../interfaces/CreateCollectionOptions.md)

Creation options

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`createCollection`](../interfaces/IVectorStore.md#createcollection)

***

### delete()

> **delete**(`collectionName`, `ids?`, `options?`): `Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1051](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L1051)

Deletes documents from a collection.

#### Parameters

##### collectionName

`string`

Collection to delete from

##### ids?

`string`[]

Specific document IDs to delete

##### options?

[`DeleteOptions`](../interfaces/DeleteOptions.md)

Delete options (filter, deleteAll)

#### Returns

`Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

Deletion result

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`delete`](../interfaces/IVectorStore.md#delete)

***

### deleteCollection()

> **deleteCollection**(`collectionName`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:439](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L439)

Deletes a collection and all its documents.

#### Parameters

##### collectionName

`string`

Collection to delete

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`deleteCollection`](../interfaces/IVectorStore.md#deletecollection)

***

### getStats()

> **getStats**(`collectionName?`): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1200](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L1200)

Gets statistics for a collection or the entire store.

#### Parameters

##### collectionName?

`string`

Specific collection, or all if omitted

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

Statistics

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`getStats`](../interfaces/IVectorStore.md#getstats)

***

### hybridSearch()

> **hybridSearch**(`collectionName`, `queryEmbedding`, `queryText`, `options?`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:798](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L798)

Performs hybrid search combining vector similarity with keyword matching.

#### Parameters

##### collectionName

`string`

Collection to search

##### queryEmbedding

`number`[]

Query vector for semantic search

##### queryText

`string`

Text query for keyword search

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md) & `object`

Search options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Combined search results

#### Example

```typescript
const results = await store.hybridSearch(
  'documents',
  queryEmbedding,
  'machine learning tutorial',
  { topK: 10, alpha: 0.7 } // 70% vector, 30% keyword
);
```

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`hybridSearch`](../interfaces/IVectorStore.md#hybridsearch)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:255](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L255)

Initializes the vector store with the provided configuration.

Creates necessary tables and indexes if they don't exist.

#### Parameters

##### config

[`VectorStoreProviderConfig`](../interfaces/VectorStoreProviderConfig.md)

Configuration object

#### Returns

`Promise`\<`void`\>

#### Throws

If configuration is invalid or initialization fails

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`initialize`](../interfaces/IVectorStore.md#initialize)

***

### query()

> **query**(`collectionName`, `queryEmbedding`, `options?`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:625](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L625)

Queries a collection for similar documents.

#### Parameters

##### collectionName

`string`

Collection to query

##### queryEmbedding

`number`[]

Query vector

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Query results sorted by similarity

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`query`](../interfaces/IVectorStore.md#query)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L1175)

Gracefully shuts down the vector store.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`shutdown`](../interfaces/IVectorStore.md#shutdown)

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:499](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/vector_stores/SqlVectorStore.ts#L499)

Upserts documents into a collection.

#### Parameters

##### collectionName

`string`

Target collection

##### documents

[`VectorDocument`](../interfaces/VectorDocument.md)[]

Documents to upsert

##### options?

[`UpsertOptions`](../interfaces/UpsertOptions.md)

Upsert options

#### Returns

`Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

Result of the upsert operation

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`upsert`](../interfaces/IVectorStore.md#upsert)
