# Interface: UpscaleImageResult

Defined in: [packages/agentos/src/api/upscaleImage.ts:85](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L85)

Result returned by [upscaleImage](../functions/upscaleImage.md).

## Properties

### image

> **image**: [`GeneratedImage`](GeneratedImage.md)

Defined in: [packages/agentos/src/api/upscaleImage.ts:87](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L87)

The upscaled image.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L91)

Model identifier.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:89](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L89)

Provider identifier.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/upscaleImage.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L93)

Token/credit usage reported by the provider.

#### costUSD?

> `optional` **costUSD**: `number`
