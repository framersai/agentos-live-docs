# Interface: RetrievedVectorDocument

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:145](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L145)

Represents a single document retrieved from a query, including its similarity score.

## Interface

RetrievedVectorDocument

## Extends

- [`VectorDocument`](VectorDocument.md)

## Properties

### embedding

> **embedding**: `number`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:106](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L106)

The vector embedding of the document's content.

#### Inherited from

[`VectorDocument`](VectorDocument.md).[`embedding`](VectorDocument.md#embedding)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L105)

A unique identifier for the document.

#### Inherited from

[`VectorDocument`](VectorDocument.md).[`id`](VectorDocument.md#id)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:107](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L107)

A flexible key-value store for document metadata.
Values can be scalars or arrays of scalars. Used for filtering and providing context.

#### Inherited from

[`VectorDocument`](VectorDocument.md).[`metadata`](VectorDocument.md#metadata)

***

### similarityScore

> **similarityScore**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:146](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L146)

The similarity score of this document with respect to the query vector.
The meaning of this score depends on the similarity metric used by the vector store (e.g., cosine similarity, Euclidean distance).

***

### textContent?

> `optional` **textContent**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/vector-store/IVectorStore.ts#L108)

Optional: The raw text content of the document.
Some use cases might store this alongside the embedding, while others might fetch it from a primary store using the ID.

#### Inherited from

[`VectorDocument`](VectorDocument.md).[`textContent`](VectorDocument.md#textcontent)
