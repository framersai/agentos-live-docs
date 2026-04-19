# Class: RAGOperationHandle

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L51)

Fluent handle for a single in-flight RAG operation.
Call `.complete(resultsCount)` to finalize timing and add it to the collector.

## Constructors

### Constructor

> **new RAGOperationHandle**(`type`, `onComplete`): `RAGOperationHandle`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L57)

#### Parameters

##### type

`"embedding"` | `"rerank"` | `"hyde"` | `"vector_query"` | `"graph_local"` | `"graph_global"` | `"ingest"`

##### onComplete

(`entry`) => `void`

#### Returns

`RAGOperationHandle`

## Methods

### addSources()

> **addSources**(`chunks`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L85)

#### Parameters

##### chunks

`object`[]

#### Returns

`this`

***

### complete()

> **complete**(`resultsCount`, `overrideDurationMs?`): [`RAGOperationEntry`](../interfaces/RAGOperationEntry.md)

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:163](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L163)

Finalizes the operation, records duration, computes relevance score stats,
and adds the entry to the parent collector.

#### Parameters

##### resultsCount

`number`

Number of results this operation produced.

##### overrideDurationMs?

`number`

Optional override for duration (when timing is measured externally).

#### Returns

[`RAGOperationEntry`](../interfaces/RAGOperationEntry.md)

***

### setCollectionIds()

> **setCollectionIds**(`ids`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L130)

#### Parameters

##### ids

`string`[]

#### Returns

`this`

***

### setCost()

> **setCost**(`costUSD`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:120](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L120)

#### Parameters

##### costUSD

`number`

#### Returns

`this`

***

### setDataSourceIds()

> **setDataSourceIds**(`ids`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L125)

#### Parameters

##### ids

`string`[]

#### Returns

`this`

***

### setGraphDetails()

> **setGraphDetails**(`details`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L135)

#### Parameters

##### details

###### communitiesSearched

`number`

###### entitiesMatched

`number`

###### traversalTimeMs

`number`

#### Returns

`this`

***

### setHydeDetails()

> **setHydeDetails**(`details`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L151)

Attach HyDE-specific metadata to this audit operation.

#### Parameters

##### details

Hypothesis text, effective threshold, and step count.

###### effectiveThreshold

`number`

Final similarity threshold after adaptive stepping.

###### hypothesis

`string`

The generated hypothetical answer used for embedding.

###### thresholdSteps

`number`

Number of adaptive threshold steps taken.

#### Returns

`this`

`this` for fluent chaining.

***

### setRerankDetails()

> **setRerankDetails**(`details`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L140)

#### Parameters

##### details

###### documentsReranked

`number`

###### modelId

`string`

###### providerId

`string`

#### Returns

`this`

***

### setRetrievalMethod()

> **setRetrievalMethod**(`method`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:80](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L80)

#### Parameters

##### method

\{ `hybridAlpha?`: `number`; `mmrLambda?`: `number`; `strategy`: `"hybrid"` \| `"similarity"` \| `"mmr"`; `topK?`: `number`; \} | `undefined`

#### Returns

`this`

***

### setTokenUsage()

> **setTokenUsage**(`usage`): `this`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:115](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L115)

#### Parameters

##### usage

###### embeddingTokens

`number`

###### llmCompletionTokens

`number`

###### llmPromptTokens

`number`

###### totalTokens

`number`

#### Returns

`this`
