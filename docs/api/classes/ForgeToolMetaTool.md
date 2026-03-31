# Class: ForgeToolMetaTool

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:99](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L99)

Meta-tool enabling agents to create new tools at runtime.

Only registered when the agent is configured with `emergent: true`.
Adds ~120 tokens to the tool list. Agents provide: name, description,
schemas, implementation (compose existing tools or write sandboxed code),
and test cases.

## Example

```ts
const metaTool = new ForgeToolMetaTool(engine);
// Register with ToolOrchestrator:
orchestrator.registerTool(metaTool);

// Agent calls via tool-call interface:
const result = await metaTool.execute({
  name: 'add_numbers',
  description: 'Add two numbers together.',
  inputSchema: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } } },
  outputSchema: { type: 'object', properties: { sum: { type: 'number' } } },
  implementation: {
    mode: 'sandbox',
    code: 'function execute(input) { return { sum: input.a + input.b }; }',
    allowlist: [],
  },
  testCases: [{ input: { a: 2, b: 3 }, expectedOutput: { sum: 5 } }],
}, context);
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<[`ForgeToolInput`](../interfaces/ForgeToolInput.md), [`ForgeResult`](../interfaces/ForgeResult.md)\>

## Constructors

### Constructor

> **new ForgeToolMetaTool**(`engine`): `ForgeToolMetaTool`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L204)

Create a new ForgeToolMetaTool.

#### Parameters

##### engine

[`EmergentCapabilityEngine`](EmergentCapabilityEngine.md)

The [EmergentCapabilityEngine](EmergentCapabilityEngine.md) that will handle the
  actual forge pipeline (build → test → judge → register).

#### Returns

`ForgeToolMetaTool`

## Properties

### category

> `readonly` **category**: `"emergent"` = `'emergent'`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L116)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:110](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L110)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Forge Tool"` = `'Forge Tool'`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:107](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L107)

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

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:119](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L119)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.emergent.forge-tool"` = `'com.framers.emergent.forge-tool'`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L101)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:122](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L122)

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

> `readonly` **name**: `"forge_tool"` = `'forge_tool'`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:104](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L104)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`ForgeResult`](../interfaces/ForgeResult.md)\>\>

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:223](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L223)

Execute the forge pipeline via the engine.

Extracts the agent ID and session/correlation ID from the execution context
and delegates to [EmergentCapabilityEngine.forge](EmergentCapabilityEngine.md#forge).

#### Parameters

##### args

[`ForgeToolInput`](../interfaces/ForgeToolInput.md)

The forge tool input arguments (name, description, schemas,
  implementation, test cases).

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

The tool execution context providing agent and session IDs.

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<[`ForgeResult`](../interfaces/ForgeResult.md)\>\>

A [ToolExecutionResult](../interfaces/ToolExecutionResult.md) wrapping the [ForgeResult](../interfaces/ForgeResult.md).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
