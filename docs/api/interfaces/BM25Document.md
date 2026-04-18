# Interface: BM25Document

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L38)

Internal document representation stored in the BM25 index.

## Interface

BM25Document

## Properties

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:40](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L40)

Unique document identifier.

***

### length

> **length**: `number`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L42)

Number of tokens in the document after tokenization.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L44)

Optional metadata attached to the document.
