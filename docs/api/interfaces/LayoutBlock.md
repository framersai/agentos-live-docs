# Interface: LayoutBlock

Defined in: [packages/agentos/src/vision/types.ts:172](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L172)

A semantic block within a document page — a paragraph, table, figure,
heading, list, or code snippet.

## Properties

### bbox

> **bbox**: `object`

Defined in: [packages/agentos/src/vision/types.ts:183](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L183)

Bounding box in page coordinates (pixels).
Origin is top-left corner of the page.

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

Defined in: [packages/agentos/src/vision/types.ts:191](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L191)

Confidence score for this block detection (0–1).

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/vision/types.ts:177](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L177)

Text content extracted from the block.

***

### type

> **type**: `"text"` \| `"code"` \| `"table"` \| `"figure"` \| `"heading"` \| `"list"`

Defined in: [packages/agentos/src/vision/types.ts:174](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L174)

Semantic type of the block.
