# Class: Memory

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:172](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L172)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:814](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L814)

Access the underlying IKnowledgeGraph implementation.

Useful for advanced queries (traversal, semantic search, neighbourhood
lookups) that are not exposed on the facade directly.

##### Returns

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

## Methods

### addEntity()

> **addEntity**(`entity`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:753](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L753)

Add or update an entity in the knowledge graph.

Delegates to `SqliteKnowledgeGraph.upsertEntity()`. Accepts a partial
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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:784](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L784)

Add or update a relation (edge) in the knowledge graph.

Delegates to `SqliteKnowledgeGraph.upsertRelation()`. Accepts a partial
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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1242](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1242)

Close the Memory instance and release all resources.

Flushes the SQLite WAL and releases the file lock. Must be called when
the agent shuts down.

#### Returns

`Promise`\<`void`\>

***

### consolidate()

> **consolidate**(`options?`): `Promise`\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:830](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L830)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1121)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:954](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L954)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1094](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1094)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:853](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L853)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:930](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L930)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:632](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L632)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1148](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1148)

Return a health snapshot of the memory store.

Queries aggregate statistics from all tables and returns a
[MemoryHealth](../interfaces/MemoryHealth.md) report.

#### Returns

`Promise`\<[`MemoryHealth`](../interfaces/MemoryHealth.md)\>

***

### importFrom()

> **importFrom**(`source`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1000](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1000)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:1061](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L1061)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:659](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L659)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:478](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L478)

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

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:337](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L337)

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

> `static` **create**(`config?`): `Promise`\<`Memory`\>

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:278](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/Memory.ts#L278)

Create a new Memory instance and wire together all subsystems.

Initialization sequence:
1. Merge `config` with defaults (store='sqlite', path=tmpdir, graph=true,
   selfImprove=true, decay=true).
2. Await `SqliteBrain.open(config.path)`.
3. Check embedding dimension compatibility (warn on mismatch).
4. Create `SqliteKnowledgeGraph(brain)`.
5. Create `SqliteMemoryGraph(brain)` and call `.initialize()`.
6. Create `LoaderRegistry()` (pre-registers all built-in loaders).
7. Create `FolderScanner(registry)`.
8. Create `ChunkingEngine()`.
9. If `selfImprove`: create `RetrievalFeedbackSignal(brain)` and
   `ConsolidationLoop(brain, memoryGraph)`.

#### Parameters

##### config?

[`MemoryConfig`](../interfaces/MemoryConfig.md)

Optional configuration; see [MemoryConfig](../interfaces/MemoryConfig.md).

#### Returns

`Promise`\<`Memory`\>

A fully initialised Memory instance.
