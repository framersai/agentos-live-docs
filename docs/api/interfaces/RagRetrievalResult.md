# Interface: RagRetrievalResult

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:242](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L242)

Retrieval result passed back to callers.

## Properties

### auditTrail?

> `optional` **auditTrail**: [`RAGAuditTrail`](RAGAuditTrail.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:249](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L249)

Full audit trail when `includeAudit` was set on the retrieval options.

***

### augmentedContext

> **augmentedContext**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:245](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L245)

***

### diagnostics?

> `optional` **diagnostics**: [`RagRetrievalDiagnostics`](RagRetrievalDiagnostics.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:247](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L247)

***

### queryEmbedding?

> `optional` **queryEmbedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:246](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L246)

***

### queryText

> **queryText**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:243](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L243)

***

### retrievedChunks

> **retrievedChunks**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:244](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L244)
