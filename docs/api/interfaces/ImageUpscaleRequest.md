# Interface: ImageUpscaleRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:253](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L253)

Provider-level request for image upscaling / super-resolution.

Passed to [IImageProvider.upscaleImage](IImageProvider.md#upscaleimage) by the high-level
[upscaleImage](../functions/upscaleImage.md) helper.

## Properties

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:263](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L263)

Target height in pixels (alternative to `scale`).

***

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:257](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L257)

Source image as a raw `Buffer`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:255](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L255)

Model identifier to use for upscaling.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:265](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L265)

Arbitrary provider-specific options.

***

### scale?

> `optional` **scale**: `2` \| `4`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:259](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L259)

Integer scale factor (e.g. `2` or `4`).

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:261](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L261)

Target width in pixels (alternative to `scale`).
