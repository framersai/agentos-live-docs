# Function: extractEntities()

> **extractEntities**(`text`): `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts#L63)

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
