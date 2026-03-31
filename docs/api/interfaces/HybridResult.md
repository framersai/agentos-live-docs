# Interface: HybridResult

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L59)

A hybrid search result combining dense and sparse signals.

## Interface

HybridResult

## Properties

### denseRank?

> `optional` **denseRank**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:69](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L69)

Rank in vector search results (1-based).

***

### denseScore?

> `optional` **denseScore**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:65](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L65)

Score from vector search (if present).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:61](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L61)

Document identifier.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:75](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L75)

Document metadata.

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:63](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L63)

Fused relevance score.

***

### sparseRank?

> `optional` **sparseRank**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:71](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L71)

Rank in BM25 search results (1-based).

***

### sparseScore?

> `optional` **sparseScore**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:67](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L67)

Score from BM25 search (if present).

***

### textContent?

> `optional` **textContent**: `string`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:73](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L73)

Document text content if available.
