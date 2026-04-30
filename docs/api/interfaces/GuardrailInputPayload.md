# Interface: GuardrailInputPayload

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:163](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L163)

Payload for input guardrail evaluation.

Provided to [IGuardrailService.evaluateInput](IGuardrailService.md#evaluateinput) before the request
enters the orchestration pipeline. Use this to validate, sanitize,
or block user input before processing.

## Properties

### context

> **context**: [`GuardrailContext`](GuardrailContext.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L165)

Conversational context for policy decisions

***

### input

> **input**: [`AgentOSInput`](AgentOSInput.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L168)

The user's input request to evaluate
