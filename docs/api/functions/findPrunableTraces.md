# Function: findPrunableTraces()

> **findPrunableTraces**(`traces`, `now`, `config?`): `string`[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:215](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/DecayModel.ts#L215)

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
