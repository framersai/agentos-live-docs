# Class: Memory

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:200](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L200)

Unified public API for the AgentOS memory system.

One `Memory` instance manages the full lifecycle of an agent's memories:
storing, retrieving, ingesting documents, building a knowledge graph,
self-improving through consolidation, and importing/exporting data.

## Quick start
```ts
const mem = await Memory.create({ store: 'sqlite', path: './brain.sqlite' });

await mem.remember('The user prefers dark mode');
const results = await mem.recall('dark mode preference');
console.log(results[0].trace.content);

await mem.close();
```

## Accessors

### graph

#### Get Signature

> **get** **graph**(): [`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1032](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1032)

Access the underlying IKnowledgeGraph implementation.

Useful for advanced queries (traversal, semantic search, neighbourhood
lookups) that are not exposed on the facade directly.

##### Returns

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

## Methods

### addEntity()

> **addEntity**(`entity`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:971](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L971)

Add or update an entity in the knowledge graph.

Delegates to `SqlKnowledgeGraph.upsertEntity()`. Accepts a partial
entity; `id`, `createdAt`, and `updatedAt` are auto-generated when omitted.

#### Parameters

##### entity

`Partial`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Partial entity descriptor.

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

The complete, persisted entity.

***

### addRelation()

> **addRelation**(`relation`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1002](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1002)

Add or update a relation (edge) in the knowledge graph.

Delegates to `SqlKnowledgeGraph.upsertRelation()`. Accepts a partial
relation; `id` and `createdAt` are auto-generated when omitted.

#### Parameters

##### relation

`Partial`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

Partial relation descriptor.

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

The complete, persisted relation.

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1462](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1462)

Close the Memory instance and release all resources.

Flushes the SQLite WAL and releases the file lock. Must be called when
the agent shuts down.

#### Returns

`Promise`\<`void`\>

***

### consolidate()

> **consolidate**(`options?`): `Promise`\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1048](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1048)

Run one consolidation cycle (prune, merge, strengthen, derive, compact,
re-index).

#### Parameters

##### options?

Optional topic filter (reserved for future use).

###### topic?

`string`

#### Returns

`Promise`\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

Statistics from the consolidation run.

#### Throws

When `selfImprove` was set to `false` in the config.

***

### createTools()

> **createTools**(`options?`): [`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1341](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1341)

Create runtime `ITool` instances backed by this memory facade's SQLite brain.

This is the supported bridge from the standalone memory engine into
AgentOS tool registration. The returned tools share this `Memory`
instance's underlying SQLite database and consolidation loop.

Typical usage:
```ts
for (const tool of memory.createTools()) {
  await agentos.getToolOrchestrator().registerTool(tool);
}
```

When self-improvement is disabled, `memory_reflect` is omitted because
there is no backing [ConsolidationLoop](ConsolidationLoop.md) instance.

#### Parameters

##### options?

###### includeReflect?

`boolean`

#### Returns

[`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]

***

### export()

> **export**(`outputPath`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1174](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1174)

Export the memory store to a file or directory.

Format is detected from `options.format` or the file extension:
- `.json` -> JSON
- `.sqlite` / `.db` -> SQLite file copy
- directory path -> Markdown or Obsidian (based on `options.format`)

#### Parameters

##### outputPath

`string`

Path to write the export to.

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional format and content controls.

#### Returns

`Promise`\<`void`\>

***

### exportToString()

> **exportToString**(`options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1314](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1314)

Export the full brain state as a JSON string without filesystem access.

Useful in browser environments or when the data needs to be sent over
a network connection.

#### Parameters

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration (embeddings, conversations).

#### Returns

`Promise`\<`string`\>

Pretty-printed JSON string of the full brain payload.

***

### feedback()

> **feedback**(`traceId`, `signal`, `query?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1071](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1071)

Record retrieval feedback for a memory trace.

The feedback is persisted asynchronously. This method returns a Promise
that resolves once the feedback has been written.

#### Parameters

##### traceId

`string`

The ID of the trace being evaluated.

##### signal

Whether the trace was `'used'` or `'ignored'` by the LLM.

`"used"` | `"ignored"`

##### query?

`string`

Optional retrieval context, typically the original user query.

#### Returns

`Promise`\<`void`\>

***

### feedbackFromResponse()

> **feedbackFromResponse**(`injectedTraces`, `response`, `query?`): `Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1150](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1150)

Detect and persist used/ignored feedback for a batch of injected traces
based on the assistant's final response text.

This is the high-level bridge used by long-term-memory integrations that
already know which traces were injected into the prompt.

#### Parameters

##### injectedTraces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

##### response

`string`

##### query?

`string`

#### Returns

`Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

***

### forget()

> **forget**(`traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:814](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L814)

Soft-delete a memory trace by setting `deleted = 1`.

The trace remains in the database for audit/recovery purposes but is
excluded from all recall queries and health reports.

#### Parameters

##### traceId

`string`

The ID of the trace to forget.

#### Returns

`Promise`\<`void`\>

***

### health()

> **health**(): `Promise`\<[`MemoryHealth`](../interfaces/MemoryHealth.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1368](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1368)

Return a health snapshot of the memory store.

Queries aggregate statistics from all tables and returns a
[MemoryHealth](../interfaces/MemoryHealth.md) report.

#### Returns

`Promise`\<[`MemoryHealth`](../interfaces/MemoryHealth.md)\>

