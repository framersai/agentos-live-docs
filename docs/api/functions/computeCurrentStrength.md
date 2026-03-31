# Function: computeCurrentStrength()

> **computeCurrentStrength**(`trace`, `now`): `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/decay/DecayModel.ts#L31)

Compute the current effective strength of a memory trace using the
Ebbinghaus forgetting curve:

  S(t) = S₀ · e^(-Δt / stability)

where Δt = now - lastAccessedAt.

## Parameters

### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

### now

`number`

## Returns

`number`
