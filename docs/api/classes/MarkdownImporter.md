# Class: MarkdownImporter

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/MarkdownImporter.ts#L53)

Imports Markdown files from a directory into a `SqliteBrain`.

**Usage:**
```ts
const importer = new MarkdownImporter(brain);
const result = await importer.import('/path/to/vault');
console.log(result.imported, result.skipped);
```

## Extended by

- [`ObsidianImporter`](ObsidianImporter.md)

## Constructors

### Constructor

> **new MarkdownImporter**(`brain`): `MarkdownImporter`

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/MarkdownImporter.ts#L57)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The target `SqliteBrain` to import into.

#### Returns

`MarkdownImporter`

## Properties

### brain

> `protected` `readonly` **brain**: [`SqliteBrain`](SqliteBrain.md)

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/MarkdownImporter.ts#L57)

The target `SqliteBrain` to import into.

## Methods

### import()

> **import**(`sourceDir`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:72](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/MarkdownImporter.ts#L72)

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

***

### postProcess()

> `protected` **postProcess**(`_filePath`, `_frontmatter`, `_body`, `_result`, `_traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/MarkdownImporter.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/MarkdownImporter.ts#L100)

Post-process a parsed file before it is inserted into the database.

The base implementation is a no-op.  `ObsidianImporter` overrides this
to extract `[[wikilinks]]` and `#tags`.

#### Parameters

##### \_filePath

`string`

Absolute path of the source file.

##### \_frontmatter

`TraceFrontmatter`

Parsed front-matter data.

##### \_body

`string`

Markdown body content.

##### \_result

[`ImportResult`](../interfaces/ImportResult.md)

Mutable result accumulator.

##### \_traceId

`string`

The ID assigned (or taken from front-matter) for this trace.

#### Returns

`Promise`\<`void`\>
