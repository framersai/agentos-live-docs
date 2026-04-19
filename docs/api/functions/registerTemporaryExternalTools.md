# Function: registerTemporaryExternalTools()

> **registerTemporaryExternalTools**(`toolOrchestrator`, `registry`): `Promise`\<() => `Promise`\<`void`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:360](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/externalToolRegistry.ts#L360)

## Parameters

### toolOrchestrator

`Pick`\<`IToolOrchestrator`, `"getTool"` \| `"registerTool"` \| `"unregisterTool"`\>

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

## Returns

`Promise`\<() => `Promise`\<`void`\>\>
