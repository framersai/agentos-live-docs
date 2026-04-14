# Interface: GuardrailInputOutcome

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:85](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/guardrailDispatcher.ts#L85)

Result of running input guardrails.

Contains the potentially modified input and all evaluation results.
Check `evaluation.action` to determine if processing should continue.

## Properties

### evaluation?

> `optional` **evaluation**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:90](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/guardrailDispatcher.ts#L90)

The last evaluation result (for backwards compatibility)

***

### evaluations?

> `optional` **evaluations**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md)[]

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:93](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/guardrailDispatcher.ts#L93)

All evaluation results from all guardrails

***

### sanitizedInput

> **sanitizedInput**: [`AgentOSInput`](AgentOSInput.md)

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:87](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/guardrailDispatcher.ts#L87)

Input after all sanitization (may be modified from original)
