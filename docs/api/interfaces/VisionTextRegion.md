# Interface: VisionTextRegion

Defined in: [packages/agentos/src/vision/types.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L116)

A detected text region within an image, with spatial coordinates
and per-region confidence.

## Properties

### bbox

> **bbox**: `object`

Defined in: [packages/agentos/src/vision/types.ts:127](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L127)

Bounding box in image coordinates (pixels).
Origin is top-left corner of the image.

#### height

> **height**: `number`

#### width

> **width**: `number`

#### x

> **x**: `number`

#### y

> **y**: `number`

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/vision/types.ts:121](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L121)

Confidence score for this specific region (0–1).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/vision/types.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L118)

The text content within this region.
