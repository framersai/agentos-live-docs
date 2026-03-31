# Function: executeExternalToolFromRegistry()

> **executeExternalToolFromRegistry**(`registry`, `toolName`, `args`, `context`, `options`): `Promise`\<[`AgentOSExternalToolHandlerResult`](../interfaces/AgentOSExternalToolHandlerResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:402](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/externalToolRegistry.ts#L402)

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
