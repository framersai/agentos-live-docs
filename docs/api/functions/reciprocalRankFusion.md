# Function: reciprocalRankFusion()

> **reciprocalRankFusion**(`denseRanked`, `sparseRanked`, `options?`): [`RRFResult`](../interfaces/RRFResult.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts#L90)

Merge two ranked retrieval results via Reciprocal Rank Fusion.

## Parameters

### denseRanked

[`RankedDoc`](../interfaces/RankedDoc.md)[]

1-based ranked list from dense retrieval.

### sparseRanked

[`RankedDoc`](../interfaces/RankedDoc.md)[]

1-based ranked list from sparse retrieval.

### options?

[`RRFOptions`](../interfaces/RRFOptions.md) = `{}`

[RRFOptions](../interfaces/RRFOptions.md); defaults to w_dense=0.7, w_sparse=0.3, k=60.

## Returns

[`RRFResult`](../interfaces/RRFResult.md)[]

Merged results sorted by fused score descending, stable
         tiebreak by id ascending.

## Example

```ts
const dense = [{ id: 'a', rank: 1 }, { id: 'b', rank: 2 }];
const sparse = [{ id: 'b', rank: 1 }, { id: 'c', rank: 2 }];
const merged = reciprocalRankFusion(dense, sparse);
// => [{ id: 'b', score: 0.0162, denseRank: 2, sparseRank: 1 }, ...]
```
