# Interface: QueryRouterResult

Defined in: [packages/agentos/src/query-router/types.ts:267](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L267)

Final result returned by the QueryRouter after classification, retrieval,
and answer generation.

This surface is intentionally provenance-oriented: it includes not only the
generated answer and citations, but also the tier path actually exercised and
the fallback names that were activated during routing.

## Properties

### answer

> **answer**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:269](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L269)

The generated answer text, grounded in retrieved sources.

***

### classification

> **classification**: [`ClassificationResult`](ClassificationResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:272](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L272)

The classification result that determined routing behaviour.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:284](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L284)

Total wall-clock duration of the entire query pipeline in milliseconds.

***

### fallbacksUsed

> **fallbacksUsed**: `string`[]

Defined in: [packages/agentos/src/query-router/types.ts:297](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L297)

Names of fallback strategies that were activated during this query.
Empty array if no fallbacks were needed.

#### Example

```ts
['keyword-fallback', 'tier-escalation']
```

***

### grounding?

> `optional` **grounding**: [`VerifiedResponse`](VerifiedResponse.md)

Defined in: [packages/agentos/src/query-router/types.ts:303](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L303)

Citation verification results. Populated when deep research runs
or when `verifyCitations` is explicitly requested in config or query options.

***

### recommendations?

> `optional` **recommendations**: `object`

Defined in: [packages/agentos/src/query-router/types.ts:315](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L315)

Recommended skills, tools, and extensions based on query analysis.

Populated when the plan-aware classifier (`classifyWithPlan`) produces
capability recommendations. When no recommendations are made (or the
plan-aware classifier is not used), this field is `undefined`.

Each recommendation includes a confidence score (0-1) and a human-readable
reasoning string explaining why the capability was recommended.

#### extensions

> **extensions**: `object`[]

#### skills

> **skills**: `object`[]

#### tools

> **tools**: `object`[]

***

### researchSynthesis?

> `optional` **researchSynthesis**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:281](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L281)

Synthesized narrative from the deep research phase, when tier-3 routing
exercised external or host-provided research.

***

### sources

> **sources**: [`SourceCitation`](SourceCitation.md)[]

Defined in: [packages/agentos/src/query-router/types.ts:275](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L275)

Citations for the sources used in generating the answer.

***

### tiersUsed

> **tiersUsed**: [`QueryTier`](../type-aliases/QueryTier.md)[]

Defined in: [packages/agentos/src/query-router/types.ts:290](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/query-router/types.ts#L290)

Which tiers were actually exercised during this query.

#### Example

```ts
[0] for trivial, [1, 2] for multi-source with fallback
```
