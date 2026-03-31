# Interface: ForgeToolInput

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:35](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L35)

Input arguments accepted by the `forge_tool` meta-tool.

Mirrors [ForgeToolRequest](ForgeToolRequest.md) but typed as a `Record<string, any>` to
satisfy the `ITool` generic constraint while retaining semantic clarity.

## Extends

- `Record`\<`string`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:40](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L40)

Natural language description of the tool's purpose.

***

### implementation

> **implementation**: \{ `mode`: `"compose"`; `steps`: `object`[]; \} \| \{ `allowlist`: `string`[]; `code`: `string`; `mode`: `"sandbox"`; \}

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L52)

Implementation specification — either compose (chain existing tools) or
sandbox (arbitrary code). Discriminated on the `mode` field.

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:43](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L43)

JSON Schema for the tool's input arguments.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:37](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L37)

Machine-readable name for the new tool.

***

### outputSchema?

> `optional` **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L46)

JSON Schema for the tool's expected output (optional).

***

### testCases

> **testCases**: `object`[]

Defined in: [packages/agentos/src/emergent/ForgeToolMetaTool.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/ForgeToolMetaTool.ts#L63)

One or more test cases for the judge to evaluate.
Each has an `input` object and optional `expectedOutput`.

#### expectedOutput?

> `optional` **expectedOutput**: `unknown`

#### input

> **input**: `Record`\<`string`, `unknown`\>
