# Interface: IDocumentLoader

Defined in: [packages/agentos/src/memory/io/ingestion/IDocumentLoader.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/IDocumentLoader.ts#L32)

Unified interface for all document loaders in the AgentOS ingestion
pipeline.

Implementations handle a specific set of file extensions and are
responsible for:
1. Reading raw bytes from a file path or in-memory `Buffer`.
2. Extracting plain-text `content` and structured `metadata`.
3. Returning a [LoadedDocument](LoadedDocument.md) ready for downstream chunking.

## Example

```ts
const loader: IDocumentLoader = new MarkdownLoader();
if (loader.canLoad('README.md')) {
  const doc = await loader.load('README.md');
  console.log(doc.metadata.title);
}
```

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/IDocumentLoader.ts:40](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/IDocumentLoader.ts#L40)

File extensions this loader handles, each with a leading dot.

Used by [LoaderRegistry](../classes/LoaderRegistry.md) to route file paths to the correct loader.

#### Example

```ts
['.md', '.mdx']
```

## Methods

### canLoad()

> **canLoad**(`source`): `boolean`

Defined in: [packages/agentos/src/memory/io/ingestion/IDocumentLoader.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/IDocumentLoader.ts#L65)

Returns `true` when this loader is capable of handling `source`.

For string sources the check is purely extension-based.  For `Buffer`
sources the loader may inspect magic bytes when relevant.

#### Parameters

##### source

Absolute file path or raw bytes.

`string` | `Buffer`

#### Returns

`boolean`

***

### load()

> **load**(`source`, `options?`): `Promise`\<[`LoadedDocument`](LoadedDocument.md)\>

Defined in: [packages/agentos/src/memory/io/ingestion/IDocumentLoader.ts:55](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/IDocumentLoader.ts#L55)

Parses `source` and returns a normalised [LoadedDocument](LoadedDocument.md).

When `source` is a `string` the loader treats it as an absolute (or
resolvable) file path and reads the file from disk.  When `source` is a
`Buffer` the loader parses the bytes directly and derives as much
metadata as possible from the buffer content alone.

#### Parameters

##### source

Absolute file path OR raw document bytes.

`string` | `Buffer`

##### options?

[`LoadOptions`](LoadOptions.md)

Optional hints such as a format override.

#### Returns

`Promise`\<[`LoadedDocument`](LoadedDocument.md)\>

A promise resolving to the fully-populated [LoadedDocument](LoadedDocument.md).

#### Throws

When the file cannot be read or the format is not parsable.
