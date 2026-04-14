# Interface: AgentOsSqlStorageConfig

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:61](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L61)

Configuration options for the AgentOS SQL storage adapter.

Extends the base storage resolution options with AgentOS-specific settings.

## Interface

AgentOsSqlStorageConfig

## Example

```typescript
const config: AgentOsSqlStorageConfig = {
  filePath: './agentos.db',
  priority: ['better-sqlite3', 'sqljs'],
  enableAutoMigration: true,
  messageRetentionDays: 90 // Keep 3 months of history
};
```

## Extends

- `StorageResolutionOptions`

## Properties

### capacitor?

> `optional` **capacitor**: `CapacitorAdapterOptions`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:12

Options passed to the Capacitor adapter.

#### Inherited from

`StorageResolutionOptions.capacitor`

***

### enableAutoMigration?

> `optional` **enableAutoMigration**: `boolean`

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:62](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L62)

Automatically run schema migrations on init

***

### filePath?

> `optional` **filePath**: `string`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:8

Absolute path for sqlite file (used by better-sqlite3/sql.js when persistence is desired).

#### Inherited from

`StorageResolutionOptions.filePath`

***

### indexedDb?

> `optional` **indexedDb**: `IndexedDbAdapterOptions`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:18

Options passed to the IndexedDB adapter (browser persistence).

#### Inherited from

`StorageResolutionOptions.indexedDb`

***

### messageRetentionDays?

> `optional` **messageRetentionDays**: `number`

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L63)

Auto-delete messages older than X days (0 = disabled)

***

### openOptions?

> `optional` **openOptions**: `StorageOpenOptions`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:20

Options forwarded to adapter.open.

#### Inherited from

`StorageResolutionOptions.openOptions`

***

### postgres?

> `optional` **postgres**: `object`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:14

Options passed to the Postgres adapter.

#### connectionString?

> `optional` **connectionString**: `string`

#### Inherited from

`StorageResolutionOptions.postgres`

***

### priority?

> `optional` **priority**: `AdapterKind`[]

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:10

Explicit adapter priority override.

#### Inherited from

`StorageResolutionOptions.priority`

***

### quiet?

> `optional` **quiet**: `boolean`

Defined in: packages/sql-storage-adapter/dist/core/resolver.d.ts:22

Suppress fallback chain logs (adapter not-found warnings). Default: false.

#### Inherited from

`StorageResolutionOptions.quiet`
