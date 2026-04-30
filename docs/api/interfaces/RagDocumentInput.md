# Interface: RagDocumentInput

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:33](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L33)

Represents raw document content provided for ingestion.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L37)

Raw text that will be chunked and embedded.

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L39)

Optional override for which data source / collection to push this document into.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L49)

Optional pre-computed embedding vector.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L51)

Identifier of the embedding model used when `embedding` is supplied.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:35](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L35)

Stable identifier for the document (chunk IDs will derive from this).

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L45)

ISO language tag for the content.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L43)

Arbitrary metadata stored alongside chunks; values must be vector-store friendly.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L41)

Original source pointer (URL, file path, API, etc.).

***

### timestamp?

> `optional` **timestamp**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L47)

ISO timestamp describing when this content was produced/updated.
