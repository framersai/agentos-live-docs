# Class: MarkdownExporter

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L63)

Exports memory traces as Markdown files with YAML front-matter.

**Usage:**
```ts
const exporter = new MarkdownExporter(brain);
await exporter.export('/path/to/vault');
```

## Extended by

- [`ObsidianExporter`](ObsidianExporter.md)

## Constructors

### Constructor

> **new MarkdownExporter**(`brain`): `MarkdownExporter`

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L67)

#### Parameters

##### brain

[`Brain`](Brain.md)

The `Brain` instance to read from.

#### Returns

`MarkdownExporter`

## Properties

### brain

> `protected` `readonly` **brain**: [`Brain`](Brain.md)

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L67)

The `Brain` instance to read from.

## Methods

### buildFileContent()

> `protected` **buildFileContent**(`trace`): `string`

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L103)

Build the Markdown content for a single trace.

Subclasses (e.g. `ObsidianExporter`) override this to inject wiki-links
and `#tag` decorations into the body.

#### Parameters

##### trace

`TraceRow`

Parsed trace row from the database.

#### Returns

`string`

Full Markdown file content (front-matter + body).

***

### export()

> **export**(`outputDir`, `_options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L82)

Export all memory traces as `.md` files into `outputDir`.

Directories are created on demand (equivalent to `mkdir -p`).

#### Parameters

##### outputDir

`string`

Root directory to write the Markdown vault into.

##### \_options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration (currently unused but
  accepted for API consistency with other exporters).

#### Returns

`Promise`\<`void`\>

***

### traceRelativePath()

> `protected` **traceRelativePath**(`trace`): `string`

Defined in: [packages/agentos/src/cognition/memory/io/MarkdownExporter.ts:130](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/MarkdownExporter.ts#L130)

Determine the relative file path for a trace within the output directory.

Default: `{scope}/{type}/{id}.md`

#### Parameters

##### trace

`TraceRow`

The trace row.

#### Returns

`string`

Relative path string (no leading slash).
