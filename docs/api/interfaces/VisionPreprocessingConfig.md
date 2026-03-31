# Interface: VisionPreprocessingConfig

Defined in: [packages/agentos/src/vision/types.ts:261](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L261)

Preprocessing options applied to images before they enter the
vision pipeline tiers. Uses `sharp` under the hood.

## Properties

### grayscale?

> `optional` **grayscale**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:263](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L263)

Convert to grayscale before OCR (improves contrast for printed text).

***

### normalize?

> `optional` **normalize**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:279](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L279)

Normalize brightness/contrast (histogram stretching).

***

### resize?

> `optional` **resize**: `object`

Defined in: [packages/agentos/src/vision/types.ts:270](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L270)

Resize constraints. The image is scaled down proportionally
so that neither dimension exceeds the specified maximum.
No upscaling is performed.

#### maxHeight?

> `optional` **maxHeight**: `number`

#### maxWidth?

> `optional` **maxWidth**: `number`

***

### sharpen?

> `optional` **sharpen**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:276](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L276)

Apply unsharp-mask sharpening (helps blurry scans).
