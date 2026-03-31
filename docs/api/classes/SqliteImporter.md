# Class: SqliteImporter

Defined in: [packages/agentos/src/memory/io/SqliteImporter.ts:83](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteImporter.ts#L83)

Merges a source SQLite brain file into a target `SqliteBrain`.

**Usage:**
```ts
const importer = new SqliteImporter(targetBrain);
const result = await importer.import('/path/to/source.sqlite');
```

## Constructors

### Constructor

> **new SqliteImporter**(`brain`): `SqliteImporter`

Defined in: [packages/agentos/src/memory/io/SqliteImporter.ts:87](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteImporter.ts#L87)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The target `SqliteBrain` to merge data into.

#### Returns

`SqliteImporter`

## Methods

### import()

> **import**(`sourcePath`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/SqliteImporter.ts:102](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteImporter.ts#L102)

Open `sourcePath` as a read-only SQLite connection, read all tables, and
merge their contents into the target brain.

The source connection is closed when this method returns (even on error).

#### Parameters

##### sourcePath

`string`

Absolute path to the source `.sqlite` file to import.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

`ImportResult` with counts of imported, skipped, and errored items.
