# Class: SqliteExporter

Defined in: [packages/agentos/src/memory/io/SqliteExporter.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteExporter.ts#L30)

Exports a `SqliteBrain` as a portable SQLite file.

**Usage:**
```ts
const exporter = new SqliteExporter(brain);
await exporter.export('/path/to/backup.sqlite');
```

## Constructors

### Constructor

> **new SqliteExporter**(`brain`): `SqliteExporter`

Defined in: [packages/agentos/src/memory/io/SqliteExporter.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteExporter.ts#L34)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The `SqliteBrain` instance to export.

#### Returns

`SqliteExporter`

## Methods

### export()

> **export**(`outputPath`, `_options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/SqliteExporter.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/SqliteExporter.ts#L54)

Copy the brain database to `outputPath`.

Uses `VACUUM INTO` which:
- Checkpoints all WAL frames into the output file.
- Creates a compact, defragmented copy (no `-wal` or `-shm` sidecar).
- Is safe to run while the database is open and being written to.

The parent directory of `outputPath` must already exist.

#### Parameters

##### outputPath

`string`

Absolute path for the SQLite backup file.

##### \_options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Export options (unused — SQLite export always includes
  all data including embeddings).

#### Returns

`Promise`\<`void`\>
