# Function: resolveProviderWithFallback()

> **resolveProviderWithFallback**(`requested`, `options?`): `ResolvedProviderChoice`

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:88](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-resolver.ts#L88)

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
