# Function: scoreAndRankTraces()

> **scoreAndRankTraces**(`candidates`, `context`): [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:99](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/decay/RetrievalPriorityScorer.ts#L99)

Score a batch of candidate traces and return them sorted by priority.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### context

[`ScoringContext`](../interfaces/ScoringContext.md)

## Returns

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]
