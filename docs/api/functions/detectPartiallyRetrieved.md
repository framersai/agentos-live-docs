# Function: detectPartiallyRetrieved()

> **detectPartiallyRetrieved**(`candidates`, `now`): [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/cognition/memory/core/decay/RetrievalPriorityScorer.ts:161](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/decay/RetrievalPriorityScorer.ts#L161)

Detect partially-accessible memories (high relevance but low strength).
These are memories the agent "almost" remembers — like tip-of-the-tongue states.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### now

`number`

## Returns

[`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]
