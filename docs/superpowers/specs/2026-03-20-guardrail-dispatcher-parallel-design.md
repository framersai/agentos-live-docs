# Guardrail Dispatcher Parallel Execution Upgrade — Design Specification

**Date:** 2026-03-20
**Status:** Approved
**Author:** Claude (brainstorming session)
**Sub-project:** 2 of 5 (SOTA Guardrails Parity)

## Summary

Upgrade the AgentOS guardrail dispatcher from purely sequential evaluation to two-phase execution: sanitizing guardrails run sequentially (Phase 1), then all remaining guardrails run concurrently (Phase 2) with worst-wins aggregation. Adds per-guardrail timeout support. Fully backwards compatible — existing function signatures and consumer code unchanged.

## Goals

1. **Parallel execution for non-sanitizing guardrails** — when 3+ guardrails are registered (PII + ML classifiers + custom), they run concurrently instead of sequentially, reducing latency from sum to max
2. **Preserve SANITIZE chaining** — guardrails that modify content (`canSanitize: true`) still run sequentially so each sees the prior's modifications
3. **Per-guardrail timeout** — `config.timeoutMs` prevents a slow guardrail from blocking the pipeline (fail-open on timeout)
4. **Zero breaking changes** — `evaluateInputGuardrails()` and `wrapOutputGuardrails()` keep their exact signatures. `AgentOS.ts` doesn't change. Existing guardrails without `canSanitize` automatically run in parallel.
5. **Apply to both input and output** — two-phase logic works for pre-orchestration input evaluation and streaming output evaluation
6. **Early-exit on BLOCK** — parallel phase returns as soon as any guardrail returns BLOCK, without waiting for the rest
7. **Thorough TSDoc/JSDoc comments** and inline comments on every interface, class, method, and non-obvious logic path

## Non-Goals

