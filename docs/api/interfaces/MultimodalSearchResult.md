# Interface: MultimodalSearchResult

Defined in: [packages/agentos/src/rag/multimodal/types.ts:254](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L254)

A single result from a multimodal search query.

Extends the base vector store result with modality-specific fields
so the caller knows what kind of content matched and can render
it appropriately.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:264](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L264)

The text content that was embedded and matched.
For images: the vision LLM description.
For audio: the STT transcript.
For text: the original text chunk.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:256](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L256)

Unique document ID in the vector store.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:283](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L283)

Any metadata attached during indexing.
May include source URLs, file names, timestamps, etc.

***

### modality

> **modality**: [`ContentModality`](../type-aliases/ContentModality.md)

Defined in: [packages/agentos/src/rag/multimodal/types.ts:277](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L277)

The content modality of this result.
Indicates whether the match came from text, image description,
or audio transcript.

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:270](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L270)

Cosine similarity score between the query and this result.
Higher is more relevant (typically 0.0 to 1.0).
