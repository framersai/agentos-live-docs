# Class: DocxLoader

Defined in: [packages/agentos/src/memory/io/ingestion/DocxLoader.ts:71](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/DocxLoader.ts#L71)

Document loader for Microsoft Word (`.docx`) files.

Uses `mammoth.extractRawText()` to strip all styling and return plain
prose text, which is then stored as the `content` field.  The `metadata`
block includes an approximate `wordCount`.

## Implements

## Example

```ts
const loader = new DocxLoader();
const doc = await loader.load('/docs/spec.docx');
console.log(doc.metadata.wordCount); // e.g. 1842
```

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new DocxLoader**(): `DocxLoader`

#### Returns

`DocxLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/DocxLoader.ts:73](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/DocxLoader.ts#L73)

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

Defined in: [packages/agentos/src/memory/io/ingestion/DocxLoader.ts:80](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/DocxLoader.ts#L80)

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

> **load**(`source`, `_options?`): `Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

Defined in: [packages/agentos/src/memory/io/ingestion/DocxLoader.ts:96](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/DocxLoader.ts#L96)

Parses `source` and returns a normalised [LoadedDocument](../interfaces/LoadedDocument.md).

When `source` is a `string` the loader treats it as an absolute (or
resolvable) file path and reads the file from disk.  When `source` is a
`Buffer` the loader parses the bytes directly and derives as much
metadata as possible from the buffer content alone.

#### Parameters

##### source

Absolute file path OR raw document bytes.

`string` | `Buffer`

##### \_options?

[`LoadOptions`](../interfaces/LoadOptions.md)

Optional hints such as a format override.

#### Returns

`Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

A promise resolving to the fully-populated [LoadedDocument](../interfaces/LoadedDocument.md).

#### Throws

When the file cannot be read or the format is not parsable.

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`load`](../interfaces/IDocumentLoader.md#load)
