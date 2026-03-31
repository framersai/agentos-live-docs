# Interface: UnifiedRetrievalResult

Defined in: [packages/agentos/src/rag/unified/types.ts:251](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L251)

Result returned by the UnifiedRetriever after executing a RetrievalPlan.

Contains the merged, reranked chunks from all queried sources along with
diagnostics about which sources contributed and how long each took.

## See

UnifiedRetriever.retrieve

## Properties

### chunks

> **chunks**: [`RetrievedChunk`](RetrievedChunk.md)[]

Defined in: [packages/agentos/src/rag/unified/types.ts:253](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L253)

Merged and reranked content chunks, sorted by relevance (highest first).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:269](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L269)

Total wall-clock duration of the retrieval in milliseconds.

***

### memoryCacheHit

> **memoryCacheHit**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:272](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L272)

Whether a memory cache hit was used (episodic memory shortcut).

***

### plan

> **plan**: [`RetrievalPlan`](RetrievalPlan.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:263](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L263)

The plan that was executed to produce this result.

***

### researchSynthesis?

> `optional` **researchSynthesis**: `string`

Defined in: [packages/agentos/src/rag/unified/types.ts:260](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L260)

Research synthesis narrative when deep research was performed.
Present only when the plan's `deepResearch` flag was true and
a deep research callback was available.

***

### sourceDiagnostics

> **sourceDiagnostics**: [`SourceDiagnostics`](SourceDiagnostics.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:266](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L266)

Per-source diagnostics showing contributions and timing.
