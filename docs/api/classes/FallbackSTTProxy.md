# Class: FallbackSTTProxy

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:89](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L89)

A [SpeechToTextProvider](../interfaces/SpeechToTextProvider.md) that wraps an ordered chain of STT providers
and implements automatic failover.

## Retry Chain Logic

Providers are tried left-to-right (index 0 first, then 1, etc.). The first
successful transcription result is returned immediately. When a provider
throws:

- **If it is NOT the last provider:** The error is caught, a
  `provider_fallback` event is emitted on the shared `EventEmitter`,
  and the next provider is tried. Errors are caught per-provider so that a
  single API outage doesn't block the entire pipeline.

- **If it IS the last provider:** The error is re-thrown to the caller,
  since there are no more fallbacks to try.

- **If the chain is empty:** An `Error('No providers in fallback chain')`
  is thrown immediately.

## Why Errors are Caught Per-Provider

Each provider in the chain operates independently. A Deepgram API key
expiration should not prevent OpenAI Whisper from transcribing the same
audio. Catching errors per-provider ensures maximum availability at the
cost of slightly increased latency when early providers fail.

## See

[ProviderFallbackEvent](../interfaces/ProviderFallbackEvent.md) for the event payload shape
See `SpeechProviderResolver.resolveSTT()` for how this proxy is created.

## Example

```ts
const proxy = new FallbackSTTProxy([whisperProvider, deepgramProvider], emitter);
const result = await proxy.transcribe(audio);
// If whisperProvider fails, deepgramProvider is tried automatically.
```

## Implements

- [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

## Constructors

### Constructor

> **new FallbackSTTProxy**(`chain`, `emitter`): `FallbackSTTProxy`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:127](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L127)

Creates a new FallbackSTTProxy wrapping the given provider chain.

#### Parameters

##### chain

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)[]

Ordered list of STT providers to try. Must contain at least
  one entry for `transcribe()` to succeed, though an empty chain is allowed
  at construction time (it will always throw on transcribe).

##### emitter

`EventEmitter`

EventEmitter on which `provider_fallback` events are
  published. Typically the [SpeechProviderResolver](SpeechProviderResolver.md) instance.

#### Returns

`FallbackSTTProxy`

#### Example

```ts
const proxy = new FallbackSTTProxy(
  [primaryProvider, fallbackProvider],
  resolver, // extends EventEmitter
);
```

## Properties

### displayName

> `readonly` **displayName**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:100](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L100)

Human-readable name showing the full chain for debugging and logging.
Format: `"Fallback STT (provider1 -> provider2 -> ...)"`.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`displayName`](../interfaces/SpeechToTextProvider.md#displayname)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:94](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L94)

Unique identifier derived from the first provider in the chain.
Falls back to `'fallback-stt'` for empty chains to avoid undefined access.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`id`](../interfaces/SpeechToTextProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `boolean`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L108)

Whether the proxy supports streaming. Only `true` when the first
(primary) provider supports streaming — fallback providers' streaming
capabilities are not considered because mid-stream provider switching
is not supported.

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`supportsStreaming`](../interfaces/SpeechToTextProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:203](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L203)

Returns the human-readable name of the primary (first) provider in the chain.

#### Returns

`string`

The provider name string, or `'fallback'` if the chain is empty.

#### Example

```ts
proxy.getProviderName(); // 'OpenAI Whisper' (from the first chain entry)
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`getProviderName`](../interfaces/SpeechToTextProvider.md#getprovidername)

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/FallbackProxy.ts#L159)

Attempt transcription using each provider in the chain in order.

Emits a `provider_fallback` event (typed as [ProviderFallbackEvent](../interfaces/ProviderFallbackEvent.md))
whenever a non-final provider throws. Re-throws the last provider's error
when the entire chain is exhausted.

#### Parameters

##### audio

[`SpeechAudioInput`](../interfaces/SpeechAudioInput.md)

The audio input to transcribe.

##### options?

[`SpeechTranscriptionOptions`](../interfaces/SpeechTranscriptionOptions.md)

Optional transcription settings (language, model, etc.).

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](../interfaces/SpeechTranscriptionResult.md)\>

The transcription result from the first provider that succeeds.

#### Throws

`'No providers in fallback chain'` when the chain is empty.

#### Throws

The last provider's error when all providers in the chain fail.

#### Example

```ts
const result = await proxy.transcribe(
  { data: wavBuffer, mimeType: 'audio/wav' },
  { language: 'en-US' },
);
```

#### Implementation of

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md).[`transcribe`](../interfaces/SpeechToTextProvider.md#transcribe)
