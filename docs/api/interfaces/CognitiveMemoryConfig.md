# Interface: CognitiveMemoryConfig

Defined in: [packages/agentos/src/memory/core/config.ts:233](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L233)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:241](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L241)

***

### archive?

> `optional` **archive**: `IMemoryArchive`

Defined in: [packages/agentos/src/memory/core/config.ts:344](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L344)

Optional memory archive for write-ahead verbatim preservation.

When provided, TemporalGist preserves the original content in cold
storage before overwriting with the gist. Enables on-demand rehydration
via `CognitiveMemoryManager.rehydrate()`.

#### Default

```ts
undefined (no archive, gist is destructive)
```

#### See

IMemoryArchive — the archive contract

***

### brain?

> `optional` **brain**: [`Brain`](../classes/Brain.md)

Defined in: [packages/agentos/src/memory/core/config.ts:316](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L316)

Optional Brain instance for durable persistence.

When provided, memory traces, knowledge graph nodes/edges,
prospective items, and observation pipeline state are persisted
to the brain's SQL tables via sql-storage-adapter. The in-memory
vector index remains the hot read path; Brain is the durable
backing store that survives process restarts.

Falls back to in-memory-only storage when omitted.

#### Default

```ts
undefined (in-memory only)
```

#### See

[Brain](../classes/Brain.md) — the cross-platform persistence layer

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/core/config.ts:276](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L276)

Optional per-mechanism cognitive science extensions (reconsolidation, RIF, FOK, etc.).

***

### collectionPrefix?

> `optional` **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:286](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L286)

#### Default

```ts
'cogmem'
```

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:263](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L263)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:254](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L254)

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/core/config.ts:238](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L238)

***

### enableGraphActivation?

> `optional` **enableGraphActivation**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:299](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L299)

Step 13: enable graph activation. Propagates to
`MemoryStoreConfig.enableGraphActivation`. When true, the internal
`MemoryStore` upserts entity nodes + `related_to:co_occurs` edges
at encode time (from `trace.entities`), and seeds Anderson
spreading activation from query-extracted entities at retrieve to
compute the sixth composite-scoring signal. Default: false (legacy
behavior, `graphActivation` signal is a silent zero).

#### Default

```ts
false
```

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:253](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L253)

***

### featureDetectionLlmInvoker()?

> `optional` **featureDetectionLlmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/core/config.ts:250](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L250)

Required when strategy is 'llm' or 'hybrid'.

#### Parameters

##### systemPrompt

`string`

##### userPrompt

`string`

#### Returns

`Promise`\<`string`\>

***

### featureDetectionStrategy

> **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/memory/core/config.ts:248](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L248)

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:262](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L262)

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:280](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L280)

Infinite context window config. Enables transparent compaction for forever conversations.

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/core/config.ts:236](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L236)

***

### maxContextTokens?

> `optional` **maxContextTokens**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:282](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L282)

Max context window size in tokens (required for infinite context).

***

### moodProvider()

> **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/core/config.ts:244](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L244)

Callback to get current mood from MoodEngine or similar.

#### Returns

[`PADState`](PADState.md)

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:260](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L260)

***

### persistentMemory?

> `optional` **persistentMemory**: `PersistentMemorySource`

Defined in: [packages/agentos/src/memory/core/config.ts:272](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L272)

Optional persistent markdown memory source injected into every prompt.

This is separate from active working memory: working memory is the
bounded cognitive focus, while persistent memory is durable agent/user
state such as profile notes, preferences, and identity anchors.

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:261](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L261)

***

### rerankerService?

> `optional` **rerankerService**: `RerankerService`

Defined in: [packages/agentos/src/memory/core/config.ts:332](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L332)

Optional reranker service for post-retrieval quality improvement.

When provided, retrieved memory traces are reranked after the
cognitive scoring pipeline (vector similarity + strength + recency +
emotional congruence + graph activation + importance). The reranker
score is blended with the existing composite score at a 0.7/0.3
weighting to preserve cognitive signals while boosting semantically
relevant results.

Recommended: Cohere rerank-v3.5 primary, LLM-Judge fallback.

#### Default

```ts
undefined (no reranking)
```

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:257](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L257)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/config.ts:242](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L242)

***

### typedNetwork?

> `optional` **typedNetwork**: `TypedNetworkRuntimeConfig`

Defined in: [packages/agentos/src/memory/core/config.ts:362](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L362)

Stage E: optional Hindsight 4-network typed observer wiring.

When provided, `encode()` additionally extracts typed facts (World /
Experience / Opinion / Observation banks) via the configured LLM and
persists them in an in-memory `TypedNetworkStore`. `retrieve()` runs
typed-graph spreading activation (`'full'` variant only) and produces
a 4-way RRF fused ranking that's merged into the existing scoring.

Variants:
- `'minimal'`: bank routing + observer only (no graph traversal at retrieve).
- `'full'`: minimal + spreading activation per Hindsight Eq. 12 + 4-way RRF.

#### Default

```ts
undefined (Stage E disabled, zero-cost no-op)
```

#### See

`packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md`

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/core/config.ts:237](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L237)

***

### workingMemory

> **workingMemory**: `IWorkingMemory`

Defined in: [packages/agentos/src/memory/core/config.ts:235](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L235)

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:256](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L256)

#### Default

```ts
7 (Miller's number)
```
