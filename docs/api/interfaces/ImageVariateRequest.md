# Interface: ImageVariateRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:278](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L278)

Provider-level request for generating image variations.

Passed to [IImageProvider.variateImage](IImageProvider.md#variateimage) by the high-level
[variateImage](../functions/variateImage.md) helper.

## Properties

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:282](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L282)

Source image as a raw `Buffer`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:280](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L280)

Model identifier to use for variation generation.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:284](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L284)

Number of variations to generate.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:293](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L293)

Arbitrary provider-specific options.

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:291](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L291)

Desired output size (e.g. `"1024x1024"`).

***

### variance?

> `optional` **variance**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:289](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L289)

How different from the original (`0` = identical, `1` = very different).
Default `0.5`.