- DAG-based dependency resolution between guardrails (YAGNI — linear phases cover all real-world cases)
- AbortController support for cancelling in-flight guardrail evaluations (ML inference can't be cancelled mid-forward-pass)
- Changes to cross-agent guardrail execution model (same sequential pattern, but could be upgraded later)
- N-phase pipeline with configurable phase numbers (deferred — two phases sufficient for now)

---

## Architecture

### 1. GuardrailConfig Extension

**Location:** `packages/agentos/src/core/guardrails/IGuardrailService.ts`

Two new optional fields on the existing `GuardrailConfig` interface:

```typescript
export interface GuardrailConfig {
  /** Enable streaming chunk evaluation. @default false */
  evaluateStreamingChunks?: boolean;
  /** Rate limit streaming evaluations per request. @default undefined (no limit) */
  maxStreamingEvaluations?: number;

  /**
   * Whether this guardrail may return SANITIZE actions that modify content.
   *
   * When true, this guardrail runs in Phase 1 (sequential) so it can
   * see and modify the text produced by prior sanitizers. Each sanitizer
   * receives the cumulative sanitized text from all preceding sanitizers.
   *
   * When false or omitted, this guardrail runs in Phase 2 (parallel)
   * on the already-sanitized text from Phase 1. It may return BLOCK,
   * FLAG, or ALLOW. If a Phase 2 guardrail returns SANITIZE, the action
   * is **downgraded to FLAG** with a warning logged, because concurrent
   * sanitization is non-deterministic (multiple guardrails modifying
   * the same text simultaneously would produce unpredictable results).
   * The original modifiedText is preserved in metadata for debugging.
   *
   * @default false
   */
  canSanitize?: boolean;

  /**
   * Maximum time in milliseconds to wait for this guardrail's evaluation.
   *
   * If exceeded, the evaluation is abandoned (fail-open), a warning is
   * logged, and the guardrail contributes nothing to the result.
   * Prevents a slow guardrail (e.g., LLM-based) from blocking the
   * entire pipeline.
   *
   * **Safety note:** Do NOT set timeoutMs on safety-critical guardrails
   * (e.g., CSAM detection, compliance-mandatory filters) because fail-open
   * on timeout means content passes unchecked. Only use timeoutMs on
   * guardrails where a missed evaluation is acceptable (e.g., toxicity
   * scoring, quality flags).
   *
   * @default undefined (no timeout — wait indefinitely)
   */
  timeoutMs?: number;
}
```

Fully backwards compatible — both fields are optional with safe defaults.

---

### 2. ParallelGuardrailDispatcher

**Location:** `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts` (NEW)

```typescript
/**
 * Two-phase guardrail dispatcher that runs sanitizing guardrails
 * sequentially (Phase 1) then all remaining guardrails in parallel
 * (Phase 2) with worst-wins aggregation.
 *
 * This replaces the sequential-only loop in the original dispatcher
 * while preserving the exact same public API and GuardrailInputOutcome
 * return type.
 *
 * Execution model:
 *
 *   Phase 1 (sequential): guardrails with config.canSanitize === true
 *     - Run one at a time, in registration order
 *     - Each receives the sanitized text from all prior sanitizers
 *     - BLOCK short-circuits immediately (no Phase 2)
 *
 *   Phase 2 (parallel): all remaining guardrails
 *     - Run concurrently via Promise.allSettled
 *     - All receive the final sanitized text from Phase 1
 *     - Worst-wins aggregation: BLOCK > FLAG > ALLOW
 *     - Individual failures are fail-open (logged, skipped)
 *     - Per-guardrail timeout via config.timeoutMs
 *     - No early-exit: Promise.allSettled waits for all to settle,
 *       then aggregates. ML inference cannot be cancelled mid-pass
 *       anyway, so early-exit would save negligible time.
 *
 * Latency comparison (3 guardrails at 20ms, 50ms, 60ms):
 *   Sequential: 20 + 50 + 60 = 130ms
 *   Parallel:   max(20, 50, 60) = 60ms  (2.2x faster)
 */
export class ParallelGuardrailDispatcher {
  /**
   * Evaluate input through two-phase pipeline.
   *
   * @param services - All registered guardrail services
   * @param input - The user input to evaluate
   * @param context - Guardrail context (userId, sessionId, etc.)
   * @returns GuardrailInputOutcome with sanitized input and all evaluations
   */
  static async evaluateInput(
    services: IGuardrailService[],
    input: AgentOSInput,
    context: GuardrailContext
  ): Promise<GuardrailInputOutcome>;

  /**
   * Wrap output stream with two-phase guardrail evaluation per chunk.
   *
   * Partitions guardrails into four groups (computed once at stream start):
   * - streamingSanitizers: canSanitize + evaluateStreamingChunks (Phase 1 per TEXT_DELTA)
   * - streamingParallel: !canSanitize + evaluateStreamingChunks (Phase 2 per TEXT_DELTA)
   * - finalSanitizers: canSanitize + evaluateOutput (Phase 1 on isFinal)
   * - finalParallel: !canSanitize + evaluateOutput (Phase 2 on isFinal)
   *
   * @param services - All registered guardrail services
   * @param context - Guardrail context
   * @param stream - Source output stream from orchestrator
   * @param options - Stream ID, persona ID, input evaluations
   */
  static async *wrapOutput(
    services: IGuardrailService[],
    context: GuardrailContext,
    stream: AsyncGenerator<AgentOSResponse>,
    options: GuardrailOutputOptions
  ): AsyncGenerator<AgentOSResponse>;
}
```

### Internal helpers

```typescript
/**
 * Call a guardrail evaluation with optional timeout.
 * On timeout or error: log warning, return null (fail-open).
 *
 * @param fn - The evaluation function to call
 * @param timeoutMs - Optional timeout in milliseconds
 * @returns Evaluation result or null (fail-open)
 */
private static async callWithTimeout(
  fn: () => Promise<GuardrailEvaluationResult | null>,
  timeoutMs?: number,
): Promise<GuardrailEvaluationResult | null>;

/**
 * Run multiple guardrail evaluations concurrently.
 *
 * Uses Promise.allSettled so one failure doesn't cancel others.
 * Waits for all to settle, then aggregates. Phase 2 SANITIZE actions
 * are downgraded to FLAG before being included in results.
 * Results are returned in registration order for determinism.
 *
 * @param evaluations - Array of { service, promise } pairs (in registration order)
 * @returns Non-null evaluation results in registration order
 */
private static async evaluateParallel(
  evaluations: Array<{ service: IGuardrailService; promise: Promise<GuardrailEvaluationResult | null> }>,
): Promise<GuardrailEvaluationResult[]>;

/**
 * Determine the worst (most severe) action across multiple evaluations.
 * Severity ordering: BLOCK > FLAG > ALLOW.
 *
 * SANITIZE is excluded from Phase 2 worst-wins aggregation because
 * Phase 2 SANITIZE actions are downgraded to FLAG before aggregation.
 * In Phase 1 (sequential), SANITIZE is handled inline, not via worstAction.
 *
 * @param evaluations - Results to aggregate
 * @returns The most severe action, or ALLOW if empty
 */
private static worstAction(
  evaluations: GuardrailEvaluationResult[],
): GuardrailAction;
```

### evaluateInput flow

```
evaluateInput(services, input, context):
  1. Partition services:
     sanitizers = services.filter(s => s.config?.canSanitize === true)
     parallel   = services.filter(s => s.config?.canSanitize !== true)

  2. Phase 1 — sequential sanitizers:
     for each sanitizer:
       result = callWithTimeout(svc.evaluateInput, svc.config.timeoutMs)
       if null → skip
       push to evaluations[]
       if BLOCK → return immediately with evaluations
       if SANITIZE + modifiedText → update sanitizedInput

  3. Phase 2 — parallel non-sanitizers:
     Fire all at once: services.map(svc => callWithTimeout(svc.evaluateInput, ...))
     evaluateParallel() with early-exit on BLOCK
     Push all results to evaluations[]
     If any BLOCK → return with BLOCK evaluation

  4. Return {
       sanitizedInput,
       evaluation: BLOCK eval if any, else worst-severity eval, else last by registration order,
       evaluations: all (Phase 1 in order, then Phase 2 in registration order)
     }
```

### wrapOutput flow

```
wrapOutput(services, context, stream, options):
  1. Partition into 4 groups (once):
     streamingSanitizers, streamingParallel, finalSanitizers, finalParallel

  2. For each chunk from stream:

     If TEXT_DELTA and not isFinal:
       Phase 1: sequential streamingSanitizers on textDelta
         (with rate limiting per guardrail)
       Phase 2: parallel streamingParallel on sanitized textDelta
         (with rate limiting per guardrail)
       If any BLOCK → yield blocked stream, return
       Attach metadata, yield chunk

     If isFinal:
       Phase 1: sequential finalSanitizers
       Phase 2: parallel finalParallel
       If any BLOCK → yield blocked stream, return
       Attach metadata, yield chunk

     Otherwise:
       Yield chunk unchanged
```

---

### 3. Delegation from Existing Functions

**Location:** `packages/agentos/src/core/guardrails/guardrailDispatcher.ts` (MODIFIED)

The existing exported functions become thin wrappers:

```typescript
/**
 * Evaluate user input through all registered guardrails.
 *
 * Uses two-phase execution: sanitizers sequential, then parallel.
 * Signature unchanged for backwards compatibility.
 */
export async function evaluateInputGuardrails(
  service: IGuardrailService | IGuardrailService[] | undefined,
  input: AgentOSInput,
  context: GuardrailContext
): Promise<GuardrailInputOutcome> {
  const services = normalizeServices(service);
  if (services.length === 0) {
    return { sanitizedInput: input, evaluation: null, evaluations: [] };
  }
  return ParallelGuardrailDispatcher.evaluateInput(services, input, context);
}
```

A `normalizeServices` helper is extracted from the existing inline normalization logic (currently inline at line ~137 of `guardrailDispatcher.ts`). It converts `service | service[] | undefined` to `service[]`. The `wrapOutputGuardrails` function delegates similarly.

All existing helper functions (`serializeEvaluation`, `withGuardrailMetadata`, `createGuardrailBlockedStream`) remain unchanged and are reused by `ParallelGuardrailDispatcher`.

---

### 4. Cross-Agent Dispatcher

**Location:** `packages/agentos/src/core/guardrails/crossAgentGuardrailDispatcher.ts` (MODIFIED)

Same two-phase pattern applied to `evaluateCrossAgentGuardrails`:

- Phase 1: cross-agent guardrails with `canSanitize: true` (rare but supported)
- Phase 2: all others in parallel

The `canInterruptOthers` downgrade logic is preserved. For Phase 2 parallel execution, the downgrade happens **inside the individual promise wrapper** (before results are aggregated), not after. This ensures the aggregation step never sees a raw BLOCK from a guardrail that shouldn't interrupt others.

---

### 5. PII Pack Migration

**Location:** `packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts` (MODIFIED)

One-line change:

```typescript
// Before:
this.config = {
  evaluateStreamingChunks: options.evaluateStreamingChunks ?? true,
  maxStreamingEvaluations: this.maxEvaluations,
};

// After:
this.config = {
  evaluateStreamingChunks: options.evaluateStreamingChunks ?? true,
  maxStreamingEvaluations: this.maxEvaluations,
  canSanitize: true, // PII redaction modifies text via SANITIZE
};
```

The ML classifier guardrail does NOT need changes — it doesn't set `canSanitize` and will automatically run in Phase 2 (parallel).

---

### 6. Latency Impact

| Scenario                     | Before (sequential)    | After (parallel)                    | Speedup                    |
| ---------------------------- | ---------------------- | ----------------------------------- | -------------------------- |
| PII only                     | 20ms                   | 20ms (Phase 1 only)                 | 1x                         |
| ML classifiers only          | 60ms                   | 60ms (Phase 2 only)                 | 1x                         |
| PII + ML classifiers         | 20 + 60 = 80ms         | 20 (Phase 1) + 60 (Phase 2) = 80ms  | 1x (phases are sequential) |
| PII + ML + keyword + cost    | 20 + 60 + 5 + 2 = 87ms | 20 (Phase 1) + max(60, 5, 2) = 80ms | 1.09x                      |
| ML + keyword + cost + custom | 60 + 5 + 2 + 30 = 97ms | max(60, 5, 2, 30) = 60ms            | 1.6x                       |
| 5 non-sanitizing guardrails  | 200ms sum              | 60ms max                            | 3.3x                       |

The benefit scales with the number of non-sanitizing guardrails. The common case (PII + ML classifiers) shows modest improvement because they're in different phases. The big win is when multiple Phase 2 guardrails are registered.

---

## File Changes Summary

| File                               | Change                                                                                                                                                                                                                | Lines     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `IGuardrailService.ts`             | Add `canSanitize?: boolean` and `timeoutMs?: number` to `GuardrailConfig`                                                                                                                                             | +25       |
| `ParallelGuardrailDispatcher.ts`   | **NEW** — two-phase logic, timeout, parallel aggregation, early-exit                                                                                                                                                  | ~250      |
| `guardrailDispatcher.ts`           | Extract `normalizeServices`, delegate to ParallelGuardrailDispatcher, remove `_finalOnlyGuardrails` dead code, keep existing helpers (`serializeEvaluation`, `withGuardrailMetadata`, `createGuardrailBlockedStream`) | ~-80, +30 |
| `crossAgentGuardrailDispatcher.ts` | Same delegation pattern                                                                                                                                                                                               | ~-40, +15 |
| `index.ts`                         | Export ParallelGuardrailDispatcher                                                                                                                                                                                    | +1        |
| PII `PiiRedactionGuardrail.ts`     | Add `canSanitize: true`                                                                                                                                                                                               | +1        |

Total: 1 new file, 5 modified, ~250 new lines.

---

## Testing Strategy

1. **ParallelGuardrailDispatcher.evaluateInput unit tests:**
   - Phase 1 sequential: sanitizers chain correctly (output of one feeds into next)
   - Phase 1 BLOCK short-circuits (Phase 2 never runs)
   - Phase 2 parallel: multiple guardrails run concurrently (verify with timing)
   - Phase 2 worst-wins: any BLOCK → result is BLOCK
   - Phase 2 FLAG + ALLOW → FLAG wins
   - Mixed phases: Phase 1 sanitizes, Phase 2 classifies sanitized text
   - Timeout: slow guardrail skipped after timeoutMs (fail-open)
   - Error: failing guardrail skipped (fail-open)
   - Empty services: returns input unchanged
   - No sanitizers: all run in Phase 2

2. **ParallelGuardrailDispatcher.wrapOutput unit tests:**
   - Streaming TEXT_DELTA: Phase 1 sanitizes textDelta, Phase 2 classifies in parallel
   - isFinal: both phases run on final chunk
   - BLOCK in Phase 2 terminates stream
   - Rate limiting still per-guardrail
   - Non-TEXT_DELTA chunks pass through unchanged

3. **Integration tests (through AgentOS.processRequest):**
   - PII (canSanitize) + ML classifier (parallel): PII sanitizes first, ML sees sanitized text
   - Multiple Phase 2 guardrails: all run, worst-wins
   - Backwards compat: single guardrail behaves identically to before

4. **Regression tests:**
   - Existing `guardrails.integration.spec.ts` tests all pass unchanged

---

## Backwards Compatibility

| Scenario                                               | Behavior                                                                                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Single guardrail, no `canSanitize`                     | Runs alone in Phase 2 — identical behavior                                                                                                |
| Multiple guardrails, no `canSanitize`                  | All run in Phase 2 (parallel) — faster, same results for BLOCK/FLAG/ALLOW                                                                 |
| Guardrail returns SANITIZE without `canSanitize: true` | Runs in Phase 2 — sanitization applies but doesn't chain with other sanitizers. **Migration note: add `canSanitize: true` for chaining.** |
| `timeoutMs` not set                                    | No timeout — identical to before                                                                                                          |
| Existing `AgentOS.ts` consumer code                    | **Zero changes needed** — function signatures unchanged                                                                                   |

---

## Open Questions (Deferred)

1. ~~Should Phase 2 results be ordered?~~ **Decided:** Registration order. Pre-allocate result slots by index, fill on settlement. Guarantees deterministic `evaluations[]` ordering for tests and consumers.
2. Should there be a `phase?: number` field on `GuardrailConfig` for N-phase pipelines? Deferred — two phases are sufficient for all current use cases.
3. Should the cross-agent dispatcher also support parallel execution? Deferred — cross-agent guardrails are rare and the sequential model is simpler.
