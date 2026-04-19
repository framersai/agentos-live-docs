# Interface: IMigrationTarget

Defined in: [packages/agentos/src/rag/migration/types.ts:116](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L116)

Adapter for writing data to a migration target backend.
Implementations exist for SQLite, Postgres, and Qdrant.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/migration/types.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L133)

Close the connection and release resources.

#### Returns

`Promise`\<`void`\>

***

### ensureTable()

> **ensureTable**(`table`, `sampleRow`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/migration/types.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L123)

Ensure the target schema/collection exists for a table.
Creates it if it doesn't exist, using a sample row to infer column types.

#### Parameters

##### table

`string`

Table name to create.

##### sampleRow

`Record`\<`string`, `unknown`\>

A sample row to derive schema from.

#### Returns

`Promise`\<`void`\>

***

### writeBatch()

> **writeBatch**(`table`, `rows`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/rag/migration/types.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L131)

Write a batch of rows to the target.
Uses INSERT OR REPLACE / upsert semantics to handle duplicates.

#### Parameters

##### table

`string`

Table name to write to.

##### rows

`Record`\<`string`, `unknown`\>[]

Array of row objects.

#### Returns

`Promise`\<`number`\>

Number of rows successfully written.
