# Function: computeCurrentStrength()

> **computeCurrentStrength**(`trace`, `now`): `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:31](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/decay/DecayModel.ts#L31)

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
