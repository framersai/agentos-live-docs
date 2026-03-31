# Function: executeExternalToolFromRegistry()

> **executeExternalToolFromRegistry**(`registry`, `toolName`, `args`, `context`, `options`): `Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:402](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/externalToolRegistry.ts#L402)

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
