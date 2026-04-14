# Class: VisionPipeline

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:127](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L127)

Unified vision pipeline with progressive enhancement.

Processes images through up to three tiers of increasing capability:
1. Local OCR (PaddleOCR / Tesseract.js) — fast, free, offline
2. Local Vision Models (TrOCR / Florence-2 / CLIP) — offline but slower
3. Cloud Vision LLMs (GPT-4o, Claude, Gemini) — best quality, API cost

All heavy dependencies are loaded lazily on first use. The pipeline
never imports ML libraries at module load time, so it's safe to
instantiate even when optional peer deps are missing — errors only
surface when a tier that needs them actually runs.

## See

[createVisionPipeline](../functions/createVisionPipeline.md) for automatic provider detection.

## Constructors

### Constructor

> **new VisionPipeline**(`config`): `VisionPipeline`

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:177](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L177)

Create a new vision pipeline.

#### Parameters

##### config

[`VisionPipelineConfig`](../interfaces/VisionPipelineConfig.md)

Pipeline configuration. All heavy dependencies are loaded
  lazily, so construction is synchronous and never imports ML libraries.

#### Returns

`VisionPipeline`

#### Example

```typescript
const pipeline = new VisionPipeline({
  strategy: 'progressive',
  ocr: 'paddle',
  handwriting: true,
  cloudProvider: 'openai',
});
```

## Methods

### analyzeLayout()

> **analyzeLayout**(`image`): `Promise`\<[`DocumentLayout`](../interfaces/DocumentLayout.md)\>

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:479](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L479)

Analyze document layout using Florence-2 — document-ai tier only.

Returns structured [DocumentLayout](../interfaces/DocumentLayout.md) with semantic blocks
(text, tables, figures, headings, lists, code) and their bounding
boxes within each page.

#### Parameters

##### image

Image data as a Buffer or file-path / URL string.

`string` | `Buffer`

#### Returns

`Promise`\<[`DocumentLayout`](../interfaces/DocumentLayout.md)\>

Structured document layout with pages and blocks.

#### Throws

If `@huggingface/transformers` is not installed.

#### Throws

If Florence-2 model loading fails.

#### Example

```typescript
const layout = await pipeline.analyzeLayout(documentScan);
for (const page of layout.pages) {
  for (const block of page.blocks) {
    console.log(`${block.type}: ${block.content.slice(0, 50)}...`);
  }
}
```

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:506](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L506)

Shut down the pipeline and release all loaded model resources.

After calling dispose(), any further calls to `process()`,
`extractText()`, `embed()`, or `analyzeLayout()` will throw.

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
const pipeline = new VisionPipeline({ strategy: 'progressive' });
try {
  const result = await pipeline.process(image);
} finally {
  await pipeline.dispose();
}
```

***

### embed()

> **embed**(`image`): `Promise`\<`number`[]\>

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:442](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L442)

Generate an image embedding using CLIP — embedding tier only.

Useful for building image similarity search indexes without running
the full OCR + vision pipeline.

#### Parameters

##### image

Image data as a Buffer or file-path / URL string.

`string` | `Buffer`

#### Returns

`Promise`\<`number`[]\>

CLIP embedding vector (typically 512 or 768 dimensions).

#### Throws

If `@huggingface/transformers` is not installed.

#### Throws

If CLIP model loading fails.

#### Example

```typescript
const embedding = await pipeline.embed(photoBuffer);
await vectorStore.upsert('images', [{
  id: 'photo-1',
  embedding,
  metadata: { source: 'upload' },
}]);
```

***

### extractText()

> **extractText**(`image`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:409](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L409)

Extract text only — fastest path using OCR tier exclusively.

Ignores all other tiers (handwriting, document-ai, cloud, embedding).
Useful when you just need the text content and don't need confidence
scoring, layout analysis, or embeddings.

#### Parameters

##### image

Image data as a Buffer or file-path / URL string.

`string` | `Buffer`

#### Returns

`Promise`\<`string`\>

Extracted text, or empty string if OCR produces no output.

#### Throws

If the configured OCR engine is missing.

#### Example

```typescript
const text = await pipeline.extractText(receiptImage);
console.log(text); // "ACME STORE\n...\nTotal: $42.99"
```

***

### process()

> **process**(`image`, `options?`): `Promise`\<[`VisionResult`](../interfaces/VisionResult.md)\>

Defined in: [packages/agentos/src/vision/VisionPipeline.ts:222](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/VisionPipeline.ts#L222)

Process an image through the configured tiers.

Automatically detects content type (printed text, handwritten, diagram,
etc.) and routes through the appropriate processing tiers based on the
configured [VisionStrategy](../type-aliases/VisionStrategy.md).

#### Parameters

##### image

Image data as a Buffer or file-path / URL string.
  Buffers are preprocessed with sharp (if configured). URL strings
  are passed directly to providers that support them.

`string` | `Buffer`

##### options?

Optional overrides for this specific invocation.

###### forceCategory?

[`VisionContentCategory`](../type-aliases/VisionContentCategory.md)

Force a specific content category
  instead of auto-detecting from OCR confidence heuristics.

###### tiers?

[`VisionTier`](../type-aliases/VisionTier.md)[]

Run only these specific tiers, ignoring
  the strategy's normal routing logic.

#### Returns

`Promise`\<[`VisionResult`](../interfaces/VisionResult.md)\>

Aggregated vision result with text, confidence, embeddings, etc.

#### Throws

If all configured tiers fail to produce a result.

#### Throws

If a required dependency (e.g. ppu-paddle-ocr) is missing.

#### Throws

If `dispose()` was already called.

#### Example

```typescript
// Full progressive pipeline
const result = await pipeline.process(imageBuffer);

// Force handwriting mode
const hw = await pipeline.process(scanBuffer, {
  forceCategory: 'handwritten',
});

// Only run OCR and embedding, skip everything else
const partial = await pipeline.process(imageBuffer, {
  tiers: ['ocr', 'embedding'],
});
```
