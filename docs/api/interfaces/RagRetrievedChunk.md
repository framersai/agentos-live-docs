# Interface: RagRetrievedChunk

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L96)

Structure describing a retrieved chunk.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L98)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:102](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L102)

Data source / collection identifier.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:110](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L110)

Embedding vector if `includeEmbeddings` was requested.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L97)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L106)

Metadata that traveled with the chunk.

***

### originalDocumentId

> **originalDocumentId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L100)

Original document ID for traceability.

***

### relevanceScore?

> `optional` **relevanceScore**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L108)

Similarity or relevance score returned by the vector store.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:104](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L104)

Optional human-friendly source description.
