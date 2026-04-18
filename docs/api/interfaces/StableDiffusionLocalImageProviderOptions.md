# Interface: StableDiffusionLocalImageProviderOptions

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:104](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L104)

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:120](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L120)

Number of images to generate (default 1).

***

### cfgScale?

> `optional` **cfgScale**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L108)

Classifier-free guidance scale (default 7.5).

***

### controlnet?

> `optional` **controlnet**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L122)

ControlNet settings forwarded verbatim to the backend.

***

### denoisingStrength?

> `optional` **denoisingStrength**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:128](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L128)

Denoising strength for high-res fix or img2img (default 0.7).

***

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:118](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L118)

Image height in pixels (default 512).

***

### hrFix?

> `optional` **hrFix**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:126](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L126)

Enable high-resolution fix (A1111 only).

***

### loras?

> `optional` **loras**: `object`[]

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:124](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L124)

LoRA models to apply.  Injected into the prompt as `<lora:name:weight>`.

#### name

> **name**: `string`

#### weight?

> `optional` **weight**: `number`

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:114](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L114)

Negative prompt.

***

### sampler?

> `optional` **sampler**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:112](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L112)

Sampler name (e.g. 'Euler a', 'DPM++ 2M Karras').

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:110](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L110)

Random seed (-1 for random).

***

### steps?

> `optional` **steps**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L106)

Number of inference steps (default 25).

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:116](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L116)

Image width in pixels (default 512).
