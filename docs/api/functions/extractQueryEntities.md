# Function: extractQueryEntities()

> **extractQueryEntities**(`text`): `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L47)

Extract candidate entity strings from a query. Matches the
Mem0-v3-style regex extractor used at ingest time so query and
fact entities use the same canonicalization.

Captures:
- Capitalized words ≥ 3 characters (proper nouns: "Berlin",
  "Docker", "TypeScript")
- Double-quoted strings ("hello world")
- Single-quoted strings ('like this')

Returns deduplicated entity strings preserving original casing
(case-sensitive comparison happens upstream).

## Parameters

### text

`string`

## Returns

`string`[]
