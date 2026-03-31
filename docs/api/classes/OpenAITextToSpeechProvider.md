# Class: OpenAITextToSpeechProvider

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L132)

Text-to-speech provider that uses the OpenAI TTS API.

## API Contract

- **Endpoint:** `POST {baseUrl}/audio/speech`
- **Authentication:** `Authorization: Bearer <apiKey>`
- **Content-Type:** `application/json`
- **Request body:** `{ model, voice, input, response_format, speed }`
- **Response:** Raw audio bytes in the requested format

## Models

- `tts-1` — Optimized for real-time, lower latency, slightly lower quality
- `tts-1-hd` — Higher quality at the cost of additional latency

## Voice Listing

OpenAI's voice catalog is static (6 voices), so `listAvailableVoices()`
returns a hardcoded list from `OPENAI_VOICES` without making an API call.

## See

 - [OpenAITextToSpeechProviderConfig](../interfaces/OpenAITextToSpeechProviderConfig.md) for configuration options
 - [OpenAIWhisperSpeechToTextProvider](OpenAIWhisperSpeechToTextProvider.md) for the corresponding STT provider

## Example

```ts
const provider = new OpenAITextToSpeechProvider({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'tts-1',
  voice: 'nova',
});
const result = await provider.synthesize('Hello!', { speed: 1.1 });
```

## Implements

- [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

## Constructors

### Constructor

> **new OpenAITextToSpeechProvider**(`config`): `OpenAITextToSpeechProvider`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:161](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L161)

Creates a new OpenAITextToSpeechProvider.

#### Parameters

##### config

[`OpenAITextToSpeechProviderConfig`](../interfaces/OpenAITextToSpeechProviderConfig.md)

Provider configuration including API key and optional defaults.

#### Returns

`OpenAITextToSpeechProvider`

#### Example

```ts
const provider = new OpenAITextToSpeechProvider({
  apiKey: 'sk-xxxx',
  voice: 'shimmer',
});
```

## Properties

### displayName

> `readonly` **displayName**: `"OpenAI TTS"` = `'OpenAI TTS'`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L137)

Human-readable display name for UI and logging.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`displayName`](../interfaces/TextToSpeechProvider.md#displayname)

***

### id

> `readonly` **id**: `"openai-tts"` = `'openai-tts'`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L134)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`id`](../interfaces/TextToSpeechProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `true` = `true`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:143](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L143)

Streaming is supported — the OpenAI API streams audio bytes as they
are generated, enabling low-latency playback pipelines.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`supportsStreaming`](../interfaces/TextToSpeechProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:175](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L175)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'OpenAI TTS'`.

#### Example

```ts
provider.getProviderName(); // 'OpenAI TTS'
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`getProviderName`](../interfaces/TextToSpeechProvider.md#getprovidername)

***

### listAvailableVoices()

> **listAvailableVoices**(): `Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:259](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L259)

Returns the static list of available OpenAI TTS voices.

Unlike other providers (ElevenLabs, Azure) that require an API call to
list voices, OpenAI's voice catalog is fixed and hardcoded. This method
returns a shallow copy to prevent external mutation.

#### Returns

`Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

A promise resolving to the 6 built-in OpenAI voice options.

#### Example

```ts
const voices = await provider.listAvailableVoices();
const defaultVoice = voices.find(v => v.isDefault); // 'nova'
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`listAvailableVoices`](../interfaces/TextToSpeechProvider.md#listavailablevoices)

***

### synthesize()

> **synthesize**(`text`, `options?`): `Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:198](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/providers/OpenAITextToSpeechProvider.ts#L198)

Synthesizes speech from text using the OpenAI TTS API.

#### Parameters

##### text

`string`

The text to convert to audio. Maximum 4096 characters.

##### options?

[`SpeechSynthesisOptions`](../interfaces/SpeechSynthesisOptions.md) = `{}`

Optional synthesis settings including voice, model,
  output format, and speed (0.25–4.0 range).

#### Returns

`Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

A promise resolving to the audio buffer and metadata.

#### Throws

When the OpenAI API returns a non-2xx status code.
  Common causes: invalid API key (401), rate limit (429), text too long (400).

#### Example

```ts
const result = await provider.synthesize('Hello world', {
  voice: 'alloy',
  speed: 1.2,
  outputFormat: 'opus',
});
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`synthesize`](../interfaces/TextToSpeechProvider.md#synthesize)
