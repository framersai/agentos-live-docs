# Interface: ParallelFunctionCallResult

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:391](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L391)

Result of parallel function calls.

## Properties

### calls

> **calls**: [`FunctionCallResult`](FunctionCallResult.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:396](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L396)

Individual function call results

***

### latencyMs

> **latencyMs**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:409](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L409)

Generation latency in milliseconds

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:412](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L412)

Model that was used

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:415](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L415)

Provider that was used

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:393](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L393)

Whether all function calls were successful

***

### textContent?

> `optional` **textContent**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:399](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L399)

Any content output alongside function calls

***

### tokenUsage?

> `optional` **tokenUsage**: `object`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:402](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L402)

Token usage statistics

#### completionTokens

> **completionTokens**: `number`

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
