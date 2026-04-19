# Class: LoaderRegistry

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:104](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L104)

Central registry mapping file extensions to [IDocumentLoader](../interfaces/IDocumentLoader.md)
implementations.

### Built-in loaders (registered automatically)
| Extensions                                         | Loader                |
|----------------------------------------------------|-----------------------|
| `.txt`, `.csv`, `.tsv`, `.json`, `.yaml`, `.yml`  | [TextLoader](TextLoader.md)    |
| `.md`, `.mdx`                                     | [MarkdownLoader](MarkdownLoader.md) |
| `.html`, `.htm`                                   | [HtmlLoader](HtmlLoader.md)    |
| `.pdf`                                            | [PdfLoader](PdfLoader.md)     |
| `.docx`                                           | [DocxLoader](DocxLoader.md)    |

### Conditional loaders (registered when available)
| Condition                     | Loader                                                  |
|-------------------------------|---------------------------------------------------------|
| `tesseract.js` installed      | factory from [createOcrPdfLoader](../functions/createOcrPdfLoader.md) (overrides PDF) |
| `python3 -m docling` available | factory from [createDoclingLoader](../functions/createDoclingLoader.md) (overrides PDF + DOCX) |

### Registering a custom loader
```ts
const registry = new LoaderRegistry();
registry.register(new PdfLoader());
const doc = await registry.loadFile('/reports/q3.pdf');
```

### Using loadFile
```ts
const registry = new LoaderRegistry();
const doc = await registry.loadFile('/notes/meeting.md');
console.log(doc.metadata.title);
```

## Constructors

### Constructor

> **new LoaderRegistry**(): `LoaderRegistry`

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L130)

Creates a new registry pre-populated with the built-in loaders.

Loader registration order determines conflict resolution: later
registrations override earlier ones for the same extension.

Registration order:
1. [TextLoader](TextLoader.md), [MarkdownLoader](MarkdownLoader.md), [HtmlLoader](HtmlLoader.md) — core text formats.
2. [PdfLoader](PdfLoader.md) (with injected OCR + Docling loaders) — PDF extraction.
3. [DocxLoader](DocxLoader.md) — DOCX extraction.
4. Optional: an override from [createOcrPdfLoader](../functions/createOcrPdfLoader.md) when `tesseract.js` is installed.
5. Optional: an override from [createDoclingLoader](../functions/createDoclingLoader.md) when Python Docling is available.
   The Docling-backed loader supports both `.pdf` and `.docx`, so it supersedes both
   PdfLoader and DocxLoader when present.

#### Returns

`LoaderRegistry`

## Methods

### getLoader()

> **getLoader**(`extensionOrPath`): [`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `undefined`

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:198](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L198)

Retrieve the loader registered for `extensionOrPath`.

Both bare extensions (`.md`, `md`) and full file paths
(`/docs/guide.md`) are accepted.

#### Parameters

##### extensionOrPath

`string`

File extension or full path.

#### Returns

[`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `undefined`

The matching [IDocumentLoader](../interfaces/IDocumentLoader.md), or `undefined` when no
         loader is registered for the detected extension.

#### Example

```ts
const loader = registry.getLoader('.md');
const loader2 = registry.getLoader('README.md');
```

***

### getSupportedExtensions()

> **getSupportedExtensions**(): `string`[]

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:215](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L215)

Return a sorted array of all extensions currently registered.

Each extension is returned with a leading dot in lower-case, e.g.
`['.csv', '.htm', '.html', '.json', '.md', …]`.

#### Returns

`string`[]

Sorted array of registered extension strings.

***

### loadFile()

> **loadFile**(`filePath`, `options?`): `Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:239](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L239)

Convenience method: detect format from `filePath`, find the matching
loader, and delegate to its `load()` method.

#### Parameters

##### filePath

`string`

Absolute (or resolvable relative) file path.

##### options?

[`LoadOptions`](../interfaces/LoadOptions.md)

Optional load hints forwarded to the loader.

#### Returns

`Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

A promise resolving to the [LoadedDocument](../interfaces/LoadedDocument.md).

#### Throws

When no loader is registered for the file's extension.

#### Throws

When the underlying loader's `load()` throws.

#### Example

```ts
const doc = await registry.loadFile('/notes/architecture.md');
```

***

### register()

> **register**(`loader`): `void`

Defined in: [packages/agentos/src/memory/io/ingestion/LoaderRegistry.ts:172](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/ingestion/LoaderRegistry.ts#L172)

Register a loader for all extensions it declares.

If a previously registered loader already handles one of the extension,
it is replaced.  This makes it trivial to swap in a higher-fidelity
implementation for any format.

#### Parameters

##### loader

[`IDocumentLoader`](../interfaces/IDocumentLoader.md)

The loader instance to register.

#### Returns

`void`

#### Example

```ts
registry.register(new PdfLoader());
```
