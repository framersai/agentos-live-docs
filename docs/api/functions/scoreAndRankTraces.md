# Function: scoreAndRankTraces()

> **scoreAndRankTraces**(`candidates`, `context`): [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:99](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/decay/RetrievalPriorityScorer.ts#L99)

Score a batch of candidate traces and return them sorted by priority.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### context

[`ScoringContext`](../interfaces/ScoringContext.md)

## Returns

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]
