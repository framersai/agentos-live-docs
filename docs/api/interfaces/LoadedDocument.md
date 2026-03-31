# Interface: LoadedDocument

Defined in: [packages/agentos/src/memory/io/facade/types.ts:788](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L788)

The parsed representation of a document returned by `Memory.load()`.
Contains full text, optional chunks, and any extracted images/tables.

## Properties

### chunks?

> `optional` **chunks**: [`DocumentChunk`](DocumentChunk.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:802](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L802)

Pre-chunked segments, present when chunking was requested during load.

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:792](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L792)

Full extracted text content of the document.

***

### format

> **format**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:819](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L819)

The format that was detected or used to parse the document.

#### Example

```ts
'pdf' | 'md' | 'docx' | 'txt'
```

***

### images?

> `optional` **images**: [`ExtractedImage`](ExtractedImage.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:808](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L808)

Images extracted from the document.
Populated only when `IngestionConfig.extractImages` is `true`.

***

### metadata

> **metadata**: [`DocumentMetadata`](DocumentMetadata.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:797](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L797)

Document-level metadata (title, author, page count, etc.).

***

### tables?

> `optional` **tables**: [`ExtractedTable`](ExtractedTable.md)[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:813](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L813)

Structured tables extracted from the document.
