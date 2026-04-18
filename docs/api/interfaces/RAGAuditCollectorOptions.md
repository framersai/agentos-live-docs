# Interface: RAGAuditCollectorOptions

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L38)

## Properties

### query

> **query**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:40](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L40)

***

### requestId

> **requestId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L39)

***

### seedId?

> `optional` **seedId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L41)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L42)

***

### usageLedger?

> `optional` **usageLedger**: `UsageLedgerLike`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/audit/RAGAuditCollector.ts#L44)

When provided, finalized audit data is pushed into the usage ledger for token/cost accounting.
