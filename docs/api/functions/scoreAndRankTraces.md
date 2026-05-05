# Function: scoreAndRankTraces()

> **scoreAndRankTraces**(`candidates`, `context`): [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:105](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L105)

Score a batch of candidate traces and return them sorted by priority.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### context

[`ScoringContext`](../interfaces/ScoringContext.md)

## Returns

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]
