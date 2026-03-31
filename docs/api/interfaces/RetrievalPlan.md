# Interface: RetrievalPlan

Defined in: [packages/agentos/src/rag/unified/types.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L53)

Structured retrieval plan produced by the query classifier.

Replaces the simple `'none'|'simple'|'moderate'|'complex'` strategy string
with a granular specification of what retrieval sources to use, how to
combine them, and what memory types to consult.

The plan is data — it describes WHAT to do, not HOW. The
[UnifiedRetriever](../classes/UnifiedRetriever.md) interprets the plan and executes it.

## Example

```typescript
const plan: RetrievalPlan = {
  strategy: 'moderate',
  sources: { vector: true, bm25: true, graph: true, raptor: true, memory: true, multimodal: false },
  hyde: { enabled: true, hypothesisCount: 1 },
  memoryTypes: ['episodic', 'semantic'],
  modalities: ['text'],
  temporal: { preferRecent: false, recencyBoost: 1.0, maxAgeMs: null },
  graphConfig: { maxDepth: 2, minEdgeWeight: 0.3 },
  raptorLayers: [0, 1],
  deepResearch: false,
  confidence: 0.85,
  reasoning: 'Moderate complexity question about auth architecture.',
};
```

## See

buildDefaultPlan for creating sensible defaults per strategy level

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:153](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L153)

Confidence score from the classifier (0 to 1).

Indicates how certain the classifier is about this plan.
Low confidence may trigger plan escalation in the router.

***

### deepResearch

> **deepResearch**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:145](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L145)

Whether deep research mode is enabled.

Deep research decomposes the query into sub-queries and recurses
with moderate-level plans per sub-query. Only used with `complex`
strategy.

***

### graphConfig

> **graphConfig**: [`GraphTraversalConfig`](GraphTraversalConfig.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:125](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L125)

Graph traversal configuration for GraphRAG source.

Controls the depth and selectivity of entity relationship traversal
starting from seed chunks discovered by vector/BM25 search.

***

### hyde

> **hyde**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L82)

HyDE (Hypothetical Document Embedding) configuration.

When enabled, a hypothetical answer is generated via LLM before
embedding, bridging vocabulary gaps between questions and documents.

#### enabled

> **enabled**: `boolean`

Whether to use HyDE for this retrieval.

#### hypothesisCount

> **hypothesisCount**: `number`

Number of diverse hypotheses to generate.
More hypotheses improve recall at the cost of additional LLM calls.

##### Default

```ts
1 for moderate, 3 for complex
```

#### See

HydeRetriever

***

### memoryTypes

> **memoryTypes**: [`MemoryTypeFilter`](../type-aliases/MemoryTypeFilter.md)[]

Defined in: [packages/agentos/src/rag/unified/types.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L101)

Which cognitive memory types to consult.

- `'episodic'`: Past interactions, events, conversations.
- `'semantic'`: Facts, knowledge, learned concepts.
- `'procedural'`: Workflows, how-to knowledge, skills.
- `'prospective'`: Upcoming intentions, reminders, planned actions.

***

### modalities

> **modalities**: [`ModalityFilter`](../type-aliases/ModalityFilter.md)[]

Defined in: [packages/agentos/src/rag/unified/types.ts:109](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L109)

Which content modalities to search in multimodal index.

Text search is always performed via vector/BM25 sources;
non-text modalities are handled by the multimodal indexer.

***

### raptorLayers

> **raptorLayers**: `number`[]

Defined in: [packages/agentos/src/rag/unified/types.ts:136](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L136)

Which RAPTOR tree layers to search.

- `0`: Leaf chunks (original documents) — detail queries.
- `1`: First-level cluster summaries — theme queries.
- `2+`: Higher-level summaries — "big picture" queries.

An empty array searches all layers (default RAPTOR behaviour).

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/rag/unified/types.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L159)

Human-readable reasoning from the classifier explaining why
this plan was selected.

***

### sources

> **sources**: [`RetrievalPlanSources`](RetrievalPlanSources.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:72](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L72)

Which retrieval sources to query.

Each flag independently enables or disables a retrieval source.
The UnifiedRetriever skips sources whose dependencies are not
available at runtime regardless of these flags.

***

### strategy

> **strategy**: `RetrievalStrategy`

Defined in: [packages/agentos/src/rag/unified/types.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L63)

Base retrieval strategy (determines overall pipeline depth).

Maps to the existing strategy tier system but carries richer config.
- `'none'`: Skip retrieval entirely.
- `'simple'`: Vector + BM25 only. Fast path.
- `'moderate'`: All sources, HyDE enabled, single pass.
- `'complex'`: All sources, HyDE with multi-hypothesis, deep research, decomposition.

***

### temporal

> **temporal**: [`TemporalConfig`](TemporalConfig.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:117](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L117)

Temporal preferences for result ordering and filtering.

Controls whether recent results are boosted and how aggressively
older content is penalized.
