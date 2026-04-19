# Function: createAudioProvider()

> **createAudioProvider**(`providerId`): [`IAudioGenerator`](../interfaces/IAudioGenerator.md)

Defined in: [packages/agentos/src/media/audio/index.ts:86](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/index.ts#L86)

Create an audio provider instance by provider ID.

Looks up the factory in the registry and returns a new uninitialised
provider. The caller must call `provider.initialize(config)` before use.

## Parameters

### providerId

`string`

Provider identifier (e.g. `"suno"`, `"stable-audio"`, `"elevenlabs-sfx"`).

## Returns

[`IAudioGenerator`](../interfaces/IAudioGenerator.md)

A new uninitialised [IAudioGenerator](../interfaces/IAudioGenerator.md) instance.

## Throws

When no factory is registered for the given provider ID.
