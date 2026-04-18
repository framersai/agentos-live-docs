# Class: OpenAIImageProvider

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L33)

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new OpenAIImageProvider**(): `OpenAIImageProvider`

#### Returns

`OpenAIImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L36)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L35)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"openai"` = `'openai'`

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L34)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:165](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L165)

Edits an image using the OpenAI `/v1/images/edits` endpoint.

Supports both img2img (prompt-guided transformation) and inpainting
(mask-guided regional editing).  The endpoint expects multipart form
data with the source image and an optional mask.

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

When the API returns an HTTP error status.

#### See

https://platform.openai.com/docs/api-reference/images/createEdit

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:67](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L67)

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

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L41)

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

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:300](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L300)

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)

***

### variateImage()

> **variateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/OpenAIImageProvider.ts:247](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/providers/OpenAIImageProvider.ts#L247)

Creates visual variations of an image using the OpenAI `/v1/images/variations` endpoint.

The `variance` field in the request is not natively supported by OpenAI's
variations API (there is no strength parameter), so it is currently ignored.
Every call produces images with the model's default level of variation.

#### Parameters

##### request

[`ImageVariateRequest`](../interfaces/ImageVariateRequest.md)

Variation request with the source image buffer.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result containing the variation image(s).

#### Throws

When the provider is not initialised.

#### Throws

When the API returns an HTTP error status.

#### See

https://platform.openai.com/docs/api-reference/images/createVariation

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`variateImage`](../interfaces/IImageProvider.md#variateimage)
