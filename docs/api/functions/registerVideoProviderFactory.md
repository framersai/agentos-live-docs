# Function: registerVideoProviderFactory()

> **registerVideoProviderFactory**(`providerId`, `factory`): `void`

Defined in: [packages/agentos/src/media/video/index.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/index.ts#L53)

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
