# Interface: GenerateImageResult

Defined in: [packages/agentos/src/api/generateImage.ts:221](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L221)

The result returned by [generateImage](../functions/generateImage.md).

## Properties

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:227](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L227)

Unix timestamp (seconds) when the image was created.

***

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/generateImage.ts:231](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L231)

Array of generated image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:223](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L223)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:225](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L225)

Provider identifier (e.g. `"openai"`, `"stability"`).

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:229](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L229)

Optional text response accompanying the images (provider-dependent).

***

### usage?

> `optional` **usage**: [`ImageProviderUsage`](ImageProviderUsage.md)

Defined in: [packages/agentos/src/api/generateImage.ts:233](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L233)

Token / credit usage reported by the provider, when available.
