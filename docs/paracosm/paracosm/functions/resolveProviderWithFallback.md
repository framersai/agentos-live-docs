# Function: resolveProviderWithFallback()

> **resolveProviderWithFallback**(`requested`, `options?`): `ResolvedProviderChoice`

Defined in: [apps/paracosm/src/engine/provider/resolver.ts:88](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/resolver.ts#L88)

Return the provider to actually use. When the requested provider has
no key available, fall through to the next provider that does. Throws
`ProviderKeyMissingError` if no supported provider is configured.

## Parameters

### requested

`LlmProvider`

### options?

`ResolveProviderOptions` = `{}`

## Returns

`ResolvedProviderChoice`
