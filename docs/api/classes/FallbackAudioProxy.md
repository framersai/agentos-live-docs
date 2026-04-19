# Class: FallbackAudioProxy

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L108)

An [IAudioGenerator](../interfaces/IAudioGenerator.md) that wraps an ordered chain of audio providers
and implements automatic failover for every operation.

## Retry chain logic

Providers are tried left-to-right (index 0 first). The first provider
that succeeds returns immediately. When a provider throws:

- **If it is NOT the last provider:** an `audio:generate:fallback` event is
  emitted and the next provider is tried.
- **If it IS the last provider:** an `AggregateError` containing every
  collected error is thrown.
- **If the chain is empty:** an `Error('No providers in audio fallback chain')`
  is thrown immediately.

For `generateMusic`, providers whose [IAudioGenerator.supports](../interfaces/IAudioGenerator.md#supports) returns
`false` for `'music'` are silently skipped. For `generateSFX`, providers
that don't support `'sfx'` (or lack the method entirely) are skipped.

## Implements

- [`IAudioGenerator`](../interfaces/IAudioGenerator.md)

## Constructors

### Constructor

> **new FallbackAudioProxy**(`chain`, `emitter`): `FallbackAudioProxy`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L134)

Creates a new FallbackAudioProxy wrapping the given provider chain.

#### Parameters

##### chain

[`IAudioGenerator`](../interfaces/IAudioGenerator.md)[]

Ordered list of audio providers to try. Must contain at
  least one entry for operations to succeed (an empty chain always throws).

##### emitter

`EventEmitter`

EventEmitter on which `audio:generate:fallback` events
  are published so callers can observe the failover path.

#### Returns

`FallbackAudioProxy`

#### Example

```ts
const proxy = new FallbackAudioProxy(
  [sunoProvider, stableAudioProvider],
  new EventEmitter(),
);
```

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:116](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L116)

Default model from the first provider, if set.

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`defaultModelId`](../interfaces/IAudioGenerator.md#defaultmodelid)

***

### isInitialized

> `readonly` **isInitialized**: `boolean` = `true`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:113](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L113)

Always `true` — the proxy is ready as soon as it is constructed.

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`isInitialized`](../interfaces/IAudioGenerator.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:110](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L110)

Identifier derived from the first provider in the chain.

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`providerId`](../interfaces/IAudioGenerator.md#providerid)

## Methods

### generateMusic()

> **generateMusic**(`request`): `Promise`\<[`AudioResult`](../interfaces/AudioResult.md)\>

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:185](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L185)

Generate music from a text prompt, falling back through the provider
chain on failure.

Providers whose [IAudioGenerator.supports](../interfaces/IAudioGenerator.md#supports) returns `false` for
`'music'` are silently skipped.

#### Parameters

##### request

[`MusicGenerateRequest`](../interfaces/MusicGenerateRequest.md)

The generation request forwarded to each provider.

#### Returns

`Promise`\<[`AudioResult`](../interfaces/AudioResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider in the chain fails.

#### Throws

When the chain is empty.

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`generateMusic`](../interfaces/IAudioGenerator.md#generatemusic)

***

### generateSFX()

> **generateSFX**(`request`): `Promise`\<[`AudioResult`](../interfaces/AudioResult.md)\>

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:215](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L215)

Generate a sound effect from a text prompt, falling back through providers
that support SFX.

Providers whose [IAudioGenerator.supports](../interfaces/IAudioGenerator.md#supports) returns `false` for
`'sfx'` or that lack the `generateSFX` method are silently skipped.

#### Parameters

##### request

[`SFXGenerateRequest`](../interfaces/SFXGenerateRequest.md)

The SFX request forwarded to each capable provider.

#### Returns

`Promise`\<[`AudioResult`](../interfaces/AudioResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider fails or does not support SFX.

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`generateSFX`](../interfaces/IAudioGenerator.md#generatesfx)

***

### initialize()

> **initialize**(`_config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:150](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L150)

No-op initialisation — individual providers in the chain should already
be initialised before being passed to the proxy.

#### Parameters

##### \_config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`initialize`](../interfaces/IAudioGenerator.md#initialize)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:239](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L239)

Shuts down all providers in the chain. Errors are caught per-provider
so a single provider's failure does not prevent the others from
cleaning up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`shutdown`](../interfaces/IAudioGenerator.md#shutdown)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/audio/FallbackAudioProxy.ts#L165)

Returns `true` if at least one provider in the chain supports the
given capability.

#### Parameters

##### capability

The capability to query (`'music'` or `'sfx'`).

`"music"` | `"sfx"`

#### Returns

`boolean`

#### Implementation of

[`IAudioGenerator`](../interfaces/IAudioGenerator.md).[`supports`](../interfaces/IAudioGenerator.md#supports)
