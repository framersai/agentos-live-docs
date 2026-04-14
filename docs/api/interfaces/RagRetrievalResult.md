# Interface: RagRetrievalResult

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:233](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L233)

Retrieval result passed back to callers.

## Properties

### auditTrail?

> `optional` **auditTrail**: [`RAGAuditTrail`](RAGAuditTrail.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:240](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L240)

Full audit trail when `includeAudit` was set on the retrieval options.

***

### augmentedContext

> **augmentedContext**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:236](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L236)

***

### diagnostics?

> `optional` **diagnostics**: [`RagRetrievalDiagnostics`](RagRetrievalDiagnostics.md)

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:238](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L238)

***

### queryEmbedding?

> `optional` **queryEmbedding**: `number`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:237](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L237)

***

### queryText

> **queryText**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:234](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L234)

***

### retrievedChunks

> **retrievedChunks**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:235](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/IRetrievalAugmentor.ts#L235)
