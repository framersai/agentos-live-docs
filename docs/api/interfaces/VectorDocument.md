# Interface: VectorDocument

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:104](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L104)

Represents a document to be stored or retrieved from a vector store.

## Interface

VectorDocument

## Extended by

- [`RetrievedVectorDocument`](RetrievedVectorDocument.md)

## Properties

### embedding

> **embedding**: `number`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L106)

The vector embedding of the document's content.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L105)

A unique identifier for the document.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:107](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L107)

A flexible key-value store for document metadata.
Values can be scalars or arrays of scalars. Used for filtering and providing context.

***

### textContent?

> `optional` **textContent**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/vector-store/IVectorStore.ts#L108)

Optional: The raw text content of the document.
Some use cases might store this alongside the embedding, while others might fetch it from a primary store using the ID.
