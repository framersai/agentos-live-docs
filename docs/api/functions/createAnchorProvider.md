# Function: createAnchorProvider()

> **createAnchorProvider**(`target?`): [`AnchorProvider`](../interfaces/AnchorProvider.md)

Defined in: [packages/agentos/src/provenance/anchoring/providers/createAnchorProvider.ts:56](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/anchoring/providers/createAnchorProvider.ts#L56)

Create an AnchorProvider from an AnchorTarget configuration.
Returns NoneProvider when target is undefined or type is 'none'.

For external provider types (rekor, ethereum, opentimestamps, worm-snapshot),
the corresponding factory must first be registered via `registerAnchorProviderFactory()`.

The `@framers/agentos-ext-anchor-providers` extension package provides
a `registerExtensionProviders()` function that registers all curated external providers.

## Parameters

### target?

[`AnchorTarget`](../interfaces/AnchorTarget.md)

## Returns

[`AnchorProvider`](../interfaces/AnchorProvider.md)

## See

https://github.com/framersai/agentos-extensions/tree/master/registry/curated/provenance/anchor-providers
