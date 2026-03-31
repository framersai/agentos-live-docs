# Interface: IVideoGenerator

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L37)

Abstraction over a video generation backend (Runway, Pika, Kling, Luma,
Stable Video, Google Veo, Replicate, etc.).

## Capability negotiation

Not every provider supports every modality. The [supports](#supports) method
lets callers (and the [FallbackVideoProxy](../classes/FallbackVideoProxy.md)) query whether a given
capability is available before invoking it.

## Lifecycle

1. Construct the provider.
2. Call [initialize](#initialize) with provider-specific configuration (API keys,
   base URLs, etc.).
3. Use [generateVideo](#generatevideo) and/or [imageToVideo](#imagetovideo).
4. Optionally call [shutdown](#shutdown) to release resources.

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L45)

Default model used when the request omits `modelId`.

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L42)

Whether [initialize](#initialize) has been called successfully.

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L39)

Unique identifier for this provider (e.g. `'runway'`, `'pika'`).

## Methods

### generateVideo()

> **generateVideo**(`request`): `Promise`\<[`VideoResult`](VideoResult.md)\>

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L61)

Generate a video from a text prompt.

#### Parameters

##### request

[`VideoGenerateRequest`](VideoGenerateRequest.md)

The generation parameters.

#### Returns

`Promise`\<[`VideoResult`](VideoResult.md)\>

A result envelope containing one or more generated videos.

***

### imageToVideo()?

> `optional` **imageToVideo**(`request`): `Promise`\<[`VideoResult`](VideoResult.md)\>

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:73](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L73)

Generate a video from a source image and a motion prompt.

This method is optional — providers that do not support image-to-video
should either omit it or have [supports](#supports) return `false` for
`'image-to-video'`.

#### Parameters

##### request

[`ImageToVideoRequest`](ImageToVideoRequest.md)

The image-to-video parameters.

#### Returns

`Promise`\<[`VideoResult`](VideoResult.md)\>

A result envelope containing one or more generated videos.

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L53)

Initialise the provider with runtime configuration.

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

Provider-specific key/value pairs (API keys, endpoints,
  model overrides, etc.).

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:87](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L87)

Release any resources held by the provider (HTTP connections, polling
loops, temp files, etc.).

#### Returns

`Promise`\<`void`\>

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [packages/agentos/src/media/video/IVideoGenerator.ts:81](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoGenerator.ts#L81)

Query whether this provider supports a given capability.

#### Parameters

##### capability

The capability to check.

`"text-to-video"` | `"image-to-video"`

#### Returns

`boolean`

`true` if the provider can handle the requested capability.
