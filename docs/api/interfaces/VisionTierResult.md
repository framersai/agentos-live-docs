# Interface: VisionTierResult

Defined in: [packages/agentos/src/vision/types.ts:92](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L92)

Result from a single processing tier.

Each tier that runs produces one of these, regardless of whether the
pipeline ultimately uses its output or prefers a higher-confidence
alternative from another tier.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/vision/types.ts:103](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L103)

Confidence score from 0 (no confidence) to 1 (certain).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/vision/types.ts:106](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L106)

Wall-clock processing time in milliseconds.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/vision/types.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L97)

Provider name within the tier (e.g. 'paddle', 'tesseract', 'openai').

***

### regions?

> `optional` **regions**: [`VisionTextRegion`](VisionTextRegion.md)[]

Defined in: [packages/agentos/src/vision/types.ts:109](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L109)

Bounding boxes for detected text regions, when available.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/vision/types.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L100)

Extracted or generated text content.

***

### tier

> **tier**: [`VisionTier`](../type-aliases/VisionTier.md)

Defined in: [packages/agentos/src/vision/types.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/types.ts#L94)

Which tier produced this result.
