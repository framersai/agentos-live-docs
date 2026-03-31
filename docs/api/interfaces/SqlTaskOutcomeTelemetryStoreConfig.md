# Interface: SqlTaskOutcomeTelemetryStoreConfig

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:12](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L12)

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

***

### tableName?

> `optional` **tableName**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L17)

SQL table used for persisted KPI windows.
Default: `agentos_task_outcome_kpi_windows`
