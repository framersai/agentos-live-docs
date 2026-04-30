# Interface: RagRetrievedChunk

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L98)

Structure describing a retrieved chunk.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L100)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L104)

Data source / collection identifier.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L112)

Embedding vector if `includeEmbeddings` was requested.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L99)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:108](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L108)

Metadata that traveled with the chunk.

***

### originalDocumentId

> **originalDocumentId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L102)

Original document ID for traceability.

***

### relevanceScore?

> `optional` **relevanceScore**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:110](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L110)

Similarity or relevance score returned by the vector store.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L106)

Optional human-friendly source description.
