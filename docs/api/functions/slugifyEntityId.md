# Function: slugifyEntityId()

> **slugifyEntityId**(`label`): `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts:116](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/extraction/HeuristicEntityExtractor.ts#L116)

Derive a deterministic entity ID from a label. Lowercases, strips
non-alphanumeric characters except spaces, replaces whitespace with
dashes, collapses runs of dashes.

Idempotent: `slugifyEntityId(slugifyEntityId(x))` === `slugifyEntityId(x)`.

## Parameters

### label

`string`

Entity label from [extractEntities](extractEntities.md).

## Returns

`string`

Slug suitable for use as a stable entity-node id.
