# Interface: SourceDiagnostics

Defined in: [packages/agentos/src/rag/unified/types.ts:298](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L298)

Per-source diagnostics for a unified retrieval operation.

Reports how many chunks each source contributed and how long
each source query took. Sources that were not queried or failed
will have `chunkCount: 0`.

## See

UnifiedRetrievalResult.sourceDiagnostics

## Properties

### graph

> **graph**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:304](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L304)

GraphRAG search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hybrid

> **hybrid**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:300](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L300)

Vector + BM25 hybrid search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hyde

> **hyde**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:310](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L310)

HyDE hypothesis search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

#### hypothesisCount

> **hypothesisCount**: `number`

***

### memory

> **memory**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:306](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L306)

Cognitive memory search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### multimodal

> **multimodal**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:308](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L308)

Multimodal search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### raptor

> **raptor**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:302](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L302)

RAPTOR tree search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### rerank

> **rerank**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L312)

Reranking diagnostics.

#### durationMs

> **durationMs**: `number`

#### inputCount

> **inputCount**: `number`

#### outputCount

> **outputCount**: `number`

***

### research

> **research**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:314](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L314)

Deep research diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`
