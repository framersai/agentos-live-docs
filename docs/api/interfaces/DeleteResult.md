# Interface: DeleteResult

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L218)

The result of a vector store delete operation.

## Interface

DeleteResult

## Properties

### deletedCount

> **deletedCount**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:219](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L219)

The number of documents successfully deleted.

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:221](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L221)

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

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:220](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L220)

The number of documents/operations that failed.
