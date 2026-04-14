# Interface: Neo4jConnectionConfig

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:10](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L10)

Configuration for connecting to a Neo4j instance.
Used by Neo4jConnectionManager and all Neo4j-backed implementations.

## Properties

### connectionAcquisitionTimeoutMs?

> `optional` **connectionAcquisitionTimeoutMs**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:22](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L22)

Connection acquisition timeout in ms — defaults to 30000

***

### database?

> `optional` **database**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:18](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L18)

Database name — defaults to 'neo4j'

***

### maxConnectionPoolSize?

> `optional` **maxConnectionPoolSize**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:20](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L20)

Max connection pool size — defaults to 50

***

### password

> **password**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:16](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L16)

Password

***

### uri

> **uri**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:12](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L12)

Connection URI (e.g., 'bolt://localhost:7687', 'neo4j+s://xxx.databases.neo4j.io')

***

### username

> **username**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/types.ts:14](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/neo4j/types.ts#L14)

Username — 'neo4j' for default installations
