# Type Alias: ExternalToolExecutor()\<TArgs, TOutput\>

> **ExternalToolExecutor**\<`TArgs`, `TOutput`\> = (`args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`TOutput`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:15](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/externalToolRegistry.ts#L15)

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
