# Class: OpenAIWhisperSpeechToTextProvider

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:146](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L146)

Speech-to-text provider that uses the OpenAI Whisper transcription API.

## API Contract

- **Endpoint:** `POST {baseUrl}/audio/transcriptions`
- **Authentication:** `Authorization: Bearer <apiKey>`
- **Content-Type:** `multipart/form-data` (FormData with file blob)
- **Response format:** Controlled by the `response_format` field; defaults
  to `verbose_json` which includes segments, language detection, and duration.

## Supported Response Formats

- `verbose_json` — Full JSON with segments, duration, and language (default)
- `json` — Minimal JSON with just the text
- `text` — Plain text response (no JSON)
- `srt` — SubRip subtitle format
- `vtt` — WebVTT subtitle format

When `text`, `srt`, or `vtt` format is used, the response is returned as
plain text and segments are not available.

## See

[OpenAIWhisperSpeechToTextProviderConfig](../interfaces/OpenAIWhisperSpeechToTextProviderConfig.md) for configuration options
See `normalizeSegments()` for the segment normalization logic.

## Example

```ts
const provider = new OpenAIWhisperSpeechToTextProvider({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'whisper-1',
});
const result = await provider.transcribe(
  { data: audioBuffer, mimeType: 'audio/wav', fileName: 'recording.wav' },
  { language: 'en', responseFormat: 'verbose_json' },
);
```

## Implements

- [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

## Constructors

### Constructor

> **new OpenAIWhisperSpeechToTextProvider**(`config`): `OpenAIWhisperSpeechToTextProvider`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:175](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L175)

#### Parameters

##### config

[`OpenAIWhisperSpeechToTextProviderConfig`](../interfaces/OpenAIWhisperSpeechToTextProviderConfig.md)

#### Returns

`OpenAIWhisperSpeechToTextProvider`

## Properties

### displayName

> `readonly` **displayName**: `"OpenAI Whisper"` = `'OpenAI Whisper'`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L151)

Human-readable display name for UI and logging.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`displayName`](../interfaces/SpeechToTextProvider.md#displayname)

***

### id

> `readonly` **id**: `"openai-whisper"` = `'openai-whisper'`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:148](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L148)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`id`](../interfaces/SpeechToTextProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `false` = `false`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:154](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L154)

Whisper API is batch-only; streaming requires a WebSocket adapter.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`supportsStreaming`](../interfaces/SpeechToTextProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:190](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L190)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'OpenAI Whisper'`.

#### Example

```ts
provider.getProviderName(); // 'OpenAI Whisper'
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`getProviderName`](../interfaces/SpeechToTextProvider.md#getprovidername)

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:216](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L216)

Transcribes an audio buffer using the OpenAI Whisper API.

The audio is sent as a multipart form upload with the file, model, and
optional parameters (language, prompt, temperature, response_format).

#### Parameters

##### audio

[`SpeechAudioInput`](../interfaces/SpeechAudioInput.md)

Raw audio data and metadata. The `data` buffer is wrapped
  in a Blob and sent as a form file field. If `fileName` is not provided,
  a default name is generated from the `format` field.

##### options?

[`SpeechTranscriptionOptions`](../interfaces/SpeechTranscriptionOptions.md) = `{}`

Optional transcription settings including language hint,
  context prompt, temperature for sampling, and response format.

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

A promise resolving to the normalized transcription result.

#### Throws

When the OpenAI API returns a non-2xx status code.

#### Example

```ts
const result = await provider.transcribe(
  { data: mp3Buffer, mimeType: 'audio/mpeg', fileName: 'voice.mp3' },
  { language: 'fr', prompt: 'Discussion about AI' },
);
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`transcribe`](../interfaces/SpeechToTextProvider.md#transcribe)
