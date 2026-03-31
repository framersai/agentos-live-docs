# Class: MemoryReflectTool

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L54)

ITool implementation that triggers one full memory consolidation cycle via
[()](ConsolidationLoop.md#run).

**Usage:**
```ts
const tool = new MemoryReflectTool(brain, consolidationLoop);
const result = await tool.execute({}, context);
// result.output → { pruned: 3, merged: 1, derived: 0, compacted: 2, durationMs: 42 }
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemoryReflectInput`, [`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

## Constructors

### Constructor

> **new MemoryReflectTool**(`brain`, `consolidation`): `MemoryReflectTool`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L101)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.
                       Accepted for symmetry with other memory tools and for
                       future direct consolidation calls.

##### consolidation

[`ConsolidationLoop`](ConsolidationLoop.md)

The [ConsolidationLoop](ConsolidationLoop.md) instance to invoke.

#### Returns

`MemoryReflectTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:75](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L75)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L68)

Description shown to the LLM. The consolidation steps are described
explicitly so the model understands what "reflect" means operationally.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Reflect on Memory"` = `'Reflect on Memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L62)

Human-readable display name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:81](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L81)

Consolidation writes to the database (pruning, merging, inserting insights).
Mark as having side effects so callers may request confirmation if needed.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-reflect-v1"` = `'memory-reflect-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L56)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L84)

JSON schema for input validation and LLM tool-call construction.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_reflect"` = `'memory_reflect'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L59)

LLM-facing tool name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`_args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemoryReflectTool.ts:121](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/tools/MemoryReflectTool.ts#L121)

Run one full consolidation cycle and return the statistics.

If a consolidation cycle is already in progress (mutex guard in
[ConsolidationLoop](ConsolidationLoop.md)), `run()` returns immediately with zero counts —
this is surfaced as a successful result with all-zero statistics.

#### Parameters

##### \_args

`MemoryReflectInput`

Reflect input (optional topic hint, currently unused).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context (not used by this tool).

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>\>

[ConsolidationResult](../interfaces/ConsolidationResult.md) on success, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
