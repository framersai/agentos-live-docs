# Function: fourWayRrf()

> **fourWayRrf**(`input`, `options?`): `string`[]

Defined in: [packages/agentos/src/memory/retrieval/typed-network/FourWayRrf.ts:53](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/FourWayRrf.ts#L53)

Fuse four retrieval rankings via Reciprocal Rank Fusion. Returns
the merged list ordered by descending fused score.

## Parameters

### input

[`FourWayRrfInput`](../interfaces/FourWayRrfInput.md)

Four ranked lists (semantic, BM25, graph, temporal).

### options?

[`FourWayRrfOptions`](../interfaces/FourWayRrfOptions.md) = `{}`

RRF k constant + optional per-signal weights.

## Returns

`string`[]
