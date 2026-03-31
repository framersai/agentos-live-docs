# Class: AzureSpeechSTTProvider

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:156](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L156)

Speech-to-text provider that uses the Azure Cognitive Services Speech REST API.

## Azure REST Endpoint Format

The endpoint URL follows this pattern:
```
https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={lang}
```

- `{region}` — The Azure region from config (e.g. `eastus`, `westeurope`).
- `{lang}` — BCP-47 language code from options or `'en-US'` default.
- The `/conversation/` path segment selects the conversation recognition mode
  (as opposed to `/interactive/` or `/dictation/`).

## Authentication: `Ocp-Apim-Subscription-Key`

Azure Cognitive Services uses the `Ocp-Apim-Subscription-Key` HTTP header
for authentication, which differs from the typical `Authorization: Bearer`
pattern. The subscription key is sent as a plain-text header value — no
"Bearer" or "Token" prefix.

An alternative is to use a short-lived token from the token endpoint, but
this provider uses the simpler key-based approach for reliability.

## NoMatch Handling

When Azure's recognizer detects audio but cannot identify any speech, it
returns `RecognitionStatus: 'NoMatch'` instead of raising an HTTP error.
This provider maps `NoMatch` to an empty-text result (`text: ''`) with
`isFinal: true`, matching the Azure Speech SDK's behaviour. This prevents
the fallback proxy from unnecessarily trying another provider when the
audio genuinely contains no speech.

## Limitations

- Audio must be PCM WAV format. The `Content-Type` is hardcoded to
  `audio/wav` regardless of the `audio.mimeType` value.
- Streaming is not supported — use the Azure Speech SDK for real-time STT.
- Speaker diarization is not available via the REST API.

## See

 - [AzureSpeechSTTProviderConfig](../interfaces/AzureSpeechSTTProviderConfig.md) for configuration options
 - [AzureSpeechTTSProvider](AzureSpeechTTSProvider.md) for the corresponding TTS provider

## Example

```ts
const provider = new AzureSpeechSTTProvider({
  key: process.env.AZURE_SPEECH_KEY!,
  region: 'eastus',
});
const result = await provider.transcribe(
  { data: wavBuffer, mimeType: 'audio/wav' },
  { language: 'de-DE' },
);
console.log(result.text); // '' if no speech detected
```

## Implements

- [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

## Constructors

### Constructor

> **new AzureSpeechSTTProvider**(`config`): `AzureSpeechSTTProvider`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:182](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L182)

Creates a new AzureSpeechSTTProvider.

#### Parameters

##### config

[`AzureSpeechSTTProviderConfig`](../interfaces/AzureSpeechSTTProviderConfig.md)

Provider configuration including the subscription key and region.

#### Returns

`AzureSpeechSTTProvider`

#### Example

```ts
const provider = new AzureSpeechSTTProvider({
  key: 'your-azure-subscription-key',
  region: 'eastus',
});
```

## Properties

### displayName

> `readonly` **displayName**: `"Azure Speech (STT)"` = `'Azure Speech (STT)'`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:161](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L161)

Human-readable display name for UI and logging.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`displayName`](../interfaces/SpeechToTextProvider.md#displayname)

***

### id

> `readonly` **id**: `"azure-speech-stt"` = `'azure-speech-stt'`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L158)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`id`](../interfaces/SpeechToTextProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `false` = `false`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L164)

This provider uses synchronous HTTP requests, not WebSocket streaming.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`supportsStreaming`](../interfaces/SpeechToTextProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:196](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L196)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'Azure Speech (STT)'`.

#### Example

```ts
provider.getProviderName(); // 'Azure Speech (STT)'
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`getProviderName`](../interfaces/SpeechToTextProvider.md#getprovidername)

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:226](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L226)

Transcribes an audio buffer using the Azure Speech recognition REST endpoint.

Sends the raw audio as PCM WAV and returns a normalized result. Azure's
`NoMatch` status is treated as an empty transcript (not an error).

#### Parameters

##### audio

[`SpeechAudioInput`](../interfaces/SpeechAudioInput.md)

Raw audio data. Azure expects PCM WAV format; the
  Content-Type header is always set to `'audio/wav'` regardless of
  `audio.mimeType`.

##### options?

[`SpeechTranscriptionOptions`](../interfaces/SpeechTranscriptionOptions.md) = `{}`

Optional transcription settings. Only `language` is
  supported by the Azure REST endpoint.

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

A promise resolving to the normalized transcription result.

#### Throws

When the Azure API returns a non-2xx HTTP status code.
  The error message includes the status and response body text.

#### Example

```ts
const result = await provider.transcribe(
  { data: wavBuffer, durationSeconds: 5 },
  { language: 'fr-FR' },
);
if (result.text === '') {
  console.log('No speech detected in the audio');
}
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`transcribe`](../interfaces/SpeechToTextProvider.md#transcribe)
