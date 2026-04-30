# Function: computeEmotionalCongruence()

> **computeEmotionalCongruence**(`currentMood`, `traceValence`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/decay/RetrievalPriorityScorer.ts#L73)

Mood-congruent recall: current mood biases retrieval toward memories
with matching emotional valence.

congruence = 1 + max(0, currentValence · traceValence) · 0.25

## Parameters

### currentMood

[`PADState`](../interfaces/PADState.md)

### traceValence

`number`

## Returns

`number`
