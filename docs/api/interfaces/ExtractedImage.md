# Interface: ExtractedImage

Defined in: [packages/agentos/src/memory/io/facade/types.ts:729](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L729)

An image extracted from a document during ingestion.

## Properties

### caption?

> `optional` **caption**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:745](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L745)

Auto-generated or OCR-derived caption.
Present when a vision LLM is configured and `extractImages: true`.

***

### data

> **data**: `Buffer`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:733](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L733)

Raw image bytes (PNG, JPEG, WebP, etc.).

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:756](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L756)

Dense embedding of the image caption or visual content.
Only present when embeddings were computed during extraction.

***

### mimeType

> **mimeType**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:739](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L739)

MIME type of `data`.

#### Example

```ts
'image/png' | 'image/jpeg'
```

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:750](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L750)

Page number the image appears on (1-based, PDF/DOCX).
