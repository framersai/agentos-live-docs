# Interface: IGuardrailService

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:374](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L374)

Contract for implementing custom guardrail logic.

Guardrails intercept content at two points:
1. **Input** - Before user messages enter the orchestration pipeline
2. **Output** - Before agent responses are streamed to the client

Both methods are optional—implement only what you need.

## Examples

```typescript
class ContentFilterGuardrail implements IGuardrailService {
  async evaluateInput({ input }: GuardrailInputPayload) {
    if (input.textInput?.includes('prohibited')) {
      return {
        action: GuardrailAction.BLOCK,
        reason: 'Input contains prohibited content',
        reasonCode: 'CONTENT_BLOCKED'
      };
    }
    return null; // Allow
  }
}
```

```typescript
class CostCeilingGuardrail implements IGuardrailService {
  config = { evaluateStreamingChunks: true };
  private tokenCount = 0;

  async evaluateOutput({ chunk }: GuardrailOutputPayload) {
    if (chunk.type === 'TEXT_DELTA') {
      this.tokenCount += chunk.textDelta?.length ?? 0;
      if (this.tokenCount > 5000) {
        // "Change mind" - stop mid-stream
        return {
          action: GuardrailAction.BLOCK,
          reason: 'Response exceeded cost ceiling'
        };
      }
    }
    return null;
  }
}
```

```typescript
class PIIRedactionGuardrail implements IGuardrailService {
  config = { evaluateStreamingChunks: true, maxStreamingEvaluations: 100 };

  async evaluateOutput({ chunk }: GuardrailOutputPayload) {
    if (chunk.type === 'TEXT_DELTA' && chunk.textDelta) {
      const redacted = chunk.textDelta.replace(
        /\b\d{3}-\d{2}-\d{4}\b/g,
        '[SSN REDACTED]'
      );
      if (redacted !== chunk.textDelta) {
        return {
          action: GuardrailAction.SANITIZE,
          modifiedText: redacted,
          reasonCode: 'PII_REDACTED'
        };
      }
    }
    return null;
  }
}
```

## Extended by

- [`ICrossAgentGuardrailService`](ICrossAgentGuardrailService.md)

## Properties

### config?

> `optional` **config**: [`GuardrailConfig`](GuardrailConfig.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:379](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L379)

Configuration for evaluation behavior.
Controls streaming vs final-only evaluation and rate limiting.

## Methods

### evaluateInput()?

> `optional` **evaluateInput**(`payload`): `Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:395](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L395)

Evaluate user input before orchestration.

Called once per request before the orchestration pipeline starts.
Use this to validate, sanitize, or block user messages.

#### Parameters

##### payload

[`GuardrailInputPayload`](GuardrailInputPayload.md)

Input and context to evaluate

#### Returns

`Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Evaluation result, or `null` to allow without action

#### Remarks

- Return `BLOCK` to prevent the request from being processed
- Return `SANITIZE` with `modifiedText` to clean the input
- Return `null` or `ALLOW` to let the request through

***

### evaluateOutput()?

> `optional` **evaluateOutput**(`payload`): `Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:412](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L412)

Evaluate agent output before streaming to client.

Called for response chunks based on [GuardrailConfig.evaluateStreamingChunks](GuardrailConfig.md#evaluatestreamingchunks):
- `true`: Called for every TEXT_DELTA chunk (real-time filtering)
- `false` (default): Called only for FINAL_RESPONSE chunks

#### Parameters

##### payload

[`GuardrailOutputPayload`](GuardrailOutputPayload.md)

Response chunk and context to evaluate

#### Returns

`Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Evaluation result, or `null` to allow without action

#### Remarks

- Return `BLOCK` to immediately terminate the stream with an error
- Return `SANITIZE` with `modifiedText` to redact/modify content
- Streaming evaluation adds latency; use only when real-time filtering is required
