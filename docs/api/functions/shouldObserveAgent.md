# Function: shouldObserveAgent()

> **shouldObserveAgent**(`guardrail`, `agentId`): `boolean`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:203](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/ICrossAgentGuardrailService.ts#L203)

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
