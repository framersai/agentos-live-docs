# Class: ObsidianExporter

Defined in: [packages/agentos/src/memory/io/ObsidianExporter.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ObsidianExporter.ts#L63)

Exports memory traces as an Obsidian-compatible Markdown vault.

**Usage:**
```ts
const exporter = new ObsidianExporter(brain);
await exporter.export('/path/to/obsidian-vault');
```

## Extends

- [`MarkdownExporter`](MarkdownExporter.md)

## Constructors

### Constructor

> **new ObsidianExporter**(`brain`): `ObsidianExporter`

Defined in: [packages/agentos/src/memory/io/MarkdownExporter.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/MarkdownExporter.ts#L67)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The `SqliteBrain` instance to read from.

#### Returns

`ObsidianExporter`

#### Inherited from

[`MarkdownExporter`](MarkdownExporter.md).[`constructor`](MarkdownExporter.md#constructor)

## Properties

### brain

> `protected` `readonly` **brain**: [`SqliteBrain`](SqliteBrain.md)

Defined in: [packages/agentos/src/memory/io/MarkdownExporter.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/MarkdownExporter.ts#L67)

The `SqliteBrain` instance to read from.

#### Inherited from

[`MarkdownExporter`](MarkdownExporter.md).[`brain`](MarkdownExporter.md#brain)

## Methods

### buildFileContent()

> `protected` **buildFileContent**(`trace`): `string`

Defined in: [packages/agentos/src/memory/io/ObsidianExporter.ts:107](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ObsidianExporter.ts#L107)

Build Obsidian-flavoured Markdown for a trace.

Additions over the base implementation:
- Tags are rendered as `#tagName` inline hashtags in the body.
- Related knowledge nodes (found via `knowledge_edges`) are rendered as
  `[[Node Label]]` wikilinks appended at the bottom of the note.

#### Parameters

##### trace

`TraceRow`

Parsed trace row.

#### Returns

`string`

Full Markdown file content with front-matter.

#### Overrides

[`MarkdownExporter`](MarkdownExporter.md).[`buildFileContent`](MarkdownExporter.md#buildfilecontent)

***

### export()

> **export**(`outputDir`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/ObsidianExporter.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ObsidianExporter.ts#L86)

Export all memory traces as Obsidian-flavoured `.md` files.

Pre-fetches all knowledge-edge relationships into an in-memory cache,
then delegates to the parent `export()` method. Directory creation and
file writing are handled there; only `buildFileContent` is overridden.

#### Parameters

##### outputDir

`string`

Root directory to write the Obsidian vault into.

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`MarkdownExporter`](MarkdownExporter.md).[`export`](MarkdownExporter.md#export)

***

### traceRelativePath()

> `protected` **traceRelativePath**(`trace`): `string`

Defined in: [packages/agentos/src/memory/io/MarkdownExporter.ts:130](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/MarkdownExporter.ts#L130)

Determine the relative file path for a trace within the output directory.

Default: `{scope}/{type}/{id}.md`

#### Parameters

##### trace

`TraceRow`

The trace row.

#### Returns

`string`

Relative path string (no leading slash).

#### Inherited from

[`MarkdownExporter`](MarkdownExporter.md).[`traceRelativePath`](MarkdownExporter.md#tracerelativepath)
