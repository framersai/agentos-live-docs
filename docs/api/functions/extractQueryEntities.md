# Function: extractQueryEntities()

> **extractQueryEntities**(`text`): `string`[]

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:47](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L47)

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
