# Function: filterCrossAgentGuardrails()

> **filterCrossAgentGuardrails**(`services`): [`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:298](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L298)

Extract cross-agent guardrails from a mixed array of guardrail services.

## Parameters

### services

`unknown`[]

Array of guardrail services (may include non-cross-agent)

## Returns

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Only the cross-agent guardrail services
