# Class: FallbackVideoProxy

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L108)

An [IVideoGenerator](../interfaces/IVideoGenerator.md) that wraps an ordered chain of video providers
and implements automatic failover for every operation.

## Retry chain logic

Providers are tried left-to-right (index 0 first). The first provider
that succeeds returns immediately. When a provider throws:

- **If it is NOT the last provider:** a `video:generate:fallback` event is
  emitted and the next provider is tried.
- **If it IS the last provider:** an `AggregateError` containing every
  collected error is thrown.
- **If the chain is empty:** an `Error('No providers in video fallback chain')`
  is thrown immediately.

For the optional `imageToVideo` operation, providers whose
[IVideoGenerator.supports](../interfaces/IVideoGenerator.md#supports) returns `false` for `'image-to-video'`
are silently skipped, since they are structurally incapable rather than
transiently failing.

## Implements

- [`IVideoGenerator`](../interfaces/IVideoGenerator.md)

## Constructors

### Constructor

> **new FallbackVideoProxy**(`chain`, `emitter`): `FallbackVideoProxy`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:134](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L134)

Creates a new FallbackVideoProxy wrapping the given provider chain.

#### Parameters

##### chain

[`IVideoGenerator`](../interfaces/IVideoGenerator.md)[]

Ordered list of video providers to try. Must contain at
  least one entry for operations to succeed (an empty chain always throws).

##### emitter

`EventEmitter`

EventEmitter on which `video:generate:fallback` events
  are published so callers can observe the failover path.

#### Returns

`FallbackVideoProxy`

#### Example

```ts
const proxy = new FallbackVideoProxy(
  [runwayProvider, pikaProvider],
  new EventEmitter(),
);
```

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L116)

Default model from the first provider, if set.

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`defaultModelId`](../interfaces/IVideoGenerator.md#defaultmodelid)

***

### isInitialized

> `readonly` **isInitialized**: `boolean` = `true`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:113](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L113)

Always `true` — the proxy is ready as soon as it is constructed.

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`isInitialized`](../interfaces/IVideoGenerator.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L110)

Identifier derived from the first provider in the chain.

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`providerId`](../interfaces/IVideoGenerator.md#providerid)

## Methods

### generateVideo()

> **generateVideo**(`request`): `Promise`\<[`VideoResult`](../interfaces/VideoResult.md)\>

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:182](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L182)

Generate a video from a text prompt, falling back through the provider
chain on failure.

#### Parameters

##### request

[`VideoGenerateRequest`](../interfaces/VideoGenerateRequest.md)

The generation request forwarded to each provider.

#### Returns

`Promise`\<[`VideoResult`](../interfaces/VideoResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider in the chain fails.

#### Throws

When the chain is empty.

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`generateVideo`](../interfaces/IVideoGenerator.md#generatevideo)

***

### imageToVideo()

> **imageToVideo**(`request`): `Promise`\<[`VideoResult`](../interfaces/VideoResult.md)\>

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:204](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L204)

Generate a video from a source image, falling back through providers
that support image-to-video.

Providers whose [IVideoGenerator.supports](../interfaces/IVideoGenerator.md#supports) returns `false` for
`'image-to-video'` are silently skipped.

#### Parameters

##### request

[`ImageToVideoRequest`](../interfaces/ImageToVideoRequest.md)

The image-to-video request forwarded to each capable provider.

#### Returns

`Promise`\<[`VideoResult`](../interfaces/VideoResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider fails or does not support image-to-video.

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`imageToVideo`](../interfaces/IVideoGenerator.md#imagetovideo)

***

### initialize()

> **initialize**(`_config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L150)

No-op initialisation — individual providers in the chain should already
be initialised before being passed to the proxy.

#### Parameters

##### \_config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`initialize`](../interfaces/IVideoGenerator.md#initialize)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:228](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L228)

Shuts down all providers in the chain. Errors are caught per-provider
so a single provider's failure does not prevent the others from
cleaning up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`shutdown`](../interfaces/IVideoGenerator.md#shutdown)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:165](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/FallbackVideoProxy.ts#L165)

Returns `true` if at least one provider in the chain supports the
given capability.

#### Parameters

##### capability

The capability to query.

`"text-to-video"` | `"image-to-video"`

#### Returns

`boolean`

#### Implementation of

[`IVideoGenerator`](../interfaces/IVideoGenerator.md).[`supports`](../interfaces/IVideoGenerator.md#supports)
