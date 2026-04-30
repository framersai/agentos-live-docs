# Class: OpenRouterImageProvider

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L45)

## Implements

- [`IImageProvider`](../interfaces/IImageProvider.md)

## Constructors

### Constructor

> **new OpenRouterImageProvider**(): `OpenRouterImageProvider`

#### Returns

`OpenRouterImageProvider`

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L48)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`defaultModelId`](../interfaces/IImageProvider.md#defaultmodelid)

***

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L47)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`isInitialized`](../interfaces/IImageProvider.md#isinitialized)

***

### providerId

> `readonly` **providerId**: `"openrouter"` = `'openrouter'`

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L46)

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`providerId`](../interfaces/IImageProvider.md#providerid)

## Methods

### generateImage()

> **generateImage**(`request`): `Promise`\<[`ImageGenerationResult`](../interfaces/ImageGenerationResult.md)\>

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L83)

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

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L53)

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

Defined in: [packages/agentos/src/media/images/providers/OpenRouterImageProvider.ts:166](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/OpenRouterImageProvider.ts#L166)

#### Returns

`Promise`\<[`ImageModelInfo`](../interfaces/ImageModelInfo.md)[]\>

#### Implementation of

[`IImageProvider`](../interfaces/IImageProvider.md).[`listAvailableModels`](../interfaces/IImageProvider.md#listavailablemodels)
