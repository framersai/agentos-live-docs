# Type Alias: VisionTier

> **VisionTier** = `"ocr"` \| `"handwriting"` \| `"document-ai"` \| `"embedding"` \| `"cloud-vision"`

Defined in: [packages/agentos/src/vision/types.ts:79](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/vision/types.ts#L79)

Identifies which processing tier produced a result.

- `'ocr'` — Tier 1: PaddleOCR or Tesseract.js text extraction
- `'handwriting'` — Tier 2a: TrOCR handwriting recognition
- `'document-ai'` — Tier 2b: Florence-2 document understanding
- `'embedding'` — Tier 2c: CLIP image embedding generation
- `'cloud-vision'` — Tier 3: Cloud vision LLM (GPT-4o, Claude, etc.)
