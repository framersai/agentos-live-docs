# Function: resolveProviderWithFallback()

> **resolveProviderWithFallback**(`requested`, `options?`): [`ResolvedProviderChoice`](../interfaces/ResolvedProviderChoice.md)

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:88](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-resolver.ts#L88)

Return the provider to actually use. When the requested provider has
no key available, fall through to the next provider that does. Throws
`ProviderKeyMissingError` if no supported provider is configured.

## Parameters

### requested

[`LlmProvider`](../type-aliases/LlmProvider.md)

### options?

[`ResolveProviderOptions`](../interfaces/ResolveProviderOptions.md) = `{}`

## Returns

[`ResolvedProviderChoice`](../interfaces/ResolvedProviderChoice.md)
