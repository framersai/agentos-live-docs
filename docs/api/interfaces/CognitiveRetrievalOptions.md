# Interface: CognitiveRetrievalOptions

Defined in: [packages/agentos/src/memory/core/types.ts:191](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L191)

## Properties

### entities?

> `optional` **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:196](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L196)

***

### hyde?

> `optional` **hyde**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:215](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L215)

Enable HyDE (Hypothetical Document Embedding) for memory retrieval.

When `true` and a HyDE retriever is configured on the memory manager,
the system generates a hypothetical memory trace matching the query
before embedding. This produces embeddings that are closer to actual
stored memories, improving recall — especially for vague or abstract
recall prompts (e.g. "that thing we discussed about deployment").

Adds one LLM call per retrieval. Use for important lookups where
recall quality matters more than latency.

#### Default

```ts
false
```

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:197](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L197)

***

### neutralMood?

> `optional` **neutralMood**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:200](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L200)

If true, skip emotional congruence bias (useful for factual lookups).

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/memory/core/types.ts:217](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L217)

Shared retrieval profile and confidence policy.

***

### scopes?

> `optional` **scopes**: `object`[]

Defined in: [packages/agentos/src/memory/core/types.ts:194](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L194)

#### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

#### scopeId

> **scopeId**: `string`

***

### scoringWeights?

> `optional` **scoringWeights**: `Partial`\<[`ScoringWeights`](ScoringWeights.md)\>

Defined in: [packages/agentos/src/memory/core/types.ts:225](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L225)

Override the 6-signal retrieval weights for this call. Missing
keys fall back to [DEFAULT\_SCORING\_WEIGHTS](../variables/DEFAULT_SCORING_WEIGHTS.md). Useful for
ablation studies (zero one weight at a time and measure
Δaccuracy) and for A/B testing alternate weight configurations
without mutating global defaults.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:195](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L195)

***

### timeRange?

> `optional` **timeRange**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:198](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L198)

#### after?

> `optional` **after**: `number`

#### before?

> `optional` **before**: `number`

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:192](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L192)

***

### types?

> `optional` **types**: [`MemoryType`](../type-aliases/MemoryType.md)[]

Defined in: [packages/agentos/src/memory/core/types.ts:193](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L193)
