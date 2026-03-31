# Function: findPrunableTraces()

> **findPrunableTraces**(`traces`, `now`, `config?`): `string`[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:215](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L215)

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
