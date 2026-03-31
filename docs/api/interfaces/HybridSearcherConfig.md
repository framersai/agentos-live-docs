# Interface: HybridSearcherConfig

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:35](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L35)

Configuration for the hybrid searcher.

## Interface

HybridSearcherConfig

## Properties

### denseWeight?

> `optional` **denseWeight**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:37](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L37)

Weight for dense (vector) results. Range: 0-1. Default: 0.7.

***

### fusionMethod?

> `optional` **fusionMethod**: `"rrf"` \| `"weighted-sum"` \| `"interleave"`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:43](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L43)

Fusion method for merging ranked lists. Default: 'rrf'.

***

### rrfK?

> `optional` **rrfK**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L41)

RRF constant k. Higher values flatten score differences. Default: 60.

***

### sparseWeight?

> `optional` **sparseWeight**: `number`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/HybridSearcher.ts#L39)

Weight for sparse (BM25) results. Range: 0-1. Default: 0.3.
