# Interface: HybridRetrieveOptions

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:131](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L131)

Per-call options for [HybridRetriever.retrieve](../classes/HybridRetriever.md#retrieve).

## Properties

### denseWeight?

> `optional` **denseWeight**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:136](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L136)

***

### overFetchMultiplier?

> `optional` **overFetchMultiplier**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:135](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L135)

Over-fetch multiplier for each side before merge.

#### Default

```ts
3
```

***

### recallTopK?

> `optional` **recallTopK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:133](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L133)

Final truncation after merge + rerank.

#### Default

```ts
10
```

***

### rrfK?

> `optional` **rrfK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:138](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L138)

***

### sparseWeight?

> `optional` **sparseWeight**: `number`

Defined in: [packages/agentos/src/memory/retrieval/hybrid/HybridRetriever.ts:137](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/hybrid/HybridRetriever.ts#L137)
