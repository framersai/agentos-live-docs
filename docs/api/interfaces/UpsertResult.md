# Interface: UpsertResult

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:186](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L186)

The result of a vector store upsert operation.

## Interface

UpsertResult

## Properties

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:190](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L190)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:189](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L189)

The number of documents that failed to upsert.

***

### upsertedCount

> **upsertedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:187](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L187)

The number of documents successfully upserted.

***

### upsertedIds?

> `optional` **upsertedIds**: `string`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:188](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L188)

Optional array of IDs of the upserted documents.
