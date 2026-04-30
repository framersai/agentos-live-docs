# Class: AssemblyAISTTProvider

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:203](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L203)

Speech-to-text provider that uses the AssemblyAI async transcription API.

## Three-Step Workflow

AssemblyAI uses an asynchronous transcription pipeline that requires three
sequential HTTP requests:

1. **Upload** — `POST /v2/upload` sends the raw audio bytes to AssemblyAI's
   CDN and returns an `upload_url`. This step is necessary because the
   transcript endpoint accepts URLs, not raw audio.

2. **Submit** — `POST /v2/transcript` creates a transcription job referencing
   the upload URL. Returns a transcript `id` used for polling. Optional
   features like `speaker_labels` are enabled in this request's JSON body.

3. **Poll** — `GET /v2/transcript/:id` is called every `POLL_INTERVAL_MS`
   (1 second) until the transcript `status` transitions to `'completed'` or
   `'error'`. The polling loop is bounded by `DEFAULT_TIMEOUT_MS`
   (120 seconds) to prevent indefinite waiting.

## AbortController Usage

An optional `AbortSignal` can be passed via
`options.providerSpecificOptions.signal` to cancel the transcription at any
point. The signal is forwarded to all three fetch calls and also checked at
the top of each polling iteration. When aborted, an error is thrown
immediately without waiting for the current fetch to complete.

## Error Handling

- Non-2xx responses at any step throw an `Error` with the HTTP status and body.
- `status === 'error'` on the transcript throws with AssemblyAI's error message.
- Timeout expiry throws with the transcript ID for manual inspection.
- Aborted signals throw with a descriptive cancellation message.

## See

[AssemblyAISTTProviderConfig](../interfaces/AssemblyAISTTProviderConfig.md) for configuration options
See `AssemblyAITranscript` for the polling response shape.

## Example

```ts
const provider = new AssemblyAISTTProvider({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

// Basic transcription
const result = await provider.transcribe({ data: audioBuffer });

// With diarization and cancellation support
const controller = new AbortController();
const result = await provider.transcribe(
  { data: audioBuffer },
  {
    enableSpeakerDiarization: true,
    providerSpecificOptions: { signal: controller.signal },
  },
);
```

## Implements

- [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

## Constructors

### Constructor

> **new AssemblyAISTTProvider**(`config`): `AssemblyAISTTProvider`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L234)

#### Parameters

##### config

[`AssemblyAISTTProviderConfig`](../interfaces/AssemblyAISTTProviderConfig.md)

#### Returns

`AssemblyAISTTProvider`

## Properties

### displayName

> `readonly` **displayName**: `"AssemblyAI"` = `'AssemblyAI'`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:208](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L208)

Human-readable display name for UI and logging.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`displayName`](../interfaces/SpeechToTextProvider.md#displayname)

***

### id

> `readonly` **id**: `"assemblyai"` = `'assemblyai'`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:205](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L205)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`id`](../interfaces/SpeechToTextProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `false` = `false`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L215)

Streaming is not supported by this provider's async pipeline.
AssemblyAI does offer a separate real-time streaming API via WebSocket,
but that would be a different provider implementation.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`supportsStreaming`](../interfaces/SpeechToTextProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:249](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L249)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'AssemblyAI'`.

#### Example

```ts
provider.getProviderName(); // 'AssemblyAI'
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`getProviderName`](../interfaces/SpeechToTextProvider.md#getprovidername)

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:282](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L282)

Transcribes an audio buffer via the AssemblyAI three-step async pipeline:
upload, submit, and poll.

#### Parameters

##### audio

[`SpeechAudioInput`](../interfaces/SpeechAudioInput.md)

Raw audio data and associated metadata. The `data` buffer
  is uploaded to AssemblyAI's CDN in step 1.

##### options?

[`SpeechTranscriptionOptions`](../interfaces/SpeechTranscriptionOptions.md) = `{}`

Optional transcription settings. Pass
  `providerSpecificOptions.signal` (an `AbortSignal`) to cancel
  at any point in the pipeline.

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

A promise resolving to the normalized transcription result.

#### Throws

When the upload API returns a non-2xx status.

#### Throws

When the transcript submit API returns a non-2xx status.

#### Throws

When the polling API returns a non-2xx status.

#### Throws

When the transcript status becomes `'error'` (includes
  AssemblyAI's error message, e.g. "Audio file could not be decoded").

#### Throws

When the 120-second timeout is exceeded (includes the
  transcript ID for manual inspection via the AssemblyAI dashboard).

#### Throws

When the caller's AbortSignal is triggered.

#### Example

```ts
const result = await provider.transcribe(
  { data: wavBuffer, mimeType: 'audio/wav' },
  { enableSpeakerDiarization: true, language: 'en' },
);
console.log(result.text);
console.log(result.segments?.map(s => `[${s.speaker}] ${s.text}`));
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`transcribe`](../interfaces/SpeechToTextProvider.md#transcribe)
