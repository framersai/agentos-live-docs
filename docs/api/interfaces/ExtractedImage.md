# Interface: ExtractedImage

Defined in: [packages/agentos/src/memory/io/facade/types.ts:737](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L737)

An image extracted from a document during ingestion.

## Properties

### caption?

> `optional` **caption**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:753](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L753)

Auto-generated or OCR-derived caption.
Present when a vision LLM is configured and `extractImages: true`.

***

### data

> **data**: `Buffer`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:741](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L741)

Raw image bytes (PNG, JPEG, WebP, etc.).

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:764](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L764)

Dense embedding of the image caption or visual content.
Only present when embeddings were computed during extraction.

***

### mimeType

> **mimeType**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:747](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L747)

MIME type of `data`.

#### Example

```ts
'image/png' | 'image/jpeg'
```

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:758](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L758)

Page number the image appears on (1-based, PDF/DOCX).
