# Interface: VisionResult

Defined in: [packages/agentos/src/vision/types.ts:224](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L224)

Aggregated result from the vision pipeline after all configured tiers
have run. Contains the best extracted text, content classification,
optional embeddings, and detailed per-tier breakdowns.

## Example

```typescript
const result = await pipeline.process(imageBuffer);

// Best extracted text across all tiers
console.log(result.text);

// What kind of content was detected
console.log(result.category); // 'printed-text' | 'handwritten' | ...

// CLIP embedding for similarity search
if (result.embedding) {
  await vectorStore.upsert('images', [{ embedding: result.embedding }]);
}

// Inspect individual tier contributions
for (const tr of result.tierResults) {
  console.log(`${tr.tier} (${tr.provider}): ${tr.confidence}`);
}
```

## Properties

### category

> **category**: [`VisionContentCategory`](../type-aliases/VisionContentCategory.md)

Defined in: [packages/agentos/src/vision/types.ts:232](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L232)

What kind of content was detected.

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/vision/types.ts:229](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L229)

Overall confidence score 0–1, taken from the winning tier.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/vision/types.ts:250](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L250)

Total wall-clock processing time in milliseconds.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/vision/types.ts:241](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L241)

CLIP image embedding vector, when embedding tier is enabled.

***

### layout?

> `optional` **layout**: [`DocumentLayout`](DocumentLayout.md)

Defined in: [packages/agentos/src/vision/types.ts:244](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L244)

Structured document layout, when Florence-2 ran.

***

### regions?

> `optional` **regions**: [`VisionTextRegion`](VisionTextRegion.md)[]

Defined in: [packages/agentos/src/vision/types.ts:247](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L247)

Bounding boxes for detected text regions from the winning tier.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/vision/types.ts:226](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L226)

Best extracted text (from OCR, handwriting, or vision description).

***

### tierResults

> **tierResults**: [`VisionTierResult`](VisionTierResult.md)[]

Defined in: [packages/agentos/src/vision/types.ts:238](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L238)

Detailed results from each tier that ran, ordered by execution.

***

### tiers

> **tiers**: [`VisionTier`](../type-aliases/VisionTier.md)[]

Defined in: [packages/agentos/src/vision/types.ts:235](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L235)

Which tier(s) contributed to the final result.
