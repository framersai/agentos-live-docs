# Interface: IAudioGenerator

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:61](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L61)

Abstraction over an audio generation backend (Suno, Udio, Stable Audio,
ElevenLabs, Replicate, etc.).

## Capability negotiation

Not every provider supports every sub-modality. The [supports](#supports) method
lets callers (and the [FallbackAudioProxy](../classes/FallbackAudioProxy.md)) query whether a given
capability is available before invoking it.

## Lifecycle

1. Construct the provider.
2. Call [initialize](#initialize) with provider-specific configuration (API keys,
   base URLs, etc.).
3. Use [generateMusic](#generatemusic) and/or [generateSFX](#generatesfx).
4. Optionally call [shutdown](#shutdown) to release resources.

## Example

```typescript
const suno: IAudioGenerator = new SunoProvider();
await suno.initialize({ apiKey: process.env.SUNO_API_KEY! });

if (suno.supports('music')) {
  const result = await suno.generateMusic({ prompt: 'Ambient piano loop' });
  console.log(result.audio[0].url);
}

await suno.shutdown?.();
```

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:69](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L69)

Default model used when the request omits `modelId`.

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:66](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L66)

Whether [initialize](#initialize) has been called successfully.

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L63)

Unique identifier for this provider (e.g. `'suno'`, `'elevenlabs-sfx'`).

## Methods

### generateMusic()

> **generateMusic**(`request`): `Promise`\<[`AudioResult`](AudioResult.md)\>

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:88](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L88)

Generate music from a text prompt.

Providers that do not support music generation should throw an error
and have [supports](#supports) return `false` for `'music'`.

#### Parameters

##### request

[`MusicGenerateRequest`](MusicGenerateRequest.md)

The music generation parameters.

#### Returns

`Promise`\<[`AudioResult`](AudioResult.md)\>

A result envelope containing one or more generated audio clips.

***

### generateSFX()?

> `optional` **generateSFX**(`request`): `Promise`\<[`AudioResult`](AudioResult.md)\>

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:100](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L100)

Generate a sound effect from a text prompt.

This method is optional — providers that do not support SFX generation
should either omit it or have [supports](#supports) return `false` for
`'sfx'`.

#### Parameters

##### request

[`SFXGenerateRequest`](SFXGenerateRequest.md)

The SFX generation parameters.

#### Returns

`Promise`\<[`AudioResult`](AudioResult.md)\>

A result envelope containing one or more generated audio clips.

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:77](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L77)

Initialise the provider with runtime configuration.

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

Provider-specific key/value pairs (API keys, endpoints,
  model overrides, etc.).

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:114](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L114)

Release any resources held by the provider (HTTP connections, polling
loops, temp files, etc.).

#### Returns

`Promise`\<`void`\>

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [packages/agentos/src/media/audio/IAudioGenerator.ts:108](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/audio/IAudioGenerator.ts#L108)

Query whether this provider supports a given capability.

#### Parameters

##### capability

The capability to check (`'music'` or `'sfx'`).

`"music"` | `"sfx"`

#### Returns

`boolean`

`true` if the provider can handle the requested capability.
