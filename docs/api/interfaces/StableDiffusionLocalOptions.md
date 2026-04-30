# Interface: StableDiffusionLocalOptions

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L37)

Provider-specific options passed through
`request.providerOptions['stable-diffusion-local']`.

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L53)

Number of images to generate (default 1).

***

### cfgScale?

> `optional` **cfgScale**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L41)

Classifier-free guidance scale (default 7.5).

***

### controlnet?

> `optional` **controlnet**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L55)

ControlNet settings forwarded verbatim to the backend.

***

### denoisingStrength?

> `optional` **denoisingStrength**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L61)

Denoising strength for high-res fix or img2img (default 0.7).

***

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L51)

Image height in pixels (default 512).

***

### hrFix?

> `optional` **hrFix**: `boolean`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L59)

Enable high-resolution fix (A1111 only).

***

### loras?

> `optional` **loras**: `object`[]

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L57)

LoRA models to apply.  Injected into the prompt as `<lora:name:weight>`.

#### name

> **name**: `string`

#### weight?

> `optional` **weight**: `number`

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L47)

Negative prompt.

***

### sampler?

> `optional` **sampler**: `string`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L45)

Sampler name (e.g. `'Euler a'`, `'DPM++ 2M Karras'`).

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L43)

Random seed (-1 for random).

***

### steps?

> `optional` **steps**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L39)

Number of inference steps (default 25).

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/media/images/providers/StableDiffusionLocalProvider.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/StableDiffusionLocalProvider.ts#L49)

Image width in pixels (default 512).
