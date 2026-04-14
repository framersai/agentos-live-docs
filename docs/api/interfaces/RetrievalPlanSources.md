# Interface: RetrievalPlanSources

Defined in: [packages/agentos/src/rag/unified/types.ts:169](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L169)

Flags controlling which retrieval sources are queried.

## See

RetrievalPlan.sources

## Properties

### bm25

> **bm25**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:173](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L173)

BM25 sparse keyword search. Default: true — catches exact term matches.

***

### graph

> **graph**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:175](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L175)

GraphRAG entity/relationship traversal. Default: true for moderate+.

***

### memory

> **memory**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:179](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L179)

Cognitive memory (episodic/semantic/procedural). Default: true for simple+.

***

### multimodal

> **multimodal**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:181](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L181)

Multimodal content (images/audio/video). Default: false unless modalities include non-text.

***

### raptor

> **raptor**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:177](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L177)

RAPTOR hierarchical summary tree. Default: true for moderate+.

***

### vector

> **vector**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:171](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L171)

Dense vector similarity search. Default: true for all strategies except 'none'.
