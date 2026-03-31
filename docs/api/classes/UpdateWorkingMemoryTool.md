# Class: UpdateWorkingMemoryTool

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:18](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L18)

Tool that lets the agent fully replace its persistent markdown working memory.
The agent should call this whenever it learns new persistent context about the
user, session, or ongoing tasks that should survive across conversations.

## Implements

- [`ITool`](../interfaces/ITool.md)\<`UpdateInput`, `UpdateOutput`\>

## Constructors

### Constructor

> **new UpdateWorkingMemoryTool**(`memory`): `UpdateWorkingMemoryTool`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L40)

#### Parameters

##### memory

[`MarkdownWorkingMemory`](MarkdownWorkingMemory.md)

#### Returns

`UpdateWorkingMemoryTool`

## Properties

### category

> `readonly` **category**: `"memory"` = `'memory'`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:27](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L27)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:22](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L22)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Update Working Memory"` = `'Update Working Memory'`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L21)

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

> `readonly` **hasSideEffects**: `true` = `true`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L28)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"update-working-memory-v1"` = `'update-working-memory-v1'`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:19](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L19)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:29](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L29)

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

> `readonly` **name**: `"update_working_memory"` = `'update_working_memory'`

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:20](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L20)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`UpdateOutput`\>\>

Defined in: [packages/agentos/src/memory/core/working/UpdateWorkingMemoryTool.ts:42](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/working/UpdateWorkingMemoryTool.ts#L42)

**`Async`**

Executes the core logic of the tool with the provided arguments and execution context.
This method is asynchronous and should encapsulate the tool's primary functionality.
Implementations should handle their own internal errors gracefully and package them
into the `ToolExecutionResult` object.

#### Parameters

##### args

`UpdateInput`

The input arguments for the tool. These arguments are expected to have been
validated against the tool's `inputSchema` by the calling system (e.g., `ToolExecutor`).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`UpdateOutput`\>\>

A promise that resolves with a `ToolExecutionResult` object,
which contains the `success` status, the `output` data (if successful), or an `error` message (if failed).

#### Throws

While tools should ideally capture errors and return them in `ToolExecutionResult.error`,
critical, unrecoverable, or unexpected system-level failures during execution might still result in a thrown exception.
The `ToolExecutor` should be prepared to catch these.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
