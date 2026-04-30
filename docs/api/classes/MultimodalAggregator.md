# Class: MultimodalAggregator

Defined in: [packages/agentos/src/memory/io/ingestion/MultimodalAggregator.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/ingestion/MultimodalAggregator.ts#L76)

Adds auto-generated captions to [ExtractedImage](../interfaces/ExtractedImage.md) objects that lack
one, using a caller-supplied vision LLM function.

Images are processed in parallel via `Promise.allSettled()` so a single
failed captioning attempt does not block the rest.  Images whose captioning
fails retain their original (un-captioned) state rather than propagating the
error.

### Example — with a vision LLM
```ts
const aggregator = new MultimodalAggregator({
  describeImage: async (buf, mime) => myVisionLLM.describe(buf, mime),
});

const captioned = await aggregator.processImages(doc.images ?? []);
```

### Example — passthrough (no LLM configured)
```ts
const aggregator = new MultimodalAggregator();
const unchanged  = await aggregator.processImages(doc.images ?? []);
```

## Constructors

### Constructor

> **new MultimodalAggregator**(`config?`): `MultimodalAggregator`

Defined in: [packages/agentos/src/memory/io/ingestion/MultimodalAggregator.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/ingestion/MultimodalAggregator.ts#L80)

#### Parameters

##### config?

`MultimodalConfig`

Optional configuration.  Omit to use in passthrough mode.

#### Returns

`MultimodalAggregator`

## Methods

### processImages()

> **processImages**(`images`): `Promise`\<[`ExtractedImage`](../interfaces/ExtractedImage.md)[]\>

Defined in: [packages/agentos/src/memory/io/ingestion/MultimodalAggregator.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/ingestion/MultimodalAggregator.ts#L101)

Enrich images with captions via the configured vision LLM.

Only images that have no existing `caption` field are processed.  Images
that already carry a caption are left unchanged to avoid redundant LLM
calls.

When no `describeImage` function is configured all images are returned
unchanged.

#### Parameters

##### images

[`ExtractedImage`](../interfaces/ExtractedImage.md)[]

Array of [ExtractedImage](../interfaces/ExtractedImage.md) objects to process.

#### Returns

`Promise`\<[`ExtractedImage`](../interfaces/ExtractedImage.md)[]\>

A promise resolving to the same-length array of
         [ExtractedImage](../interfaces/ExtractedImage.md) objects, with captions filled in where
         possible.
