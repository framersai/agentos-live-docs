# Interface: GuardrailInputOutcome

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:85](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/guardrailDispatcher.ts#L85)

Result of running input guardrails.

Contains the potentially modified input and all evaluation results.
Check `evaluation.action` to determine if processing should continue.

## Properties

### evaluation?

> `optional` **evaluation**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:90](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/guardrailDispatcher.ts#L90)

The last evaluation result (for backwards compatibility)

***

### evaluations?

> `optional` **evaluations**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md)[]

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/guardrailDispatcher.ts#L93)

All evaluation results from all guardrails

***

### sanitizedInput

> **sanitizedInput**: [`AgentOSInput`](AgentOSInput.md)

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:87](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/guardrailDispatcher.ts#L87)

Input after all sanitization (may be modified from original)
