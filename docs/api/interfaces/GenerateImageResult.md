# Interface: GenerateImageResult

Defined in: [packages/agentos/src/api/generateImage.ts:209](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L209)

The result returned by [generateImage](../functions/generateImage.md).

## Properties

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:215](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L215)

Unix timestamp (seconds) when the image was created.

***

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/generateImage.ts:219](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L219)

Array of generated image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:211](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L211)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:213](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L213)

Provider identifier (e.g. `"openai"`, `"stability"`).

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L217)

Optional text response accompanying the images (provider-dependent).

***

### usage?

> `optional` **usage**: [`ImageProviderUsage`](ImageProviderUsage.md)

Defined in: [packages/agentos/src/api/generateImage.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateImage.ts#L221)

Token / credit usage reported by the provider, when available.
