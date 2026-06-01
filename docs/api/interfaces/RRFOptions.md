# Interface: RRFOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts:48](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts#L48)

Options for [reciprocalRankFusion](../functions/reciprocalRankFusion.md).

## Properties

### denseWeight?

> `optional` **denseWeight**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts:50](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts#L50)

Weight on the dense-side rank contribution. Default 0.7.

***

### k?

> `optional` **k**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts#L57)

RRF smoothing constant. Larger k flattens rank differences.
Default 60 per Cormack et al. 2009.

***

### sparseWeight?

> `optional` **sparseWeight**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/reciprocalRankFusion.ts#L52)

Weight on the sparse-side rank contribution. Default 0.3.
