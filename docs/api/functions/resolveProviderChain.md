# Function: resolveProviderChain()

> **resolveProviderChain**(`available`, `preferences?`): `string`[]

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:174](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/ProviderPreferences.ts#L174)

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
