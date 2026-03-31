# Interface: IMigrationSource

Defined in: [packages/agentos/src/rag/migration/types.ts:95](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/migration/types.ts#L95)

Adapter for reading data from a migration source backend.
Implementations exist for SQLite, Postgres, and Qdrant.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/migration/types.ts:109](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/migration/types.ts#L109)

Close the connection and release resources.

#### Returns

`Promise`\<`void`\>

***

### countRows()

> **countRows**(`table`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/rag/migration/types.ts:99](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/migration/types.ts#L99)

Count rows/points in a table.

#### Parameters

##### table

`string`

#### Returns

`Promise`\<`number`\>

***

### listTables()

> **listTables**(): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/rag/migration/types.ts:97](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/migration/types.ts#L97)

List table/collection names available for migration.

#### Returns

`Promise`\<`string`[]\>

***

### readBatch()

> **readBatch**(`table`, `offset`, `limit`): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [packages/agentos/src/rag/migration/types.ts:107](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/migration/types.ts#L107)

Read a batch of rows starting at offset.

#### Parameters

##### table

`string`

Table name to read from.

##### offset

`number`

Number of rows to skip.

##### limit

`number`

Maximum rows to return.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>[]\>

Array of row objects with column values.
