# Class: ReplicateImageProvider

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L75)

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new ReplicateImageProvider**(): `ReplicateImageProvider`

#### Returns

`ReplicateImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:78](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L78)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L77)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"replicate"` = `'replicate'`

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:76](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L76)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:249](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L249)

Edits an image using a Replicate model that supports image-to-image input.

Uses `black-forest-labs/flux-fill` for inpainting (when a mask is provided)
or falls back to `stability-ai/sdxl` for generic img2img transforms.
The source image is passed as a base64 data URL in the model input.

#### Parameters

##### request

[`ImageEditRequest`](../interfaces/ImageEditRequest.md)

Edit request with source image, prompt, and optional mask.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result with the edited image(s).

#### Throws

When the provider is not initialised or the API fails.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L105)

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

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L83)

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

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:381](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L381)

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)

***

### upscaleImage()

> **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/ReplicateImageProvider.ts:329](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/ReplicateImageProvider.ts#L329)

Upscales an image using a Replicate upscaling model.

Defaults to `nightmareai/real-esrgan` which supports 2x and 4x upscaling
via the `scale` input parameter.

#### Parameters

##### request

[`ImageUpscaleRequest`](../interfaces/ImageUpscaleRequest.md)

Upscale request with source image and desired scale factor.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result with the upscaled image.

#### Throws

When the provider is not initialised or the API fails.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`upscaleImage`](../interfaces/IImageProvider.md#upscaleimage)
