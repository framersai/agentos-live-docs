# Interface: RagRetrievalDiagnostics

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:182](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L182)

Diagnostics emitted by retrieval operations.

## Properties

### dataSourceHits?

> `optional` **dataSourceHits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:188](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L188)

***

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:189](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L189)

***

### embeddingTimeMs?

> `optional` **embeddingTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:183](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L183)

***

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:200](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L200)

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

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:190](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L190)

***

### policy?

> `optional` **policy**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:206](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L206)

#### confidence

> **confidence**: `RetrievalConfidenceSummary`

#### escalations

> **escalations**: `string`[]

#### profile

> **profile**: [`MemoryRetrievalProfile`](../type-aliases/MemoryRetrievalProfile.md)

***

### rerankingTimeMs?

> `optional` **rerankingTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L185)

***

### retrievalTimeMs?

> `optional` **retrievalTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:184](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L184)

***

### strategyUsed?

> `optional` **strategyUsed**: `"hybrid"` \| `"similarity"` \| `"mmr"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:187](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L187)

***

### totalTokensInContext?

> `optional` **totalTokensInContext**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:186](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L186)
