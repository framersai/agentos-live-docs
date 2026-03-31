# Interface: ImageEditRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:151](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L151)

Provider-level request for image editing.

Passed to [IImageProvider.editImage](IImageProvider.md#editimage) by the high-level
[editImage](../functions/editImage.md) helper after normalising user input.

## Properties

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:155](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L155)

Source image as a raw `Buffer`.

***

### mask?

> `optional` **mask**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L159)

Optional mask for inpainting (white = edit region, black = keep).

***

### mode?

> `optional` **mode**: [`ImageEditMode`](../type-aliases/ImageEditMode.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:161](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L161)

Editing mode. Defaults to `'img2img'`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:153](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L153)

Model identifier to use for the edit.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:174](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L174)

Number of output images.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:168](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L168)

Negative prompt describing content to avoid.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:157](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L157)

Text prompt describing the desired changes.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:176](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L176)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:172](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L172)

Seed for reproducible output.

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:170](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L170)

Desired output dimensions (e.g. `"1024x1024"`).

***

### strength?

> `optional` **strength**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:166](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/IImageProvider.ts#L166)

How much the output may deviate from the source.
`0` = identical, `1` = completely redrawn.  Default `0.75`.
