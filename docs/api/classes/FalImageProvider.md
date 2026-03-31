# Class: FalImageProvider

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:210](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L210)

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

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:218](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L218)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:215](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L215)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"fal"` = `'fal'`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:212](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L212)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:285](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L285)

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

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:234](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L234)

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

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:357](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/images/providers/FalImageProvider.ts#L357)

List available Flux models on the Fal.ai platform.

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Static list of known Fal.ai model identifiers.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)
