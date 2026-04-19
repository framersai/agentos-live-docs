# Interface: BM25Result

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/BM25Index.ts#L55)

A single BM25 search result with relevance score.

## Interface

BM25Result

## Properties

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/BM25Index.ts#L57)

Document identifier.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:61](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/BM25Index.ts#L61)

Document metadata if available.

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/BM25Index.ts#L59)

BM25 relevance score (higher = more relevant).
