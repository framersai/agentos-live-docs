# Function: registerVideoProviderFactory()

> **registerVideoProviderFactory**(`providerId`, `factory`): `void`

Defined in: [packages/agentos/src/media/video/index.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/index.ts#L53)

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
