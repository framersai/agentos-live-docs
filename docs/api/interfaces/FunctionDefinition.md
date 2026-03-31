# Interface: FunctionDefinition

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:300](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L300)

Definition of a callable function/tool.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:305](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L305)

Human-readable description

***

### handler()?

> `optional` **handler**: (`args`) => `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:314](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L314)

Function handler (for execution)

#### Parameters

##### args

`Record`\<`string`, `unknown`\>

#### Returns

`unknown`

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:302](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L302)

Unique function name

***

### parameters

> **parameters**: [`JSONSchema`](JSONSchema.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:308](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L308)

JSON Schema for function parameters

***

### required?

> `optional` **required**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:311](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L311)

Whether this function is required
