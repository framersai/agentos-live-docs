# Function: extractEntities()

> **extractEntities**(`text`): `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts#L63)

Extract entity labels from free-form text.

Applies five regex pattern families, filters single-word sentence-start
stopwords, normalizes whitespace, dedupes by exact match, and caps at
MAX\_ENTITIES\_PER\_TEXT.

## Parameters

### text

`string`

Free-form text (chunk content, query, etc.).

## Returns

`string`[]

Deduplicated array of entity labels in document order.
