# Function: wrapOutputGuardrails()

> **wrapOutputGuardrails**(`service`, `context`, `stream`, `options`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:252](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/guardrailDispatcher.ts#L252)

Wrap a response stream with guardrail filtering.

Creates an async generator that evaluates each chunk through registered
guardrails before yielding to the client. Supports both real-time streaming
evaluation and final-only evaluation based on guardrail configuration.

**Evaluation Strategy:**
- Guardrails with `config.evaluateStreamingChunks === true` evaluate TEXT_DELTA chunks
- All guardrails evaluate FINAL_RESPONSE chunks (final safety check)
- Rate limiting via `config.maxStreamingEvaluations` per guardrail

**Actions:**
- [GuardrailAction.BLOCK](../enumerations/GuardrailAction.md#block) - Terminates stream immediately with error chunk
- [GuardrailAction.SANITIZE](../enumerations/GuardrailAction.md#sanitize) - Replaces chunk content with `modifiedText`
- [GuardrailAction.FLAG](../enumerations/GuardrailAction.md#flag) / [GuardrailAction.ALLOW](../enumerations/GuardrailAction.md#allow) - Passes through

## Parameters

### service

Single guardrail or array of guardrails

[`IGuardrailService`](../interfaces/IGuardrailService.md) | [`IGuardrailService`](../interfaces/IGuardrailService.md)[] | `undefined`

### context

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Conversation context for policy decisions

### stream

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Source response stream to wrap

### options

[`GuardrailOutputOptions`](../interfaces/GuardrailOutputOptions.md)

Stream options and input evaluations to attach

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Wrapped stream with guardrail filtering applied

## Example

```typescript
// Wrap output stream with PII redaction
const safeStream = wrapOutputGuardrails(
  [piiRedactor, contentFilter],
  guardrailContext,
  orchestratorStream,
  { streamId: 'stream-123', inputEvaluations }
);

for await (const chunk of safeStream) {
  // Chunks are filtered/sanitized before reaching here
  yield chunk;
}
```
