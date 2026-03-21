# Guardrail Dispatcher Parallel Execution Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the guardrail dispatcher from sequential to two-phase parallel execution — sanitizers run sequentially (Phase 1), then all others run concurrently (Phase 2) with worst-wins aggregation.

**Architecture:** New `ParallelGuardrailDispatcher` class handles two-phase logic, timeout, and parallel aggregation. Existing `evaluateInputGuardrails` / `wrapOutputGuardrails` become thin delegating wrappers. `canSanitize` and `timeoutMs` added to `GuardrailConfig`. PII pack adds `canSanitize: true`.

**Tech Stack:** TypeScript, vitest, no new dependencies

**Spec:** `docs/superpowers/specs/2026-03-20-guardrail-dispatcher-parallel-design.md`

---

## File Map

| File                                                                           | Change     | Purpose                                                                                                         |
| ------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `packages/agentos/src/core/guardrails/IGuardrailService.ts`                    | Modify     | Add `canSanitize?: boolean` and `timeoutMs?: number` to `GuardrailConfig`                                       |
| `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts`          | **Create** | Two-phase logic, timeout, parallel aggregation                                                                  |
| `packages/agentos/src/core/guardrails/guardrailDispatcher.ts`                  | Modify     | Extract `normalizeServices`, delegate to `ParallelGuardrailDispatcher`, remove `_finalOnlyGuardrails` dead code |
| `packages/agentos/src/core/guardrails/index.ts`                                | Modify     | Export `ParallelGuardrailDispatcher`                                                                            |
| `packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts` | Modify     | Add `canSanitize: true` to config                                                                               |
| `packages/agentos/tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts`   | **Create** | Unit tests for two-phase dispatcher                                                                             |
| `packages/agentos/tests/core/guardrails.integration.spec.ts`                   | Modify     | Add parallel execution integration tests                                                                        |

---

## Task 1: Extend GuardrailConfig

**Files:**

- Modify: `packages/agentos/src/core/guardrails/IGuardrailService.ts`

- [ ] **Step 1: Add `canSanitize` and `timeoutMs` to GuardrailConfig**

In `IGuardrailService.ts`, find the `GuardrailConfig` interface and add the two new fields after `maxStreamingEvaluations`:

```typescript
  /**
   * Whether this guardrail may return SANITIZE actions that modify content.
   *
   * When true, runs in Phase 1 (sequential) — sees and modifies text
   * from prior sanitizers. When false/omitted, runs in Phase 2 (parallel).
   * Phase 2 SANITIZE actions are downgraded to FLAG with a warning.
   *
   * @default false
   */
  canSanitize?: boolean;

  /**
   * Maximum time in ms to wait for this guardrail's evaluation.
   * On timeout: fail-open (logged, skipped).
   *
   * Safety note: Do NOT set on safety-critical guardrails (CSAM, compliance)
   * because fail-open means content passes unchecked.
   *
   * @default undefined (no timeout)
   */
  timeoutMs?: number;
```

- [ ] **Step 2: Commit**

```bash
cd packages/agentos
git add src/core/guardrails/IGuardrailService.ts
git commit -m "feat(guardrails): add canSanitize and timeoutMs to GuardrailConfig"
git push origin master
```

---

## Task 2: ParallelGuardrailDispatcher

**Files:**

- Create: `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts`
- Create: `packages/agentos/tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts`

- [ ] **Step 1: Write the failing tests**

Create `packages/agentos/tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts`:

Test cases for `evaluateInput`:

1. **Empty services** → returns input unchanged, empty evaluations
2. **Single non-sanitizer** → runs in Phase 2, returns its result
3. **Phase 1 sequential sanitize chaining** → sanitizer A modifies text, sanitizer B sees modified text
4. **Phase 1 BLOCK short-circuits** → sanitizer returns BLOCK, Phase 2 never runs
5. **Phase 2 parallel execution** → 3 guardrails run concurrently (verify via timing or concurrent counter)
6. **Phase 2 worst-wins** → one returns FLAG, one returns BLOCK → result is BLOCK
7. **Phase 2 SANITIZE downgraded to FLAG** → guardrail returns SANITIZE in Phase 2 → action becomes FLAG
8. **Mixed phases** → Phase 1 sanitizes, Phase 2 classifies sanitized text
9. **Timeout** → slow guardrail with `timeoutMs: 10` is skipped (fail-open)
10. **Error** → throwing guardrail is skipped (fail-open)
11. **Registration order** → evaluations array is in registration order, not completion order
12. **`evaluation` (singular)** → BLOCK eval is returned as `evaluation`, else worst-severity

Test cases for `wrapOutput`: 13. **TEXT_DELTA Phase 1 sanitize** → textDelta is modified by streaming sanitizer 14. **TEXT_DELTA Phase 2 parallel** → multiple streaming classifiers run concurrently 15. **TEXT_DELTA Phase 2 BLOCK terminates stream** → yields blocked stream 16. **isFinal Phase 1 + Phase 2** → both phases run on final chunk 17. **Rate limiting** → respects `maxStreamingEvaluations` per guardrail 18. **Non-TEXT_DELTA passthrough** → non-text chunks pass through unchanged

