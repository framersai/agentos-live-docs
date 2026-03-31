# Interface: RAGOperationEntry

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:9](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L9)

A single RAG operation within a request pipeline.

## Properties

### collectionIds?

> `optional` **collectionIds**: `string`[]

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L57)

Collection IDs involved in this operation.

***

### costUSD

> **costUSD**: `number`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L45)

Estimated cost in USD for this operation.

***

### dataSourceIds?

> `optional` **dataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L54)

Data source IDs queried by this operation.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:23](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L23)

Duration in milliseconds.

***

### graphDetails?

> `optional` **graphDetails**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L60)

Graph-specific details (for graph_local / graph_global operations).

#### communitiesSearched

> **communitiesSearched**: `number`

#### entitiesMatched

> **entitiesMatched**: `number`

#### traversalTimeMs

> **traversalTimeMs**: `number`

***

### hydeDetails?

> `optional` **hydeDetails**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:74](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L74)

HyDE-specific details (for hyde operations).

#### effectiveThreshold

> **effectiveThreshold**: `number`

Final similarity threshold after adaptive stepping.

#### hypothesis

> **hypothesis**: `string`

The generated hypothetical answer used for embedding.

#### thresholdSteps

> **thresholdSteps**: `number`

Number of adaptive threshold steps taken.

***

### operationId

> **operationId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:10](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L10)

***

### operationType

> **operationType**: `"embedding"` \| `"rerank"` \| `"hyde"` \| `"vector_query"` \| `"graph_local"` \| `"graph_global"` \| `"ingest"`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:11](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L11)

***

### relevanceScores?

> `optional` **relevanceScores**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L51)

Relevance score statistics across results.

#### avg

> **avg**: `number`

#### max

> **max**: `number`

#### min

> **min**: `number`

***

### rerankDetails?

> `optional` **rerankDetails**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L67)

Reranking-specific details (for rerank operations).

#### documentsReranked

> **documentsReranked**: `number`

#### modelId

> **modelId**: `string`

#### providerId

> **providerId**: `string`

***

### resultsCount

> **resultsCount**: `number`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L48)

Number of results returned by this operation.

***

### retrievalMethod?

> `optional` **retrievalMethod**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L26)

Retrieval strategy details (for vector_query operations).

#### hybridAlpha?

> `optional` **hybridAlpha**: `number`

#### mmrLambda?

> `optional` **mmrLambda**: `number`

#### strategy

> **strategy**: `"hybrid"` \| `"similarity"` \| `"mmr"`

#### topK?

> `optional` **topK**: `number`

***

### sources

> **sources**: [`RAGSourceAttribution`](RAGSourceAttribution.md)[]

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:34](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L34)

Source documents/chunks that contributed to this operation's results.

***

### startedAt

> **startedAt**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:21](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L21)

ISO 8601 timestamp when the operation started.

***

### tokenUsage

> **tokenUsage**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/audit/RAGAuditTypes.ts#L37)

Token usage breakdown for this operation.

#### embeddingTokens

> **embeddingTokens**: `number`

#### llmCompletionTokens

> **llmCompletionTokens**: `number`

#### llmPromptTokens

> **llmPromptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
