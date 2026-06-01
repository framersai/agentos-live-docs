# Interface: CognitiveRetrievalOptions

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:394](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L394)

## Properties

### entities?

> `optional` **entities**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:399](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L399)

***

### hyde?

> `optional` **hyde**: `boolean`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:426](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L426)

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

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:400](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L400)

***

### neutralMood?

> `optional` **neutralMood**: `boolean`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:411](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L411)

If true, skip emotional congruence bias (useful for factual lookups).

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:428](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L428)

Shared retrieval profile and confidence policy.

***

### scopes?

> `optional` **scopes**: `object`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:397](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L397)

#### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

#### scopeId

> **scopeId**: `string`

***

### scoringWeights?

> `optional` **scoringWeights**: `Partial`\<[`ScoringWeights`](ScoringWeights.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:436](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L436)

Override the 6-signal retrieval weights for this call. Missing
keys fall back to [DEFAULT\_SCORING\_WEIGHTS](../variables/DEFAULT_SCORING_WEIGHTS.md). Useful for
ablation studies (zero one weight at a time and measure
Δaccuracy) and for A/B testing alternate weight configurations
without mutating global defaults.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:398](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L398)

***

### timeRange?

> `optional` **timeRange**: `object`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:409](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L409)

#### after?

> `optional` **after**: `number`

#### before?

> `optional` **before**: `number`

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:395](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L395)

***

### types?

> `optional` **types**: [`MemoryType`](../type-aliases/MemoryType.md)[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:396](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L396)

***

### usableFor?

> `optional` **usableFor**: [`TrustCapability`](../type-aliases/TrustCapability.md) \| [`TrustCapability`](../type-aliases/TrustCapability.md)[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:408](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L408)

Restrict results to traces whose trust policy permits the listed
capabilities. Pass a single capability or an array (AND semantics: a
trace must permit every requested capability). Applies the same
staleness check as [canUseFor](../functions/canUseFor.md) when the policy declares
`requiresReverificationAfterMs`.
