# Class: MigrationEngine

Defined in: [packages/agentos/src/rag/migration/MigrationEngine.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/migration/MigrationEngine.ts#L33)

## Constructors

### Constructor

> **new MigrationEngine**(): `MigrationEngine`

#### Returns

`MigrationEngine`

## Methods

### migrate()

> `static` **migrate**(`options`): `Promise`\<[`MigrationResult`](../interfaces/MigrationResult.md)\>

Defined in: [packages/agentos/src/rag/migration/MigrationEngine.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/migration/MigrationEngine.ts#L47)

Migrate data between any two backends.

The engine:
1. Connects to source and lists available tables.
2. For each table, reads rows in streaming batches.
3. Creates the table in the target (if it doesn't exist).
4. Writes each batch to the target.
5. Reports progress after each batch.

#### Parameters

##### options

[`MigrationOptions`](../interfaces/MigrationOptions.md)

Source, target, batch size, and progress callback.

#### Returns

`Promise`\<[`MigrationResult`](../interfaces/MigrationResult.md)\>

Migration result with counts, duration, and any errors.
