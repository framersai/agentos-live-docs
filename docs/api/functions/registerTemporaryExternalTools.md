# Function: registerTemporaryExternalTools()

> **registerTemporaryExternalTools**(`toolOrchestrator`, `registry`): `Promise`\<() => `Promise`\<`void`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:315](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/externalToolRegistry.ts#L315)

## Parameters

### toolOrchestrator

`Pick`\<`IToolOrchestrator`, `"getTool"` \| `"registerTool"` \| `"unregisterTool"`\>

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

## Returns

`Promise`\<() => `Promise`\<`void`\>\>
