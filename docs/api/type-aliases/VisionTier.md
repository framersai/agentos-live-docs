# Type Alias: VisionTier

> **VisionTier** = `"ocr"` \| `"handwriting"` \| `"document-ai"` \| `"embedding"` \| `"cloud-vision"`

Defined in: [packages/agentos/src/vision/types.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/types.ts#L79)

Identifies which processing tier produced a result.

- `'ocr'` — Tier 1: PaddleOCR or Tesseract.js text extraction
- `'handwriting'` — Tier 2a: TrOCR handwriting recognition
- `'document-ai'` — Tier 2b: Florence-2 document understanding
- `'embedding'` — Tier 2c: CLIP image embedding generation
- `'cloud-vision'` — Tier 3: Cloud vision LLM (GPT-4o, Claude, etc.)
