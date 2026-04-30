# Interface: ResolvedProviderChoice

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:65](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L65)

## Properties

### fellBack

> **fellBack**: `boolean`

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:69](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L69)

True when the returned provider differs from what the caller requested.

***

### provider

> **provider**: [`LlmProvider`](../type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:67](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L67)

The provider to actually use for this run.

***

### requested

> **requested**: [`LlmProvider`](../type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/engine/provider-resolver.ts:71](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/provider-resolver.ts#L71)

The provider the caller originally asked for.
