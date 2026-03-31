# Class: SpeechProviderAdapter

Defined in: [packages/agentos/src/rag/multimodal/SpeechProviderAdapter.ts:77](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/multimodal/SpeechProviderAdapter.ts#L77)

Bridges the voice-pipeline's `SpeechToTextProvider` to the multimodal
indexer's `ISpeechToTextProvider` interface.

Converts raw `Buffer` audio into the `SpeechAudioInput` shape expected
by voice providers, forwards the language hint through
`SpeechTranscriptionOptions`, and extracts the plain transcript text
from the rich `SpeechTranscriptionResult`.

## Example

```typescript
const whisper = resolver.resolveSTT();
const adapted = new SpeechProviderAdapter(whisper);

// Now usable by the multimodal indexer:
const text = await adapted.transcribe(audioBuffer, 'en');
```

## Implements

- [`ISpeechToTextProvider`](../interfaces/ISpeechToTextProvider.md)

## Constructors

### Constructor

> **new SpeechProviderAdapter**(`provider`, `defaultMimeType?`): `SpeechProviderAdapter`

Defined in: [packages/agentos/src/rag/multimodal/SpeechProviderAdapter.ts:109](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/multimodal/SpeechProviderAdapter.ts#L109)

Create a new adapter wrapping a voice-pipeline STT provider.

#### Parameters

##### provider

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

A configured `SpeechToTextProvider` instance
  (e.g. Whisper, Deepgram, AssemblyAI, Azure Speech).

##### defaultMimeType?

`string` = `'audio/wav'`

MIME type to assume for raw audio buffers.
  Defaults to `'audio/wav'` which is accepted by all major STT
  providers. Override to `'audio/mpeg'` or `'audio/ogg'` when
  indexing MP3/OGG files.

#### Returns

`SpeechProviderAdapter`

#### Throws

If provider is null or undefined.

#### Example

```typescript
const adapter = new SpeechProviderAdapter(whisperProvider);
const mp3Adapter = new SpeechProviderAdapter(whisperProvider, 'audio/mpeg');
```

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/rag/multimodal/SpeechProviderAdapter.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/multimodal/SpeechProviderAdapter.ts#L164)

Get the display name of the underlying STT provider.

Useful for logging and diagnostics — lets callers identify which
voice-pipeline provider is actually handling transcription.

#### Returns

`string`

The provider's display name or ID string.

#### Example

```typescript
console.log(`STT via: ${adapter.getProviderName()}`); // "openai-whisper"
```

***

### transcribe()

> **transcribe**(`audio`, `language?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/rag/multimodal/SpeechProviderAdapter.ts:140](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/multimodal/SpeechProviderAdapter.ts#L140)

Transcribe audio data to text.

Wraps the raw buffer in a `SpeechAudioInput` and delegates to the
underlying voice-pipeline provider. The rich transcription result
is reduced to the plain text string that the multimodal indexer
needs for embedding generation.

#### Parameters

##### audio

`Buffer`

Raw audio data as a Buffer (WAV, MP3, OGG, etc.).

##### language?

`string`

Optional BCP-47 language code hint for improved
  transcription accuracy (e.g. `'en'`, `'es'`, `'ja'`).

#### Returns

`Promise`\<`string`\>

The transcribed text content.

#### Throws

If the underlying STT provider fails.

#### Example

```typescript
const transcript = await adapter.transcribe(wavBuffer);
const spanishTranscript = await adapter.transcribe(audioBuffer, 'es');
```

#### Implementation of

[`ISpeechToTextProvider`](../interfaces/ISpeechToTextProvider.md).[`transcribe`](../interfaces/ISpeechToTextProvider.md#transcribe)
