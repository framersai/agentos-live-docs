# Interface: SourceDiagnostics

Defined in: [packages/agentos/src/rag/unified/types.ts:289](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L289)

Per-source diagnostics for a unified retrieval operation.

Reports how many chunks each source contributed and how long
each source query took. Sources that were not queried or failed
will have `chunkCount: 0`.

## See

UnifiedRetrievalResult.sourceDiagnostics

## Properties

### graph

> **graph**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:295](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L295)

GraphRAG search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hybrid

> **hybrid**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:291](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L291)

Vector + BM25 hybrid search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hyde

> **hyde**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:301](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L301)

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

Defined in: [packages/agentos/src/rag/unified/types.ts:297](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L297)

Cognitive memory search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### multimodal

> **multimodal**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:299](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L299)

Multimodal search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### raptor

> **raptor**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:293](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L293)

RAPTOR tree search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### rerank

> **rerank**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:303](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L303)

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

Defined in: [packages/agentos/src/rag/unified/types.ts:305](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L305)

Deep research diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`
