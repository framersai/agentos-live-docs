# Class: FluxImageProvider

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:199](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L199)

Image generation provider connecting directly to the Black Forest Labs
(BFL) API for Flux model access.

Implements the async submit-then-poll pattern: a generation request
returns a task ID immediately, and the provider polls until the image
is ready or a timeout is reached.

## Implements

## Example

```typescript
const provider = new FluxImageProvider();
await provider.initialize({ apiKey: process.env.BFL_API_KEY! });

const result = await provider.generateImage({
  modelId: 'flux-pro-1.1',
  prompt: 'A photorealistic astronaut riding a horse on Mars',
  size: '1024x1024',
});
console.log(result.images[0].url);
```

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new FluxImageProvider**(): `FluxImageProvider`

#### Returns

`FluxImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L207)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:204](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L204)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"bfl"` = `'bfl'`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L201)

#### Inherit Doc

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:274](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L274)

Generate an image using the BFL Flux API.

Submits the generation task, then polls until the result is ready
or the timeout is reached.

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
  modelId: 'flux-pro-1.1',
  prompt: 'A serene Japanese garden in autumn',
  size: '1024x768',
});
```

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`generateImage`](../interfaces/IImageProvider.md#generateimage)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L223)

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
await provider.initialize({ apiKey: 'bfl_xxx' });
```

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`initialize`](../interfaces/IImageProvider.md#initialize)

***

### listAvailableModels()

> **listAvailableModels**(): `Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:332](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/providers/FluxImageProvider.ts#L332)

List available Flux models on the BFL API.

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

Static list of known BFL model identifiers.

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)
