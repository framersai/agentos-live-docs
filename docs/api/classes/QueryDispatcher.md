# Class: QueryDispatcher

Defined in: [packages/agentos/src/query-router/QueryDispatcher.ts:173](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/QueryDispatcher.ts#L173)

Routes classified queries to the strategy-appropriate retrieval pipeline.

Supports both the new strategy-based dispatch ([dispatchByStrategy](#dispatchbystrategy))
and the legacy tier-based dispatch ([dispatch](#dispatch)) for backward
compatibility.

## Example

```typescript
const dispatcher = new QueryDispatcher({
  vectorSearch: async (q, k) => vectorStore.search(q, k),
  hydeSearch:   async (q, k) => hydeRetriever.search(q, k),
  decompose:    async (q, max) => decomposer.decompose(q, max),
  graphExpand:  async (seeds) => graphRag.expand(seeds),
  rerank:       async (q, chunks, n) => reranker.rerank(q, chunks, n),
  deepResearch: async (q, srcs) => researcher.research(q, srcs),
  emit:         (e) => eventBus.emit(e),
  graphEnabled: true,
  deepResearchEnabled: true,
});

// Strategy-based (preferred):
const result = await dispatcher.dispatchByStrategy('How does auth work?', 'moderate');

// Tier-based (legacy):
const result = await dispatcher.dispatch('How does auth work?', 2);
```

## Constructors

### Constructor

> **new QueryDispatcher**(`deps`): `QueryDispatcher`

Defined in: [packages/agentos/src/query-router/QueryDispatcher.ts:177](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/QueryDispatcher.ts#L177)

#### Parameters

##### deps

`QueryDispatcherDeps`

#### Returns

`QueryDispatcher`

## Methods

### dispatch()

> **dispatch**(`query`, `tier`, `suggestedSources?`): `Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryDispatcher.ts:257](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/QueryDispatcher.ts#L257)

Dispatch a classified query to the tier-appropriate retrieval pipeline.

This is the legacy entry point. For HyDE-aware routing, prefer
[dispatchByStrategy](#dispatchbystrategy).

#### Parameters

##### query

`string`

The user's natural-language query.

##### tier

[`QueryTier`](../type-aliases/QueryTier.md)

Complexity tier assigned by the QueryClassifier.

##### suggestedSources?

`string`[]

Optional retrieval or research source hints for
                          deep research (T3). Internal classifier hints
                          are normalized before dispatch. Defaults to
                          `['web']` when not provided.

#### Returns

`Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

Aggregated retrieval result with chunks, optional synthesis,
         and timing metadata.

***

### dispatchByStrategy()

> **dispatchByStrategy**(`query`, `strategy`, `suggestedSources?`): `Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryDispatcher.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/QueryDispatcher.ts#L201)

Dispatch a query using the recommended retrieval strategy.

This is the preferred entry point for the HyDE-aware routing pipeline.
The strategy is typically produced by the QueryClassifier's LLM-as-judge
or heuristic classifier.

#### Parameters

##### query

`string`

The user's natural-language query.

##### strategy

`RetrievalStrategy`

Retrieval strategy (`none`, `simple`, `moderate`, `complex`).

##### suggestedSources?

`string`[]

Optional retrieval or research source hints for
                          deep research (complex). Internal classifier
                          hints such as `vector`/`graph`/`research` are
                          normalized to research hints before dispatch.

#### Returns

`Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

Aggregated retrieval result with chunks, optional synthesis,
         and timing metadata.
