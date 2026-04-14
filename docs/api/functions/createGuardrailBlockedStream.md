# Function: createGuardrailBlockedStream()

> **createGuardrailBlockedStream**(`context`, `evaluation`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:189](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/guardrails/guardrailDispatcher.ts#L189)

Create a stream that emits a single error chunk for blocked content.

Use this when input evaluation returns [GuardrailAction.BLOCK](../enumerations/GuardrailAction.md#block)
to generate an appropriate error response without invoking orchestration.

## Parameters

### context

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Guardrail context for the error details

### evaluation

[`GuardrailEvaluationResult`](../interfaces/GuardrailEvaluationResult.md)

The blocking evaluation result

### options?

[`GuardrailOutputOptions`](../interfaces/GuardrailOutputOptions.md)

Stream options (streamId, personaId)

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Async generator yielding a single ERROR chunk

## Example

```typescript
if (outcome.evaluation?.action === GuardrailAction.BLOCK) {
  yield* createGuardrailBlockedStream(
    guardrailContext,
    outcome.evaluation,
    { streamId: 'stream-123', personaId: 'support-agent' }
  );
  return;
}
```
