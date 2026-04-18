# Function: createVideoProvider()

> **createVideoProvider**(`providerId`): [`IVideoGenerator`](../interfaces/IVideoGenerator.md)

Defined in: [packages/agentos/src/media/video/index.ts:70](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/index.ts#L70)

Create a video provider instance by provider ID.

Looks up the factory in the registry and returns a new uninitialised
provider. The caller must call `provider.initialize(config)` before use.

## Parameters

### providerId

`string`

Provider identifier (e.g. `"runway"`, `"replicate"`, `"fal"`).

## Returns

[`IVideoGenerator`](../interfaces/IVideoGenerator.md)

A new uninitialised [IVideoGenerator](../interfaces/IVideoGenerator.md) instance.

## Throws

When no factory is registered for the given provider ID.
