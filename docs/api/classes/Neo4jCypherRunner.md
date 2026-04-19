# Class: Neo4jCypherRunner

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:16](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L16)

Helper for running parameterized Cypher queries.

## Constructors

### Constructor

> **new Neo4jCypherRunner**(`connectionManager`): `Neo4jCypherRunner`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:17](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L17)

#### Parameters

##### connectionManager

[`Neo4jConnectionManager`](Neo4jConnectionManager.md)

#### Returns

`Neo4jCypherRunner`

## Methods

### read()

> **read**\<`T`\>(`cypher`, `params?`): `Promise`\<`T`[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L23)

Execute a read-only Cypher query with automatic session management.
Returns result records mapped to plain objects.

#### Type Parameters

##### T

`T` = `Record`\<`string`, `unknown`\>

#### Parameters

##### cypher

`string`

##### params?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<`T`[]\>

***

### write()

> **write**\<`T`\>(`cypher`, `params?`): `Promise`\<`T`[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:40](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L40)

Execute a write Cypher query with automatic session management.
Returns result records mapped to plain objects.

#### Type Parameters

##### T

`T` = `Record`\<`string`, `unknown`\>

#### Parameters

##### cypher

`string`

##### params?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<`T`[]\>

***

### writeTransaction()

> **writeTransaction**(`statements`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L71)

Execute multiple write statements in a single transaction.

#### Parameters

##### statements

`object`[]

#### Returns

`Promise`\<`void`\>

***

### writeVoid()

> **writeVoid**(`cypher`, `params?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/neo4j/Neo4jCypherRunner.ts#L56)

Execute a write Cypher query that returns no results.

#### Parameters

##### cypher

`string`

##### params?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<`void`\>
