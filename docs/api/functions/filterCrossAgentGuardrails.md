# Function: filterCrossAgentGuardrails()

> **filterCrossAgentGuardrails**(`services`): [`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:298](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L298)

Extract cross-agent guardrails from a mixed array of guardrail services.

## Parameters

### services

`unknown`[]

Array of guardrail services (may include non-cross-agent)

## Returns

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Only the cross-agent guardrail services
