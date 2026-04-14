# Class: TextLoader

Defined in: [packages/agentos/src/memory/io/ingestion/TextLoader.ts:127](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/ingestion/TextLoader.ts#L127)

Loader for plain-text, CSV, TSV, JSON, and YAML files.

The loader performs minimal transformation:
- **`.json`** — re-serialises with pretty-printing so stored content is
  consistently formatted.
- **`.yaml` / `.yml`** — the `yaml` package is used to parse and re-dump
  for consistent formatting; falls back to raw text on parse error.
- All other extensions — content is returned as-is.

Metadata includes the approximate `wordCount` and a `format` label derived
from the file extension.

## Implements

## Example

```ts
const loader = new TextLoader();
const doc = await loader.load('/data/notes.txt');
console.log(doc.metadata.wordCount); // e.g. 312
```

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new TextLoader**(): `TextLoader`

#### Returns

`TextLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/TextLoader.ts:129](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/ingestion/TextLoader.ts#L129)

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

Defined in: [packages/agentos/src/memory/io/ingestion/TextLoader.ts:136](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/ingestion/TextLoader.ts#L136)

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

Defined in: [packages/agentos/src/memory/io/ingestion/TextLoader.ts:150](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/ingestion/TextLoader.ts#L150)

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
