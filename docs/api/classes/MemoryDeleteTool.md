# Class: MemoryDeleteTool

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L62)

ITool implementation that soft-deletes a memory trace from the agent's
SQLite brain database.

**Usage:**
```ts
const tool = new MemoryDeleteTool(brain);
const result = await tool.execute(
  { traceId: 'mt_1711234567890_0', reason: 'Information is outdated.' },
  context,
);
// result.output.deleted → true
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemoryDeleteInput`, `MemoryDeleteOutput`\>

## Constructors

### Constructor

> **new MemoryDeleteTool**(`brain`): `MemoryDeleteTool`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:103](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L103)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.

#### Returns

`MemoryDeleteTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L79)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L73)

LLM-facing description.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Delete Memory"` = `'Delete Memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L70)

Human-readable display name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L82)

This tool writes to the database.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-delete-v1"` = `'memory-delete-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L64)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L85)

JSON schema for input validation and LLM tool-call construction.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_delete"` = `'memory_delete'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L67)

LLM-facing tool name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryDeleteOutput`\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemoryDeleteTool.ts:120](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryDeleteTool.ts#L120)

Set `deleted = 1` on the memory trace matching `traceId`.

The WHERE clause filters to `deleted = 0` so that attempting to
delete an already-deleted trace returns `{ deleted: false }` rather
than silently succeeding — this gives callers accurate feedback.

#### Parameters

##### args

`MemoryDeleteInput`

Delete input (traceId, optional reason).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context (not used by this tool).

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryDeleteOutput`\>\>

`{ deleted }` status, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
