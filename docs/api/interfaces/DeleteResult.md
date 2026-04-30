# Interface: DeleteResult

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L240)

The result of a vector store delete operation.

## Interface

DeleteResult

## Properties

### deletedCount

> **deletedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:241](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L241)

The number of documents successfully deleted.

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:243](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L243)

Detailed information about any failures.

#### details?

> `optional` **details**: `any`

#### id?

> `optional` **id**: `string`

#### message

> **message**: `string`

***

### failedCount?

> `optional` **failedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:242](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L242)

The number of documents/operations that failed.
