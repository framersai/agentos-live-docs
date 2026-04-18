# Class: BM25Index

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:152](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L152)

BM25 sparse keyword index for hybrid retrieval.

Dense embeddings excel at semantic similarity but miss exact keyword matches
(e.g., error codes, function names, product IDs). BM25 catches these by
scoring documents based on term frequency, inverse document frequency,
and document length normalization.

## Examples

```typescript
const index = new BM25Index({ k1: 1.5, b: 0.75 });

index.addDocuments([
  { id: 'doc-1', text: 'TypeScript compiler error TS2304' },
  { id: 'doc-2', text: 'JavaScript runtime TypeError explanation' },
  { id: 'doc-3', text: 'Fix error TS2304 by adding type declarations' },
]);

const results = index.search('error TS2304', 5);
// results[0].id === 'doc-3' (exact match on "error" + "TS2304")
// results[1].id === 'doc-1' (exact match on "error" + "TS2304")
```

```typescript
const hybrid = new HybridSearcher(vectorStore, embeddingManager, bm25Index, {
  denseWeight: 0.7,
  sparseWeight: 0.3,
});
const results = await hybrid.search('What does error TS2304 mean?');
```

## Constructors

### Constructor

> **new BM25Index**(`config?`): `BM25Index`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:203](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L203)

Creates a new BM25 index.

#### Parameters

##### config?

[`BM25Config`](../interfaces/BM25Config.md)

Optional BM25 tuning parameters.

#### Returns

`BM25Index`

#### Example

```typescript
// Use defaults (k1=1.2, b=0.75)
const index = new BM25Index();

// Custom parameters for short documents
const shortDocIndex = new BM25Index({ k1: 1.5, b: 0.5 });
```

## Methods

### addDocument()

> **addDocument**(`id`, `text`, `metadata?`): `void`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:298](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L298)

Adds a single document to the BM25 index.

The text is tokenized, stop words are removed, and term frequencies
are recorded in the inverted index. IDF values are lazily recomputed
on the next search.

#### Parameters

##### id

`string`

Unique document identifier.

##### text

`string`

Document text content to index.

##### metadata?

`Record`\<`string`, `unknown`\>

Optional metadata to store.

#### Returns

`void`

#### Throws

If `id` is empty or `text` is empty.

#### Example

```typescript
index.addDocument('readme', 'AgentOS is a framework for building AI agents');
index.addDocument('changelog', 'v2.0: Added BM25 hybrid search', { version: '2.0' });
```

***

### addDocuments()

> **addDocuments**(`docs`): `void`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:352](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L352)

Adds multiple documents to the index in a single batch.

More efficient than calling [addDocument](#adddocument) repeatedly because
IDF recomputation is deferred until the next search.

#### Parameters

##### docs

`object`[]

Array of documents to index.

#### Returns

`void`

#### Example

```typescript
index.addDocuments([
  { id: 'doc-1', text: 'First document content' },
  { id: 'doc-2', text: 'Second document content', metadata: { source: 'api' } },
]);
```

***

### getStats()

> **getStats**(): [`BM25Stats`](../interfaces/BM25Stats.md)

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:465](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L465)

Returns current index statistics.

#### Returns

[`BM25Stats`](../interfaces/BM25Stats.md)

Object containing document count, term count,
  and average document length.

#### Example

```typescript
const stats = index.getStats();
console.log(`${stats.documentCount} docs, ${stats.termCount} unique terms`);
```

***

### removeDocument()

> **removeDocument**(`id`): `boolean`

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:436](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L436)

Removes a document from the index by its ID.

Cleans up all term frequency entries in the inverted index and
marks IDF for recomputation.

#### Parameters

##### id

`string`

Document ID to remove.

#### Returns

`boolean`

`true` if the document existed and was removed, `false` otherwise.

#### Example

```typescript
const removed = index.removeDocument('doc-obsolete');
console.log(removed ? 'Removed' : 'Not found');
```

***

### search()

> **search**(`query`, `topK?`): [`BM25Result`](../interfaces/BM25Result.md)[]

Defined in: [packages/agentos/src/rag/search/BM25Index.ts:380](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/search/BM25Index.ts#L380)

Searches the BM25 index for documents matching the query.

Scoring formula per document D and query Q:
```
score(D, Q) = sum_{t in Q} IDF(t) * (tf(t,D) * (k1 + 1)) / (tf(t,D) + k1 * (1 - b + b * |D| / avgdl))
```

#### Parameters

##### query

`string`

Search query text.

##### topK?

`number` = `10`

Maximum number of results to return.

#### Returns

[`BM25Result`](../interfaces/BM25Result.md)[]

Array of results sorted by BM25 score descending.

#### Example

```typescript
const results = index.search('typescript error TS2304', 5);
for (const r of results) {
  console.log(`${r.id}: score=${r.score.toFixed(4)}`);
}
```
