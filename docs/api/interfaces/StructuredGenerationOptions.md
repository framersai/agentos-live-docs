# Interface: StructuredGenerationOptions

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L221)

Options for structured output generation.

## Properties

### customValidator()?

> `optional` **customValidator**: (`data`) => [`ValidationIssue`](ValidationIssue.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:265](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L265)

Custom validation function for additional checks

#### Parameters

##### data

`unknown`

#### Returns

[`ValidationIssue`](ValidationIssue.md)[]

***

### includeReasoning?

> `optional` **includeReasoning**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:253](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L253)

Whether to include reasoning/chain-of-thought before output

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:250](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L250)

Number of retry attempts on validation failure

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:247](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L247)

Maximum tokens to generate

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:241](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L241)

Model ID to use

***

### prompt

> **prompt**: `string` \| `object`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L223)

The prompt or messages to send to the LLM

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:238](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L238)

LLM provider to use

***

### schema

> **schema**: [`JSONSchema`](JSONSchema.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:226](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L226)

JSON Schema the output must conform to

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:232](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L232)

Description of what output is expected

***

### schemaName

> **schemaName**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:229](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L229)

Human-readable name for the schema (used in function calling)

***

### strategy?

> `optional` **strategy**: [`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:235](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L235)

Strategy for enforcing structure

***

### strict?

> `optional` **strict**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:262](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L262)

Whether to strictly enforce schema (fail on extra properties)

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:256](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L256)

Custom system prompt to prepend

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:244](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L244)

Temperature for generation (0-2)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:259](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L259)

Timeout in milliseconds
