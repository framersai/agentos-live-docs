# Class: PineconeVectorStore

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L74)

## Interface

IVectorStore

## Description

Defines the contract for interacting with a specific vector database or storage backend.
Implementations will wrap specific clients (e.g., Pinecone client, Weaviate client, in-memory store logic).

## Implements

- [`IVectorStore`](../interfaces/IVectorStore.md)

## Constructors

### Constructor

> **new PineconeVectorStore**(`config`): `PineconeVectorStore`

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L78)

#### Parameters

##### config

[`PineconeVectorStoreConfig`](../interfaces/PineconeVectorStoreConfig.md)

#### Returns

`PineconeVectorStore`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:121](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L121)

IVectorStore-compliant health check.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`checkHealth`](../interfaces/IVectorStore.md#checkhealth)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L101)

No-op — Pinecone is cloud-managed.

#### Returns

`Promise`\<`void`\>

***

### createCollection()

> **createCollection**(`_name`, `_dimension`, `_options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:134](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L134)

Create a "collection" — in Pinecone this maps to a namespace.
Namespaces are created implicitly on first upsert, so this is a no-op.

#### Parameters

##### \_name

`string`

##### \_dimension

`number`

##### \_options?

[`CreateCollectionOptions`](../interfaces/CreateCollectionOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`createCollection`](../interfaces/IVectorStore.md#createcollection)

***

### delete()

> **delete**(`collectionName`, `ids?`, `options?`): `Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:445](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L445)

Delete vectors by ID or delete all in namespace.

#### Parameters

##### collectionName

`string`

##### ids?

`string`[]

##### options?

[`DeleteOptions`](../interfaces/DeleteOptions.md)

#### Returns

`Promise`\<[`DeleteResult`](../interfaces/DeleteResult.md)\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`delete`](../interfaces/IVectorStore.md#delete)

***

### dropCollection()

> **dropCollection**(`name`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:146](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L146)

Drop a "collection" — deletes all vectors in the namespace.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`void`\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L111)

Health check — verify index is reachable (legacy).

#### Returns

`Promise`\<`boolean`\>

***

### hybridSearch()

> **hybridSearch**(`collectionName`, `queryEmbedding`, `_queryText`, `options?`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:361](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L361)

Hybrid search is not natively supported by Pinecone in a single call.
Falls back to dense-only query. For true hybrid search, use Postgres
or Qdrant backends which support server-side RRF fusion.

#### Parameters

##### collectionName

`string`

##### queryEmbedding

`number`[]

##### \_queryText

`string`

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md) & `object`

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`hybridSearch`](../interfaces/IVectorStore.md#hybridsearch)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L87)

Verify connectivity by calling the describe index stats endpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`initialize`](../interfaces/IVectorStore.md#initialize)

***

### query()

> **query**(`collectionName`, `queryEmbedding`, `options?`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:219](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L219)

Query for top-K nearest neighbors via Pinecone's query endpoint.
Supports metadata filtering via Pinecone's native filter syntax.

#### Parameters

##### collectionName

`string`

##### queryEmbedding

`number`[]

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`query`](../interfaces/IVectorStore.md#query)

***

### scanByMetadata()

> **scanByMetadata**(`collectionName`, `options?`): `Promise`\<`MetadataScanResult`\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:286](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L286)

Enumerate vectors by metadata filter using Pinecone's fetch_by_metadata endpoint.

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

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L106)

Gracefully shut down the store (alias for close).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`shutdown`](../interfaces/IVectorStore.md#shutdown)

***

### upsert()

> **upsert**(`collectionName`, `documents`, `options?`): `Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

Defined in: [packages/agentos/src/rag/vector\_stores/PineconeVectorStore.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/vector_stores/PineconeVectorStore.ts#L159)

Upsert vectors into Pinecone.
Batches automatically in chunks of 100 (Pinecone's max batch size).

#### Parameters

##### collectionName

`string`

##### documents

[`VectorDocument`](../interfaces/VectorDocument.md)[]

##### options?

[`UpsertOptions`](../interfaces/UpsertOptions.md)

#### Returns

`Promise`\<[`UpsertResult`](../interfaces/UpsertResult.md)\>

#### Implementation of

[`IVectorStore`](../interfaces/IVectorStore.md).[`upsert`](../interfaces/IVectorStore.md#upsert)