***

### importFrom()

> **importFrom**(`source`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1220](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1220)

Import memory data from a file or directory.

Format is detected from `options.format`, the file extension, or by
inspecting the content.

#### Parameters

##### source

`string`

Path to the import source (file or directory).

##### options?

[`ImportOptions`](../interfaces/ImportOptions.md)

Optional format hint and dedup settings.

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Summary of the import operation.

***

### importFromString()

> **importFromString**(`content`, `format`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:1281](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L1281)

Import memory data from a string without filesystem access.

Supports JSON and CSV formats. Useful in browser environments or when
the data is already in memory.

#### Parameters

##### content

`string`

The raw string content to import.

##### format

The format of the content: `'json'` or `'csv'`.

`"json"` | `"csv"`

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

Optional deduplication controls.

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Summary of the import operation.

***

### ingest()

> **ingest**(`source`, `options?`): `Promise`\<[`IngestResult`](../interfaces/IngestResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:841](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L841)

Ingest documents from a file, directory, or URL.

Workflow:
1. Detect source type (file, directory, or URL).
2. Load document(s) using the appropriate loader.
3. Chunk each document using the configured strategy.
4. For each chunk: insert into `document_chunks`, create a memory trace.
5. Record the document in the `documents` table.

#### Parameters

##### source

`string`

File path, directory path, or URL.

##### options?

[`IngestOptions`](../interfaces/IngestOptions.md)

Optional ingestion settings (recursive, include/exclude globs).

#### Returns

`Promise`\<[`IngestResult`](../interfaces/IngestResult.md)\>

Summary of the ingestion run.

***

### recall()

> **recall**(`query`, `options?`): `Promise`\<[`ScoredTrace`](../interfaces/ScoredTrace.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:615](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L615)

Search for memory traces matching a natural-language query.

Uses FTS5 full-text search with the Porter tokenizer. Results are ranked
by `strength * abs(fts_rank)` and filtered by optional type/scope/strength
criteria.

#### Parameters

##### query

`string`

Natural-language search query.

##### options?

[`RecallOptions`](../interfaces/RecallOptions.md)

Optional filters (limit, type, scope, minStrength).

#### Returns

`Promise`\<[`ScoredTrace`](../interfaces/ScoredTrace.md)[]\>

Ranked array of [ScoredTrace](../interfaces/ScoredTrace.md) results.

***

### remember()

> **remember**(`content`, `options?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:467](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L467)

Store a new memory trace.

Creates a trace in the `memory_traces` table with a unique ID, content
hash for deduplication, and optional type/scope/tags metadata. If the
memory graph is available the trace is also added as a graph node.

#### Parameters

##### content

`string`

The text content to remember.

##### options?

[`RememberOptions`](../interfaces/RememberOptions.md)

Optional metadata (type, scope, tags, importance, etc.).

#### Returns

`Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)\>

The created MemoryTrace-like object.

***

### create()

> `static` **create**(`pathOrConfig?`, `opts?`): `Promise`\<`Memory`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:324](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L324)

Backwards-compatible alias for [Memory.createSqlite](#createsqlite). The earlier
surface accepted `Memory.create(config)` and several published docs and
blog posts still reference it; rather than break those examples we
forward to `createSqlite` (the modern, more explicit factory).

For non-SQLite backends call [Memory.createPostgres](#createpostgres) or
[Memory.createWithAdapter](#createwithadapter) directly.

#### Parameters

##### pathOrConfig?

`string` | [`MemoryConfig`](../interfaces/MemoryConfig.md)

##### opts?

`Omit`\<[`MemoryConfig`](../interfaces/MemoryConfig.md), `"path"` \| `"store"`\> & `object` = `{}`

#### Returns

`Promise`\<`Memory`\>

***

### createPostgres()

> `static` **createPostgres**(`connectionString`, `opts`): `Promise`\<`Memory`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:380](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L380)

Open a Memory backed by PostgreSQL. Requires the `pg` npm package.

#### Parameters

##### connectionString

`string`

Standard Postgres connection URL.

##### opts

`Omit`\<[`MemoryConfig`](../interfaces/MemoryConfig.md), `"path"` \| `"store"`\> & `object`

Plus standard Memory options (graph, selfImprove, decay,
  embeddings).

#### Returns

`Promise`\<`Memory`\>

***

### createSqlite()

> `static` **createSqlite**(`pathOrConfig?`, `opts?`): `Promise`\<`Memory`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:334](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L334)

#### Parameters

##### pathOrConfig?

`string` | [`MemoryConfig`](../interfaces/MemoryConfig.md)

##### opts?

`Omit`\<[`MemoryConfig`](../interfaces/MemoryConfig.md), `"path"` \| `"store"`\> & `object` = `{}`

#### Returns

`Promise`\<`Memory`\>

***

### createWithAdapter()

> `static` **createWithAdapter**(`adapter`, `opts?`): `Promise`\<`Memory`\>

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:399](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L399)

Open a Memory with a pre-resolved StorageAdapter. Use when sharing an
adapter across subsystems or when you need full control over adapter
resolution.

#### Parameters

##### adapter

`StorageAdapter`

##### opts?

`Omit`\<[`MemoryConfig`](../interfaces/MemoryConfig.md), `"path"` \| `"store"`\> & `object` = `{}`

#### Returns

`Promise`\<`Memory`\>
