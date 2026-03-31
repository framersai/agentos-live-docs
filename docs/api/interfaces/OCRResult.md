# Interface: OCRResult

Defined in: [packages/agentos/src/api/performOCR.ts:106](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L106)

Result returned by [performOCR](../functions/performOCR.md).

## Properties

### category?

> `optional` **category**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:124](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L124)

Content category detected by the pipeline (e.g. `'printed-text'`).

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/api/performOCR.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L111)

Overall confidence score (0 = no confidence, 1 = certain).

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:127](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L127)

Provider name that produced the winning result (e.g. `'paddle'`, `'openai'`).

***

### regions?

> `optional` **regions**: `object`[]

Defined in: [packages/agentos/src/api/performOCR.ts:133](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L133)

Text regions with bounding boxes, when the winning tier provides
spatial information. Not all tiers return region data.

#### bbox?

> `optional` **bbox**: `object`

##### bbox.height

> **height**: `number`

##### bbox.width

> **width**: `number`

##### bbox.x

> **x**: `number`

##### bbox.y

> **y**: `number`

#### confidence

> **confidence**: `number`

#### text

> **text**: `string`

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:108](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L108)

Extracted text content.

***

### tier

> **tier**: [`VisionTier`](../type-aliases/VisionTier.md)

Defined in: [packages/agentos/src/api/performOCR.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/performOCR.ts#L121)

Which processing tier produced the winning result.

- `'ocr'` — PaddleOCR or Tesseract.js (fast, local, free).
- `'handwriting'` — TrOCR handwriting recognition (local).
- `'document-ai'` — Florence-2 document understanding (local).
- `'cloud-vision'` — Cloud LLM (GPT-4o, Claude, Gemini).
