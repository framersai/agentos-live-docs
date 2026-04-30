# Function: registerTemporaryExternalTools()

> **registerTemporaryExternalTools**(`toolOrchestrator`, `registry`): `Promise`\<() => `Promise`\<`void`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:360](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/externalToolRegistry.ts#L360)

## Parameters

### toolOrchestrator

`Pick`\<`IToolOrchestrator`, `"getTool"` \| `"registerTool"` \| `"unregisterTool"`\>

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

## Returns

`Promise`\<() => `Promise`\<`void`\>\>
