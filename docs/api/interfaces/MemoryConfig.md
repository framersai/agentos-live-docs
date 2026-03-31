# Interface: MemoryConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:198](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L198)

Top-level configuration object for the Memory facade.

All fields are optional; sensible defaults are applied per field.
A minimal `{}` config is valid and will use a temporary SQLite brain file
with graph + self-improvement enabled.

## Properties

### connectionString?

> `optional` **connectionString**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:225](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L225)

Postgres connection string. Required when store='postgres'.

#### Example

```ts
'postgresql://postgres:wunderland@localhost:5432/agent_memory'
```

***

### consolidation?

> `optional` **consolidation**: [`ExtendedConsolidationConfig`](ExtendedConsolidationConfig.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:278](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L278)

Consolidation schedule and thresholds.

***

### decay?

> `optional` **decay**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:275](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L275)

Whether memory traces lose strength over time following an Ebbinghaus
forgetting-curve model.

#### Default

```ts
true
```

***

### embed()?

> `optional` **embed**: (`text`) => `Promise`\<`number`[]\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:254](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L254)

Optional embedding function for generating vectors at remember/recall time.
When provided, enables HNSW vector search in recall() and stores embeddings
alongside text in remember(). Without this, recall() falls back to FTS5-only.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<`number`[]\>

#### Example

```typescript
const mem = await Memory.create({
  embed: async (text) => {
    const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
    return res.data[0].embedding;
  },
});
```

***

### embeddings?

> `optional` **embeddings**: [`EmbeddingConfig`](EmbeddingConfig.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:237](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L237)

Embedding model configuration (provider name + optional model).

***

### graph?

> `optional` **graph**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:261](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L261)

Whether to build and maintain a knowledge graph alongside the vector store.
When enabled, entity co-occurrence and semantic edges are tracked.

#### Default

```ts
false
```

***

### ingestion?

> `optional` **ingestion**: [`IngestionConfig`](IngestionConfig.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:281](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L281)

Document ingestion settings applied to all `ingest()` calls by default.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:219](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L219)

File-system path for stores that require one (e.g. SQLite db file).
Ignored by in-memory and remote stores.

#### Example

```ts
'./data/agent-memory.sqlite'
```

***

### qdrantApiKey?

> `optional` **qdrantApiKey**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L234)

Qdrant API key for cloud instances. Optional.

***

### qdrantUrl?

> `optional` **qdrantUrl**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:231](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L231)

Qdrant base URL. Required when store='qdrant'.

#### Example

```ts
'http://localhost:6333'
```

***

### selfImprove?

> `optional` **selfImprove**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L268)

Whether the agent may autonomously refine and restructure its own memories
(write new insight traces, prune contradictions, merge redundancies).

#### Default

```ts
false
```

***

### store?

> `optional` **store**: `"memory"` \| `"postgres"` \| `"qdrant"` \| `"sqlite"` \| `"neo4j"` \| `"hnsw"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:212](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L212)

Persistence backend for memory traces.

The Phase 1 facade currently implements the SQLite path at runtime.
Other values are reserved for future backends and will throw if selected.

- `'sqlite'`  – file-based SQLite (implemented; recommended).
- `'memory'`  – reserved for a future in-process backend.
- `'qdrant'`  – reserved for a future vector-database backend.
- `'neo4j'`   – reserved for a future graph-database backend.
- `'hnsw'`    – reserved for a future ANN-only backend.

#### Default

```ts
'sqlite'
```
