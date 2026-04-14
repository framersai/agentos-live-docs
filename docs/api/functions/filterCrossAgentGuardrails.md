# Function: filterCrossAgentGuardrails()

> **filterCrossAgentGuardrails**(`services`): [`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:298](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L298)

Extract cross-agent guardrails from a mixed array of guardrail services.

## Parameters

### services

`unknown`[]

Array of guardrail services (may include non-cross-agent)

## Returns

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Only the cross-agent guardrail services
