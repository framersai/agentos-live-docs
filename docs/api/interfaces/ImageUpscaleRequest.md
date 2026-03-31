# Interface: ImageUpscaleRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:189](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L189)

Provider-level request for image upscaling / super-resolution.

Passed to [IImageProvider.upscaleImage](IImageProvider.md#upscaleimage) by the high-level
[upscaleImage](../functions/upscaleImage.md) helper.

## Properties

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:199](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L199)

Target height in pixels (alternative to `scale`).

***

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:193](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L193)

Source image as a raw `Buffer`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:191](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L191)

Model identifier to use for upscaling.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:201](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L201)

Arbitrary provider-specific options.

***

### scale?

> `optional` **scale**: `2` \| `4`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:195](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L195)

Integer scale factor (e.g. `2` or `4`).

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:197](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L197)

Target width in pixels (alternative to `scale`).
