# Interface: UnifiedRetrievalResult

Defined in: [packages/agentos/src/rag/unified/types.ts:256](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L256)

Result returned by the UnifiedRetriever after executing a RetrievalPlan.

Contains the merged, reranked chunks from all queried sources along with
diagnostics about which sources contributed and how long each took.

## See

UnifiedRetriever.retrieve

## Properties

### chunks

> **chunks**: [`RetrievedChunk`](RetrievedChunk.md)[]

Defined in: [packages/agentos/src/rag/unified/types.ts:258](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L258)

Merged and reranked content chunks, sorted by relevance (highest first).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:274](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L274)

Total wall-clock duration of the retrieval in milliseconds.

***

### memoryCacheHit

> **memoryCacheHit**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:277](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L277)

Whether a memory cache hit was used (episodic memory shortcut).

***

### plan

> **plan**: [`RetrievalPlan`](RetrievalPlan.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:268](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L268)

The plan that was executed to produce this result.

***

### researchSynthesis?

> `optional` **researchSynthesis**: `string`

Defined in: [packages/agentos/src/rag/unified/types.ts:265](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L265)

Research synthesis narrative when deep research was performed.
Present only when the plan's `deepResearch` flag was true and
a deep research callback was available.

***

### sourceDiagnostics

> **sourceDiagnostics**: [`SourceDiagnostics`](SourceDiagnostics.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:271](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/unified/types.ts#L271)

Per-source diagnostics showing contributions and timing.
