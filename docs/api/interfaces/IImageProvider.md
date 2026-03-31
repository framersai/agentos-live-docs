# Interface: IImageProvider

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:236](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L236)

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:239](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L239)

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:238](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L238)

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:237](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L237)

## Methods

### editImage()?

> `optional` **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:252](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L252)

Perform an image-to-image edit, inpainting, or outpainting operation.
Providers that do not support editing should leave this `undefined`.

#### Parameters

##### request

[`ImageEditRequest`](ImageEditRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:242](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L242)

#### Parameters

##### request

[`ImageGenerationRequest`](ImageGenerationRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:241](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L241)

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### listAvailableModels()?

> `optional` **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:243](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L243)

#### Returns

`Promise`\<[`ImageModelInfo`](ImageModelInfo.md)[]\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:244](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L244)

#### Returns

`Promise`\<`void`\>

***

### upscaleImage()?

> `optional` **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:258](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L258)

Upscale / super-resolve an image.
Providers that do not support upscaling should leave this `undefined`.

#### Parameters

##### request

[`ImageUpscaleRequest`](ImageUpscaleRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

***

### variateImage()?

> `optional` **variateImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:264](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L264)

Generate visual variations of the supplied image.
Providers that do not support variations should leave this `undefined`.

#### Parameters

##### request

[`ImageVariateRequest`](ImageVariateRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>
