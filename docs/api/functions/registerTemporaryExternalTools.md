# Function: registerTemporaryExternalTools()

> **registerTemporaryExternalTools**(`toolOrchestrator`, `registry`): `Promise`\<() => `Promise`\<`void`\>\>

Defined in: [packages/agentos/src/api/runtime/externalToolRegistry.ts:360](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/externalToolRegistry.ts#L360)

## Parameters

### toolOrchestrator

`Pick`\<`IToolOrchestrator`, `"getTool"` \| `"registerTool"` \| `"unregisterTool"`\>

### registry

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) | `undefined`

## Returns

`Promise`\<() => `Promise`\<`void`\>\>
