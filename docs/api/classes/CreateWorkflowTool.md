# Class: CreateWorkflowTool

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:143](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L143)

ITool implementation enabling agents to compose, execute, and list
multi-step tool workflows at runtime.

## Example

```ts
const tool = new CreateWorkflowTool({
  config: { maxSteps: 10, allowedTools: ['web_search', 'summarize'] },
  executeTool: (name, args) => orchestrator.execute(name, args),
  listTools: () => orchestrator.listToolNames(),
});

// Create a workflow
const createResult = await tool.execute({
  action: 'create',
  name: 'search-and-summarize',
  description: 'Search the web and summarize results.',
  steps: [
    { tool: 'web_search', args: { query: '$input' } },
    { tool: 'summarize', args: { text: '$prev' } },
  ],
}, context);
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`CreateWorkflowInput`\>

## Constructors

### Constructor

> **new CreateWorkflowTool**(`deps`): `CreateWorkflowTool`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:219](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L219)

Create a new CreateWorkflowTool.

#### Parameters

##### deps

`CreateWorkflowDeps`

Injected dependencies including config, tool executor,
  and tool lister.

#### Returns

`CreateWorkflowTool`

## Properties

### category

> `readonly` **category**: `"emergent"` = `'emergent'`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L159)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:154](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L154)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Create Workflow"` = `'Create Workflow'`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:151](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L151)

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

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:162](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L162)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.emergent.create-workflow"` = `'com.framers.emergent.create-workflow'`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:145](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L145)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:165](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L165)

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

> `readonly` **name**: `"create_workflow"` = `'create_workflow'`

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:148](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L148)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

Defined in: [packages/agentos/src/emergent/CreateWorkflowTool.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/CreateWorkflowTool.ts#L234)

Execute the requested workflow action.

#### Parameters

##### args

`CreateWorkflowInput`

Action type and associated parameters.

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

A [ToolExecutionResult](../interfaces/ToolExecutionResult.md) wrapping the action outcome.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
