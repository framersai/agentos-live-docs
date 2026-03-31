# Class: MemorySearchTool

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:105](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L105)

ITool implementation that searches the agent's memory traces using FTS5.

**Usage:**
```ts
const tool = new MemorySearchTool(brain);
const result = await tool.execute(
  { query: 'dark mode preference', scope: 'user', limit: 5 },
  context,
);
// result.output.results → [{ id, content, type, scope, strength, tags }, ...]
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemorySearchInput`, `MemorySearchOutput`\>

## Constructors

### Constructor

> **new MemorySearchTool**(`brain`): `MemorySearchTool`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L159)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.

#### Returns

`MemorySearchTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L122)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L116)

LLM-facing description.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Search Memory"` = `'Search Memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:113](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L113)

Human-readable display name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `false` = `false`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:125](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L125)

This tool only reads from the database — no side effects.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-search-v1"` = `'memory-search-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:107](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L107)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:128](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L128)

JSON schema for input validation and LLM tool-call construction.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_search"` = `'memory_search'`

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L110)

LLM-facing tool name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemorySearchOutput`\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemorySearchTool.ts:189](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemorySearchTool.ts#L189)

Run a full-text search against `memory_traces_fts` and join back to
`memory_traces` for metadata.

The SQL pattern:
```sql
SELECT mt.id, mt.content, mt.type, mt.scope, mt.strength, mt.tags
FROM memory_traces_fts fts
JOIN memory_traces mt ON mt.rowid = fts.rowid
WHERE fts.memory_traces_fts MATCH ?
  AND mt.deleted = 0
  [AND mt.type = ?]    -- when type filter provided
  [AND mt.scope = ?]   -- when scope filter provided
ORDER BY rank          -- FTS5 BM25 relevance (lower = more relevant)
LIMIT ?
```

Tags are stored as JSON arrays; they are parsed and returned as string[].
Malformed tag JSON returns an empty array rather than throwing.

#### Parameters

##### args

`MemorySearchInput`

Search input (query, optional type/scope/limit).

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context used to resolve scoped searches.

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemorySearchOutput`\>\>

`{ results }` array on success, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
