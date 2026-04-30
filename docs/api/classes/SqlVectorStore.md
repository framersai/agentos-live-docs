# Class: SqlVectorStore

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:223](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L223)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:245](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L245)

Constructs a SqlVectorStore instance.
The store is not operational until `initialize()` is called.

#### Returns

`SqlVectorStore`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1190](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L1190)

Checks the health of the vector store.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Health status

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`checkHealth`](../interfaces/IVectorStore.md#checkhealth)

***

### collectionExists()

> **collectionExists**(`collectionName`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:425](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L425)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:378](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L378)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L1102)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:441](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L441)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1251](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L1251)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:849](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L849)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:257](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L257)

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

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:627](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L627)

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

### scanByMetadata()

> **scanByMetadata**(`collectionName`, `options?`): `Promise`\<`MetadataScanResult`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:781](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L781)

Optional: Enumerates documents using metadata-only filtering without
requiring a query embedding.

#### Parameters

##### collectionName

`string`

##### options?

`MetadataScanOptions`

#### Returns

`Promise`\<`MetadataScanResult`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`scanByMetadata`](../interfaces/IVectorStore.md#scanbymetadata)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:1226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L1226)

Gracefully shuts down the vector store.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`shutdown`](../interfaces/IVectorStore.md#shutdown)

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/SqlVectorStore.ts:501](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/SqlVectorStore.ts#L501)

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
