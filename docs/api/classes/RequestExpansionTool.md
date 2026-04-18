# Class: RequestExpansionTool

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:30](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L30)

Tool available to all agent nodes in a mission graph.
Calling this signals that the agent needs a capability it doesn't have.

## Implements

- [`ITool`](../interfaces/ITool.md)\<[`RequestExpansionInput`](../interfaces/RequestExpansionInput.md), [`RequestExpansionOutput`](../interfaces/RequestExpansionOutput.md)\>

## Constructors

### Constructor

> **new RequestExpansionTool**(): `RequestExpansionTool`

#### Returns

`RequestExpansionTool`

## Properties

### category

> `readonly` **category**: `"orchestration"` = `'orchestration'`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L36)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `"Request additional agents or capabilities to complete your task. Use when you encounter a need that your current tools cannot fulfill. The mission planner will evaluate your request and may spawn new agents or forge new tools."` = `'Request additional agents or capabilities to complete your task. Use when you encounter a need that your current tools cannot fulfill. The mission planner will evaluate your request and may spawn new agents or forge new tools.'`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L34)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Request Expansion"` = `'Request Expansion'`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L33)

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

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L37)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.orchestration.request-expansion"` = `'com.framers.orchestration.request-expansion'`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L31)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:40](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L40)

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

> `readonly` **name**: `"request_expansion"` = `'request_expansion'`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L32)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

***

### outputSchema

> `readonly` **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L57)

**`Optional`**

Optional. The JSON schema defining the structure and types of the output object
that this tool will produce upon successful execution.
Providing an output schema helps in validating the tool's output, provides clarity for
consumers of the tool's result (including other tools or the GMI), and can aid the LLM
in understanding what to expect back from the tool.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`outputSchema`](../interfaces/ITool.md#outputschema)

***

### requiredPermissions

> `readonly` **requiredPermissions**: `string`[] = `[]`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L38)

## Methods

### execute()

> **execute**(`args`, `_context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`RequestExpansionOutput`](../interfaces/RequestExpansionOutput.md)\>\>

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/tools/RequestExpansionTool.ts#L65)

**`Async`**

Executes the core logic of the tool with the provided arguments and execution context.
This method is asynchronous and should encapsulate the tool's primary functionality.
Implementations should handle their own internal errors gracefully and package them
into the `ToolExecutionResult` object.

#### Parameters

##### args

[`RequestExpansionInput`](../interfaces/RequestExpansionInput.md)

The input arguments for the tool. These arguments are expected to have been
validated against the tool's `inputSchema` by the calling system (e.g., `ToolExecutor`).

##### \_context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`RequestExpansionOutput`](../interfaces/RequestExpansionOutput.md)\>\>

A promise that resolves with a `ToolExecutionResult` object,
which contains the `success` status, the `output` data (if successful), or an `error` message (if failed).

#### Throws

While tools should ideally capture errors and return them in `ToolExecutionResult.error`,
critical, unrecoverable, or unexpected system-level failures during execution might still result in a thrown exception.
The `ToolExecutor` should be prepared to catch these.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
