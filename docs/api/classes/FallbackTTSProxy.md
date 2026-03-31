# Class: FallbackTTSProxy

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:239](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L239)

A [TextToSpeechProvider](../interfaces/TextToSpeechProvider.md) that wraps an ordered chain of TTS providers
and implements automatic failover.

## Retry Chain Logic

Identical to [FallbackSTTProxy](FallbackSTTProxy.md): providers are tried left-to-right,
the first successful synthesis result is returned, and `provider_fallback`
events are emitted on each intermediate failure.

## Voice Listing

Voice listing is delegated to the first provider in the chain that exposes
a `listAvailableVoices()` method. If no provider supports this, an empty
array is returned. This is a best-effort approach — the voice list may not
reflect the provider that actually handles synthesis if the primary fails.

## See

[ProviderFallbackEvent](../interfaces/ProviderFallbackEvent.md) for the event payload shape
See `SpeechProviderResolver.resolveTTS()` for how this proxy is created.

## Example

```ts
const proxy = new FallbackTTSProxy([elevenlabsProvider, openaiTtsProvider], emitter);
const audio = await proxy.synthesize('Hello world');
// If ElevenLabs fails, OpenAI TTS is tried automatically.
```

## Implements

- [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

## Constructors

### Constructor

> **new FallbackTTSProxy**(`chain`, `emitter`): `FallbackTTSProxy`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:272](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L272)

Creates a new FallbackTTSProxy wrapping the given provider chain.

#### Parameters

##### chain

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)[]

Ordered list of TTS providers to try.

##### emitter

`EventEmitter`

EventEmitter on which `provider_fallback` events are published.

#### Returns

`FallbackTTSProxy`

#### Example

```ts
const proxy = new FallbackTTSProxy(
  [elevenlabsProvider, openaiTtsProvider],
  resolver,
);
```

## Properties

### displayName

> `readonly` **displayName**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:250](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L250)

Human-readable name showing the full chain for debugging and logging.
Format: `"Fallback TTS (provider1 -> provider2 -> ...)"`.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`displayName`](../interfaces/TextToSpeechProvider.md#displayname)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:244](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L244)

Unique identifier derived from the first provider in the chain.
Falls back to `'fallback-tts'` for empty chains.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`id`](../interfaces/TextToSpeechProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `boolean`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:256](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L256)

Whether the proxy supports streaming. Only reflects the first provider's
capability — see `FallbackSTTProxy.supportsStreaming` for rationale.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`supportsStreaming`](../interfaces/TextToSpeechProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:338](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L338)

Returns the human-readable name of the primary (first) provider.

#### Returns

`string`

The provider name string, or `'fallback'` if the chain is empty.

#### Example

```ts
proxy.getProviderName(); // 'ElevenLabs' (from the first chain entry)
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`getProviderName`](../interfaces/TextToSpeechProvider.md#getprovidername)

***

### listAvailableVoices()

> **listAvailableVoices**(): `Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:361](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L361)

Returns the voice list from the first provider in the chain that supports
`listAvailableVoices()`.

Iterates through the chain looking for any provider that implements this
optional method. Returns an empty array when no provider supports voice
listing. This is a best-effort approach — if the primary provider fails
during synthesis and a fallback provider handles it, the returned voice
list may not match the provider that actually produced the audio.

#### Returns

`Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

A promise resolving to an array of available voices, or an empty
  array if no provider in the chain supports voice listing.

#### Example

```ts
const voices = await proxy.listAvailableVoices();
// voices from the first provider that implements the method
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`listAvailableVoices`](../interfaces/TextToSpeechProvider.md#listavailablevoices)

***

### synthesize()

> **synthesize**(`text`, `options?`): `Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:299](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/FallbackProxy.ts#L299)

Attempt synthesis using each provider in the chain in order.

Emits a `provider_fallback` event (typed as [ProviderFallbackEvent](../interfaces/ProviderFallbackEvent.md))
whenever a non-final provider throws. Re-throws the last provider's error
when the entire chain is exhausted.

#### Parameters

##### text

`string`

The text to synthesize into speech.

##### options?

[`SpeechSynthesisOptions`](../interfaces/SpeechSynthesisOptions.md)

Optional synthesis settings (voice, speed, format, etc.).

#### Returns

`Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

The synthesis result from the first provider that succeeds.

#### Throws

`'No providers in fallback chain'` when the chain is empty.

#### Throws

The last provider's error when all providers in the chain fail.

#### Example

```ts
const result = await proxy.synthesize('Hello world', { voice: 'nova' });
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`synthesize`](../interfaces/TextToSpeechProvider.md#synthesize)
