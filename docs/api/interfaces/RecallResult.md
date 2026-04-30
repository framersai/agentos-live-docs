# Interface: RecallResult

Defined in: [packages/agentos/src/memory/AgentMemory.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/AgentMemory.ts#L71)

## Properties

### diagnostics

> **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:77](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/AgentMemory.ts#L77)

Retrieval diagnostics.

#### candidatesScanned

> **candidatesScanned**: `number`

#### confidence?

> `optional` **confidence**: `RetrievalConfidenceSummary`

#### escalations?

> `optional` **escalations**: `string`[]

#### factSupersession?

> `optional` **factSupersession**: `object`

Step-5: post-retrieve FactSupersession pass diagnostics.
Populated only when a bench adapter or downstream consumer
ran `FactSupersession.resolve()` over the retrieved traces.

##### factSupersession.droppedIds

> **droppedIds**: `string`[]

##### factSupersession.llmLatencyMs

> **llmLatencyMs**: `number`

##### factSupersession.notes?

> `optional` **notes**: `string`[]

##### factSupersession.parseOk

> **parseOk**: `boolean`

#### hyde?

> `optional` **hyde**: `object`

Step-4: when a `HybridRetriever` runs with a `hydeRetriever`
attached, the first ~120 chars of the generated hypothesis
are surfaced here for post-hoc analysis of which queries
benefited from expansion.

##### hyde.hypothesis

> **hypothesis**: `string`

#### policyProfile?

> `optional` **policyProfile**: [`MemoryRetrievalProfile`](../type-aliases/MemoryRetrievalProfile.md)

#### scoringTimeMs

> **scoringTimeMs**: `number`

#### splitOnAmbiguous?

> `optional` **splitOnAmbiguous**: `object`

Step-6: when `HybridRetriever` runs with `splitAmbiguousThreshold`
set, the bottom fraction of traces by first-pass rerank score
are split at sentence boundaries and rescored. Replacements are
recorded here for post-hoc analysis.

##### splitOnAmbiguous.candidateCount

> **candidateCount**: `number`

##### splitOnAmbiguous.replacedIds

> **replacedIds**: `string`[]

##### splitOnAmbiguous.threshold

> **threshold**: `number`

#### stageIds?

> `optional` **stageIds**: `object`

Per-stage ranked trace IDs for the hybrid retrieval pipeline
(dense → sparse → merged → reranked → final). Populated by
`HybridRetriever` so downstream consumers can compute per-stage
retrieval-quality metrics (Recall@K, NDCG@K, MRR) and attribute
losses to the stage that caused them. Absent for non-hybrid
retrieval paths.

##### stageIds.dense

> **dense**: `string`[]

##### stageIds.final

> **final**: `string`[]

##### stageIds.merged

> **merged**: `string`[]

##### stageIds.reranked

> **reranked**: `string`[]

##### stageIds.sparse

> **sparse**: `string`[]

#### suppressed?

> `optional` **suppressed**: `"weak_hits"`

#### totalTimeMs

> **totalTimeMs**: `number`

#### vectorSearchTimeMs

> **vectorSearchTimeMs**: `number`

***

### memories

> **memories**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/AgentMemory.ts#L73)

Relevant memory traces sorted by relevance.

***

### partial

> **partial**: [`PartiallyRetrievedTrace`](PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:75](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/AgentMemory.ts#L75)

Partially retrieved traces (tip-of-the-tongue).
