# Interface: RetrievalPlanSources

Defined in: [packages/agentos/src/rag/unified/types.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L171)

Flags controlling which retrieval sources are queried.

## See

RetrievalPlan.sources

## Properties

### bm25

> **bm25**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:175](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L175)

BM25 sparse keyword search. Default: true — catches exact term matches.

***

### graph

> **graph**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:177](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L177)

GraphRAG entity/relationship traversal. Default: true for moderate+.

***

### memory

> **memory**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:181](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L181)

Cognitive memory (episodic/semantic/procedural). Default: true for simple+.

***

### multimodal

> **multimodal**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:183](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L183)

Multimodal content (images/audio/video). Default: false unless modalities include non-text.

***

### raptor

> **raptor**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:179](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L179)

RAPTOR hierarchical summary tree. Default: true for moderate+.

***

### vector

> **vector**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L173)

Dense vector similarity search. Default: true for all strategies except 'none'.
