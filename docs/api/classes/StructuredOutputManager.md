# Class: StructuredOutputManager

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:144](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L144)

Structured Output Manager implementation.

Provides comprehensive structured output capabilities including:
- JSON Schema validation with detailed error reporting
- Multiple generation strategies (JSON mode, function calling, prompt engineering)
- Automatic retry with feedback on validation failures
- Parallel function calling with argument validation
- Entity extraction from unstructured text
- Robust JSON parsing with error recovery

## Implements

## Implements

- [`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md)

## Constructors

### Constructor

> **new StructuredOutputManager**(`config`): `StructuredOutputManager`

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L182)

Creates a new StructuredOutputManager instance.

#### Parameters

##### config

[`StructuredOutputManagerConfig`](../interfaces/StructuredOutputManagerConfig.md)

Configuration options

#### Returns

`StructuredOutputManager`

## Methods

### extractEntities()

> **extractEntities**\<`T`\>(`options`): `Promise`\<[`EntityExtractionResult`](../interfaces/EntityExtractionResult.md)\<`T`\>\>

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:567](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L567)

Extracts structured entities from unstructured text.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### options

[`EntityExtractionOptions`](../interfaces/EntityExtractionOptions.md)

#### Returns

`Promise`\<[`EntityExtractionResult`](../interfaces/EntityExtractionResult.md)\<`T`\>\>

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`extractEntities`](../interfaces/IStructuredOutputManager.md#extractentities)

***

### generate()

> **generate**\<`T`\>(`options`): `Promise`\<[`StructuredGenerationResult`](../interfaces/StructuredGenerationResult.md)\<`T`\>\>

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:202](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L202)

Generates structured output conforming to the given schema.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### options

[`StructuredGenerationOptions`](../interfaces/StructuredGenerationOptions.md)

#### Returns

`Promise`\<[`StructuredGenerationResult`](../interfaces/StructuredGenerationResult.md)\<`T`\>\>

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`generate`](../interfaces/IStructuredOutputManager.md#generate)

***

### generateFunctionCalls()

> **generateFunctionCalls**(`options`): `Promise`\<[`ParallelFunctionCallResult`](../interfaces/ParallelFunctionCallResult.md)\>

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:475](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L475)

Generates parallel function/tool calls.

#### Parameters

##### options

[`ParallelFunctionCallOptions`](../interfaces/ParallelFunctionCallOptions.md)

#### Returns

`Promise`\<[`ParallelFunctionCallResult`](../interfaces/ParallelFunctionCallResult.md)\>

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`generateFunctionCalls`](../interfaces/IStructuredOutputManager.md#generatefunctioncalls)

***

### getSchema()

> **getSchema**(`name`): [`JSONSchema`](../interfaces/JSONSchema.md) \| `undefined`

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1164](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1164)

Gets a registered schema.

#### Parameters

##### name

`string`

#### Returns

[`JSONSchema`](../interfaces/JSONSchema.md) \| `undefined`

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`getSchema`](../interfaces/IStructuredOutputManager.md#getschema)

***

### getStatistics()

> **getStatistics**(): [`StructuredOutputStats`](../interfaces/StructuredOutputStats.md)

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1171)

Gets statistics about structured output operations.

#### Returns

[`StructuredOutputStats`](../interfaces/StructuredOutputStats.md)

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`getStatistics`](../interfaces/IStructuredOutputManager.md#getstatistics)

***

### initialize()

> **initialize**(`logger?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L194)

Initializes the manager.

#### Parameters

##### logger?

[`ILogger`](../interfaces/ILogger.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`initialize`](../interfaces/IStructuredOutputManager.md#initialize)

***

### parseJSON()

> **parseJSON**(`jsonString`): `unknown`

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1074](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1074)

Parses JSON string with error recovery.

#### Parameters

##### jsonString

`string`

#### Returns

`unknown`

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`parseJSON`](../interfaces/IStructuredOutputManager.md#parsejson)

***

### recommendStrategy()

> **recommendStrategy**(`providerId`, `modelId`, `schema`): [`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1125](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1125)

Recommends a strategy for the given provider/model.

#### Parameters

##### providerId

`string`

##### modelId

`string`

##### schema

[`JSONSchema`](../interfaces/JSONSchema.md)

#### Returns

[`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`recommendStrategy`](../interfaces/IStructuredOutputManager.md#recommendstrategy)

***

### registerSchema()

> **registerSchema**(`name`, `schema`): `void`

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1156)

Registers a schema for reuse.

#### Parameters

##### name

`string`

##### schema

[`JSONSchema`](../interfaces/JSONSchema.md)

#### Returns

`void`

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`registerSchema`](../interfaces/IStructuredOutputManager.md#registerschema)

***

### resetStatistics()

> **resetStatistics**(): `void`

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:1178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L1178)

Resets statistics.

#### Returns

`void`

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`resetStatistics`](../interfaces/IStructuredOutputManager.md#resetstatistics)

***

### validate()

> **validate**(`data`, `schema`, `strict?`): [`ValidationIssue`](../interfaces/ValidationIssue.md)[]

Defined in: [packages/agentos/src/structured/output/StructuredOutputManager.ts:651](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/StructuredOutputManager.ts#L651)

Validates data against a JSON Schema.

#### Parameters

##### data

`unknown`

##### schema

[`JSONSchema`](../interfaces/JSONSchema.md)

##### strict?

`boolean`

#### Returns

[`ValidationIssue`](../interfaces/ValidationIssue.md)[]

#### Implementation of

[`IStructuredOutputManager`](../interfaces/IStructuredOutputManager.md).[`validate`](../interfaces/IStructuredOutputManager.md#validate)
