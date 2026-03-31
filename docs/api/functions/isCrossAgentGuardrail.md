# Function: isCrossAgentGuardrail()

> **isCrossAgentGuardrail**(`service`): `service is ICrossAgentGuardrailService`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:186](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L186)

Type guard to check if a guardrail service is a cross-agent guardrail.

## Parameters

### service

[`IGuardrailService`](../interfaces/IGuardrailService.md)

Guardrail service to check

## Returns

`service is ICrossAgentGuardrailService`

`true` if the service implements cross-agent evaluation
