# Class: FolderScanner

Defined in: [packages/agentos/src/memory/io/ingestion/FolderScanner.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/ingestion/FolderScanner.ts#L111)

Recursively scans a directory and loads every file whose extension has a
registered loader in the supplied `LoaderRegistry`.

### Example
```ts
const registry = new LoaderRegistry();
const scanner  = new FolderScanner(registry);

const result = await scanner.scan('/knowledge-base', {
  recursive:  true,
  include:    ['**/*.md', '**/*.pdf'],
  exclude:    ['**/node_modules/**'],
  onProgress: (file, i, total) => console.log(`${i}/${total} ${file}`),
});

console.log(`Loaded ${result.documents.length} documents`);
console.log(`Failed: ${result.failed.length}`);
```

## Constructors

### Constructor

> **new FolderScanner**(`registry`): `FolderScanner`

Defined in: [packages/agentos/src/memory/io/ingestion/FolderScanner.ts:116](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/ingestion/FolderScanner.ts#L116)

#### Parameters

##### registry

[`LoaderRegistry`](LoaderRegistry.md)

The `LoaderRegistry` used to dispatch each file to
                  the appropriate loader.

#### Returns

`FolderScanner`

## Methods

### scan()

> **scan**(`dirPath`, `options?`): `Promise`\<`FolderScanResult`\>

Defined in: [packages/agentos/src/memory/io/ingestion/FolderScanner.ts:136](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/ingestion/FolderScanner.ts#L136)

Walk `dirPath` and load every matching file.

Files are discovered first and then loaded sequentially.  Errors thrown
by individual loaders are caught and accumulated in
the returned `failed` list rather than propagating.

#### Parameters

##### dirPath

`string`

Absolute path to the directory to scan.

##### options?

`FolderScanOptions` = `{}`

Optional include/exclude filters and progress callback.

#### Returns

`Promise`\<`FolderScanResult`\>

A promise that resolves to a `FolderScanResult`.

#### Throws

When `dirPath` cannot be read as a directory (e.g.
                it does not exist or is a regular file).
