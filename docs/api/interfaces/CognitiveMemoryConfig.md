# Interface: CognitiveMemoryConfig

Defined in: [packages/agentos/src/memory/core/config.ts:224](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L224)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L232)

***

### archive?

> `optional` **archive**: `IMemoryArchive`

Defined in: [packages/agentos/src/memory/core/config.ts:313](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L313)

Optional memory archive for write-ahead verbatim preservation.

When provided, TemporalGist preserves the original content in cold
storage before overwriting with the gist. Enables on-demand rehydration
via `CognitiveMemoryManager.rehydrate()`.

#### Default

```ts
undefined (no archive — gist is destructive)
```

#### See

IMemoryArchive — the archive contract

***

### brain?

> `optional` **brain**: [`SqliteBrain`](../classes/SqliteBrain.md)

Defined in: [packages/agentos/src/memory/core/config.ts:285](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L285)

Optional SqliteBrain instance for durable persistence.

When provided, memory traces, knowledge graph nodes/edges,
prospective items, and observation pipeline state are persisted
to the brain's SQL tables via sql-storage-adapter. The in-memory
vector index remains the hot read path; SqliteBrain is the durable
backing store that survives process restarts.

Falls back to in-memory-only storage when omitted.

#### Default

```ts
undefined (in-memory only)
```

#### See

[SqliteBrain](../classes/SqliteBrain.md) — the cross-platform persistence layer

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/core/config.ts:258](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L258)

Optional per-mechanism cognitive science extensions (reconsolidation, RIF, FOK, etc.).

***

### collectionPrefix?

> `optional` **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:268](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L268)

#### Default

```ts
'cogmem'
```

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:254](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L254)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:245](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L245)

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/core/config.ts:229](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L229)

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:244](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L244)

***

### featureDetectionLlmInvoker()?

> `optional` **featureDetectionLlmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/core/config.ts:241](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L241)

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

Defined in: [packages/agentos/src/memory/core/config.ts:239](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L239)

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:253](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L253)

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:262](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L262)

Infinite context window config. Enables transparent compaction for forever conversations.

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/core/config.ts:227](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L227)

***

### maxContextTokens?

> `optional` **maxContextTokens**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:264](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L264)

Max context window size in tokens (required for infinite context).

***

### moodProvider()

> **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/core/config.ts:235](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L235)

Callback to get current mood from MoodEngine or similar.

#### Returns

[`PADState`](PADState.md)

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:251](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L251)

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:252](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L252)

***

### rerankerService?

> `optional` **rerankerService**: `RerankerService`

Defined in: [packages/agentos/src/memory/core/config.ts:301](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L301)

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

Defined in: [packages/agentos/src/memory/core/config.ts:248](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L248)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/config.ts:233](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L233)

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/core/config.ts:228](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L228)

***

### workingMemory

> **workingMemory**: `IWorkingMemory`

Defined in: [packages/agentos/src/memory/core/config.ts:226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L226)

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:247](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L247)

#### Default

```ts
7 (Miller's number)
```
