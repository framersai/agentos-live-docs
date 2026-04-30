# Interface: QueryRouterConfig

Defined in: [packages/agentos/src/query-router/types.ts:427](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L427)

Public constructor configuration for the QueryRouter pipeline.

`knowledgeCorpus` is required. All other fields are optional and default to
the values in DEFAULT\_QUERY\_ROUTER\_CONFIG.

## Example

```ts
const router = new QueryRouter({
  knowledgeCorpus: ['./docs', './packages/agentos/docs'],
  availableTools: ['web_search', 'deep_research'],
  maxTier: 3,
});
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:575](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L575)

Optional API key override for classifier and generator LLM calls.

When omitted, QueryRouter prefers `OPENAI_API_KEY` and falls back to
`OPENROUTER_API_KEY` with the OpenRouter compatibility base URL.

***

### availableTools?

> `optional` **availableTools**: `string`[]

Defined in: [packages/agentos/src/query-router/types.ts:511](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L511)

Optional tool/capability names exposed to the classifier prompt so it can
reason about what the runtime can actually do.

#### Default

```ts
[]
```

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:583](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L583)

Optional base URL override for classifier and generator LLM providers.

When omitted, QueryRouter auto-selects the OpenRouter compatibility URL
only when `OPENROUTER_API_KEY` is being used implicitly.

***

### cacheResults?

> `optional` **cacheResults**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:504](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L504)

Whether to cache query results.

When enabled, `route()` caches completed `QueryResult` objects in memory
and reuses them for identical query/history/request-option inputs until
router state changes (for example corpus refresh or retriever swap).

#### Default

```ts
true
```

***

### classifierModel?

> `optional` **classifierModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:445](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L445)

LLM model for the classifier.

#### Default

```ts
'gpt-4o-mini'
```

***

### classifierProvider?

> `optional` **classifierProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:448](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L448)

LLM provider for the classifier.

#### Default

```ts
'openai'
```

***

### confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:442](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L442)

Minimum confidence threshold for accepting a classification result.
If confidence falls below this, the router may escalate to a higher tier.

#### Default

```ts
0.7
```

***

### conversationWindowSize?

> `optional` **conversationWindowSize**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:487](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L487)

Number of recent conversation messages to include as context
for classification and generation.

#### Default

```ts
5
```

***

### deepResearch()?

> `optional` **deepResearch**: (`query`, `sources`) => `Promise`\<\{ `sources`: [`RetrievedChunk`](RetrievedChunk.md)[]; `synthesis`: `string`; \}\>

Defined in: [packages/agentos/src/query-router/types.ts:552](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L552)

Optional host-provided deep research callback.

Provide this to replace the built-in placeholder research branch with a
real multi-source research runtime. The `sources` argument receives
normalized research-source hints such as `web`, `docs`, or `media`,
not raw classifier retrieval labels.

#### Parameters

##### query

`string`

##### sources

`string`[]

#### Returns

`Promise`\<\{ `sources`: [`RetrievedChunk`](RetrievedChunk.md)[]; `synthesis`: `string`; \}\>

***

### deepResearchEnabled?

> `optional` **deepResearchEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:480](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L480)

Whether to enable deep research mode for tier 3 queries.
Research mode performs iterative multi-pass retrieval and synthesis.

#### Default

```ts
true
```

***

### embeddingApiKey?

> `optional` **embeddingApiKey**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:593](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L593)

Optional API key override for embeddings only.

When omitted, embeddings fall back to `apiKey`, then `OPENAI_API_KEY`,
then `OPENROUTER_API_KEY`.
This is useful when generation uses an OpenAI-compatible endpoint like
OpenRouter but embeddings should stay on a direct OpenAI key.

***

### embeddingBaseUrl?

> `optional` **embeddingBaseUrl**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:604](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L604)

Optional base URL override for embeddings only.

When omitted, embeddings inherit `baseUrl` unless `embeddingApiKey` is
explicitly set, in which case the embedding path assumes the provider's
default endpoint. If neither override is set and QueryRouter falls back to
`OPENROUTER_API_KEY`, it automatically uses the OpenRouter compatibility
URL for embeddings as well.

***

### embeddingModel?

> `optional` **embeddingModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:457](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L457)

Embedding model identifier.

#### Default

```ts
'text-embedding-3-small'
```

***

### embeddingProvider?

> `optional` **embeddingProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:454](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L454)

Embedding provider name.

#### Default

```ts
'openai'
```

***

### generationModel?

> `optional` **generationModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:460](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L460)

LLM model for T0/T1 generation.

#### Default

```ts
'gpt-4o-mini'
```

***

### generationModelDeep?

> `optional` **generationModelDeep**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:463](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L463)

LLM model for T2/T3 generation (deep).

#### Default

```ts
'gpt-4o'
```

***

### generationProvider?

> `optional` **generationProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:466](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L466)

LLM provider for generation.

#### Default

```ts
'openai'
```

***

### githubRepos?

> `optional` **githubRepos**: `RepoIndexConfig`

Defined in: [packages/agentos/src/query-router/types.ts:612](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L612)

Configuration for background GitHub repository indexing.

When provided, the router will asynchronously index GitHub repos after
`init()` completes and merge the resulting chunks into the corpus.

***

### graphEnabled?

> `optional` **graphEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:473](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L473)

Whether to enable GraphRAG-based retrieval for tier >= 2 queries.
Requires a configured GraphRAG engine.

#### Default

```ts
true
```

***

### graphExpand()?

> `optional` **graphExpand**: (`seedChunks`) => `Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Defined in: [packages/agentos/src/query-router/types.ts:519](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L519)

