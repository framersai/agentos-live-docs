# Interface: IImageProvider

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:300](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L300)

## Properties

### defaultModelId?

> `readonly` `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:303](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L303)

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:302](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L302)

***

### providerId

> `readonly` **providerId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:301](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L301)

## Methods

### editImage()?

> `optional` **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:316](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L316)

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

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:306](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L306)

#### Parameters

##### request

[`ImageGenerationRequest`](ImageGenerationRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:305](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L305)

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### listAvailableModels()?

> `optional` **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:307](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L307)

#### Returns

`Promise`\<[`ImageModelInfo`](ImageModelInfo.md)[]\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:308](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L308)

#### Returns

`Promise`\<`void`\>

***

### upscaleImage()?

> `optional` **upscaleImage**(`request`): `Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:322](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L322)

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

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:328](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/IImageProvider.ts#L328)

Generate visual variations of the supplied image.
Providers that do not support variations should leave this `undefined`.

#### Parameters

##### request

[`ImageVariateRequest`](ImageVariateRequest.md)

#### Returns

`Promise`\<[`ImageGenerationResult`](ImageGenerationResult.md)\>
