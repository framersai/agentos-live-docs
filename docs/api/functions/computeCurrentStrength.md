# Function: computeCurrentStrength()

> **computeCurrentStrength**(`trace`, `now`): `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:31](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/decay/DecayModel.ts#L31)

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
