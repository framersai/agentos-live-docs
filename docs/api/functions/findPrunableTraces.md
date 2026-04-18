# Function: findPrunableTraces()

> **findPrunableTraces**(`traces`, `now`, `config?`): `string`[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:215](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/decay/DecayModel.ts#L215)

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
