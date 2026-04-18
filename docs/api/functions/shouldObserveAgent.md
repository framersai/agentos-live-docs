# Function: shouldObserveAgent()

> **shouldObserveAgent**(`guardrail`, `agentId`): `boolean`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:203](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/ICrossAgentGuardrailService.ts#L203)

Check if a cross-agent guardrail should observe a specific agent.

## Parameters

### guardrail

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)

The cross-agent guardrail

### agentId

`string`

The agent ID to check

## Returns

`boolean`

`true` if the guardrail should observe this agent
