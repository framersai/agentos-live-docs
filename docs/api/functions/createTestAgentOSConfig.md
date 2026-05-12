# Function: createTestAgentOSConfig()

> **createTestAgentOSConfig**(`options?`): `Promise`\<[`AgentOSConfig`](../interfaces/AgentOSConfig.md)\>

Defined in: [packages/agentos/src/core/config/AgentOSConfig.ts:501](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/config/AgentOSConfig.ts#L501)

Helper function to create a test configuration for development/testing.
This bypasses some environment requirements and uses sensible defaults.

## Parameters

### options?

`CreateAgentOSConfigOptions` = `{}`

Optional runtime tool inputs to apply to the generated config.

## Returns

`Promise`\<[`AgentOSConfig`](../interfaces/AgentOSConfig.md)\>

Promise resolving to a test AgentOSConfig
