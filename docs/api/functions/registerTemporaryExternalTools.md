# Function: registerTemporaryExternalTools()

> **registerTemporaryExternalTools**(`toolOrchestrator`, `registry`): `Promise`\<() => `Promise`\<`void`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:360](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/externalToolRegistry.ts#L360)

## Parameters

### toolOrchestrator

`Pick`\<`IToolOrchestrator`, `"getTool"` \| `"registerTool"` \| `"unregisterTool"`\>

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

## Returns

`Promise`\<() => `Promise`\<`void`\>\>
