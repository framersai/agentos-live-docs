# Class: PipelineVisionProvider

Defined in: [packages/agentos/src/vision/providers/PipelineVisionProvider.ts:70](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/vision/providers/PipelineVisionProvider.ts#L70)

Adapts the full [VisionPipeline](VisionPipeline.md) to the narrow
[IVisionProvider](../interfaces/IVisionProvider.md) interface used by the multimodal indexer.

The pipeline's `process()` method runs all configured tiers and returns
a rich [VisionResult](../interfaces/VisionResult.md). This adapter extracts just the text field
that the indexer needs for embedding generation.

For callers that need the full pipeline result (embeddings, layout,
confidence, regions), use `processWithFullResult()` instead.

## Example

```typescript
const provider = new PipelineVisionProvider(pipeline);

// Simple: just the description text
const text = await provider.describeImage(imageUrl);

// Advanced: full pipeline result
const result = await provider.processWithFullResult(imageBuffer);
console.log(result.embedding);  // CLIP vector
console.log(result.layout);     // Florence-2 layout
```

## Implements

- [`IVisionProvider`](../interfaces/IVisionProvider.md)

## Constructors

### Constructor

> **new PipelineVisionProvider**(`pipeline`): `PipelineVisionProvider`

Defined in: [packages/agentos/src/vision/providers/PipelineVisionProvider.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/vision/providers/PipelineVisionProvider.ts#L93)

Create a new pipeline vision provider.

#### Parameters

##### pipeline

[`VisionPipeline`](VisionPipeline.md)

An initialized [VisionPipeline](VisionPipeline.md) instance.
  The caller retains ownership and is responsible for calling
  `pipeline.dispose()` when done.

#### Returns

`PipelineVisionProvider`

#### Throws

If pipeline is null or undefined.

#### Example

```typescript
const pipeline = new VisionPipeline({ strategy: 'progressive' });
const provider = new PipelineVisionProvider(pipeline);
```

## Methods

### describeImage()

> **describeImage**(`image`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/vision/providers/PipelineVisionProvider.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/vision/providers/PipelineVisionProvider.ts#L122)

Generate a text description of the provided image by running it
through the full vision pipeline.

This satisfies the [IVisionProvider](../interfaces/IVisionProvider.md) contract. The image passes
through all configured tiers (OCR, handwriting, document-ai, cloud)
and the best extracted text is returned.

#### Parameters

##### image

`string`

Image as a URL string (https://... or data:image/...).

#### Returns

`Promise`\<`string`\>

Text description or extracted content from the image.

#### Throws

If all pipeline tiers fail to produce output.

#### Throws

If the pipeline has been disposed.

#### Example

```typescript
const description = await provider.describeImage(imageUrl);
console.log(description);
```

#### Implementation of

[`IVisionProvider`](../interfaces/IVisionProvider.md).[`describeImage`](../interfaces/IVisionProvider.md#describeimage)

***

### getPipeline()

> **getPipeline**(): [`VisionPipeline`](VisionPipeline.md)

Defined in: [packages/agentos/src/vision/providers/PipelineVisionProvider.ts:174](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/vision/providers/PipelineVisionProvider.ts#L174)

Get a reference to the underlying pipeline for direct access.

Useful when the caller needs to invoke pipeline-specific methods
like `extractText()`, `embed()`, or `analyzeLayout()` that aren't
exposed through the [IVisionProvider](../interfaces/IVisionProvider.md) interface.

#### Returns

[`VisionPipeline`](VisionPipeline.md)

The underlying VisionPipeline instance.

#### Example

```typescript
const layout = await provider.getPipeline().analyzeLayout(image);
```

***

### processWithFullResult()

> **processWithFullResult**(`image`): `Promise`\<[`VisionResult`](../interfaces/VisionResult.md)\>

Defined in: [packages/agentos/src/vision/providers/PipelineVisionProvider.ts:156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/vision/providers/PipelineVisionProvider.ts#L156)

Process an image through the full pipeline and return the complete
[VisionResult](../interfaces/VisionResult.md) — including embeddings, layout, confidence
scores, and per-tier breakdowns.

Use this when you need more than just the text description (e.g.
to store the CLIP embedding alongside the text embedding in the
vector store).

#### Parameters

##### image

Image data as a Buffer or URL string.

`string` | `Buffer`

#### Returns

`Promise`\<[`VisionResult`](../interfaces/VisionResult.md)\>

Full vision pipeline result.

#### Throws

If all pipeline tiers fail.

#### Throws

If the pipeline has been disposed.

#### Example

```typescript
const result = await provider.processWithFullResult(imageBuffer);

// Use both text embedding (via indexer) and image embedding (via CLIP)
if (result.embedding) {
  await imageVectorStore.upsert('images', [{
    id: docId,
    embedding: result.embedding,
    metadata: { text: result.text },
  }]);
}
```
