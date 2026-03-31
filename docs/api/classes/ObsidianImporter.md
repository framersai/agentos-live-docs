# Class: ObsidianImporter

Defined in: [packages/agentos/src/memory/io/ObsidianImporter.ts:80](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ObsidianImporter.ts#L80)

Imports an Obsidian vault (directory of Markdown files) into a `SqliteBrain`.

**Usage:**
```ts
const importer = new ObsidianImporter(brain);
const result = await importer.import('/path/to/obsidian-vault');
```

## Extends

- [`MarkdownImporter`](MarkdownImporter.md)

## Constructors

### Constructor

> **new ObsidianImporter**(`brain`): `ObsidianImporter`

Defined in: [packages/agentos/src/memory/io/ObsidianImporter.ts:84](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ObsidianImporter.ts#L84)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The target `SqliteBrain` to import into.

#### Returns

`ObsidianImporter`

#### Overrides

[`MarkdownImporter`](MarkdownImporter.md).[`constructor`](MarkdownImporter.md#constructor)

## Properties

### brain

> `protected` `readonly` **brain**: [`SqliteBrain`](SqliteBrain.md)

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/MarkdownImporter.ts#L57)

The target `SqliteBrain` to import into.

#### Inherited from

[`MarkdownImporter`](MarkdownImporter.md).[`brain`](MarkdownImporter.md#brain)

## Methods

### import()

> **import**(`sourceDir`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:72](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/MarkdownImporter.ts#L72)

Recursively walk `sourceDir`, parse every `.md` file, and insert traces.

Non-Markdown files are silently ignored.  Files that fail to parse are
recorded in `result.errors` and processing continues.

#### Parameters

##### sourceDir

`string`

Directory to recursively scan for `.md` files.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

`ImportResult` with counts of imported, skipped, and errored items.

#### Inherited from

[`MarkdownImporter`](MarkdownImporter.md).[`import`](MarkdownImporter.md#import)

***

### postProcess()

> `protected` **postProcess**(`_filePath`, `_frontmatter`, `body`, `result`, `traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/ObsidianImporter.ts:105](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ObsidianImporter.ts#L105)

Post-process a successfully imported Markdown file:

1. Warn about any embedded images (`![[...]]`).
2. Extract inline `#hashtags` and merge them into the trace's tag list.
3. Parse `[[wikilinks]]` and create `knowledge_edges` entries.

#### Parameters

##### \_filePath

`string`

Absolute path of the source file (unused here).

##### \_frontmatter

`TraceFrontmatter`

Parsed front-matter data.

##### body

`string`

Markdown body (content after front-matter).

##### result

[`ImportResult`](../interfaces/ImportResult.md)

Mutable `ImportResult` accumulator.

##### traceId

`string`

The ID of the just-inserted trace.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`MarkdownImporter`](MarkdownImporter.md).[`postProcess`](MarkdownImporter.md#postprocess)
