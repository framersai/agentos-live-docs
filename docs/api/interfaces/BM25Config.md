# Interface: BM25Config

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:73](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/BM25Index.ts#L73)

Configuration options for the BM25 index.

## Interface

BM25Config

## Properties

### b?

> `optional` **b**: `number`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:77](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/BM25Index.ts#L77)

Document length normalization factor.
  0 = no normalization, 1 = full normalization. Range: 0-1.

***

### k1?

> `optional` **k1**: `number`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:75](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/BM25Index.ts#L75)

Term saturation parameter. Higher values increase
  the influence of term frequency. Range: 1.2-2.0 typical.

***

### pipeline?

> `optional` **pipeline**: `TextProcessingPipeline`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:84](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/search/BM25Index.ts#L84)

Optional text processing pipeline for tokenization.
When provided, replaces the built-in regex tokenizer with configurable
stemming, lemmatization, and stop word handling.

#### See

createRagPipeline from nlp for the recommended default.
