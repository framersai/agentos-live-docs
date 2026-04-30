# Function: registerAudioProviderFactory()

> **registerAudioProviderFactory**(`providerId`, `factory`): `void`

Defined in: [packages/agentos/src/media/audio/index.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/index.ts#L69)

Register an audio provider factory for a given provider ID.

Use this to add third-party or custom audio providers at runtime.
Built-in providers (suno, udio, stable-audio, elevenlabs-sfx,
musicgen-local, audiogen-local, replicate-audio, fal-audio) are
pre-registered.

## Parameters

### providerId

`string`

Unique identifier for the provider (lowercased for matching).

### factory

[`AudioProviderFactory`](../type-aliases/AudioProviderFactory.md)

Factory function that creates a new uninitialised provider instance.

## Returns

`void`
