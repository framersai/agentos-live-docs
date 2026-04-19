# Class: HybridSearcher

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:113](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/HybridSearcher.ts#L113)

Hybrid dense+sparse searcher combining vector embeddings with BM25.

Uses Reciprocal Rank Fusion (RRF) to merge results from both retrieval
systems, capturing both semantic similarity and exact keyword matches.

## Examples

```typescript
const bm25 = new BM25Index();
bm25.addDocuments(documents);

const hybrid = new HybridSearcher(vectorStore, embeddingManager, bm25, {
  denseWeight: 0.7,
  sparseWeight: 0.3,
  fusionMethod: 'rrf',
});

const results = await hybrid.search(
  'error TS2304 type declarations',
  'my-collection',
  10,
);
```

```typescript
const hybrid = new HybridSearcher(vectorStore, embeddingManager, bm25, {
  fusionMethod: 'weighted-sum',
  denseWeight: 0.6,
  sparseWeight: 0.4,
});
```

## Constructors

### Constructor

> **new HybridSearcher**(`vectorStore`, `embeddingManager`, `bm25Index`, `config?`): `HybridSearcher`

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:142](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/HybridSearcher.ts#L142)

Creates a new HybridSearcher.

#### Parameters

##### vectorStore

[`IVectorStore`](../interfaces/IVectorStore.md)

Dense vector store for semantic search.

##### embeddingManager

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

Manager for generating query embeddings.

##### bm25Index

[`BM25Index`](BM25Index.md)

BM25 sparse keyword index.

##### config?

[`HybridSearcherConfig`](../interfaces/HybridSearcherConfig.md)

Optional configuration overrides.

#### Returns

`HybridSearcher`

#### Example

```typescript
const searcher = new HybridSearcher(store, embeddings, bm25, {
  denseWeight: 0.7,
  sparseWeight: 0.3,
});
```

## Methods

### search()

> **search**(`query`, `collectionName`, `topK?`, `queryOptions?`): `Promise`\<[`HybridResult`](../interfaces/HybridResult.md)[]\>

Defined in: [packages/agentos/src/rag/search/HybridSearcher.ts:184](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/search/HybridSearcher.ts#L184)

Searches both dense and sparse indexes, then fuses results.

Pipeline:
1. Generate query embedding via the embedding manager
2. Query the dense vector store for semantically similar documents
3. Query the BM25 sparse index for keyword-matching documents
4. Fuse both result sets using the configured fusion method (RRF by default)
5. Return the top K results sorted by fused score

#### Parameters

##### query

`string`

The search query text.

##### collectionName

`string`

Vector store collection to search.

##### topK?

`number` = `10`

Maximum number of results to return.

##### queryOptions?

`Partial`\<[`QueryOptions`](../interfaces/QueryOptions.md)\>

Additional options for the vector store query.

#### Returns

`Promise`\<[`HybridResult`](../interfaces/HybridResult.md)[]\>

Fused results sorted by relevance.

#### Throws

If embedding generation fails.

#### Example

```typescript
const results = await hybrid.search('error TS2304', 'knowledge-base', 5);
for (const r of results) {
  console.log(`${r.id}: fused=${r.score.toFixed(4)} dense=${r.denseRank} sparse=${r.sparseRank}`);
}
```
