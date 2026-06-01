# Function: registerVideoProviderFactory()

> **registerVideoProviderFactory**(`providerId`, `factory`): `void`

Defined in: [packages/agentos/src/io/media/video/index.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/video/index.ts#L53)

Register a video provider factory for a given provider ID.

Use this to add third-party or custom video providers at runtime.
Built-in providers (runway, replicate, fal) are pre-registered.

## Parameters

### providerId

`string`

Unique identifier for the provider (lowercased for matching).

### factory

[`VideoProviderFactory`](../type-aliases/VideoProviderFactory.md)

Factory function that creates a new uninitialised provider instance.

## Returns

`void`
