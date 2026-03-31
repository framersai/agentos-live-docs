# Interface: VisionTextRegion

Defined in: [packages/agentos/src/vision/types.ts:116](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L116)

A detected text region within an image, with spatial coordinates
and per-region confidence.

## Properties

### bbox

> **bbox**: `object`

Defined in: [packages/agentos/src/vision/types.ts:127](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L127)

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

Defined in: [packages/agentos/src/vision/types.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L121)

Confidence score for this specific region (0–1).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/vision/types.ts:118](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L118)

The text content within this region.
