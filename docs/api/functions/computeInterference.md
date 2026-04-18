# Function: computeInterference()

> **computeInterference**(`similarities`, `config?`): [`InterferenceResult`](../interfaces/InterferenceResult.md)

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:128](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/decay/DecayModel.ts#L128)

Compute interference effects when a new trace is encoded alongside
existing similar traces.

- **Proactive interference**: Old similar traces impair new encoding
  (reduce new trace's initial strength).
- **Retroactive interference**: New trace weakens old similar traces
  (reduce their encoding strength).

Similarity is provided externally (cosine similarity of embeddings).

## Parameters

### similarities

`object`[]

Array of { traceId, similarity } for existing traces.

### config?

[`DecayConfig`](../interfaces/DecayConfig.md) = `DEFAULT_DECAY_CONFIG`

Decay configuration with interference threshold.

## Returns

[`InterferenceResult`](../interfaces/InterferenceResult.md)
