# Class: DeepgramBatchSTTProvider

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:181](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L181)

Speech-to-text provider that uses the Deepgram batch (pre-recorded) REST API.

## REST API Contract

- **Endpoint:** `POST https://api.deepgram.com/v1/listen`
- **Authentication:** `Authorization: Token <apiKey>` header
- **Content-Type:** Set to the audio's MIME type (e.g. `audio/wav`)
- **Body:** Raw audio bytes sent directly (no multipart form)
- **Query parameters:** `model`, `punctuate`, `diarize`, `language`
- **Response:** JSON containing `results.channels[].alternatives[]` with
  transcript text, confidence scores, and optional word-level timing

## Word-Level Diarization Mapping

When `enableSpeakerDiarization` is `true`, the `diarize=true` query parameter
is set. Deepgram then includes a `speaker` field (zero-based integer index) on
each word in the response. These speaker indices are preserved through the
`wordsToSegments()` mapping into the normalized result.

## Error Handling

Non-2xx responses from Deepgram trigger an `Error` with the HTTP status code
and response body text included in the message for debugging. Network-level
errors (DNS failures, timeouts) propagate as-is from the fetch implementation.

Streaming is NOT supported by this provider — use a Deepgram WebSocket adapter
for real-time transcription.

## See

[DeepgramBatchSTTProviderConfig](../interfaces/DeepgramBatchSTTProviderConfig.md) for configuration options
See `wordsToSegments()` for the word-to-segment mapping logic.

## Example

```ts
const provider = new DeepgramBatchSTTProvider({
  apiKey: process.env.DEEPGRAM_API_KEY!,
  model: 'nova-2',
});
const result = await provider.transcribe(
  { data: audioBuffer, mimeType: 'audio/wav' },
  { enableSpeakerDiarization: true },
);
console.log(result.text);
console.log(result.segments?.map(s => `[Speaker ${s.speaker}] ${s.text}`));
```

## Implements

- [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

## Constructors

### Constructor

> **new DeepgramBatchSTTProvider**(`config`): `DeepgramBatchSTTProvider`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:210](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L210)

#### Parameters

##### config

[`DeepgramBatchSTTProviderConfig`](../interfaces/DeepgramBatchSTTProviderConfig.md)

#### Returns

`DeepgramBatchSTTProvider`

## Properties

### displayName

> `readonly` **displayName**: `"Deepgram (Batch)"` = `'Deepgram (Batch)'`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:186](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L186)

Human-readable display name for UI and logging.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`displayName`](../interfaces/SpeechToTextProvider.md#displayname)

***

### id

> `readonly` **id**: `"deepgram-batch"` = `'deepgram-batch'`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:183](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L183)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`id`](../interfaces/SpeechToTextProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `false` = `false`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:189](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L189)

This provider uses synchronous HTTP requests, not WebSocket streaming.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`supportsStreaming`](../interfaces/SpeechToTextProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L225)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'Deepgram (Batch)'`.

#### Example

```ts
provider.getProviderName(); // 'Deepgram (Batch)'
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`getProviderName`](../interfaces/SpeechToTextProvider.md#getprovidername)

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:253](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/DeepgramBatchSTTProvider.ts#L253)

Transcribes an audio buffer using the Deepgram pre-recorded API.

Sends the raw audio bytes as the request body (not multipart form) with
the appropriate Content-Type header. The response is parsed and normalized
into a [SpeechTranscriptionResult](../interfaces/SpeechTranscriptionResult.md).

#### Parameters

##### audio

[`SpeechAudioInput`](../interfaces/SpeechAudioInput.md)

Raw audio data and associated metadata (buffer, MIME type,
  duration). The `data` buffer is sent directly as the request body.

##### options?

[`SpeechTranscriptionOptions`](../interfaces/SpeechTranscriptionOptions.md) = `{}`

Optional transcription settings. Supports `model`,
  `language`, and `enableSpeakerDiarization` overrides.

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

A promise resolving to the normalized transcription result with
  text, confidence, timing, and optional speaker-attributed segments.

#### Throws

When the Deepgram API returns a non-2xx status code.
  The error message includes the HTTP status and response body for debugging.

#### Example

```ts
const result = await provider.transcribe(
  { data: wavBuffer, mimeType: 'audio/wav', durationSeconds: 5.2 },
  { language: 'fr-FR', enableSpeakerDiarization: true },
);
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`transcribe`](../interfaces/SpeechToTextProvider.md#transcribe)
