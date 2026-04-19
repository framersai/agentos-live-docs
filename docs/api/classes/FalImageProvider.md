# Class: FalImageProvider

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:212](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L212)

Image generation provider connecting to the Fal.ai serverless platform.

Implements the queue-based submit-then-poll pattern: a generation request
returns a request ID immediately, and the provider polls the status
endpoint until completion or timeout.

## Implements

## Example

```typescript
const provider = new FalImageProvider();
await provider.initialize({ apiKey: process.env.FAL_API_KEY! });

const result = await provider.generateImage({
  modelId: 'fal-ai/flux/dev',
  prompt: 'A photorealistic astronaut riding a horse on Mars',
});
console.log(result.images[0].url);
```

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new FalImageProvider**(): `FalImageProvider`

#### Returns

`FalImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:220](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L220)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:217](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L217)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"fal"` = `'fal'`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:214](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L214)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### editImage()

> **editImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:394](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L394)

Edit an image using a Fal.ai-hosted Flux model.

Supports img2img (prompt-guided transformation) and inpainting
(mask-guided regional editing). The source image is passed as a
base64 data URL in the `image` field of the model input.

#### Parameters

##### request

[`ImageEditRequest`](../interfaces/ImageEditRequest.md)

Edit request with source image, prompt, and optional mask.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Generation result with the edited image(s).

#### Throws

When the provider is not initialised or the API fails.

#### Example

```typescript
const result = await provider.editImage({
  modelId: 'fal-ai/flux/dev',
  image: imageBuffer,
  prompt: 'Convert to watercolor style',
  strength: 0.7,
});
```

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`editImage`](../interfaces/IImageProvider.md#editimage)

***

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:289](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L289)

Generate an image using the Fal.ai queue API.

Submits the generation task to the queue, then polls the status
endpoint until the result is ready or the timeout is reached.

#### Parameters

##### request

[`ImageGenerationRequest`](../interfaces/ImageGenerationRequest.md)

Image generation request with prompt and optional params.

#### Returns

`Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

The generated image result with URL(s).

#### Throws

If the provider is not initialized.

#### Throws

If the API returns an error or times out.

#### Example

```typescript
const result = await provider.generateImage({
  modelId: 'fal-ai/flux/dev',
  prompt: 'A serene Japanese garden in autumn',
  n: 2,
});
```

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`generateImage`](../interfaces/IImageProvider.md#generateimage)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:237](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L237)

Initialize the provider with API credentials and optional configuration.

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

Configuration object. Must include `apiKey`.

#### Returns

`Promise`\<`void`\>

#### Throws

If `apiKey` is missing or empty.

#### Example

```typescript
await provider.initialize({ apiKey: 'fal_xxx' });
```

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`initialize`](../interfaces/IImageProvider.md#initialize)

***

### listAvailableModels()

> **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:441](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FalImageProvider.ts#L441)

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)
