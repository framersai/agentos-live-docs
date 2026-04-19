# Class: ElevenLabsTextToSpeechProvider

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L97)

Text-to-speech provider that uses the ElevenLabs TTS API.

## API Contract

- **Endpoint:** `POST {baseUrl}/text-to-speech/{voiceId}`
- **Authentication:** `xi-api-key: <apiKey>` header
- **Content-Type:** `application/json`
- **Accept:** `audio/mpeg` (MP3 response)
- **Request body:** `{ text, model_id, voice_settings: { stability, similarity_boost, style, use_speaker_boost } }`
- **Response:** Raw MP3 audio bytes

## Voice Settings

ElevenLabs exposes fine-grained voice control via `voice_settings`:
- **stability** (0.0–1.0) — Lower values = more expressive/variable, higher = more consistent
- **similarity_boost** (0.0–1.0) — Higher values make output more similar to the original voice
- **style** (0.0–1.0) — Style exaggeration (optional, only for v2+ models)
- **use_speaker_boost** (boolean) — Enhances speaker similarity (default: true)

These can be passed via `options.providerSpecificOptions`.

## Voice ID Resolution

The voice ID is resolved with the following priority:
1. `options.voice` (per-call override)
2. `config.voiceId` (constructor default)
3. `options.providerSpecificOptions.voiceId` (legacy override path)
4. `'EXAVITQu4vr4xnSDxMaL'` (hardcoded fallback — the "Sarah" voice)

## Voice Listing

[listAvailableVoices](#listavailablevoices) fetches the user's voice library from the
`/voices` endpoint and maps each entry to the normalized [SpeechVoice](../interfaces/SpeechVoice.md)
shape. Returns an empty array on API errors (graceful degradation).

## See

[ElevenLabsTextToSpeechProviderConfig](../interfaces/ElevenLabsTextToSpeechProviderConfig.md) for configuration options

## Example

```ts
const provider = new ElevenLabsTextToSpeechProvider({
  apiKey: process.env.ELEVENLABS_API_KEY!,
  voiceId: 'pNInz6obpgDQGcFmaJgB', // "Adam"
});
const result = await provider.synthesize('Hello world', {
  providerSpecificOptions: { stability: 0.7, similarityBoost: 0.8 },
});
```

## Implements

- [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

## Constructors

### Constructor

> **new ElevenLabsTextToSpeechProvider**(`config`): `ElevenLabsTextToSpeechProvider`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L130)

Creates a new ElevenLabsTextToSpeechProvider.

#### Parameters

##### config

[`ElevenLabsTextToSpeechProviderConfig`](../interfaces/ElevenLabsTextToSpeechProviderConfig.md)

Provider configuration including API key and optional defaults.

#### Returns

`ElevenLabsTextToSpeechProvider`

#### Example

```ts
const provider = new ElevenLabsTextToSpeechProvider({
  apiKey: 'xi-xxxx',
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  model: 'eleven_multilingual_v2',
});
```

## Properties

### displayName

> `readonly` **displayName**: `"ElevenLabs"` = `'ElevenLabs'`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L102)

Human-readable display name for UI and logging.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`displayName`](../interfaces/TextToSpeechProvider.md#displayname)

***

### id

> `readonly` **id**: `"elevenlabs"` = `'elevenlabs'`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:99](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L99)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`id`](../interfaces/TextToSpeechProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `true` = `true`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L108)

Streaming is supported — ElevenLabs offers a WebSocket streaming endpoint,
and even the REST endpoint can be consumed as a stream.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`supportsStreaming`](../interfaces/TextToSpeechProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:145](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L145)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'ElevenLabs'`.

#### Example

```ts
provider.getProviderName(); // 'ElevenLabs'
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`getProviderName`](../interfaces/TextToSpeechProvider.md#getprovidername)

***

### listAvailableVoices()

> **listAvailableVoices**(): `Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:275](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L275)

Fetches the user's voice library from the ElevenLabs API.

Returns available voices mapped to the normalized [SpeechVoice](../interfaces/SpeechVoice.md) shape.
Gracefully returns an empty array on API errors (e.g. network failure,
invalid key) to avoid breaking voice selection UIs.

The voice library includes both ElevenLabs' pre-made voices and any
custom/cloned voices in the user's account.

#### Returns

`Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

A promise resolving to an array of available voices, or an empty
  array if the API call fails.

#### Example

```ts
const voices = await provider.listAvailableVoices();
const rachel = voices.find(v => v.name === 'Rachel');
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`listAvailableVoices`](../interfaces/TextToSpeechProvider.md#listavailablevoices)

***

### synthesize()

> **synthesize**(`text`, `options?`): `Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:173](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L173)

Synthesizes speech from text using the ElevenLabs TTS API.

#### Parameters

##### text

`string`

The text to convert to audio.

##### options?

[`SpeechSynthesisOptions`](../interfaces/SpeechSynthesisOptions.md) = `{}`

Optional synthesis settings. Use `providerSpecificOptions`
  to control ElevenLabs-specific voice settings (stability, similarityBoost,
  style, useSpeakerBoost).

#### Returns

`Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

A promise resolving to the MP3 audio buffer and metadata.

#### Throws

When the ElevenLabs API returns a non-2xx status code.
  Common causes: invalid API key (401), voice not found (404),
  character limit exceeded (400), or rate limit (429).

#### Example

```ts
const result = await provider.synthesize('Hello there!', {
  voice: 'pNInz6obpgDQGcFmaJgB',
  providerSpecificOptions: {
    stability: 0.3,       // More expressive
    similarityBoost: 0.9, // Closer to original voice
    style: 0.5,           // Moderate style exaggeration
  },
});
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`synthesize`](../interfaces/TextToSpeechProvider.md#synthesize)
