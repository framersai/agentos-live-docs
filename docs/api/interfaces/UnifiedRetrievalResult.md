# Interface: UnifiedRetrievalResult

Defined in: [packages/agentos/src/rag/unified/types.ts:258](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L258)

Result returned by the UnifiedRetriever after executing a RetrievalPlan.

Contains the merged, reranked chunks from all queried sources along with
diagnostics about which sources contributed and how long each took.

## See

UnifiedRetriever.retrieve

## Properties

### chunks

> **chunks**: [`RetrievedChunk`](RetrievedChunk.md)[]

Defined in: [packages/agentos/src/rag/unified/types.ts:260](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L260)

Merged and reranked content chunks, sorted by relevance (highest first).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:276](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L276)

Total wall-clock duration of the retrieval in milliseconds.

***

### memoryCacheHit

> **memoryCacheHit**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:279](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L279)

Whether a memory cache hit was used (episodic memory shortcut).

***

### plan

> **plan**: [`RetrievalPlan`](RetrievalPlan.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:270](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L270)

The plan that was executed to produce this result.

***

### policyDiagnostics?

> `optional` **policyDiagnostics**: `object`

Defined in: [packages/agentos/src/rag/unified/types.ts:282](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L282)

Optional policy-level diagnostics when retrieval was policy-driven.

#### confidence

> **confidence**: `RetrievalConfidenceSummary`

#### escalations

> **escalations**: `string`[]

#### policy

> **policy**: [`ResolvedMemoryRetrievalPolicy`](ResolvedMemoryRetrievalPolicy.md)

***

### researchSynthesis?

> `optional` **researchSynthesis**: `string`

Defined in: [packages/agentos/src/rag/unified/types.ts:267](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L267)

Research synthesis narrative when deep research was performed.
Present only when the plan's `deepResearch` flag was true and
a deep research callback was available.

***

### sourceDiagnostics

> **sourceDiagnostics**: [`SourceDiagnostics`](SourceDiagnostics.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:273](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L273)

Per-source diagnostics showing contributions and timing.
