# Function: computeEmotionalCongruence()

> **computeEmotionalCongruence**(`currentMood`, `traceValence`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/decay/RetrievalPriorityScorer.ts#L67)

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
