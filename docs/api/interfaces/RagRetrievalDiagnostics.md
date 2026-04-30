# Interface: RagRetrievalDiagnostics

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:130](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L130)

Diagnostics emitted by retrieval operations.

## Properties

### dataSourceHits?

> `optional` **dataSourceHits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L136)

***

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:137](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L137)

***

### embeddingTimeMs?

> `optional` **embeddingTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:131](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L131)

***

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:148](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L148)

HyDE-specific diagnostics, populated when HyDE retrieval is active.

- `hypothesis`: The generated (or pre-supplied) hypothetical answer.
- `hypothesisLatencyMs`: Time spent generating the hypothesis via LLM.
- `effectiveThreshold`: Final similarity threshold after adaptive stepping.
- `thresholdSteps`: Number of times the threshold was lowered before results
  were found (0 means the initial threshold succeeded).

#### effectiveThreshold

> **effectiveThreshold**: `number`

#### hypothesis

> **hypothesis**: `string`

#### hypothesisLatencyMs

> **hypothesisLatencyMs**: `number`

#### thresholdSteps

> **thresholdSteps**: `number`

***

### messages?

> `optional` **messages**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L138)

***

### policy?

> `optional` **policy**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:154](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L154)

#### confidence

> **confidence**: `RetrievalConfidenceSummary`

#### escalations

> **escalations**: `string`[]

#### profile

> **profile**: [`MemoryRetrievalProfile`](../type-aliases/MemoryRetrievalProfile.md)

***

### rerankingTimeMs?

> `optional` **rerankingTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L133)

***

### retrievalTimeMs?

> `optional` **retrievalTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:132](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L132)

***

### strategyUsed?

> `optional` **strategyUsed**: `"hybrid"` \| `"similarity"` \| `"mmr"`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:135](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L135)

***

### totalTokensInContext?

> `optional` **totalTokensInContext**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:134](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L134)
