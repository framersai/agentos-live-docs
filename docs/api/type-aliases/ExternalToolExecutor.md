# Type Alias: ExternalToolExecutor()\<TArgs, TOutput\>

> **ExternalToolExecutor**\<`TArgs`, `TOutput`\> = (`args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:14](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/externalToolRegistry.ts#L14)

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
