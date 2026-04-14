# Interface: EmergentRegistryStorageAdapter

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/EmergentToolRegistry.ts#L47)

Minimal storage adapter interface for SQLite persistence.

The registry uses this abstraction so it can work with any SQLite driver
(better-sqlite3, sql.js, Drizzle raw, etc.) without taking a hard dependency.
All methods are async to support both sync and async driver wrappers.

## Methods

### all()

> **all**(`sql`, `params?`): `Promise`\<`unknown`[]\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:73](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/EmergentToolRegistry.ts#L73)

Execute a single SQL query and return all matching rows.

#### Parameters

##### sql

`string`

The SQL SELECT statement.

##### params?

`unknown`[]

Optional positional parameters bound to `?` placeholders.

#### Returns

`Promise`\<`unknown`[]\>

An array of plain objects, one per matching row.

***

### exec()?

> `optional` **exec**(`sql`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/EmergentToolRegistry.ts#L82)

Execute a raw SQL string containing one or more statements.
Used for schema DDL (CREATE TABLE, CREATE INDEX).
Not all adapters support this — the registry falls back to `run()` if absent.

#### Parameters

##### sql

`string`

The raw SQL string to execute.

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`sql`, `params?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:64](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/EmergentToolRegistry.ts#L64)

Execute a single SQL query and return the first matching row.

#### Parameters

##### sql

`string`

The SQL SELECT statement.

##### params?

`unknown`[]

Optional positional parameters bound to `?` placeholders.

#### Returns

`Promise`\<`unknown`\>

The first row as a plain object, or `undefined` if no rows match.

***

### run()

> **run**(`sql`, `params?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/EmergentToolRegistry.ts#L55)

Execute a single SQL statement that does not return rows.
Used for INSERT, UPDATE, DELETE, and DDL statements.

#### Parameters

##### sql

`string`

The SQL statement to execute.

##### params?

`unknown`[]

Optional positional parameters bound to `?` placeholders.

#### Returns

`Promise`\<`unknown`\>
