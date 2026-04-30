# Interface: LoadedDocument

Defined in: [packages/agentos/src/memory/io/facade/types.ts:796](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L796)

The parsed representation of a document returned by `Memory.load()`.
Contains full text, optional chunks, and any extracted images/tables.

## Properties

### chunks?

> `optional` **chunks**: [`DocumentChunk`](DocumentChunk.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:810](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L810)

Pre-chunked segments, present when chunking was requested during load.

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:800](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L800)

Full extracted text content of the document.

***

### format

> **format**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:827](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L827)

The format that was detected or used to parse the document.

#### Example

```ts
'pdf' | 'md' | 'docx' | 'txt'
```

***

### images?

> `optional` **images**: [`ExtractedImage`](ExtractedImage.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:816](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L816)

Images extracted from the document.
Populated only when `IngestionConfig.extractImages` is `true`.

***

### metadata

> **metadata**: [`DocumentMetadata`](DocumentMetadata.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:805](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L805)

Document-level metadata (title, author, page count, etc.).

***

### tables?

> `optional` **tables**: [`ExtractedTable`](ExtractedTable.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:821](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L821)

Structured tables extracted from the document.
