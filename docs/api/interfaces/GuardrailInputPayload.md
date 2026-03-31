# Interface: GuardrailInputPayload

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L163)

Payload for input guardrail evaluation.

Provided to [IGuardrailService.evaluateInput](IGuardrailService.md#evaluateinput) before the request
enters the orchestration pipeline. Use this to validate, sanitize,
or block user input before processing.

## Properties

### context

> **context**: [`GuardrailContext`](GuardrailContext.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:165](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L165)

Conversational context for policy decisions

***

### input

> **input**: [`AgentOSInput`](AgentOSInput.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L168)

The user's input request to evaluate
