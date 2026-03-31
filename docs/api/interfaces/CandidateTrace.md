# Interface: CandidateTrace

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:88](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/RetrievalPriorityScorer.ts#L88)

## Properties

### graphActivation?

> `optional` **graphActivation**: `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:93](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/RetrievalPriorityScorer.ts#L93)

Activation level from spreading activation (0-1). 0 if graph not available.

***

### trace

> **trace**: [`MemoryTrace`](MemoryTrace.md)

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:89](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/RetrievalPriorityScorer.ts#L89)

***

### vectorSimilarity

> **vectorSimilarity**: `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/RetrievalPriorityScorer.ts#L91)

Cosine similarity from vector search (0-1).
