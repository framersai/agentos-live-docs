# Interface: MemoryConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:200](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L200)

Top-level configuration object for the Memory facade.

All fields are optional; sensible defaults are applied per field.
A minimal `{}` config is valid and will use a temporary SQLite brain file
with graph + self-improvement enabled.

## Properties

### connectionString?

> `optional` **connectionString**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:227](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L227)

Postgres connection string. Required when store='postgres'.

#### Example

```ts
'postgresql://postgres:wunderland@localhost:5432/agent_memory'
```

***

### consolidation?

> `optional` **consolidation**: [`ExtendedConsolidationConfig`](ExtendedConsolidationConfig.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:280](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L280)

Consolidation schedule and thresholds.

***

### decay?

> `optional` **decay**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:277](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L277)

Whether memory traces lose strength over time following an Ebbinghaus
forgetting-curve model.

#### Default

```ts
true
```

***

### embed()?

> `optional` **embed**: (`text`) => `Promise`\<`number`[]\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:256](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L256)

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

Defined in: [packages/agentos/src/memory/io/facade/types.ts:239](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L239)

Embedding model configuration (provider name + optional model).

***

### graph?

> `optional` **graph**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:263](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L263)

Whether to build and maintain a knowledge graph alongside the vector store.
When enabled, entity co-occurrence and semantic edges are tracked.

#### Default

```ts
false
```

***

### ingestion?

> `optional` **ingestion**: [`IngestionConfig`](IngestionConfig.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:283](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L283)

Document ingestion settings applied to all `ingest()` calls by default.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:221](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L221)

File-system path for stores that require one (e.g. SQLite db file).
Ignored by in-memory and remote stores.

#### Example

```ts
'./data/agent-memory.sqlite'
```

***

### qdrantApiKey?

> `optional` **qdrantApiKey**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L236)

Qdrant API key for cloud instances. Optional.

***

### qdrantUrl?

> `optional` **qdrantUrl**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:233](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L233)

Qdrant base URL. Required when store='qdrant'.

#### Example

```ts
'http://localhost:6333'
```

***

### selfImprove?

> `optional` **selfImprove**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:270](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L270)

Whether the agent may autonomously refine and restructure its own memories
(write new insight traces, prune contradictions, merge redundancies).

#### Default

```ts
false
```

***

### store?

> `optional` **store**: `"memory"` \| `"postgres"` \| `"qdrant"` \| `"sqlite"` \| `"neo4j"` \| `"hnsw"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:214](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L214)

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
