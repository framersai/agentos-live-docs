# Class: SelfEvaluateTool

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:187](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L187)

ITool implementation enabling agents to evaluate their own responses,
adjust runtime parameters, and generate performance reports.

## Example

```ts
const tool = new SelfEvaluateTool({
  config: {
    autoAdjust: false,
    adjustableParams: ['temperature', 'verbosity'],
    maxEvaluationsPerSession: 20,
  },
});

const result = await tool.execute({
  action: 'evaluate',
  response: 'The capital of France is Paris.',
  query: 'What is the capital of France?',
}, context);
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`SelfEvaluateInput`\>

## Constructors

### Constructor

> **new SelfEvaluateTool**(`deps`): `SelfEvaluateTool`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:253](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L253)

Create a new SelfEvaluateTool.

#### Parameters

##### deps

`SelfEvaluateDeps`

Injected dependencies including config, optional
  adaptPersonality tool, and optional memory store callback.

#### Returns

`SelfEvaluateTool`

## Properties

### category

> `readonly` **category**: `"emergent"` = `'emergent'`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:204](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L204)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:198](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L198)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Self Evaluate"` = `'Self Evaluate'`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:195](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L195)

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

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:207](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L207)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.emergent.self-evaluate"` = `'com.framers.emergent.self-evaluate'`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:189](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L189)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:210](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L210)

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

> `readonly` **name**: `"self_evaluate"` = `'self_evaluate'`

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:192](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L192)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

Defined in: [packages/agentos/src/emergent/SelfEvaluateTool.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SelfEvaluateTool.ts#L268)

Execute the requested self-evaluation action.

#### Parameters

##### args

`SelfEvaluateInput`

Action type and associated parameters.

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context.

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

A [ToolExecutionResult](../interfaces/ToolExecutionResult.md) wrapping the action outcome.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
