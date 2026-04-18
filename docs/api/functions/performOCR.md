# Function: performOCR()

> **performOCR**(`opts`): `Promise`\<[`OCRResult`](../interfaces/OCRResult.md)\>

Defined in: [packages/agentos/src/api/performOCR.ts:270](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/performOCR.ts#L270)

Extract text from an image using AgentOS's progressive vision pipeline.

This is the recommended high-level API for OCR. It handles input
resolution (file, URL, base64, Buffer), pipeline lifecycle, and
result mapping so callers don't need to interact with
[VisionPipeline](../classes/VisionPipeline.md) directly.

## When to use `performOCR()` vs `VisionPipeline`

| Use case | Recommendation |
|----------|---------------|
| One-shot text extraction | `performOCR()` |
| Batch processing many images | `VisionPipeline` (create once, reuse) |
| Need embeddings or layout | `VisionPipeline` (richer result) |
| Simple scripts / quick integration | `performOCR()` |

## Parameters

### opts

[`PerformOCROptions`](../interfaces/PerformOCROptions.md)

OCR options including the image source and strategy.

## Returns

`Promise`\<[`OCRResult`](../interfaces/OCRResult.md)\>

A promise resolving to an [OCRResult](../interfaces/OCRResult.md) with extracted text,
  confidence, tier info, and optional bounding-box regions.

## Example

```ts
// Basic usage — file path, auto-detect everything
const { text, confidence } = await performOCR({
  image: '/path/to/receipt.png',
});

// Privacy-sensitive — never call cloud APIs
const local = await performOCR({
  image: screenshotBuffer,
  strategy: 'local-only',
});

// Best quality — go straight to cloud
const cloud = await performOCR({
  image: 'https://example.com/document.jpg',
  strategy: 'cloud-only',
  provider: 'openai',
  model: 'gpt-4o',
});
```
