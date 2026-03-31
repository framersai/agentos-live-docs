# Interface: IngestOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:385](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L385)

Options controlling a document-ingestion job launched via `Memory.ingest()`.

## Properties

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:402](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L402)

Glob patterns for paths to exclude.

#### Example

```ts
['node_modules/**', '**/*.test.*']
```

***

### format?

> `optional` **format**: `"markdown"` \| `"auto"` \| `"obsidian"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:411](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L411)

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

Defined in: [packages/agentos/src/memory/io/facade/types.ts:396](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L396)

Glob patterns for file types to include.

#### Example

```ts
['**/*.md', '**/*.pdf']
```

***

### onProgress()?

> `optional` **onProgress**: (`processed`, `total`, `current`) => `void`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:420](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L420)

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

Defined in: [packages/agentos/src/memory/io/facade/types.ts:390](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L390)

Whether to recursively scan sub-directories when `source` is a directory.

#### Default

```ts
false
```
