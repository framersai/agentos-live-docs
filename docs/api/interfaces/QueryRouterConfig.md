# Interface: QueryRouterConfig

Defined in: [packages/agentos/src/query-router/types.ts:419](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L419)

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

Defined in: [packages/agentos/src/query-router/types.ts:551](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L551)

Optional API key override for classifier and generator LLM calls.

When omitted, QueryRouter prefers `OPENAI_API_KEY` and falls back to
`OPENROUTER_API_KEY` with the OpenRouter compatibility base URL.

***

### availableTools?

> `optional` **availableTools**: `string`[]

Defined in: [packages/agentos/src/query-router/types.ts:498](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L498)

Optional tool/capability names exposed to the classifier prompt so it can
reason about what the runtime can actually do.

#### Default

```ts
[]
```

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:559](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L559)

Optional base URL override for classifier and generator LLM providers.

When omitted, QueryRouter auto-selects the OpenRouter compatibility URL
only when `OPENROUTER_API_KEY` is being used implicitly.

***

### cacheResults?

> `optional` **cacheResults**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:491](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L491)

Whether to cache query results.

#### Default

```ts
true
```

***

### classifierModel?

> `optional` **classifierModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:437](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L437)

LLM model for the classifier.

#### Default

```ts
'gpt-4o-mini'
```

***

### classifierProvider?

> `optional` **classifierProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:440](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L440)

LLM provider for the classifier.

#### Default

```ts
'openai'
```

***

### confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:434](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L434)

Minimum confidence threshold for accepting a classification result.
If confidence falls below this, the router may escalate to a higher tier.

#### Default

```ts
0.7
```

***

### conversationWindowSize?

> `optional` **conversationWindowSize**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:479](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L479)

Number of recent conversation messages to include as context
for classification and generation.

#### Default

```ts
5
```

***

### deepResearch()?

> `optional` **deepResearch**: (`query`, `sources`) => `Promise`\<\{ `sources`: [`RetrievedChunk`](RetrievedChunk.md)[]; `synthesis`: `string`; \}\>

Defined in: [packages/agentos/src/query-router/types.ts:528](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L528)

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

Defined in: [packages/agentos/src/query-router/types.ts:472](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L472)

Whether to enable deep research mode for tier 3 queries.
Research mode performs iterative multi-pass retrieval and synthesis.

#### Default

```ts
true
```

***

### embeddingApiKey?

> `optional` **embeddingApiKey**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:569](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L569)

Optional API key override for embeddings only.

When omitted, embeddings fall back to `apiKey`, then `OPENAI_API_KEY`,
then `OPENROUTER_API_KEY`.
This is useful when generation uses an OpenAI-compatible endpoint like
OpenRouter but embeddings should stay on a direct OpenAI key.

***

### embeddingBaseUrl?

> `optional` **embeddingBaseUrl**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:580](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L580)

Optional base URL override for embeddings only.

When omitted, embeddings inherit `baseUrl` unless `embeddingApiKey` is
explicitly set, in which case the embedding path assumes the provider's
default endpoint. If neither override is set and QueryRouter falls back to
`OPENROUTER_API_KEY`, it automatically uses the OpenRouter compatibility
URL for embeddings as well.

***

### embeddingModel?

> `optional` **embeddingModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:449](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L449)

Embedding model identifier.

#### Default

```ts
'text-embedding-3-small'
```

***

### embeddingProvider?

> `optional` **embeddingProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:446](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L446)

Embedding provider name.

#### Default

```ts
'openai'
```

***

### generationModel?

> `optional` **generationModel**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:452](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L452)

LLM model for T0/T1 generation.

#### Default

```ts
'gpt-4o-mini'
```

***

### generationModelDeep?

> `optional` **generationModelDeep**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:455](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L455)

LLM model for T2/T3 generation (deep).

#### Default

```ts
'gpt-4o'
```

***

### generationProvider?

> `optional` **generationProvider**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:458](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L458)

LLM provider for generation.

#### Default

```ts
'openai'
```

***

### githubRepos?

> `optional` **githubRepos**: `RepoIndexConfig`

Defined in: [packages/agentos/src/query-router/types.ts:588](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L588)

Configuration for background GitHub repository indexing.

When provided, the router will asynchronously index GitHub repos after
`init()` completes and merge the resulting chunks into the corpus.

***

### graphEnabled?

> `optional` **graphEnabled**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:465](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L465)

Whether to enable GraphRAG-based retrieval for tier >= 2 queries.
Requires a configured GraphRAG engine.

#### Default

```ts
true
```

***

### graphExpand()?

> `optional` **graphExpand**: (`seedChunks`) => `Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Defined in: [packages/agentos/src/query-router/types.ts:506](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L506)

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

Defined in: [packages/agentos/src/query-router/types.ts:609](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L609)

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

Defined in: [packages/agentos/src/query-router/types.ts:427](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L427)

Directories containing `.md` / `.mdx` files to ingest as the knowledge
corpus.

`init()` will throw if these paths resolve to zero readable markdown
sections, because a successful router init should imply a non-empty corpus.

***

### maxContextTokens?

> `optional` **maxContextTokens**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:485](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L485)

Maximum estimated tokens to allocate for documentation context.

#### Default

```ts
4000
```

***

### maxTier?

> `optional` **maxTier**: [`QueryTier`](../type-aliases/QueryTier.md)

Defined in: [packages/agentos/src/query-router/types.ts:443](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L443)

Maximum tier the classifier may assign.

#### Default

```ts
3
```

***

### onClassification()?

> `optional` **onClassification**: (`result`) => `void`

Defined in: [packages/agentos/src/query-router/types.ts:537](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L537)

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

Defined in: [packages/agentos/src/query-router/types.ts:543](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L543)

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

Defined in: [packages/agentos/src/query-router/types.ts:514](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L514)

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

Defined in: [packages/agentos/src/query-router/types.ts:598](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L598)

Retrieval strategy configuration for the HyDE-aware query router.

Controls how the classifier selects between `none`, `simple`, `moderate`
(HyDE), and `complex` (HyDE + decompose) retrieval strategies.

#### See

QueryRouterStrategyConfig
