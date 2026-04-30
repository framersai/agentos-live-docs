# Class: SqliteBrain

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:329](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L329)

Unified cross-platform connection manager for a single agent's persistent brain.

Uses the `StorageAdapter` interface from `@framers/sql-storage-adapter` to
support multiple backends (better-sqlite3, sql.js, IndexedDB, Postgres, etc.)
transparently. All methods are async.

**Usage:**
```ts
const brain = await SqliteBrain.open('/path/to/agent/brain.sqlite');

// Async query API for subsystems
const row = await brain.get<{ value: string }>('SELECT value FROM brain_meta WHERE key = ?', ['schema_version']);

// Meta helpers
await brain.setMeta('last_sync', Date.now().toString());
const ver = await brain.getMeta('schema_version'); // '1'

await brain.close();
```

Subsystems (KnowledgeGraph, MemoryGraph, ConsolidationLoop, etc.)
receive the `SqliteBrain` instance and call its async proxy methods
(`run`, `get`, `all`, `exec`, `transaction`) for all database operations.

## Accessors

### adapter

#### Get Signature

> **get** **adapter**(): `StorageAdapter`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:480](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L480)

Expose the raw storage adapter for advanced usage.

Primarily used by SqliteExporter (VACUUM INTO) and SqliteImporter
(which needs direct adapter access for the target brain).

##### Returns

`StorageAdapter`

***

### features

#### Get Signature

> **get** **features**(): `StorageFeatures`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:489](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L489)

Platform-aware feature bundle (dialect, FTS, BLOB codec, exporter).
Consumers use this to generate cross-platform SQL instead of hardcoding
SQLite-specific syntax.

##### Returns

`StorageFeatures`

## Methods

### all()

> **all**\<`T`\>(`sql`, `params?`): `Promise`\<`T`[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:448](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L448)

Retrieve all rows matching the statement.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### sql

`string`

SQL SELECT statement.

##### params?

`StorageParameters`

Parameter array.

#### Returns

`Promise`\<`T`[]\>

Array of matching rows (empty array if none).

***

### checkEmbeddingCompat()

> **checkEmbeddingCompat**(`dimensions`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:613](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L613)

Check whether a given embedding dimension is compatible with this brain.

On first call (no stored `embedding_dimensions`), returns `true` and stores
the provided dimension for future compatibility checks.

Subsequent calls compare `dimensions` against the stored value.
Mismatches indicate that a different embedding model was used to encode
memories — mixing dimensions would corrupt vector similarity searches.

#### Parameters

##### dimensions

`number`

The embedding vector length to check (e.g. 1536 for OpenAI ada-002).

#### Returns

`Promise`\<`boolean`\>

`true` if compatible (or no prior value), `false` on mismatch.

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:632](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L632)

Close the database connection.

Must be called when the agent shuts down to flush the WAL and release
the file lock. Failing to close may leave the database in WAL mode with
an unconsumed WAL file.

#### Returns

`Promise`\<`void`\>

***

### exec()

> **exec**(`sql`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:457](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L457)

Execute a script containing multiple SQL statements.

#### Parameters

##### sql

`string`

SQL script (semicolon-delimited statements).

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**\<`T`\>(`sql`, `params?`): `Promise`\<`T` \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:437](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L437)

Retrieve a single row (or null if none found).

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### sql

`string`

SQL SELECT statement.

##### params?

`StorageParameters`

Parameter array.

#### Returns

`Promise`\<`T` \| `null`\>

First matching row or null.

***

### getMeta()

> **getMeta**(`key`): `Promise`\<`string` \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:575](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L575)

Read a value from the `brain_meta` key-value store.

#### Parameters

##### key

`string`

The metadata key to look up.

#### Returns

`Promise`\<`string` \| `undefined`\>

The stored string value, or `undefined` if the key does not exist.

***

### run()

> **run**(`sql`, `params?`): `Promise`\<`StorageRunResult`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:426](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L426)

Execute a mutation statement (INSERT, UPDATE, DELETE).

#### Parameters

##### sql

`string`

SQL statement with `?` positional placeholders.

##### params?

`StorageParameters`

Parameter array matching the placeholders.

#### Returns

`Promise`\<`StorageRunResult`\>

Metadata about affected rows.

***

### setMeta()

> **setMeta**(`key`, `value`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:593](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L593)

Upsert a value into the `brain_meta` key-value store.

Uses `INSERT OR REPLACE` semantics — creates the row if absent, or
overwrites if present.

#### Parameters

##### key

`string`

The metadata key.

##### value

`string`

The string value to store.

#### Returns

`Promise`\<`void`\>

***

### transaction()

> **transaction**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:470](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L470)

Execute a callback within a database transaction.

The transaction is automatically committed on success or rolled back
on error.

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`trx`) => `Promise`\<`T`\>

Async callback receiving a transactional adapter.

#### Returns

`Promise`\<`T`\>

Result of the callback.

***

### create()

> `static` **create**(`dbPath`): `Promise`\<`SqliteBrain`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:411](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L411)

Alias for `open()` — matches the naming convention used by WildsMemoryFacade.

#### Parameters

##### dbPath

`string`

Absolute path to the `.sqlite` file.

#### Returns

`Promise`\<`SqliteBrain`\>

A fully initialised `SqliteBrain` instance.

***

### open()

> `static` **open**(`dbPath`): `Promise`\<`SqliteBrain`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteBrain.ts:378](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteBrain.ts#L378)

Create or open the agent's brain database at `dbPath`.

Async factory that replaces the previous synchronous constructor.

Initialization sequence:
1. Resolve the best available storage adapter for the current runtime.
2. Enable WAL journal mode for concurrent read access (when supported).
3. Enable foreign key enforcement (OFF by default in SQLite).
4. Execute the full DDL schema (all `CREATE TABLE IF NOT EXISTS`).
5. Create the FTS5 virtual table for full-text memory search.
6. Seed `brain_meta` with `schema_version` and `created_at` if absent.

#### Parameters

##### dbPath

`string`

Absolute path to the `.sqlite` file. The file is created
  if it does not exist; parent directories must already exist.

#### Returns

`Promise`\<`SqliteBrain`\>

A fully initialised `SqliteBrain` instance.
