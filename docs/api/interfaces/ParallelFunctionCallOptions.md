# Interface: ParallelFunctionCallOptions

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:271](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L271)

Options for parallel function/tool calls.

## Properties

### functions

> **functions**: [`FunctionDefinition`](FunctionDefinition.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:276](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L276)

Available functions/tools the model can call

***

### maxParallelCalls?

> `optional` **maxParallelCalls**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:279](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L279)

Maximum number of parallel calls allowed

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:288](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L288)

Model ID to use

***

### prompt

> **prompt**: `string` \| `object`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:273](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L273)

The prompt requesting actions

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:285](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L285)

LLM provider to use

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:291](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L291)

Temperature for generation

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:294](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L294)

Timeout in milliseconds

***

### toolChoice?

> `optional` **toolChoice**: `"none"` \| `"auto"` \| `"required"` \| \{ `function`: \{ `name`: `string`; \}; `type`: `"function"`; \}

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:282](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L282)

Whether functions are required or optional
