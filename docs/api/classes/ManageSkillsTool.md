# Class: ManageSkillsTool

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:125](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L125)

ITool implementation enabling agents to dynamically manage their skill set
at runtime, subject to allowlist and lock constraints.

## Example

```ts
const tool = new ManageSkillsTool({
  config: { allowlist: ['*'], requireApprovalForNewCategories: false },
  getActiveSkills: () => agent.skills,
  getLockedSkills: () => ['core-reasoning'],
  loadSkill: (id) => skillRegistry.load(id),
  unloadSkill: (id) => skillRegistry.unload(id),
  searchSkills: (q) => skillRegistry.search(q),
});
```

## Implements

- [`ITool`](../interfaces/ITool.md)\<`ManageSkillsInput`\>

## Constructors

### Constructor

> **new ManageSkillsTool**(`deps`): `ManageSkillsTool`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:179](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L179)

Create a new ManageSkillsTool.

#### Parameters

##### deps

`ManageSkillsDeps`

Injected dependencies including config, skill accessors,
  and loader/unloader functions.

#### Returns

`ManageSkillsTool`

## Properties

### category

> `readonly` **category**: `"emergent"` = `'emergent'`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:141](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L141)

**`Optional`**

Optional. A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system", "image_generation").
This is useful for organizing tools, for filtering in UIs or registries, and potentially for
aiding an LLM in selecting from a large set of tools.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`category`](../interfaces/ITool.md#category)

***

### description

> `readonly` **description**: `string`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:136](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L136)

A detailed, natural language description of what the tool does, its primary purpose,
typical use cases, and any important considerations or limitations for its use.
This description is critical for an LLM to understand the tool's capabilities and
make informed decisions about when and how to invoke it. It should be comprehensive enough
for the LLM to grasp the tool's semantics.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`description`](../interfaces/ITool.md#description)

***

### displayName

> `readonly` **displayName**: `"Manage Skills"` = `'Manage Skills'`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:133](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L133)

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

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L144)

**`Optional`**

Optional. Indicates if the tool might have side effects on external systems
(e.g., writing to a database, sending an email, making a purchase, modifying a file).
Defaults to `false` if not specified. LLMs or orchestrators might handle tools with side effects
with greater caution, potentially requiring explicit user confirmation.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`hasSideEffects`](../interfaces/ITool.md#hassideeffects)

***

### id

> `readonly` **id**: `"com.framers.emergent.manage-skills"` = `'com.framers.emergent.manage-skills'`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:127](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L127)

A globally unique identifier for this specific tool (e.g., "web-search-engine-v1.2", "stock-price-fetcher").
This ID is used for internal registration, management, and precise identification.
It's recommended to use a namespaced, versioned format (e.g., `vendor-toolname-version`).

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`id`](../interfaces/ITool.md#id)

***

### inputSchema

> `readonly` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:147](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L147)

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

> `readonly` **name**: `"manage_skills"` = `'manage_skills'`

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:130](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L130)

The functional name of the tool, as it should be presented to and used by an LLM in a tool call request
(e.g., "searchWeb", "executePythonCode", "getWeatherForecast").
This name must be unique among the set of tools made available to a given GMI/LLM at any time.
It should be concise, descriptive, and typically in camelCase or snake_case.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`name`](../interfaces/ITool.md#name)

## Methods

### execute()

> **execute**(`args`, `context`): `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

Defined in: [packages/agentos/src/emergent/ManageSkillsTool.ts:194](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ManageSkillsTool.ts#L194)

Execute the requested skill management action.

#### Parameters

##### args

`ManageSkillsInput`

Action type and associated parameters.

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

A [ToolExecutionResult](../interfaces/ToolExecutionResult.md) wrapping the action outcome.

#### Implementation of

[`ITool`](../interfaces/ITool.md).[`execute`](../interfaces/ITool.md#execute)
