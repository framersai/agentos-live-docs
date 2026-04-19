# Class: FallbackImageProxy

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:138](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L138)

An [IImageProvider](../interfaces/IImageProvider.md) that wraps an ordered chain of image providers
and implements automatic failover for every operation.

## Retry chain logic

Providers are tried left-to-right (index 0 first). The first provider
that succeeds returns immediately. When a provider throws:

- **If it is NOT the last provider:** a `image:fallback` event is
  emitted and the next provider is tried.
- **If it IS the last provider:** an `AggregateError` containing every
  collected error is thrown.
- **If the chain is empty:** an `Error('No providers in image fallback chain')`
  is thrown immediately.

For optional operations (edit/upscale/variate), providers that do not
implement the method or throw a `*NotSupportedError` are silently
skipped, since they are structurally incapable rather than transiently
failing.

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new FallbackImageProxy**(`chain`, `emitter`): `FallbackImageProxy`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:164](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L164)

Creates a new FallbackImageProxy wrapping the given provider chain.

#### Parameters

##### chain

[`IImageProvider`](../interfaces/IImageProvider.md)[]

Ordered list of image providers to try. Must contain at
  least one entry for operations to succeed (an empty chain always throws).

##### emitter

`EventEmitter`

EventEmitter on which `image:fallback` events are
  published so callers can observe the failover path.

#### Returns

`FallbackImageProxy`

#### Example

```ts
const proxy = new FallbackImageProxy(
  [openaiProvider, stabilityProvider],
  new EventEmitter(),
);
```

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:146](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L146)

Default model from the first provider, if set.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> `readonly` **isInitialized**: `boolean` = `true`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:143](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L143)

Always `true` — the proxy is ready as soon as it is constructed.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L140)

Identifier derived from the first provider in the chain.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:218](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L218)

Edit an image, falling back through providers that support editing.

Providers that do not implement `editImage` or that throw a
`*NotSupportedError` are silently skipped.

#### Parameters

##### request

[`ImageEditRequest`](../interfaces/ImageEditRequest.md)

The edit request forwarded to each capable provider.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider fails or does not support editing.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:197](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L197)

Generate an image, falling back through the provider chain on failure.

#### Parameters

##### request

[`ImageGenerationRequest`](../interfaces/ImageGenerationRequest.md)

The generation request forwarded to each provider.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider in the chain fails.

#### Throws

When the chain is empty.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`generateImage`](../interfaces/IImageProvider.md#generateimage)

***

### initialize()

> **initialize**(`_config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:180](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L180)

No-op initialisation — individual providers in the chain should already
be initialised before being passed to the proxy.

#### Parameters

##### \_config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`initialize`](../interfaces/IImageProvider.md#initialize)

***

### listAvailableModels()

> **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:294](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L294)

Returns the model list from the first provider in the chain that
implements `listAvailableModels`. Returns an empty array when none do.

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:312](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L312)

Shuts down all providers in the chain. Errors are caught per-provider
so a single provider's failure does not prevent the others from
cleaning up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`shutdown`](../interfaces/IImageProvider.md#shutdown)

***

### upscaleImage()

> **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:244](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L244)

Upscale an image, falling back through providers that support upscaling.

#### Parameters

##### request

[`ImageUpscaleRequest`](../interfaces/ImageUpscaleRequest.md)

The upscale request forwarded to each capable provider.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider fails or does not support upscaling.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`upscaleImage`](../interfaces/IImageProvider.md#upscaleimage)

***

### variateImage()

> **variateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:271](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/FallbackImageProxy.ts#L271)

Generate variations of an image, falling back through providers that
support the operation.

#### Parameters

##### request

[`ImageVariateRequest`](../interfaces/ImageVariateRequest.md)

The variation request forwarded to each capable provider.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

The result from the first provider that succeeds.

#### Throws

When every provider fails or does not support variations.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`variateImage`](../interfaces/IImageProvider.md#variateimage)
