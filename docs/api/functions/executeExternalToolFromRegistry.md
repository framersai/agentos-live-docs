# Function: executeExternalToolFromRegistry()

> **executeExternalToolFromRegistry**(`registry`, `toolName`, `args`, `context`, `options`): `Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:447](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/externalToolRegistry.ts#L447)

## Parameters

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

### toolName

`string`

### args

`Record`\<`string`, `any`\>

### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

### options

#### errorOrigin

`string`

#### failureMessage

`string`

## Returns

`Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>
