# Function: scoreAndRankTraces()

> **scoreAndRankTraces**(`candidates`, `context`): [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/decay/RetrievalPriorityScorer.ts#L105)

Score a batch of candidate traces and return them sorted by priority.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### context

[`ScoringContext`](../interfaces/ScoringContext.md)

## Returns

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]
