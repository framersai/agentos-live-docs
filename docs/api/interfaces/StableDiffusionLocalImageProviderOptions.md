# Interface: StableDiffusionLocalImageProviderOptions

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:75](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L75)

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L91)

Number of images to generate (default 1).

***

### cfgScale?

> `optional` **cfgScale**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:79](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L79)

Classifier-free guidance scale (default 7.5).

***

### controlnet?

> `optional` **controlnet**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:93](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L93)

ControlNet settings forwarded verbatim to the backend.

***

### denoisingStrength?

> `optional` **denoisingStrength**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:99](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L99)

Denoising strength for high-res fix or img2img (default 0.7).

***

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:89](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L89)

Image height in pixels (default 512).

***

### hrFix?

> `optional` **hrFix**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L97)

Enable high-resolution fix (A1111 only).

***

### loras?

> `optional` **loras**: `object`[]

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L95)

LoRA models to apply.  Injected into the prompt as `<lora:name:weight>`.

#### name

> **name**: `string`

#### weight?

> `optional` **weight**: `number`

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:85](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L85)

Negative prompt.

***

### sampler?

> `optional` **sampler**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:83](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L83)

Sampler name (e.g. 'Euler a', 'DPM++ 2M Karras').

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:81](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L81)

Random seed (-1 for random).

***

### steps?

> `optional` **steps**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:77](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L77)

Number of inference steps (default 25).

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:87](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/images/IImageProvider.ts#L87)

Image width in pixels (default 512).
