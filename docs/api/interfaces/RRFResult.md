# Interface: RRFResult

Defined in: [packages/agentos/src/memory/retrieval/hybrid/reciprocalRankFusion.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/reciprocalRankFusion.ts#L63)

One merged result from [reciprocalRankFusion](../functions/reciprocalRankFusion.md).

## Properties

### denseRank?

> `optional` **denseRank**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/reciprocalRankFusion.ts:68](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/reciprocalRankFusion.ts#L68)

Rank in the dense list (undefined if doc was sparse-only).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/reciprocalRankFusion.ts:64](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/reciprocalRankFusion.ts#L64)

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/reciprocalRankFusion.ts:66](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/reciprocalRankFusion.ts#L66)

Fused score; higher = more relevant.

***

### sparseRank?

> `optional` **sparseRank**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/reciprocalRankFusion.ts:70](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/reciprocalRankFusion.ts#L70)

Rank in the sparse list (undefined if doc was dense-only).
