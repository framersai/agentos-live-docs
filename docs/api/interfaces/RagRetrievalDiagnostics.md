# Interface: RagRetrievalDiagnostics

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:128](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L128)

Diagnostics emitted by retrieval operations.

## Properties

### dataSourceHits?

> `optional` **dataSourceHits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L134)

***

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L135)

***

### embeddingTimeMs?

> `optional` **embeddingTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L129)

***

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:146](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L146)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:136](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L136)

***

### rerankingTimeMs?

> `optional` **rerankingTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L131)

***

### retrievalTimeMs?

> `optional` **retrievalTimeMs**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L130)

***

### strategyUsed?

> `optional` **strategyUsed**: `"hybrid"` \| `"similarity"` \| `"mmr"`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L133)

***

### totalTokensInContext?

> `optional` **totalTokensInContext**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:132](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L132)
