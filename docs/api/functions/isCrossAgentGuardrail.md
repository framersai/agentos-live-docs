# Function: isCrossAgentGuardrail()

> **isCrossAgentGuardrail**(`service`): `service is ICrossAgentGuardrailService`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:186](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/ICrossAgentGuardrailService.ts#L186)

Type guard to check if a guardrail service is a cross-agent guardrail.

## Parameters

### service

[`IGuardrailService`](../interfaces/IGuardrailService.md)

Guardrail service to check

## Returns

`service is ICrossAgentGuardrailService`

`true` if the service implements cross-agent evaluation
