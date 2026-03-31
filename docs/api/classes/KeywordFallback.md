# Class: KeywordFallback

Defined in: [packages/agentos/src/query-router/KeywordFallback.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/KeywordFallback.ts#L51)

Simple keyword-matching search over a corpus of chunks.

Used as a degraded-mode fallback when the embedding API is unavailable.
Splits the query into keywords, filters out stop words and short tokens,
then scores each chunk by the number of keyword hits (heading matches
receive a higher weight than content matches).

## Example

```typescript
const fallback = new KeywordFallback(corpusChunks);
const results = fallback.search('authentication tokens', 5);
// results: RetrievedChunk[] sorted by relevance, at most 5 entries
```

## Constructors

### Constructor

> **new KeywordFallback**(`chunks`): `KeywordFallback`

Defined in: [packages/agentos/src/query-router/KeywordFallback.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/KeywordFallback.ts#L59)

Creates a new KeywordFallback instance.

#### Parameters

##### chunks

[`CorpusChunk`](../interfaces/CorpusChunk.md)[]

The corpus chunks to search over.

#### Returns

`KeywordFallback`

## Methods

### search()

> **search**(`query`, `topK?`): [`RetrievedChunk`](../interfaces/RetrievedChunk.md)[]

Defined in: [packages/agentos/src/query-router/KeywordFallback.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/KeywordFallback.ts#L77)

Searches the corpus for chunks matching the given query keywords.

Scoring algorithm:
- Each keyword found in the chunk heading awards HEADING\_MATCH\_SCORE points.
- Each keyword found in the chunk content awards CONTENT\_MATCH\_SCORE point.
- Chunks with zero total score are excluded.
- Scores are normalized to the 0-1 range (relative to the maximum observed score).
- Results are sorted by score descending and sliced to topK.

#### Parameters

##### query

`string`

The user query string to match.

##### topK?

`number` = `5`

Maximum number of results to return. Defaults to 5.

#### Returns

[`RetrievedChunk`](../interfaces/RetrievedChunk.md)[]

Array of RetrievedChunk sorted by relevance, at most topK entries.
