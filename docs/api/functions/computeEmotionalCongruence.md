# Function: computeEmotionalCongruence()

> **computeEmotionalCongruence**(`currentMood`, `traceValence`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/decay/RetrievalPriorityScorer.ts#L67)

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
