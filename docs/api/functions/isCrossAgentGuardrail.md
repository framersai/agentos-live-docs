# Function: isCrossAgentGuardrail()

> **isCrossAgentGuardrail**(`service`): `service is ICrossAgentGuardrailService`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:186](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/safety/guardrails/ICrossAgentGuardrailService.ts#L186)

Type guard to check if a guardrail service is a cross-agent guardrail.

## Parameters

### service

[`IGuardrailService`](../interfaces/IGuardrailService.md)

Guardrail service to check

## Returns

`service is ICrossAgentGuardrailService`

`true` if the service implements cross-agent evaluation
