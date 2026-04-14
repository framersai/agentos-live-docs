# Interface: BackendConfig

Defined in: [packages/agentos/src/rag/migration/types.ts:26](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L26)

Configuration for a migration source or target backend.
Only the fields relevant to the chosen `type` need to be provided.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:36](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L36)

Qdrant API key for cloud instances. Optional.

***

### collectionPrefix?

> `optional` **collectionPrefix**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L43)

Qdrant collection name prefix.

#### Default

```ts
'wunderland'
```

***

### connectionString?

> `optional` **connectionString**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:32](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L32)

Postgres connection string. Required when type='postgres'.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:30](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L30)

SQLite file path. Required when type='sqlite'.

***

### sidecarPath?

> `optional` **sidecarPath**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L41)

Optional SQLite sidecar path used by Qdrant deployments for non-vector
tables such as graph metadata and documents.

***

### type

> **type**: [`BackendType`](../type-aliases/BackendType.md)

Defined in: [packages/agentos/src/rag/migration/types.ts:28](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L28)

Which backend type to connect to.

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/rag/migration/types.ts:34](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/migration/types.ts#L34)

Qdrant base URL (e.g. 'http://localhost:6333'). Required when type='qdrant'.