Optional host-provided graph expansion callback.

Provide this to replace the built-in placeholder `graphExpand()` branch
with a real GraphRAG or relationship-expansion implementation.

#### Parameters

##### seedChunks

[`RetrievedChunk`](RetrievedChunk.md)[]

#### Returns

`Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

***

### includePlatformKnowledge?

> `optional` **includePlatformKnowledge**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:633](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L633)

Load bundled platform knowledge (tools, skills, FAQ, API reference,
troubleshooting) into the corpus during `init()`.

When enabled, the router ships with instant knowledge about every
AgentOS capability — no external docs required for platform questions.

#### Default

```ts
true
```

***

### knowledgeCorpus

> **knowledgeCorpus**: `string`[]

Defined in: [packages/agentos/src/query-router/types.ts:435](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L435)

Directories containing `.md` / `.mdx` files to ingest as the knowledge
corpus.

`init()` will throw if these paths resolve to zero readable markdown
sections, because a successful router init should imply a non-empty corpus.

***

### maxContextTokens?

> `optional` **maxContextTokens**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:493](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L493)

Maximum estimated tokens to allocate for documentation context.

#### Default

```ts
4000
```

***

### maxTier?

> `optional` **maxTier**: [`QueryTier`](../type-aliases/QueryTier.md)

Defined in: [packages/agentos/src/query-router/types.ts:451](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L451)

Maximum tier the classifier may assign.

#### Default

```ts
3
```

***

### onClassification()?

> `optional` **onClassification**: (`result`) => `void`

Defined in: [packages/agentos/src/query-router/types.ts:561](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L561)

Hook called after classification completes.
Receives the ClassificationResult for consumer integration.

#### Parameters

##### result

[`ClassificationResult`](ClassificationResult.md)

#### Returns

`void`

***

### onRetrieval()?

> `optional` **onRetrieval**: (`result`) => `void`

Defined in: [packages/agentos/src/query-router/types.ts:567](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L567)

Hook called after retrieval completes.
Receives the RetrievalResult for consumer integration.

#### Parameters

##### result

[`RetrievalResult`](RetrievalResult.md)

#### Returns

`void`

***

### rerank()?

> `optional` **rerank**: (`query`, `chunks`, `topN`) => `Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Defined in: [packages/agentos/src/query-router/types.ts:527](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L527)

Optional host-provided reranker callback.

Provide this to replace the built-in lexical heuristic reranker with a
provider-backed or cross-encoder reranker.

#### Parameters

##### query

`string`

##### chunks

[`RetrievedChunk`](RetrievedChunk.md)[]

##### topN

`number`

#### Returns

`Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

***

### strategyConfig?

> `optional` **strategyConfig**: `QueryRouterStrategyConfig`

Defined in: [packages/agentos/src/query-router/types.ts:622](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L622)

Retrieval strategy configuration for the HyDE-aware query router.

Controls how the classifier selects between `none`, `simple`, `moderate`
(HyDE), and `complex` (HyDE + decompose) retrieval strategies.

#### See

QueryRouterStrategyConfig

***

### verifyCitations?

> `optional` **verifyCitations**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:542](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L542)

Enable post-generation citation verification when the router has an active
embedding path and retrieved source chunks.

When enabled, `route()` runs `CitationVerifier` over the generated answer
and retrieved sources, then attaches the result to `QueryResult.grounding`.
If embeddings are unavailable or no sources were retrieved, verification is
skipped gracefully.
