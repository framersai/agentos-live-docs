# Interface: IngestionConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:134](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L134)

Controls how documents are split into chunks before being stored and indexed.

## Properties

### chunkOverlap?

> `optional` **chunkOverlap**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:156](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L156)

Overlap between consecutive chunks in tokens/characters.
Prevents context loss at chunk boundaries.

#### Default

```ts
64
```

***

### chunkSize?

> `optional` **chunkSize**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:149](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L149)

Target token/character count for each chunk.

#### Default

```ts
512
```

***

### chunkStrategy?

> `optional` **chunkStrategy**: `"fixed"` \| `"semantic"` \| `"hierarchical"` \| `"layout"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L143)

Strategy for splitting a document into indexable chunks.
- `'fixed'`       – split at a fixed token/character count.
- `'semantic'`    – split at semantic boundaries (paragraphs, sections).
- `'hierarchical'`– build a tree of coarse → fine chunks (good for Q&A).
- `'layout'`      – preserve the visual layout of the source (PDF columns etc.).

#### Default

```ts
'semantic'
```

***

### doclingEnabled?

> `optional` **doclingEnabled**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:177](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L177)

Whether to use the Docling library for high-fidelity PDF/DOCX parsing.
When `false`, a simpler text-extraction path is used.

#### Default

```ts
false
```

***

### extractImages?

> `optional` **extractImages**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L163)

Whether to extract embedded images from documents (PDF, DOCX, etc.).
Extracted images are stored as `ExtractedImage` objects.

#### Default

```ts
false
```

***

### ocrEnabled?

> `optional` **ocrEnabled**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:170](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L170)

Whether to run Optical Character Recognition on extracted images.
Requires `extractImages: true`.

#### Default

```ts
false
```

***

### visionLlm?

> `optional` **visionLlm**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:184](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L184)

Vision-capable LLM model identifier used to caption extracted images.
Only consulted when `extractImages: true`.

#### Example

```ts
'gpt-4o'
```
