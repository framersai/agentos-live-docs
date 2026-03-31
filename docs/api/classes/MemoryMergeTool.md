# Class: MemoryMergeTool

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:90](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L90)

ITool implementation that merges multiple memory traces into one.

**Usage:**
```ts
const tool = new MemoryMergeTool(brain);
const result = await tool.execute(
  {
    traceIds: ['mt_1_0', 'mt_2_0', 'mt_3_0'],
    mergedContent: 'Consolidated insight from three related observations.',
  },
  context,
);
// result.output → { survivorId: 'mt_1_0', deletedIds: ['mt_2_0', 'mt_3_0'] }
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`MemoryMergeInput`, `MemoryMergeOutput`\>

## Constructors

### Constructor

> **new MemoryMergeTool**(`brain`): `MemoryMergeTool`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:134](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L134)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's shared SQLite brain database connection.

#### Returns

`MemoryMergeTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:107](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L107)

Logical category for discovery and grouping.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L101)

LLM-facing description.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Merge Memories"` = `'Merge Memories'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:98](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L98)

Human-readable display name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L110)

This tool writes to the database.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"memory-merge-v1"` = `'memory-merge-v1'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:92](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L92)

Globally unique tool identifier.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:113](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L113)

JSON schema for input validation and LLM tool-call construction.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"memory_merge"` = `'memory_merge'`

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:95](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L95)

LLM-facing tool name.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryMergeOutput`\>\>

Defined in: [packages/agentos/src/memory/io/tools/MemoryMergeTool.ts:156](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/tools/MemoryMergeTool.ts#L156)

Merge the specified traces into one survivor.

Steps:
1. Validate that at least 2 trace IDs were supplied.
2. Load all matching, non-deleted traces from the database.
3. Pick survivor by highest `retrieval_count`; fallback to first found.
4. Compute merged content (provided or concatenated).
5. Union all tags, deduplicate.
6. Update survivor: new content, cleared embedding, unioned tags.
7. Soft-delete all non-survivor traces.

#### Parameters

##### args

`MemoryMergeInput`

Merge input (traceIds, optional mergedContent).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context (not used by this tool).

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`MemoryMergeOutput`\>\>

`{ survivorId, deletedIds }` on success, or an error result.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
