# Function: computeEmotionalCongruence()

> **computeEmotionalCongruence**(`currentMood`, `traceValence`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:73](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L73)

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
