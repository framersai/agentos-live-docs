# Class: MemoryUpdateTool

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L65)

ITool implementation that applies partial updates to an existing memory
trace stored in the agent's SQLite brain database.

**Usage:**
```ts
const tool = new MemoryUpdateTool(brain);
const result = await tool.execute(
  { traceId: 'mt_1711234567890_0', content: 'Updated content here.' },
  context,
);
// result.output.updated → true
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemoryUpdateInput`, `MemoryUpdateOutput`\>

## Constructors

### Constructor

> **new MemoryUpdateTool**(`brain`): `MemoryUpdateTool`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:110](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L110)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.

#### Returns

`MemoryUpdateTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:81](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L81)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L76)

LLM-facing description.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Update Memory"` = `'Update Memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L73)

Human-readable display name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L84)

This tool writes to the database.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-update-v1"` = `'memory-update-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L67)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:87](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L87)

JSON schema for input validation and LLM tool-call construction.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_update"` = `'memory_update'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L70)

LLM-facing tool name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryUpdateOutput`\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemoryUpdateTool.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryUpdateTool.ts#L134)

Update a memory trace identified by `traceId`.

The method builds a dynamic SET clause based on which optional fields
are provided:
- `content` provided → set `content = ?`, also set `embedding = NULL`
  to signal that the cached vector is stale.
- `tags` provided → serialise array as JSON and set `tags = ?`.

If neither `content` nor `tags` is specified, the method returns
`{ updated: false }` immediately without touching the database.

A trace that does not exist or has `deleted = 1` returns `{ updated: false }`.

#### Parameters

##### args

`MemoryUpdateInput`

Update input (traceId, optional content/tags).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context (not used by this tool).

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryUpdateOutput`\>\>

`{ updated }` status, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
