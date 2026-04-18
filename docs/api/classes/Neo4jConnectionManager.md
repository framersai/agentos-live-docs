# Class: Neo4jConnectionManager

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:30](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L30)

Shared Neo4j connection manager.

Usage:
```typescript
const mgr = new Neo4jConnectionManager();
await mgr.initialize({ uri: 'bolt://localhost:7687', username: 'neo4j', password: 'pw' });

// All backends receive the same manager
const vectorStore = new Neo4jVectorStore(mgr);
const knowledgeGraph = new Neo4jKnowledgeGraph({ connectionManager: mgr });
```

## Constructors

### Constructor

> **new Neo4jConnectionManager**(): `Neo4jConnectionManager`

#### Returns

`Neo4jConnectionManager`

## Accessors

### isInitialized

#### Get Signature

> **get** **isInitialized**(): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L38)

Whether initialize() has been called successfully

##### Returns

`boolean`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L97)

Check Neo4j connectivity.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L46)

Initialize the connection manager.
Dynamically imports neo4j-driver, creates the driver, and verifies connectivity.

#### Parameters

##### config

[`Neo4jConnectionConfig`](../interfaces/Neo4jConnectionConfig.md)

#### Returns

`Promise`\<`void`\>

***

### session()

> **session**(`mode?`): `any`

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L83)

Create a session. Callers MUST close the session in a finally block.

#### Parameters

##### mode?

'READ' for read-only transactions, 'WRITE' for write transactions.

`"READ"` | `"WRITE"`

#### Returns

`any`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/neo4j/Neo4jConnectionManager.ts#L122)

Gracefully close the driver and release all connection pool resources.

#### Returns

`Promise`\<`void`\>
