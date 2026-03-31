# Class: QueryRouter

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:185](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L185)

Main orchestrator that wires together the QueryClassifier, QueryDispatcher,
and QueryGenerator into a complete classify -> dispatch -> generate pipeline.

## Example

```typescript
const router = new QueryRouter({
  knowledgeCorpus: ['./docs'],
  generationModel: 'gpt-4o-mini',
  generationModelDeep: 'gpt-4o',
  generationProvider: 'openai',
});

await router.init();
const result = await router.route('How does authentication work?');
console.log(result.answer);
console.log(result.sources);

await router.close();
```

## Constructors

### Constructor

> **new QueryRouter**(`config`): `QueryRouter`

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:265](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L265)

Creates a new QueryRouter instance.

Merges user-supplied configuration over QUERY\_ROUTER\_DEFAULTS.
The router is NOT ready to use until [init](#init) is called.

#### Parameters

##### config

[`QueryRouterConfig`](../interfaces/QueryRouterConfig.md)

Partial configuration; `knowledgeCorpus` is required.

#### Returns

`QueryRouter`

## Methods

### classify()

> **classify**(`query`, `conversationHistory?`, `options?`): `Promise`\<[`ClassificationResult`](../interfaces/ClassificationResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:550](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L550)

Classify a query into a complexity tier without dispatching or generating.

Useful when consumers want to inspect the classification before deciding
whether to proceed with the full pipeline.

#### Parameters

##### query

`string`

The user's natural-language query.

##### conversationHistory?

[`ConversationMessage`](../interfaces/ConversationMessage.md)[]

Optional recent conversation messages.

##### options?

`QueryRouterRequestOptions`

#### Returns

`Promise`\<[`ClassificationResult`](../interfaces/ClassificationResult.md)\>

The classification result with tier, confidence, and reasoning.

#### Throws

If the router has not been initialised via [init](#init).

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:813](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L813)

Tear down resources and release references.

Shuts down embedding and vector store managers if they were initialised,
then nulls out all component references. Safe to call multiple times.
After close(), the router must be re-initialised via [init](#init) before
further use.

#### Returns

`Promise`\<`void`\>

***

### getCorpusStats()

> **getCorpusStats**(): [`QueryRouterCorpusStats`](../interfaces/QueryRouterCorpusStats.md)

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:853](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L853)

Return lightweight corpus/index stats for observability and host startup
logs.

Useful after [init](#init) so callers can confirm the router loaded a real
corpus instead of only knowing that initialisation completed.

#### Returns

[`QueryRouterCorpusStats`](../interfaces/QueryRouterCorpusStats.md)

***

### getUnifiedRetriever()

> **getUnifiedRetriever**(): [`UnifiedRetriever`](UnifiedRetriever.md) \| `null`

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:314](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L314)

Get the attached UnifiedRetriever, or `null` if not configured.

#### Returns

[`UnifiedRetriever`](UnifiedRetriever.md) \| `null`

The UnifiedRetriever instance, or `null`.

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:368](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L368)

Initialise the router: load corpus from disk, extract topics, build
keyword fallback index, embed the corpus into a vector store, and
instantiate classifier/dispatcher/generator.

Must be called before `classify()`, `retrieve()`, or `route()`.

The embedding step uses real EmbeddingManager + VectorStoreManager when
an LLM provider is available (e.g., OPENAI_API_KEY is set). If embedding
initialisation fails for any reason, the router falls back gracefully to
KeywordFallback for all retrieval.

#### Returns

`Promise`\<`void`\>

***

### retrieve()

> **retrieve**(`query`, `tier`): `Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:597](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L597)

Retrieve context at a specific tier, bypassing the classifier.

Useful when the caller already knows the appropriate retrieval depth
and wants to skip classification overhead.

#### Parameters

##### query

`string`

The user's natural-language query.

##### tier

[`QueryTier`](../type-aliases/QueryTier.md)

The complexity tier to retrieve at (0-3).

#### Returns

`Promise`\<[`RetrievalResult`](../interfaces/RetrievalResult.md)\>

The retrieval result with chunks and optional graph/research data.

#### Throws

If the router has not been initialised via [init](#init).

***

### route()

> **route**(`query`, `conversationHistory?`, `options?`): `Promise`\<[`QueryRouterResult`](../interfaces/QueryRouterResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:616](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L616)

Full end-to-end pipeline: classify -> dispatch -> generate.

This is the primary method for answering user queries. It:
1. Classifies the query to determine retrieval depth.
2. Dispatches retrieval at the classified tier.
3. Generates a grounded answer from the retrieved context.
4. Emits lifecycle events throughout for observability.

#### Parameters

##### query

`string`

The user's natural-language query.

##### conversationHistory?

[`ConversationMessage`](../interfaces/ConversationMessage.md)[]

Optional recent conversation messages.

##### options?

`QueryRouterRequestOptions`

#### Returns

`Promise`\<[`QueryRouterResult`](../interfaces/QueryRouterResult.md)\>

The final query result with answer, classification, sources, and timing.

#### Throws

If the router has not been initialised via [init](#init).

***

### setCapabilityDiscoveryEngine()

> **setCapabilityDiscoveryEngine**(`engine`): `void`

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:343](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L343)

Attach a CapabilityDiscoveryEngine for capability-aware classification.

When set, the classifier injects Tier 0 capability summaries (~150 tokens)
into its LLM prompt, enabling it to recommend which skills, tools, and
extensions should be activated for each query. The recommendations are
included in the [ExecutionPlan](../interfaces/ExecutionPlan.md) returned by `classifyWithPlan()`.

Pass `null` to detach and revert to keyword-based heuristic capability
selection.

#### Parameters

##### engine

A configured and initialized CapabilityDiscoveryEngine, or `null` to detach.

`CapabilityDiscoveryEngine` | `null`

#### Returns

`void`

#### Example

```typescript
const engine = new CapabilityDiscoveryEngine(embeddingManager, vectorStore);
await engine.initialize({ tools, skills, extensions, channels });
router.setCapabilityDiscoveryEngine(engine);
// Now route() includes skill/tool/extension recommendations in the execution plan
```

***

### setUnifiedRetriever()

> **setUnifiedRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/query-router/QueryRouter.ts:303](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryRouter.ts#L303)

Attach a [UnifiedRetriever](UnifiedRetriever.md) for plan-based retrieval.

When set, the `route()` method uses the UnifiedRetriever instead of
the legacy QueryDispatcher for the retrieval phase. The classifier
automatically produces a [RetrievalPlan](../interfaces/RetrievalPlan.md) via `classifyWithPlan()`
and the retriever executes it across all available sources in parallel.

Pass `null` to revert to the legacy QueryDispatcher pipeline.

#### Parameters

##### retriever

A configured UnifiedRetriever instance, or `null` to disable.

[`UnifiedRetriever`](UnifiedRetriever.md) | `null`

#### Returns

`void`

#### Example

```typescript
const retriever = new UnifiedRetriever({
  hybridSearcher, raptorTree, graphEngine, memoryManager,
});
router.setUnifiedRetriever(retriever);
// Now route() uses plan-based retrieval automatically
```
