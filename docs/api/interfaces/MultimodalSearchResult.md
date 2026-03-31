# Interface: MultimodalSearchResult

Defined in: [packages/agentos/src/rag/multimodal/types.ts:218](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L218)

A single result from a multimodal search query.

Extends the base vector store result with modality-specific fields
so the caller knows what kind of content matched and can render
it appropriately.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:228](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L228)

The text content that was embedded and matched.
For images: the vision LLM description.
For audio: the STT transcript.
For text: the original text chunk.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:220](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L220)

Unique document ID in the vector store.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:247](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L247)

Any metadata attached during indexing.
May include source URLs, file names, timestamps, etc.

***

### modality

> **modality**: [`ContentModality`](../type-aliases/ContentModality.md)

Defined in: [packages/agentos/src/rag/multimodal/types.ts:241](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L241)

The content modality of this result.
Indicates whether the match came from text, image description,
or audio transcript.

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L234)

Cosine similarity score between the query and this result.
Higher is more relevant (typically 0.0 to 1.0).
