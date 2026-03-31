# Interface: PerformOCROptions

Defined in: [packages/agentos/src/api/performOCR.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L49)

Options accepted by [performOCR](../functions/performOCR.md).

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:100](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L100)

API key for the cloud provider. When omitted the key is read from the
standard environment variable for the provider.

***

### confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

Defined in: [packages/agentos/src/api/performOCR.ts:81](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L81)

Minimum confidence threshold (0-1) to accept an OCR result from a local
tier without escalating to the next tier.

Only meaningful for the `'progressive'` strategy.

#### Default

```ts
0.7
```

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/performOCR.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L58)

Image source. Accepts any of:
- **File path** — absolute or relative filesystem path (e.g. `/tmp/scan.png`).
- **URL** — HTTP(S) URL to fetch the image from.
- **Base64 string** — raw base64-encoded image data (with or without a
  `data:image/...;base64,` prefix).
- **Buffer** — in-memory image bytes.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:94](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L94)

Cloud LLM model override. When omitted the provider's default vision
model is used (e.g. `gpt-4o` for OpenAI).

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/performOCR.ts:88](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L88)

Cloud LLM provider for tier-3 fallback (e.g. `'openai'`, `'anthropic'`,
`'google'`). When omitted the provider is auto-detected from environment
variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.).

***

### strategy?

> `optional` **strategy**: `"progressive"` \| `"local-only"` \| `"cloud-only"`

Defined in: [packages/agentos/src/api/performOCR.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/performOCR.ts#L71)

Vision strategy controlling which tiers are used.

- `'progressive'` — start local, escalate to cloud only when confidence
  is below [confidenceThreshold](#confidencethreshold). Best cost/quality balance.
- `'local-only'` — never call cloud APIs. For air-gapped / privacy use.
- `'cloud-only'` — skip local processing, send straight to a cloud LLM.
  Highest quality but highest cost.

#### Default

```ts
'progressive'
```
