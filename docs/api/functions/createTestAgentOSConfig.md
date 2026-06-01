# Function: createTestAgentOSConfig()

> **createTestAgentOSConfig**(`options?`): `Promise`\<[`AgentOSConfig`](../interfaces/AgentOSConfig.md)\>

Defined in: [packages/agentos/src/core/config/AgentOSConfig.ts:501](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/config/AgentOSConfig.ts#L501)

Helper function to create a test configuration for development/testing.
This bypasses some environment requirements and uses sensible defaults.

## Parameters

### options?

`CreateAgentOSConfigOptions` = `{}`

Optional runtime tool inputs to apply to the generated config.

## Returns

`Promise`\<[`AgentOSConfig`](../interfaces/AgentOSConfig.md)\>

Promise resolving to a test AgentOSConfig
