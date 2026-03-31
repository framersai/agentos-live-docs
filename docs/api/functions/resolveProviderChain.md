# Function: resolveProviderChain()

> **resolveProviderChain**(`available`, `preferences?`): `string`[]

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:174](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/ProviderPreferences.ts#L174)

Resolve a full provider chain from the available providers and preferences.

This combines deterministic filtering/reordering via
[resolveProviderOrder](resolveProviderOrder.md) with optional weighted primary selection via
[selectWeightedProvider](selectWeightedProvider.md). When `weights` are present, a single primary
provider is chosen from the ordered list and moved to the front while the
remaining providers preserve their relative order as fallbacks.

## Parameters

### available

`string`[]

Provider IDs currently available in the system.

### preferences?

[`MediaProviderPreference`](../interfaces/MediaProviderPreference.md)

Optional preference configuration.

## Returns

`string`[]

Ordered provider chain with the chosen primary first.
