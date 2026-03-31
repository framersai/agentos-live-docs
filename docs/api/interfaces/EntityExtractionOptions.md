# Interface: EntityExtractionOptions

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:451](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L451)

Options for entity extraction from text.

## Properties

### entitySchema

> **entitySchema**: [`JSONSchema`](JSONSchema.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:456](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L456)

Schema defining the entities to extract

***

### examples?

> `optional` **examples**: `object`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:465](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L465)

Examples of expected extractions

#### input

> **input**: `string`

#### output

> **output**: `unknown`

***

### extractAll?

> `optional` **extractAll**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:474](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L474)

Whether to extract all occurrences or just first

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:462](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L462)

Additional context or instructions

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:471](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L471)

Model ID to use

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:468](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L468)

LLM provider to use

***

### taskName

> **taskName**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:459](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L459)

Name for the extraction task

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:453](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L453)

Text to extract entities from
