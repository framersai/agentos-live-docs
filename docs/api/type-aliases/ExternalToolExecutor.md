# Type Alias: ExternalToolExecutor()\<TArgs, TOutput\>

> **ExternalToolExecutor**\<`TArgs`, `TOutput`\> = (`args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:14](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/externalToolRegistry.ts#L14)

## Type Parameters

### TArgs

`TArgs` *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

### TOutput

`TOutput` = `unknown`

## Parameters

### args

`TArgs`

### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

## Returns

`Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>
