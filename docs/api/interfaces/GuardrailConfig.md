# Interface: GuardrailConfig

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:220](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L220)

Configuration for guardrail evaluation behavior.

Controls when and how often guardrails evaluate content.
Use these settings to balance safety requirements against
performance and cost constraints.

## Example

```typescript
// Real-time PII redaction with rate limiting
const config: GuardrailConfig = {
  evaluateStreamingChunks: true,
  maxStreamingEvaluations: 50
};

// Cost-efficient final-only evaluation (default)
const config: GuardrailConfig = {
  evaluateStreamingChunks: false
};
```

## Properties

### canSanitize?

> `optional` **canSanitize**: `boolean`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:270](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L270)

Whether this guardrail may return SANITIZE actions that modify content.

When true, this guardrail runs in Phase 1 (sequential) of the parallel
dispatcher — it sees and can modify text produced by prior sanitizers.
Each sanitizer receives the cumulative sanitized text from all preceding
sanitizers in registration order.

When false or omitted, this guardrail runs in Phase 2 (parallel) on
the already-sanitized text from Phase 1. It may return BLOCK, FLAG, or
ALLOW. If a Phase 2 guardrail returns SANITIZE, the action is
**downgraded to FLAG** with a warning logged, because concurrent
sanitization would produce non-deterministic results.

#### Default

```ts
false
```

***

### evaluateStreamingChunks?

> `optional` **evaluateStreamingChunks**: `boolean`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:241](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L241)

Enable real-time evaluation of streaming chunks.

When `true`, evaluates every TEXT_DELTA chunk during streaming.
When `false` (default), only evaluates FINAL_RESPONSE chunks.

**Performance Impact:**
- Streaming: Adds 1-500ms latency per TEXT_DELTA chunk
- Final-only: Adds 1-500ms latency once per response

**Cost Impact:**
- Streaming: May trigger LLM calls per chunk (expensive)
- Final-only: Single evaluation per response (cost-efficient)

**Use Cases:**
- Streaming (`true`): Real-time PII redaction, immediate blocking
- Final-only (`false`): Policy checks needing full context, cost-sensitive

#### Default

```ts
false
```

***

### maxStreamingEvaluations?

> `optional` **maxStreamingEvaluations**: `number`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:252](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L252)

Maximum streaming evaluations per request.

Rate-limits streaming evaluations to control cost and performance.
Only applies when [evaluateStreamingChunks](#evaluatestreamingchunks) is `true`.
After reaching the limit, remaining chunks pass through unevaluated.

#### Default

```ts
undefined (no limit)
```

***

### streamingMode?

> `optional` **streamingMode**: `"per-chunk"` \| `"sentence-buffered"`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:300](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L300)

Streaming evaluation mode.

- `'per-chunk'` — evaluate every TEXT_DELTA individually (default behavior).
- `'sentence-buffered'` — accumulate chunks and evaluate at sentence
  boundaries using the internal sentence boundary buffer. The previous sentence
  is included as overlap context for safety evaluation.

Only applies when [evaluateStreamingChunks](#evaluatestreamingchunks) is `true`.

#### Default

```ts
'per-chunk'
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:286](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/IGuardrailService.ts#L286)

Maximum time in milliseconds to wait for this guardrail's evaluation.

If exceeded, the evaluation is abandoned (fail-open), a warning is
logged, and the guardrail contributes nothing to the result. Prevents
a slow guardrail (e.g., LLM-based) from blocking the entire pipeline.

**Safety note:** Do NOT set timeoutMs on safety-critical guardrails
(e.g., CSAM detection, compliance-mandatory filters) because fail-open
on timeout means content passes unchecked. Only use on guardrails
where a missed evaluation is acceptable.

#### Default

```ts
undefined (no timeout — wait indefinitely)
```
