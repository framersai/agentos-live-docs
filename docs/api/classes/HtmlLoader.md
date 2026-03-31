# Class: HtmlLoader

Defined in: [packages/agentos/src/memory/io/ingestion/HtmlLoader.ts:175](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ingestion/HtmlLoader.ts#L175)

Basic document loader for HTML (`.html`, `.htm`) files.

### Text extraction strategy
1. `<script>` and `<style>` blocks are removed entirely.
2. Block-level elements (`<p>`, `<div>`, `<h1>`–`<h6>`, etc.) are replaced
   with newline characters to preserve paragraph structure.
3. All remaining HTML tags are stripped.
4. A common subset of HTML entities is decoded.
5. Excessive whitespace is collapsed.

### Metadata
- `title` — extracted from the `<title>` element when present.
- `wordCount` — approximate count of words in the extracted text.
- `source` — absolute file path (when loaded from disk).

## Implements

## Example

```ts
const loader = new HtmlLoader();
const doc = await loader.load('/public/index.html');
console.log(doc.metadata.title); // e.g. 'Welcome to AgentOS'
```

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new HtmlLoader**(): `HtmlLoader`

#### Returns

`HtmlLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/HtmlLoader.ts:177](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ingestion/HtmlLoader.ts#L177)

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

Defined in: [packages/agentos/src/memory/io/ingestion/HtmlLoader.ts:184](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ingestion/HtmlLoader.ts#L184)

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

Defined in: [packages/agentos/src/memory/io/ingestion/HtmlLoader.ts:196](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ingestion/HtmlLoader.ts#L196)

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
