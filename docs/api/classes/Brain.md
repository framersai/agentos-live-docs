# Class: Brain

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:409](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L409)

Unified cross-platform connection manager for a single agent's persistent brain.

Uses the `StorageAdapter` interface from `@framers/sql-storage-adapter` to
support multiple backends (better-sqlite3, sql.js, IndexedDB, Postgres, etc.)
transparently. All methods are async.

**Usage:**
```ts
const brain = await Brain.open('/path/to/agent/brain.sqlite');

// Async query API for subsystems
const row = await brain.get<{ value: string }>('SELECT value FROM brain_meta WHERE key = ?', ['schema_version']);

// Meta helpers
await brain.setMeta('last_sync', Date.now().toString());
const ver = await brain.getMeta('schema_version'); // '1'

await brain.close();
```

Subsystems (KnowledgeGraph, MemoryGraph, ConsolidationLoop, etc.)
receive the `Brain` instance and call its async proxy methods
(`run`, `get`, `all`, `exec`, `transaction`) for all database operations.

## Accessors

### adapter

#### Get Signature

> **get** **adapter**(): `StorageAdapter`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:664](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L664)

Expose the raw storage adapter for advanced usage.

Primarily used by SqliteExporter (VACUUM INTO) and SqliteImporter
(which needs direct adapter access for the target brain).

##### Returns

`StorageAdapter`

***

### brainId

#### Get Signature

