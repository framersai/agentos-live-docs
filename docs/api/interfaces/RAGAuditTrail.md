# Interface: RAGAuditTrail

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:101](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L101)

Aggregated audit trail for a complete RAG request.

## Properties

### operations

> **operations**: [`RAGOperationEntry`](RAGOperationEntry.md)[]

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:115](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L115)

Per-operation breakdown.

***

### query

> **query**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:110](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L110)

The user query that triggered RAG.

***

### requestId

> **requestId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:104](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L104)

Correlates with the conversation turn or API request.

***

### seedId?

> `optional` **seedId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:106](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L106)

Wunderland agent seed ID.

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L108)

Conversation session ID.

***

### summary

> **summary**: `object`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L118)

Aggregated summary across all operations.

#### operationTypes

> **operationTypes**: `string`[]

Unique operation types used (e.g. ['embedding', 'vector_query', 'rerank']).

#### sourceSummary

> **sourceSummary**: `object`

##### sourceSummary.uniqueCollections

> **uniqueCollections**: `number`

##### sourceSummary.uniqueDataSources

> **uniqueDataSources**: `number`

##### sourceSummary.uniqueDocuments

> **uniqueDocuments**: `number`

#### totalCompletionTokens

> **totalCompletionTokens**: `number`

#### totalCostUSD

> **totalCostUSD**: `number`

#### totalDurationMs

> **totalDurationMs**: `number`

#### totalEmbeddingCalls

> **totalEmbeddingCalls**: `number`

#### totalEmbeddingTokens

> **totalEmbeddingTokens**: `number`

#### totalLLMCalls

> **totalLLMCalls**: `number`

#### totalOperations

> **totalOperations**: `number`

#### totalPromptTokens

> **totalPromptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:112](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L112)

ISO 8601 timestamp.

***

### trailId

> **trailId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditTypes.ts#L102)
