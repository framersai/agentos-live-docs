# Function: shouldObserveAgent()

> **shouldObserveAgent**(`guardrail`, `agentId`): `boolean`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:203](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/ICrossAgentGuardrailService.ts#L203)

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
