# Function: registerVideoProviderFactory()

> **registerVideoProviderFactory**(`providerId`, `factory`): `void`

Defined in: [packages/agentos/src/media/video/index.ts:53](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/video/index.ts#L53)

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
