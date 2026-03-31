# Interface: VisionPipelineConfig

Defined in: [packages/agentos/src/vision/types.ts:303](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L303)

Configuration for the [VisionPipeline](../classes/VisionPipeline.md).

All fields are optional — the factory function [createVisionPipeline](../functions/createVisionPipeline.md)
auto-detects available providers and fills in sensible defaults.

## Example

```typescript
const config: VisionPipelineConfig = {
  strategy: 'progressive',
  ocr: 'paddle',
  handwriting: true,
  documentAI: true,
  embedding: true,
  cloudProvider: 'openai',
  cloudModel: 'gpt-4o',
  confidenceThreshold: 0.8,
  preprocessing: { grayscale: true, sharpen: true },
};
```

## Properties

### cloudModel?

> `optional` **cloudModel**: `string`

Defined in: [packages/agentos/src/vision/types.ts:351](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L351)

Cloud model override. When unset, the provider's default vision model is used.

#### Example

```ts
'gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'
```

***

### cloudProvider?

> `optional` **cloudProvider**: `string`

Defined in: [packages/agentos/src/vision/types.ts:345](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L345)

Cloud vision LLM provider name for Tier 3 fallback.
Must match a provider known to `generateText()` (e.g. 'openai', 'anthropic', 'google').
When unset, cloud vision is disabled.

***

### confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

Defined in: [packages/agentos/src/vision/types.ts:359](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L359)

Minimum confidence to accept an OCR result without escalating to cloud.
Only applies to `'progressive'` strategy — if OCR confidence is below
this threshold, the pipeline escalates to the next tier.

#### Default

```ts
0.7
```

***

### documentAI?

> `optional` **documentAI**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:331](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L331)

Enable document understanding via Florence-2 (`@huggingface/transformers`).
Produces structured [DocumentLayout](DocumentLayout.md) with semantic block detection.

#### Default

```ts
false
```

***

### embedding?

> `optional` **embedding**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:338](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L338)

Enable CLIP image embeddings (`@huggingface/transformers`).
Runs in parallel with other tiers — does not affect text extraction.

#### Default

```ts
false
```

***

### handwriting?

> `optional` **handwriting**: `boolean`

Defined in: [packages/agentos/src/vision/types.ts:324](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L324)

Enable handwriting recognition via TrOCR (`@huggingface/transformers`).
Only triggered when OCR confidence is low and content appears handwritten.

#### Default

```ts
false
```

***

### ocr?

> `optional` **ocr**: `"none"` \| `"paddle"` \| `"tesseract"`

Defined in: [packages/agentos/src/vision/types.ts:317](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L317)

OCR engine for Tier 1 text extraction.
- `'paddle'` — PaddleOCR (via `ppu-paddle-ocr`). Best accuracy for most scripts.
- `'tesseract'` — Tesseract.js. Wider language support, slightly lower accuracy.
- `'none'` — Skip OCR entirely (useful for photo-only pipelines).

#### Default

```ts
'paddle' (if installed), else 'tesseract' (if installed), else 'none'
```

***

### preprocessing?

> `optional` **preprocessing**: [`VisionPreprocessingConfig`](VisionPreprocessingConfig.md)

Defined in: [packages/agentos/src/vision/types.ts:366](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L366)

Image preprocessing options applied before any tier runs.
Uses `sharp` for resizing, grayscale conversion, sharpening,
and normalization.

***

### strategy

> **strategy**: [`VisionStrategy`](../type-aliases/VisionStrategy.md)

Defined in: [packages/agentos/src/vision/types.ts:308](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L308)

How to combine tiers.

#### Default

```ts
'progressive'
```
