# Function: evaluateInputGuardrails()

> **evaluateInputGuardrails**(`service`, `input`, `context`): `Promise`\<[`GuardrailInputOutcome`](../interfaces/GuardrailInputOutcome.md)\>

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:156](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/guardrailDispatcher.ts#L156)

Evaluate user input through all registered guardrails.

Runs guardrails in sequence, allowing each to modify or block the input.
If any guardrail returns [GuardrailAction.BLOCK](../enumerations/GuardrailAction.md#block), evaluation stops
immediately and the blocked result is returned.

## Parameters

### service

Single guardrail or array of guardrails to evaluate

[`IGuardrailService`](../interfaces/IGuardrailService.md) | [`IGuardrailService`](../interfaces/IGuardrailService.md)[] | `undefined`

### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

User input to evaluate

### context

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Conversation context for policy decisions

## Returns

`Promise`\<[`GuardrailInputOutcome`](../interfaces/GuardrailInputOutcome.md)\>

Outcome containing sanitized input and all evaluations

## Example

```typescript
const outcome = await evaluateInputGuardrails(
  [contentFilter, piiRedactor],
  userInput,
  { userId: 'user-123', sessionId: 'session-abc' }
);

if (outcome.evaluation?.action === GuardrailAction.BLOCK) {
  // Input was blocked - return error stream
  yield* createGuardrailBlockedStream(context, outcome.evaluation);
  return;
}

// Use sanitized input for orchestration
const cleanInput = outcome.sanitizedInput;
```
