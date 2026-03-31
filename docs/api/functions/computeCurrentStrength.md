# Function: computeCurrentStrength()

> **computeCurrentStrength**(`trace`, `now`): `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:31](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L31)

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
