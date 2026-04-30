# Interface: ImageEditRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L215)

Provider-level request for image editing.

Passed to [IImageProvider.editImage](IImageProvider.md#editimage) by the high-level
[editImage](../functions/editImage.md) helper after normalising user input.

## Properties

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:219](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L219)

Source image as a raw `Buffer`.

***

### mask?

> `optional` **mask**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:223](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L223)

Optional mask for inpainting (white = edit region, black = keep).

***

### mode?

> `optional` **mode**: [`ImageEditMode`](../type-aliases/ImageEditMode.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L225)

Editing mode. Defaults to `'img2img'`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:217](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L217)

Model identifier to use for the edit.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:238](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L238)

Number of output images.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L232)

Negative prompt describing content to avoid.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:221](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L221)

Text prompt describing the desired changes.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L240)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L236)

Seed for reproducible output.

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L234)

Desired output dimensions (e.g. `"1024x1024"`).

***

### strength?

> `optional` **strength**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:230](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/IImageProvider.ts#L230)

How much the output may deviate from the source.
`0` = identical, `1` = completely redrawn.  Default `0.75`.
