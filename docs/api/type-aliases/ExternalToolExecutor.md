# Type Alias: ExternalToolExecutor()\<TArgs, TOutput\>

> **ExternalToolExecutor**\<`TArgs`, `TOutput`\> = (`args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:15](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/externalToolRegistry.ts#L15)

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
