# Interface: IngestOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:393](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L393)

Options controlling a document-ingestion job launched via `Memory.ingest()`.

## Properties

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:410](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L410)

Glob patterns for paths to exclude.

#### Example

```ts
['node_modules/**', '**/*.test.*']
```

***

### format?

> `optional` **format**: `"markdown"` \| `"auto"` \| `"obsidian"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:419](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L419)

Format hint for the ingested content.
- `'auto'`      – detect from file extension / mime type.
- `'obsidian'`  – parse Obsidian wiki-links and front-matter.
- `'markdown'`  – treat as plain CommonMark.

#### Default

```ts
'auto'
```

***

### include?

> `optional` **include**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:404](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L404)

Glob patterns for file types to include.

#### Example

```ts
['**/*.md', '**/*.pdf']
```

***

### onProgress()?

> `optional` **onProgress**: (`processed`, `total`, `current`) => `void`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:428](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L428)

Callback invoked as each file is processed.
Useful for building progress UI.

#### Parameters

##### processed

`number`

number of files completed so far

##### total

`number`

total number of files discovered

##### current

`string`

path of the file currently being processed

#### Returns

`void`

***

### recursive?

> `optional` **recursive**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:398](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L398)

Whether to recursively scan sub-directories when `source` is a directory.

#### Default

```ts
false
```
