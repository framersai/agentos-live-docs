# Type Alias: VisionStrategy

> **VisionStrategy** = `"progressive"` \| `"local-only"` \| `"cloud-only"` \| `"parallel"`

Defined in: [packages/agentos/src/vision/types.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/vision/types.ts#L41)

Strategy for how vision tiers are combined during processing.

- `'progressive'` — Try local OCR first, enhance with local vision models,
  upgrade with cloud only when confidence is below threshold. Best balance
  of cost and quality.
- `'local-only'` — Tiers 1 + 2 only, never call cloud APIs. For air-gapped
  or privacy-sensitive environments.
- `'cloud-only'` — Skip local processing entirely, send directly to cloud
  vision LLM. Highest quality but highest cost.
- `'parallel'` — Run local and cloud simultaneously, merge the best results.
  Lowest latency for high-quality output when cost is not a concern.
