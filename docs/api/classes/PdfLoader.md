# Class: PdfLoader

Defined in: [packages/agentos/src/memory/io/ingestion/PdfLoader.ts:93](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/PdfLoader.ts#L93)

Document loader for PDF files.

### Extraction tiers
1. **unpdf** — always used as the primary extraction engine.  Performs
   pure-JS PDF text layer extraction with no native binaries required.
2. **OCR fallback** (optional) — supplied at construction time and engaged
   automatically when unpdf yields sparse text (< 50 chars per page on
   average), indicating a scanned document.
3. **Docling fallback** (optional) — when provided, takes precedence over both
   unpdf and OCR, yielding the highest-fidelity extraction at the cost of
   requiring a Python runtime.

## Implements

## Example

```ts
const ocrLoader    = createOcrPdfLoader();   // null if tesseract.js absent
const doclingLoader = createDoclingLoader(); // null if docling absent
const pdfLoader = new PdfLoader(ocrLoader, doclingLoader);
const doc = await pdfLoader.load('/reports/q3.pdf');
```

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new PdfLoader**(`ocrLoader?`, `doclingLoader?`): `PdfLoader`

Defined in: [packages/agentos/src/memory/io/ingestion/PdfLoader.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/PdfLoader.ts#L116)

Creates a new PdfLoader.

#### Parameters

##### ocrLoader?

Optional OCR fallback (for example from `createOcrPdfLoader()`).

[`IDocumentLoader`](../interfaces/IDocumentLoader.md) | `null`

##### doclingLoader?

Optional Docling loader (for example from `createDoclingLoader()`).

[`IDocumentLoader`](../interfaces/IDocumentLoader.md) | `null`

#### Returns

`PdfLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/PdfLoader.ts:95](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/PdfLoader.ts#L95)

File extensions this loader handles, each with a leading dot.

Used by [LoaderRegistry](LoaderRegistry.md) to route file paths to the correct loader.

#### Example

```ts
['.md', '.mdx']
```

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`supportedExtensions`](../interfaces/IDocumentLoader.md#supportedextensions)

## Methods

### canLoad()

> **canLoad**(`source`): `boolean`

Defined in: [packages/agentos/src/memory/io/ingestion/PdfLoader.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/PdfLoader.ts#L129)

Returns `true` when this loader is capable of handling `source`.

For string sources the check is purely extension-based.  For `Buffer`
sources the loader may inspect magic bytes when relevant.

#### Parameters

##### source

Absolute file path or raw bytes.

`string` | `Buffer`

#### Returns

`boolean`

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`canLoad`](../interfaces/IDocumentLoader.md#canload)

***

### load()

> **load**(`source`, `options?`): `Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

Defined in: [packages/agentos/src/memory/io/ingestion/PdfLoader.ts:148](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/PdfLoader.ts#L148)

Parses `source` and returns a normalised [LoadedDocument](../interfaces/LoadedDocument.md).

When `source` is a `string` the loader treats it as an absolute (or
resolvable) file path and reads the file from disk.  When `source` is a
`Buffer` the loader parses the bytes directly and derives as much
metadata as possible from the buffer content alone.

#### Parameters

##### source

Absolute file path OR raw document bytes.

`string` | `Buffer`

##### options?

[`LoadOptions`](../interfaces/LoadOptions.md)

Optional hints such as a format override.

#### Returns

`Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

A promise resolving to the fully-populated [LoadedDocument](../interfaces/LoadedDocument.md).

#### Throws

When the file cannot be read or the format is not parsable.

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`load`](../interfaces/IDocumentLoader.md#load)
