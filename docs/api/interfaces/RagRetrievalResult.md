# Interface: RagRetrievalResult

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:327](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L327)

Retrieval result passed back to callers.

## Properties

### auditTrail?

> `optional` **auditTrail**: [`RAGAuditTrail`](RAGAuditTrail.md)

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:334](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L334)

Full audit trail when `includeAudit` was set on the retrieval options.

***

### augmentedContext

> **augmentedContext**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:330](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L330)

***

### diagnostics?

> `optional` **diagnostics**: [`RagRetrievalDiagnostics`](RagRetrievalDiagnostics.md)

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:332](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L332)

***

### queryEmbedding?

> `optional` **queryEmbedding**: `number`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:331](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L331)

***

### queryText

> **queryText**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:328](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L328)

***

### retrievedChunks

> **retrievedChunks**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:329](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L329)
