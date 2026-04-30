# Interface: VectorStoreConfig

Defined in: [packages/agentos/src/rag/setup/types.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L43)

Persisted vector store configuration at ~/.wunderland/vector-store.json.
Written after successful auto-setup, read by all subsequent commands.

## Properties

### connectionString?

> `optional` **connectionString**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L51)

Postgres connection string.

***

### containerName?

> `optional` **containerName**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L55)

Docker container name if applicable.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L49)

File path (for SQLite).

***

### setupAt?

> `optional` **setupAt**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L57)

ISO timestamp of when setup was performed.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L53)

How this config was created.

***

### type

> **type**: `"postgres"` \| `"qdrant"` \| `"sqlite"`

Defined in: [packages/agentos/src/rag/setup/types.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L45)

Backend type.

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/types.ts#L47)

Connection URL (for Postgres/Qdrant).
