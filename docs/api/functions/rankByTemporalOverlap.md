# Function: rankByTemporalOverlap()

> **rankByTemporalOverlap**(`facts`, `queryTimestamp`): [`TypedFact`](../interfaces/TypedFact.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TemporalIntervalOverlap.ts:38](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TemporalIntervalOverlap.ts#L38)

Rank an array of typed facts by their temporal proximity to a query
timestamp. Facts whose `(start, end)` interval contains the query
rank highest, with tighter intervals (smaller width) scoring higher
within the contained set. Facts whose interval lies outside the
query rank by the minimum endpoint distance. Facts with only a
mention timestamp fall back to mention-distance.

Returns a new array; the input is not mutated. Stable ordering
within tied scores follows JavaScript's `Array.prototype.sort`
insertion order.

## Parameters

### facts

[`TypedFact`](../interfaces/TypedFact.md)[]

Typed facts to rank.

### queryTimestamp

`string`

ISO 8601 string. Invalid timestamps fall
  back to original ordering.

## Returns

[`TypedFact`](../interfaces/TypedFact.md)[]
