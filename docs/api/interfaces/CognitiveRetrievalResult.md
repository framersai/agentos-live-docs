# Interface: CognitiveRetrievalResult

Defined in: [packages/agentos/src/memory/core/types.ts:249](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L249)

## Properties

### diagnostics

> **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:252](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L252)

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

#### retrievedTypedTraces?

> `optional` **retrievedTypedTraces**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Stage E: optional Hindsight typed-network output as canonical-shaped
scored traces. When the manager is configured with `typedNetwork` and
the variant supports retrieval-side activation (`'full'`), the manager
delegates to a `TypedNetworkRetriever` which performs seed-finding
(proper-noun + quoted-string entity extraction, case-insensitive
intersection), spreading activation, and top-K ranking. Top-K results
are surfaced as `ScoredMemoryTrace[]` for drop-in compatibility with
the canonical retrieval pipeline (bank-prefixed content, namespaced
IDs `typed-network:<factId>`, sourceType `'typed_network'`).

Absent when typed-network is not configured. Empty when the retriever
found no seed matches in the typed-network store.

Phase 4.3 MVP: surfaced in diagnostics but NOT merged into the primary
`retrieved` ranking. Phase 4.4 fusion lands when consumers wire the
merged ranking. See `2026-04-26-hindsight-4network-observer-design.md`.

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

### partiallyRetrieved

> **partiallyRetrieved**: [`PartiallyRetrievedTrace`](PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/memory/core/types.ts:251](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L251)

***

### retrieved

> **retrieved**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/types.ts:250](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L250)
