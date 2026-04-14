# Interface: MigrationResult

Defined in: [packages/agentos/src/rag/migration/types.ts:74](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L74)

Result returned after a migration completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/rag/migration/types.ts:80](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L80)

Wall-clock duration in milliseconds.

***

### errors

> **errors**: `string`[]

Defined in: [packages/agentos/src/rag/migration/types.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L84)

Any errors encountered (non-fatal errors are collected, not thrown).

***

### tablesProcessed

> **tablesProcessed**: `string`[]

Defined in: [packages/agentos/src/rag/migration/types.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L76)

Names of tables that were processed.

***

### totalRows

> **totalRows**: `number`

Defined in: [packages/agentos/src/rag/migration/types.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L78)

Total rows migrated across all tables.

***

### verified

> **verified**: `boolean`

Defined in: [packages/agentos/src/rag/migration/types.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L82)

True if post-migration verification passed.
