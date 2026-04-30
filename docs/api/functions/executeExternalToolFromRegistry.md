# Function: executeExternalToolFromRegistry()

> **executeExternalToolFromRegistry**(`registry`, `toolName`, `args`, `context`, `options`): `Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:447](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/externalToolRegistry.ts#L447)

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
