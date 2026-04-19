# Type Alias: PromptAwareExternalToolRegistryEntry

> **PromptAwareExternalToolRegistryEntry** = `object`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L57)

## Properties

### category?

> `optional` **category**: `string`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:65](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L65)

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:60](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L60)

***

### displayName?

> `optional` **displayName**: `string`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:62](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L62)

***

### execute

> **execute**: [`ITool`](../interfaces/ITool.md)\<`Record`\<`string`, `any`\>, `unknown`\>\[`"execute"`\]

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L59)

***

### hasSideEffects?

> `optional` **hasSideEffects**: `boolean`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:67](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L67)

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](JSONSchemaObject.md)

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:61](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L61)

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:58](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L58)

***

### outputSchema?

> `optional` **outputSchema**: [`JSONSchemaObject`](JSONSchemaObject.md)

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:63](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L63)

***

### requiredCapabilities?

> `optional` **requiredCapabilities**: `string`[]

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L64)

***

### version?

> `optional` **version**: `string`

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:66](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L66)
