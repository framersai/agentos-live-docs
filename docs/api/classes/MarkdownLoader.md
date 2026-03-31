# Class: MarkdownLoader

Defined in: [packages/agentos/src/memory/io/ingestion/MarkdownLoader.ts:114](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/ingestion/MarkdownLoader.ts#L114)

Document loader for Markdown (`.md`) and MDX (`.mdx`) files.

### Front-matter handling
YAML front-matter delimited by `---` is parsed via `gray-matter`.  All
key-value pairs are merged into [DocumentMetadata](../interfaces/DocumentMetadata.md) as-is, with a
handful of well-known keys (`title`, `author`, `createdAt`, `modifiedAt`,
`language`) mapped to the corresponding typed metadata fields.

### Title extraction fallback
When the front-matter does **not** contain a `title` field the loader
searches the document body for the first level-1 ATX heading (`# Title`)
and uses that as the title.

### Returned content
The `content` field in the returned [LoadedDocument](../interfaces/LoadedDocument.md) contains the
Markdown body **without** the front-matter block.

## Implements

## Example

```ts
const loader = new MarkdownLoader();
const doc = await loader.load('/docs/architecture.md');
console.log(doc.metadata.title); // from front-matter or first # heading
```

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new MarkdownLoader**(): `MarkdownLoader`

#### Returns

`MarkdownLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/MarkdownLoader.ts:116](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/ingestion/MarkdownLoader.ts#L116)

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

Defined in: [packages/agentos/src/memory/io/ingestion/MarkdownLoader.ts:123](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/ingestion/MarkdownLoader.ts#L123)

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

Defined in: [packages/agentos/src/memory/io/ingestion/MarkdownLoader.ts:137](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/ingestion/MarkdownLoader.ts#L137)

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
