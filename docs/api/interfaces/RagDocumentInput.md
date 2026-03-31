# Interface: RagDocumentInput

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L31)

Represents raw document content provided for ingestion.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L35)

Raw text that will be chunked and embedded.

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L37)

Optional override for which data source / collection to push this document into.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L47)

Optional pre-computed embedding vector.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L49)

Identifier of the embedding model used when `embedding` is supplied.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L33)

Stable identifier for the document (chunk IDs will derive from this).

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L43)

ISO language tag for the content.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:41](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L41)

Arbitrary metadata stored alongside chunks; values must be vector-store friendly.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L39)

Original source pointer (URL, file path, API, etc.).

***

### timestamp?

> `optional` **timestamp**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/IRetrievalAugmentor.ts#L45)

ISO timestamp describing when this content was produced/updated.
