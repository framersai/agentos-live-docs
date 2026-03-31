# Class: StabilityImageProvider

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:119](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L119)

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new StabilityImageProvider**(): `StabilityImageProvider`

#### Returns

`StabilityImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:122](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L122)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L121)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"stability"` = `'stability'`

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:120](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L120)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:287](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L287)

Edits an image using the Stability AI image-to-image endpoint.

Routes to different endpoints depending on the edit mode:
- `'img2img'` (default) — `/v2beta/stable-image/generate/sd3` with `image` and `strength`.
- `'inpaint'` — same endpoint but additionally includes `mask_image`.
- `'outpaint'` — currently treated identically to `img2img` (provider
  does not expose a dedicated outpainting endpoint in the v2beta surface).

#### Parameters

##### request

[`ImageEditRequest`](../interfaces/ImageEditRequest.md)

Edit request containing the source image, prompt, and optional mask.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result with the edited image(s).

#### Throws

When the provider is not initialised.

#### Throws

When the Stability API returns an HTTP error status.

#### See

https://platform.stability.ai/docs/api-reference#tag/Generate/paths/~1v2beta~1stable-image~1generate~1sd3/post

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:148](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L148)

#### Parameters

##### request

[`ImageGenerationRequest`](../interfaces/ImageGenerationRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`generateImage`](../interfaces/IImageProvider.md#generateimage)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:127](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L127)

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`initialize`](../interfaces/IImageProvider.md#initialize)

***

### listAvailableModels()

> **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:478](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L478)

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)

***

### upscaleImage()

> **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StabilityImageProvider.ts:377](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/StabilityImageProvider.ts#L377)

Upscales an image using the Stability AI upscale endpoint.

Uses `/v2beta/stable-image/upscale/conservative` which takes an image
and a target width to produce a higher-resolution version.

#### Parameters

##### request

[`ImageUpscaleRequest`](../interfaces/ImageUpscaleRequest.md)

Upscale request with the source image and desired dimensions.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result with the upscaled image.

#### Throws

When the provider is not initialised.

#### Throws

When the Stability API returns an HTTP error status.

#### See

https://platform.stability.ai/docs/api-reference#tag/Upscale

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`upscaleImage`](../interfaces/IImageProvider.md#upscaleimage)
