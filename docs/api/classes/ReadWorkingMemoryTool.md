# Class: ReadWorkingMemoryTool

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:15](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L15)

Tool that lets the agent explicitly read its persistent working memory.
The memory is also injected into the system prompt automatically,
but this tool is useful when the agent wants to reason about its
memory before deciding what to update.

## Implements

- [`ITool`](../interfaces/ITool.md)\<`Record`\<`string`, `never`\>, `ReadOutput`\>

## Constructors

### Constructor

> **new ReadWorkingMemoryTool**(`memory`): `ReadWorkingMemoryTool`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L30)

#### Parameters

##### memory

[`MarkdownWorkingMemory`](MarkdownWorkingMemory.md)

#### Returns

`ReadWorkingMemoryTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:23](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L23)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L19)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Read Working Memory"` = `'Read Working Memory'`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:18](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L18)

A concise, human-readable title or display name for the tool.
Used in user interfaces, logs, or when presenting tool options to developers or users.

#### Example

```ts
"Web Search Engine", "Advanced Python Code Interpreter"
```

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`displayName`](../interfaces/ITool.md#displayname)

***

### hasSideEffects

> `readonly` **hasSideEffects**: `false` = `false`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L24)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"read-working-memory-v1"` = `'read-working-memory-v1'`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:16](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L16)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:25](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L25)

The JSON schema defining the structure, types, and constraints of the input arguments object
that this tool expects. This schema is used by:
1. LLMs: To construct valid argument objects when requesting a tool call.
2. `ToolExecutor`: For validating the arguments before invoking the tool's `execute` method.
It should follow the JSON Schema specification.

#### See

https://json-schema.org/

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`inputSchema`](../interfaces/ITool.md#inputschema)

***

### name

> `readonly` **name**: `"read_working_memory"` = `'read_working_memory'`

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L17)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`_args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`ReadOutput`\>\>

Defined in: [packages/agentos/src/memory/core/working/ReadWorkingMemoryTool.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/working/ReadWorkingMemoryTool.ts#L32)

**`Async`**

Executes the core logic of the tool with the provided arguments and execution context.
This method is asynchronous and should encapsulate the tool's primary functionality.
Implementations should handle their own internal errors gracefully and package them
into the `ToolExecutionResult` object.

#### Parameters

##### \_args

`Record`\<`string`, `never`\>

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`ReadOutput`\>\>

A promise that resolves with a `ToolExecutionResult` object,
which contains the `success` status, the `output` data (if successful), or an `error` message (if failed).

#### Throws

While tools should ideally capture errors and return them in `ToolExecutionResult.error`,
critical, unrecoverable, or unexpected system-level failures during execution might still result in a thrown exception.
The `ToolExecutor` should be prepared to catch these.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
