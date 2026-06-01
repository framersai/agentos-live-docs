# Function: computeCurrentStrength()

> **computeCurrentStrength**(`trace`, `now`): `number`

Defined in: [packages/agentos/src/cognition/memory/core/decay/DecayModel.ts:31](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/decay/DecayModel.ts#L31)

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
