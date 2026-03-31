# Function: detectPartiallyRetrieved()

> **detectPartiallyRetrieved**(`candidates`, `now`): [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:155](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/decay/RetrievalPriorityScorer.ts#L155)

Detect partially-accessible memories (high relevance but low strength).
These are memories the agent "almost" remembers — like tip-of-the-tongue states.

## Parameters

### candidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

### now

`number`

## Returns

[`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]
