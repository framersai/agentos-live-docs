# Function: executeExternalToolFromRegistry()

> **executeExternalToolFromRegistry**(`registry`, `toolName`, `args`, `context`, `options`): `Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:402](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/runtime/externalToolRegistry.ts#L402)

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
