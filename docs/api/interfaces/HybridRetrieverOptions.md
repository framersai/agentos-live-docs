# Interface: HybridRetrieverOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L63)

Options for constructing a [HybridRetriever](../classes/HybridRetriever.md).

## Properties

### bm25Config?

> `optional` **bm25Config**: [`BM25Config`](BM25Config.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:66](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L66)

BM25 config (k1, b, optional tokenizer). Defaults match BM25Index.

***

### defaultDenseWeight?

> `optional` **defaultDenseWeight**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L94)

Default dense weight in RRF.

#### Default

```ts
0.7
```

***

### defaultRrfK?

> `optional` **defaultRrfK**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:98](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L98)

Default RRF constant.

#### Default

```ts
60
```

***

### defaultSparseWeight?

> `optional` **defaultSparseWeight**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L96)

Default sparse weight in RRF.

#### Default

```ts
0.3
```

***

### factGraphQueryClassifier?

> `optional` **factGraphQueryClassifier**: `FactGraphQueryClassifier`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:117](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L117)

Step-9: optional query classifier. Given the user's query, returns
`(subject, predicate)` pairs to look up in the [factStore](#factstore),
plus whether the query is temporal (in which case ALL facts for a
subject are prepended, not just the latest). When absent and
`factStore` is set, a keyword-based default is used.

***

### factStore?

> `optional` **factStore**: [`FactStore`](../classes/FactStore.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:109](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L109)

Step-9: optional [FactStore](../classes/FactStore.md) of `(subject, predicate) → Fact[]`
tuples extracted at session-ingest time. When present AND the query
classifier extracts at least one `(subject, predicate)` pair from
the query, the latest fact per pair is prepended as a synthetic
[ScoredMemoryTrace](ScoredMemoryTrace.md) (retrievalScore: 1.0, sourceType:
'fact_graph') to the merged pool BEFORE rerank. Preserves literal
`object` tokens where summary-based approaches (Steps 5/7/8)
paraphrased them away.

***

### hydeRetriever?

> `optional` **hydeRetriever**: [`HydeRetriever`](../classes/HydeRetriever.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L82)

Optional HyDE retriever for query expansion (Step 4). When set,
each `retrieve()` call generates a hypothesis and uses it as the
query for BOTH dense (`memoryStore.query`) and sparse
(`bm25.search`). The reranker continues to use the ORIGINAL user
query so it scores documents against real user intent, not the
hypothesis. HyDE generation is non-critical — errors fall back
to the raw query without aborting retrieval.

***

### memoryStore

> **memoryStore**: [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:64](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L64)

***

### rerankerService?

> `optional` **rerankerService**: `RerankerService`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L72)

Optional neural reranker. When provided, the merged pool is
reranked before truncation. Passing the same reranker the
baseline uses is the matched-ablation path.

***

### splitAmbiguousThreshold?

> `optional` **splitAmbiguousThreshold**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:92](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L92)

Step-6: enable split-on-ambiguous rerank refinement. When set to a
value in (0, 1], the bottom fraction of traces by first-pass
rerank score are split at sentence boundaries, rescored with a
second rerank call (same query), and replaced by their better
half ONLY IF the better half outscores the original. Monotonic.

Default: undefined (no split, Step 3 behavior preserved).
