# Interface: ImageVariateRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:214](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L214)

Provider-level request for generating image variations.

Passed to [IImageProvider.variateImage](IImageProvider.md#variateimage) by the high-level
[variateImage](../functions/variateImage.md) helper.

## Properties

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:218](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L218)

Source image as a raw `Buffer`.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:216](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L216)

Model identifier to use for variation generation.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:220](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L220)

Number of variations to generate.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:229](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L229)

Arbitrary provider-specific options.

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:227](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L227)

Desired output size (e.g. `"1024x1024"`).

***

### variance?

> `optional` **variance**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:225](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L225)

How different from the original (`0` = identical, `1` = very different).
Default `0.5`.
