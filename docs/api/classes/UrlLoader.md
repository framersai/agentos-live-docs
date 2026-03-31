# Class: UrlLoader

Defined in: [packages/agentos/src/memory/io/ingestion/UrlLoader.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/UrlLoader.ts#L63)

An [IDocumentLoader](../interfaces/IDocumentLoader.md) that fetches a remote URL and delegates parsing
to the appropriate registered loader based on the response `Content-Type`.

### Supported content types
| Content-Type          | Delegates to          |
|-----------------------|-----------------------|
| `text/html`           | HtmlLoader (registry) |
| `application/pdf`     | PdfLoader  (registry) |
| Everything else       | Plain UTF-8 text      |

### Example
```ts
const registry = new LoaderRegistry();
const urlLoader = new UrlLoader(registry);

// Register so the registry also dispatches URLs via canLoad checks.
// (Optional — UrlLoader can be used standalone too.)

if (urlLoader.canLoad('https://example.com/report.pdf')) {
  const doc = await urlLoader.load('https://example.com/report.pdf');
  console.log(doc.format); // 'pdf'
}
```

## Implements

## Implements

- [`IDocumentLoader`](../interfaces/IDocumentLoader.md)

## Constructors

### Constructor

> **new UrlLoader**(`registry`): `UrlLoader`

Defined in: [packages/agentos/src/memory/io/ingestion/UrlLoader.ts:76](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/UrlLoader.ts#L76)

#### Parameters

##### registry

[`LoaderRegistry`](LoaderRegistry.md)

The [LoaderRegistry](LoaderRegistry.md) used to resolve format-specific
                  loaders once the remote content type is known.

#### Returns

`UrlLoader`

## Properties

### supportedExtensions

> `readonly` **supportedExtensions**: `string`[] = `[]`

Defined in: [packages/agentos/src/memory/io/ingestion/UrlLoader.ts:70](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/UrlLoader.ts#L70)

URLs have no file extension so this array is always empty.

Routing to this loader must be performed via [canLoad](#canload) rather than
the registry's extension-based lookup.

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`supportedExtensions`](../interfaces/IDocumentLoader.md#supportedextensions)

## Methods

### canLoad()

> **canLoad**(`source`): `boolean`

Defined in: [packages/agentos/src/memory/io/ingestion/UrlLoader.ts:90](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/UrlLoader.ts#L90)

Returns `true` when `source` is a string that starts with `http://` or
`https://`.

Buffer sources are always rejected — raw bytes cannot be a URL.

#### Parameters

##### source

Absolute file path, URL string, or raw bytes.

`string` | `Buffer`

#### Returns

`boolean`

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`canLoad`](../interfaces/IDocumentLoader.md#canload)

***

### load()

> **load**(`source`, `options?`): `Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

Defined in: [packages/agentos/src/memory/io/ingestion/UrlLoader.ts:119](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/UrlLoader.ts#L119)

Fetch `source` over HTTP/HTTPS and return a [LoadedDocument](../interfaces/LoadedDocument.md).

The response body is buffered in memory and then handed to the appropriate
sub-loader according to the `Content-Type` header:

- `text/html` → fetched as text, passed to the HTML loader as a `Buffer`.
- `application/pdf` → fetched as bytes, passed to the PDF loader as a
   `Buffer`.
- Anything else → returned as plain text with format `'text'` and
  `source` metadata set to the URL.

#### Parameters

##### source

HTTP/HTTPS URL string.

`string` | `Buffer`

##### options?

[`LoadOptions`](../interfaces/LoadOptions.md)

Optional load hints forwarded to the delegated loader.

#### Returns

`Promise`\<[`LoadedDocument`](../interfaces/LoadedDocument.md)\>

A promise resolving to the [LoadedDocument](../interfaces/LoadedDocument.md).

#### Throws

When `source` is a `Buffer` (URLs must be strings).

#### Throws

When the HTTP request fails (network error or non-2xx
                status).

#### Implementation of

[`IDocumentLoader`](../interfaces/IDocumentLoader.md).[`load`](../interfaces/IDocumentLoader.md#load)
