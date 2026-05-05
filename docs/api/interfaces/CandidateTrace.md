# Interface: CandidateTrace

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L94)

## Properties

### graphActivation?

> `optional` **graphActivation**: `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:99](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L99)

Activation level from spreading activation (0-1). 0 if graph not available.

***

### trace

> **trace**: [`MemoryTrace`](MemoryTrace.md)

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:95](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L95)

***

### vectorSimilarity

> **vectorSimilarity**: `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:97](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L97)

Cosine similarity from vector search (0-1).
