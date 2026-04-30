# Interface: UpsertResult

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:208](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L208)

The result of a vector store upsert operation.

## Interface

UpsertResult

## Properties

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:212](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L212)

Detailed information about any failures.

#### details?

> `optional` **details**: `any`

#### id

> **id**: `string`

#### message

> **message**: `string`

***

### failedCount?

> `optional` **failedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:211](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L211)

The number of documents that failed to upsert.

***

### upsertedCount

> **upsertedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L209)

The number of documents successfully upserted.

***

### upsertedIds?

> `optional` **upsertedIds**: `string`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:210](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L210)

Optional array of IDs of the upserted documents.
