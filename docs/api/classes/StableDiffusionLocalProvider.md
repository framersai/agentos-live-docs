# Class: StableDiffusionLocalProvider

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:111](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L111)

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new StableDiffusionLocalProvider**(`fetchImpl?`): `StableDiffusionLocalProvider`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L125)

#### Parameters

##### fetchImpl?

\{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

#### Returns

`StableDiffusionLocalProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L114)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:113](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L113)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"stable-diffusion-local"` = `'stable-diffusion-local'`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:112](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L112)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:464](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L464)

Edits an image using the A1111 `img2img` endpoint.

Routes to `/sdapi/v1/img2img` which accepts `init_images` (base64 array)
and `denoising_strength` to control how much the output deviates from the
source.  When a mask is provided, A1111 performs inpainting on the white
regions of the mask.

#### Parameters

##### request

[`ImageEditRequest`](../interfaces/ImageEditRequest.md)

Edit request with source image buffer and prompt.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result containing the edited image(s).

#### Throws

When the provider is not initialised.

#### Throws

When the A1111 API returns an HTTP error.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:204](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L204)

Generate one or more images from a text prompt.

Dispatches to the detected backend (A1111 or ComfyUI).

#### Parameters

##### request

[`ImageGenerationRequest`](../interfaces/ImageGenerationRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

#### Throws

When the provider has not been initialised.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`generateImage`](../interfaces/IImageProvider.md#generateimage)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:142](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L142)

Initialise the provider.

Accepts `baseURL` / `baseUrl` / `baseurl` from the config bag and
auto-detects the backend by probing known endpoints.

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

Provider configuration.  Must contain a `baseURL` string.

#### Returns

`Promise`\<`void`\>

#### Throws

When no `baseURL` is supplied.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`initialize`](../interfaces/IImageProvider.md#initialize)

***

### listAvailableModels()

> **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:603](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L603)

Lists available checkpoint models from an A1111 backend.

ComfyUI does not expose a simple model listing endpoint, so an empty
array is returned in that case.

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:633](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L633)

Resets initialisation state.  The local backend keeps running independently.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`shutdown`](../interfaces/IImageProvider.md#shutdown)

***

### upscaleImage()

> **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:547](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/StableDiffusionLocalProvider.ts#L547)

Upscales an image using the A1111 extras single-image endpoint.

Routes to `/sdapi/v1/extra-single-image` which accepts a base64 image,
an upscaler name, and a resize factor.

#### Parameters

##### request

[`ImageUpscaleRequest`](../interfaces/ImageUpscaleRequest.md)

Upscale request with source image and desired scale.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result containing the upscaled image.

#### Throws

When the provider is not initialised.

#### Throws

When the A1111 API returns an HTTP error.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`upscaleImage`](../interfaces/IImageProvider.md#upscaleimage)
