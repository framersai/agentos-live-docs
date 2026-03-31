# Interface: SourceDiagnostics

Defined in: [packages/agentos/src/rag/unified/types.ts:284](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L284)

Per-source diagnostics for a unified retrieval operation.

Reports how many chunks each source contributed and how long
each source query took. Sources that were not queried or failed
will have `chunkCount: 0`.

## See

UnifiedRetrievalResult.sourceDiagnostics

## Properties

### graph

> **graph**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:290](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L290)

GraphRAG search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hybrid

> **hybrid**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:286](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L286)

Vector + BM25 hybrid search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### hyde

> **hyde**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:296](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L296)

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

Defined in: [packages/agentos/src/rag/unified/types.ts:292](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L292)

Cognitive memory search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### multimodal

> **multimodal**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:294](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L294)

Multimodal search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### raptor

> **raptor**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:288](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L288)

RAPTOR tree search diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`

***

### rerank

> **rerank**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:298](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L298)

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

Defined in: [packages/agentos/src/rag/unified/types.ts:300](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L300)

Deep research diagnostics.

#### chunkCount

> **chunkCount**: `number`

#### durationMs

> **durationMs**: `number`
