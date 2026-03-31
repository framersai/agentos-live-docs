# Type Alias: ExternalToolExecutor()\<TArgs, TOutput\>

> **ExternalToolExecutor**\<`TArgs`, `TOutput`\> = (`args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:14](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/externalToolRegistry.ts#L14)

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
