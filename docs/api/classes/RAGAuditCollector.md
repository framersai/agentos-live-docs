# Class: RAGAuditCollector

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:189](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L189)

Request-scoped audit collector. Create one per `retrieveContext()` call.
NOT a singleton — scoped to a single pipeline execution.

## Constructors

### Constructor

> **new RAGAuditCollector**(`options`): `RAGAuditCollector`

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:195](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L195)

#### Parameters

##### options

[`RAGAuditCollectorOptions`](../interfaces/RAGAuditCollectorOptions.md)

#### Returns

`RAGAuditCollector`

## Methods

### finalize()

> **finalize**(): [`RAGAuditTrail`](../interfaces/RAGAuditTrail.md)

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:209](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L209)

Finalize and return the complete audit trail with computed summary.

#### Returns

[`RAGAuditTrail`](../interfaces/RAGAuditTrail.md)

***

### startOperation()

> **startOperation**(`type`): [`RAGOperationHandle`](RAGOperationHandle.md)

Defined in: [packages/agentos/src/rag/audit/RAGAuditCollector.ts:202](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/audit/RAGAuditCollector.ts#L202)

Start tracking a new operation. Returns a fluent handle.

#### Parameters

##### type

`"embedding"` | `"rerank"` | `"hyde"` | `"vector_query"` | `"graph_local"` | `"graph_global"` | `"ingest"`

#### Returns

[`RAGOperationHandle`](RAGOperationHandle.md)
