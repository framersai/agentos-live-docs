# Function: findPrunableTraces()

> **findPrunableTraces**(`traces`, `now`, `config?`): `string`[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/decay/DecayModel.ts#L215)

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
