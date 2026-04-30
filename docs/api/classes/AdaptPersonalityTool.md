# Class: AdaptPersonalityTool

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:152](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L152)

ITool implementation enabling agents to self-modify their HEXACO personality
traits within per-session budgets.

## Example

```ts
const tool = new AdaptPersonalityTool({
  config: { maxDeltaPerSession: 0.3 },
  mutationStore: myStore,
  getPersonality: () => agent.personality,
  setPersonality: (t, v) => { agent.personality[t] = v; },
});

const result = await tool.execute(
  { trait: 'openness', delta: 0.1, reasoning: 'User prefers creative responses.' },
  context,
);
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`AdaptPersonalityInput`, `AdaptPersonalityOutput`\>

## Constructors

### Constructor

> **new AdaptPersonalityTool**(`deps`): `AdaptPersonalityTool`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L209)

Create a new AdaptPersonalityTool.

#### Parameters

##### deps

`AdaptPersonalityDeps`

Injected dependencies including config, mutation store,
  and personality getter/setter.

#### Returns

`AdaptPersonalityTool`

## Properties

### category

> `readonly` **category**: `"emergent"` = `'emergent'`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L170)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L165)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Adapt Personality"` = `'Adapt Personality'`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:162](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L162)

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

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L173)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.emergent.adapt-personality"` = `'com.framers.emergent.adapt-personality'`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L156)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:176](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L176)

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

> `readonly` **name**: `"adapt_personality"` = `'adapt_personality'`

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L159)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`AdaptPersonalityOutput`\>\>

Defined in: [packages/agentos/src/emergent/AdaptPersonalityTool.ts:224](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/AdaptPersonalityTool.ts#L224)

Apply a personality trait mutation within session budget constraints.

#### Parameters

##### args

`AdaptPersonalityInput`

The trait, delta, and reasoning for the mutation.

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Tool execution context.

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`AdaptPersonalityOutput`\>\>

A [ToolExecutionResult](../interfaces/ToolExecutionResult.md) wrapping the mutation outcome.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