> **get** **brainId**(): `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:456](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L456)

Brain identifier scoping every query through this Brain instance.
Subsystems (KnowledgeGraph, MemoryGraph, ConsolidationLoop) read this
to inject `brain_id` into their own SQL.

##### Returns

`string`

***

### features

#### Get Signature

> **get** **features**(): `StorageFeatures`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:673](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L673)

Platform-aware feature bundle (dialect, FTS, BLOB codec, exporter).
Consumers use this to generate cross-platform SQL instead of hardcoding
SQLite-specific syntax.

##### Returns

`StorageFeatures`

## Methods

### all()

> **all**\<`T`\>(`sql`, `params?`): `Promise`\<`T`[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:632](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L632)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:812](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L812)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:1036](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L1036)

Close the database connection.

Must be called when the agent shuts down to flush the WAL and release
the file lock. Failing to close may leave the database in WAL mode with
an unconsumed WAL file.

#### Returns

`Promise`\<`void`\>

***

### exec()

> **exec**(`sql`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:641](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L641)

Execute a script containing multiple SQL statements.

#### Parameters

##### sql

`string`

SQL script (semicolon-delimited statements).

#### Returns

`Promise`\<`void`\>

***

### exportToSqlite()

> **exportToSqlite**(`targetPath`): `Promise`\<\{ `bytesWritten`: `number`; \}\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:844](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L844)

Materialize this brain to a portable SQLite file at `targetPath`.

Source can be any backend (SQLite, Postgres, Capacitor, etc.); output
is always a fresh SQLite file. Used by `.wildsoul`-style export and
other portability flows.

Refuses to overwrite an existing file at `targetPath` so callers do
not silently lose data.

Forking semantics: rows are emitted with the source brainId. Importing
the resulting file under a different brainId produces a fork.

#### Parameters

##### targetPath

`string`

Destination file path. File must not exist.

#### Returns

`Promise`\<\{ `bytesWritten`: `number`; \}\>

Bytes written to the destination file.

***

### get()

> **get**\<`T`\>(`sql`, `params?`): `Promise`\<`T` \| `null`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:621](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L621)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:769](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L769)

Read a value from the `brain_meta` key-value store.

#### Parameters

##### key

`string`

The metadata key to look up.

#### Returns

`Promise`\<`string` \| `undefined`\>

The stored string value, or `undefined` if the key does not exist.

***

### importFromSqlite()

> **importFromSqlite**(`sourcePath`, `opts?`): `Promise`\<\{ `tablesImported`: `Record`\<`string`, `number`\>; \}\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:901](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L901)

Load a portable SQLite file into this Brain's adapter.

Forking semantics: rows from the source file are written under the
RECEIVING brain's `brainId`, not the brainId stored in the source
file. This means importing an `alice` snapshot into a Brain opened
with `brainId: 'alice-fork'` produces a fork with no shared identity.

**CAVEAT:** importing from a pre-0.3.0 SQLite file MUTATES the source
file. Opening the source via `Brain.openSqlite` runs the v1 to v2
migration in place. To preserve the source unchanged, copy the file to
a temp path before calling this method.

#### Parameters

##### sourcePath

`string`

Source SQLite file path (typically produced by
  `Brain.exportToSqlite`).

##### opts?

###### strategy?

`"merge"` \| `"replace"`

`'merge'` (default) upserts on PK collision;
  `'replace'` wipes all rows for the receiving `brainId` first.

#### Returns

`Promise`\<\{ `tablesImported`: `Record`\<`string`, `number`\>; \}\>

Counts of rows imported per table.

***

### run()

> **run**(`sql`, `params?`): `Promise`\<`StorageRunResult`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:610](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L610)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:787](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L787)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:654](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L654)

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

### openPostgres()

> `static` **openPostgres**(`connectionString`, `opts`): `Promise`\<`Brain`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:511](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L511)

Open a Brain backed by PostgreSQL. Requires the `pg` npm package and
a reachable Postgres instance.

#### Parameters

##### connectionString

`string`

Standard Postgres connection URL.

##### opts

###### brainId

`string`

REQUIRED. Used to scope every query so multiple
  brains can share one Postgres database without leaking rows.

###### poolSize?

`number`

pg connection pool size. Defaults to 10.

#### Returns

`Promise`\<`Brain`\>

***

### openSqlite()

> `static` **openSqlite**(`path`, `opts?`): `Promise`\<`Brain`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:486](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L486)

Open a Brain backed by SQLite. Tries adapters in order:
better-sqlite3 (Node native) -> sql.js (WASM) -> indexeddb (browser).

#### Parameters

##### path

`string`

File path. Use `:memory:` for in-process testing.

##### opts?

###### brainId?

`string`

Optional explicit brainId; defaults to file basename
  (or `'default'` for `:memory:`).

###### priority?

(`"better-sqlite3"` \| `"sqljs"` \| `"indexeddb"`)[]

Override the default adapter priority.

#### Returns

`Promise`\<`Brain`\>

A fully initialised `Brain` instance with the v2 schema.

***

### openWithAdapter()

> `static` **openWithAdapter**(`adapter`, `opts?`): `Promise`\<`Brain`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/Brain.ts:557](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/Brain.ts#L557)

Open a Brain with a pre-resolved StorageAdapter. Use when sharing an
adapter across subsystems (e.g., wilds-ai foundation pool + brain) or
when the consumer needs full control over adapter resolution.

**CONCURRENCY CAVEAT (Postgres adapters):** the underlying
`PostgresAdapter` tracks `transactionalClient` as instance-shared
mutable state. Two concurrent `Brain.transaction(...)` calls on the
same shared adapter (or any subsystem call that internally opens a
transaction) will overwrite each other's connection assignment, which
corrupts both transactions silently. If the consumer dispatches
concurrent writes through subsystems sharing one adapter, either:
  1. construct a fresh `PostgresAdapter` per logical actor, OR
  2. serialize transactions at the consumer layer until the adapter
     gets `AsyncLocalStorage`-tracked transactional clients.
Non-transactional concurrent reads/writes against a shared adapter
are safe (the pool handles those correctly).

#### Parameters

##### adapter

`StorageAdapter`

Pre-built StorageAdapter instance.

##### opts?

###### brainId?

`string`

Required for postgres-kind adapters; optional for
  sqlite-kind adapters (defaults to `'default'`).

#### Returns

`Promise`\<`Brain`\>
