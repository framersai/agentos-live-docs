# Class: MemoryAddTool

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:77](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L77)

ITool implementation that stores a new memory trace in the agent's
SQLite brain database.

**Usage:**
```ts
const tool = new MemoryAddTool(brain);
const result = await tool.execute(
  { content: 'User prefers dark mode.', tags: ['preference', 'ui'] },
  context,
);
// result.output.traceId → 'mt_1711234567890_0'
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemoryAddInput`, `MemoryAddOutput`\>

## Constructors

### Constructor

> **new MemoryAddTool**(`brain`): `MemoryAddTool`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L136)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.

#### Returns

`MemoryAddTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L95)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `"Store a new memory trace. The agent calls this to remember important facts, decisions, or observations."` = `'Store a new memory trace. The agent calls this to remember important facts, decisions, or observations.'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L91)

Description shown to the LLM when deciding which tool to invoke.
Must be comprehensive enough for the model to understand when to call this.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Add Memory"` = `'Add Memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L85)

Human-readable display name for UIs and logs.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L101)

This tool writes to the database.
Callers may request confirmation before execution when `hasSideEffects = true`.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-add-v1"` = `'memory-add-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L79)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L107)

JSON schema for input validation and LLM tool-call construction.
All optional fields default gracefully inside `execute()`.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_add"` = `'memory_add'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L82)

LLM-facing tool name (snake_case, as the LLM will call it).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryAddOutput`\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemoryAddTool.ts:158](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/tools/MemoryAddTool.ts#L158)

Insert a new memory trace row into `memory_traces`.

Defaults applied when optional fields are absent:
- `type`  → `'episodic'`
- `scope` → `'user'`
- `tags`  → `[]`

The trace is created with `strength = 1.0` (maximum encoding strength)
and `deleted = 0` (active). No embedding is computed here — the background
EmbeddingEncoder will embed it asynchronously.

#### Parameters

##### args

`MemoryAddInput`

Memory add input (content, optional type/scope/tags).

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context used to resolve the scope ID.

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryAddOutput`\>\>

`{ traceId }` on success, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
