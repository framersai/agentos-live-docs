# Interface: ITool\<TInput, TOutput\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:90](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L90)

## Interface

ITool

## Description

The core interface that all tools within AgentOS must implement.
It provides a standardized way for tools to declare their identity, capabilities,
input/output schemas, required permissions, and the core execution logic.
This standardization is crucial for tool discovery, LLM interaction, validation, and orchestrated execution.

## Type Parameters

### TInput

`TInput` *extends* `Record`\<`string`, `any`\> = `any`

The type of the input arguments object this tool expects. Defaults to `any`. It should ideally be a specific interface matching the `inputSchema`.

### TOutput

`TOutput` = `any`

The type of the output data this tool produces upon successful execution. Defaults to `any`. It should ideally be a specific interface matching the `outputSchema`.

## Properties

### category?

> `readonly` `optional` **category**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:174](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L174)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:128](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L128)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

***

### displayName

> `readonly` **displayName**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:117](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L117)

A concise, human-readable title or display name for the tool.
Used in user interfaces, logs, or when presenting tool options to developers or users.

#### Example

```ts
"Web Search Engine", "Advanced Python Code Interpreter"
```

***

### hasSideEffects?

> `readonly` `optional` **hasSideEffects**: `boolean`

Defined in: [packages/agentos/src/core/tools/ITool.ts:194](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L194)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L98)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/core/tools/ITool.ts:140](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L140)

The JSON schema defining the structure, types, and constraints of the input arguments object
that this tool expects. This schema is used by:
1. LLMs: To construct valid argument objects when requesting a tool call.
2. `ToolExecutor`: For validating the arguments before invoking the tool's `execute` method.
It should follow the JSON Schema specification.

#### See

https://json-schema.org/

***

### name

> `readonly` **name**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L108)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

***

### outputSchema?

> `readonly` `optional` **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/core/tools/ITool.ts:152](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L152)

**`Optional`**

Optional. The JSON schema defining the structure and types of the output object
that this tool will produce upon successful execution.
Providing an output schema helps in validating the tool's output, provides clarity for
consumers of the tool's result (including other tools or the GMI), and can aid the LLM
in understanding what to expect back from the tool.

***

### requiredCapabilities?

> `readonly` `optional` **requiredCapabilities**: `string`[]

Defined in: [packages/agentos/src/core/tools/ITool.ts:164](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L164)

**`Optional`**

Optional. An array of capability strings (e.g., "capability:filesystem:read", "capability:network:external_api")
that the active Persona (or GMI configuration) must possess to be authorized to use this tool.
If this array is empty or undefined, the tool might be generally available or rely on other
permission mechanisms (e.g., user subscription tiers).

#### Example

```ts
`["capability:web_search", "capability:execute_code_unsafe"]`
```

***

### version?

> `readonly` `optional` **version**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:183](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L183)

**`Optional`**

Optional. The version of the tool (e.g., "1.0.0", "2.1-beta", "2024-05-24").
Useful for managing updates and compatibility.

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:214](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L214)

**`Async`**

Executes the core logic of the tool with the provided arguments and execution context.
This method is asynchronous and should encapsulate the tool's primary functionality.
Implementations should handle their own internal errors gracefully and package them
into the `ToolExecutionResult` object.

#### Parameters

##### args

`TInput`

The input arguments for the tool. These arguments are expected to have been
validated against the tool's `inputSchema` by the calling system (e.g., `ToolExecutor`).

##### context

[`ToolExecutionContext`](ToolExecutionContext.md)

The execution context, providing information about
the GMI, user, current session, and any correlation IDs for tracing.

#### Returns

`Promise`\<[`ToolExecutionResult`](ToolExecutionResult.md)\<`TOutput`\>\>

A promise that resolves with a `ToolExecutionResult` object,
which contains the `success` status, the `output` data (if successful), or an `error` message (if failed).

#### Throws

While tools should ideally capture errors and return them in `ToolExecutionResult.error`,
critical, unrecoverable, or unexpected system-level failures during execution might still result in a thrown exception.
The `ToolExecutor` should be prepared to catch these.

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:241](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L241)

**`Async`** **`Optional`**

Optional. A method to gracefully shut down the tool and release any resources it holds
(e.g., database connections, network listeners, file handles, child processes).
This is called by the system (e.g., `ToolExecutor` or `ToolOrchestrator`) during application shutdown
or when a tool is being unregistered dynamically.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the tool has completed its shutdown procedures.

***

### validateArgs()?

> `optional` **validateArgs**(`args`): `object`

Defined in: [packages/agentos/src/core/tools/ITool.ts:228](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/tools/ITool.ts#L228)

**`Optional`**

Optional. Provides a hook for tools to implement custom validation logic for their input arguments,
potentially more specific or nuanced than standard JSON schema validation.
While the `ToolExecutor` typically performs schema validation based on `inputSchema` before calling `execute`,
this method allows the tool itself to perform additional checks if necessary.

#### Parameters

##### args

`Record`\<`string`, `any`\>

The raw arguments object to validate.

#### Returns

`object`

An object indicating if the arguments are valid.
If `isValid` is `false`, the `errors` array should contain objects or strings describing the validation failures.

##### errors?

> `optional` **errors**: `any`[]

##### isValid

> **isValid**: `boolean`