Use mock guardrails:

```typescript
function createMockGuardrail(opts: {
  id?: string;
  canSanitize?: boolean;
  evaluateStreamingChunks?: boolean;
  inputResult?: GuardrailEvaluationResult | null;
  outputResult?: GuardrailEvaluationResult | null;
  delay?: number;
  timeoutMs?: number;
}): IGuardrailService {
  return {
    config: {
      canSanitize: opts.canSanitize,
      evaluateStreamingChunks: opts.evaluateStreamingChunks,
      timeoutMs: opts.timeoutMs,
    },
    evaluateInput:
      opts.inputResult !== undefined
        ? vi.fn(async () => {
            if (opts.delay) await new Promise((r) => setTimeout(r, opts.delay));
            return opts.inputResult;
          })
        : undefined,
    evaluateOutput:
      opts.outputResult !== undefined
        ? vi.fn(async () => {
            if (opts.delay) await new Promise((r) => setTimeout(r, opts.delay));
            return opts.outputResult;
          })
        : undefined,
  };
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write ParallelGuardrailDispatcher**

Create `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts`.

Key implementation details:

**evaluateInput:**

1. Partition: `sanitizers = services.filter(s => s.config?.canSanitize === true)`, `parallel = rest`
2. Phase 1: sequential `for...of` on sanitizers (same pattern as existing code, lines 149-179)
3. Phase 2: `Promise.allSettled` on parallel services. Pre-allocate result slots for registration order. Downgrade SANITIZE → FLAG for Phase 2 results.
4. `evaluation` (singular): first BLOCK found, else worst-severity, else last by registration order

**wrapOutput:**

1. Partition into 4 groups once (streamingSanitizers, streamingParallel, finalSanitizers, finalParallel)
2. Per TEXT_DELTA: Phase 1 sequential on streamingSanitizers (with rate limit), Phase 2 parallel on streamingParallel
3. Per isFinal: Phase 1 sequential on finalSanitizers, Phase 2 parallel on finalParallel
4. Reuse existing `serializeEvaluation`, `withGuardrailMetadata`, `createGuardrailBlockedStream` from `guardrailDispatcher.ts` (import them)

**callWithTimeout:**

```typescript
private static async callWithTimeout(
  fn: () => Promise<GuardrailEvaluationResult | null>,
  timeoutMs?: number,
): Promise<GuardrailEvaluationResult | null> {
  try {
    if (!timeoutMs) return await fn();
    return await Promise.race([
      fn(),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          console.warn(`[AgentOS][Guardrails] Evaluation timed out after ${timeoutMs}ms`);
          resolve(null);
        }, timeoutMs)
      ),
    ]);
  } catch (error) {
    console.warn('[AgentOS][Guardrails] Evaluation failed (fail-open):', error);
    return null;
  }
}
```

**worstAction:**

```typescript
private static worstAction(evaluations: GuardrailEvaluationResult[]): GuardrailAction {
  const severity: Record<string, number> = {
    [GuardrailAction.BLOCK]: 3,
    [GuardrailAction.FLAG]: 2,
    [GuardrailAction.ALLOW]: 0,
  };
  let worst = GuardrailAction.ALLOW;
  for (const e of evaluations) {
    if ((severity[e.action] ?? 0) > (severity[worst] ?? 0)) worst = e.action;
  }
  return worst;
}
```

**Phase 2 SANITIZE downgrade:**

```typescript
// Inside evaluateParallel, after each result:
if (result.action === GuardrailAction.SANITIZE) {
  console.warn(
    '[AgentOS][Guardrails] Phase 2 SANITIZE downgraded to FLAG (concurrent sanitization not supported)'
  );
  result = {
    ...result,
    action: GuardrailAction.FLAG,
    metadata: { ...result.metadata, originalAction: 'sanitize', downgraded: true },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts
```

Expected: ALL PASS

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/core/guardrails/ParallelGuardrailDispatcher.ts tests/core/guardrails/ParallelGuardrailDispatcher.spec.ts
git commit -m "feat(guardrails): add ParallelGuardrailDispatcher with two-phase execution"
git push origin master
```

---

## Task 3: Delegate from existing dispatcher

**Files:**

- Modify: `packages/agentos/src/core/guardrails/guardrailDispatcher.ts`
- Modify: `packages/agentos/src/core/guardrails/index.ts`

- [ ] **Step 1: Extract `normalizeServices` helper**

At the top of `guardrailDispatcher.ts` (after imports), extract the inline normalization into a named function:

```typescript
/**
 * Normalize a guardrail service input to an array.
 * Handles: single service, array of services, or undefined.
 */
export function normalizeServices(
  service: IGuardrailService | IGuardrailService[] | undefined
): IGuardrailService[] {
  return Array.isArray(service) ? service.filter(Boolean) : service ? [service] : [];
}
```

- [ ] **Step 2: Update `evaluateInputGuardrails` to delegate**

Replace the sequential loop (lines 131-186) with delegation:

```typescript
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

- [ ] **Step 3: Update `wrapOutputGuardrails` to delegate**

Replace the sequential output loop (lines 274-421) with delegation:

```typescript
export async function* wrapOutputGuardrails(
  service: IGuardrailService | IGuardrailService[] | undefined,
  context: GuardrailContext,
  stream: AsyncGenerator<AgentOSResponse, void, undefined>,
  options: GuardrailOutputOptions
): AsyncGenerator<AgentOSResponse, void, undefined> {
  const services = normalizeServices(service);
  if (services.length === 0) {
    yield* stream;
    return;
  }
  yield* ParallelGuardrailDispatcher.wrapOutput(services, context, stream, options);
}
```

- [ ] **Step 4: Remove `_finalOnlyGuardrails` dead code**

The old variable at line 292 is no longer needed — delete it.

- [ ] **Step 5: Keep existing helper functions**

`serializeEvaluation`, `withGuardrailMetadata`, `createGuardrailBlockedStream`, `hasEvaluateOutput`, `normalizeMetadata` all stay in `guardrailDispatcher.ts` and are imported by `ParallelGuardrailDispatcher`. Export them:

```typescript
export {
  serializeEvaluation,
  withGuardrailMetadata,
  createGuardrailBlockedStream,
  hasEvaluateOutput,
};
```

- [ ] **Step 6: Update barrel exports**

In `packages/agentos/src/core/guardrails/index.ts`, add:

```typescript
export { ParallelGuardrailDispatcher } from './ParallelGuardrailDispatcher';
```

- [ ] **Step 7: Run existing integration tests (regression check)**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails.integration.spec.ts
```

Expected: ALL 4 existing tests PASS (unchanged behavior)

- [ ] **Step 8: Commit and push**

```bash
cd packages/agentos
git add src/core/guardrails/guardrailDispatcher.ts src/core/guardrails/index.ts
git commit -m "feat(guardrails): delegate to ParallelGuardrailDispatcher, extract normalizeServices"
git push origin master
```

---

## Task 4: PII pack migration + ML classifier check

**Files:**

- Modify: `packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts`

- [ ] **Step 1: Add `canSanitize: true` to PII guardrail config**

In `PiiRedactionGuardrail.ts`, find the `this.config` assignment (around line 170) and add `canSanitize`:

```typescript
this.config = {
  evaluateStreamingChunks: options.evaluateStreamingChunks ?? false,
  maxStreamingEvaluations: this.maxStreamingEvaluations,
  canSanitize: true, // PII redaction modifies text via SANITIZE action
};
```

- [ ] **Step 2: Verify ML classifier guardrail does NOT have canSanitize**

Check `packages/agentos/src/extensions/packs/ml-classifiers/MLClassifierGuardrail.ts` — confirm its `config` does not set `canSanitize`. It should default to `false` (Phase 2, parallel).

- [ ] **Step 3: Run all extension tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

Expected: ALL tests PASS

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts
git commit -m "feat(pii): add canSanitize: true to PiiRedactionGuardrail config"
git push origin master
```

---

## Task 5: Integration test + full verification

**Files:**

- Modify: `packages/agentos/tests/core/guardrails.integration.spec.ts`

- [ ] **Step 1: Add parallel execution integration test**

Add a new test case to the existing integration spec that uses both a sanitizing guardrail and a non-sanitizing guardrail together:

```typescript
it('runs sanitizer in Phase 1 then classifier in Phase 2 on sanitized text', async () => {
  // Sanitizer: replaces "secret" with "[REDACTED]"
  // Classifier: returns FLAG if text contains "danger"
  // Input: "secret danger"
  // Expected: sanitizer runs first → "[REDACTED] danger"
  //           classifier runs on sanitized text → FLAG
  //           Both evaluations present in result
});

it('runs multiple Phase 2 guardrails concurrently', async () => {
  // 3 non-sanitizing guardrails, each with 50ms delay
  // Total time should be ~50ms (parallel), not ~150ms (sequential)
});
```

- [ ] **Step 2: Run full guardrails test suite**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/ tests/core/guardrails.integration.spec.ts
```

Expected: ALL PASS

- [ ] **Step 3: Run ALL extension tests (full regression)**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

Expected: ALL PASS (PII + ML classifier + SharedServiceRegistry tests)

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add tests/core/guardrails.integration.spec.ts
git commit -m "test(guardrails): add parallel execution integration tests"
git push origin master
```

- [ ] **Step 5: Update monorepo submodule pointer and push**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos
git commit -m "chore: update agentos submodule — guardrail dispatcher parallel execution upgrade"
git push origin master
```
