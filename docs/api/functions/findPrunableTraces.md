# Function: findPrunableTraces()

> **findPrunableTraces**(`traces`, `now`, `config?`): `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/decay/DecayModel.ts:215](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/decay/DecayModel.ts#L215)

Identify traces that have decayed below the pruning threshold.
These should be soft-deleted (isActive = false).

## Parameters

### traces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

### now

`number`

### config?

[`DecayConfig`](../interfaces/DecayConfig.md) = `DEFAULT_DECAY_CONFIG`

## Returns

`string`[]
