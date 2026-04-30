# Interface: GenerateImageResult

Defined in: [packages/agentos/src/api/generateImage.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L232)

The result returned by [generateImage](../functions/generateImage.md).

## Properties

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:238](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L238)

Unix timestamp (seconds) when the image was created.

***

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/generateImage.ts:242](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L242)

Array of generated image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L234)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L236)

Provider identifier (e.g. `"openai"`, `"stability"`).

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L240)

Optional text response accompanying the images (provider-dependent).

***

### usage?

> `optional` **usage**: [`ImageProviderUsage`](ImageProviderUsage.md)

Defined in: [packages/agentos/src/api/generateImage.ts:244](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateImage.ts#L244)

Token / credit usage reported by the provider, when available.
