# Interface: ResolveProviderOptions

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:74](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L74)

## Properties

### apiKey?

> `optional` **apiKey**: `string` \| `null`

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:76](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L76)

Explicit apiKey disables env inspection for the requested provider.

***

### env?

> `optional` **env**: `ProcessEnv`

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:78](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L78)

Inject env for tests. Defaults to `process.env` when available.

***

### silent?

> `optional` **silent**: `boolean`

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:80](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L80)

Suppress the fallback warning log (tests, library callers).
