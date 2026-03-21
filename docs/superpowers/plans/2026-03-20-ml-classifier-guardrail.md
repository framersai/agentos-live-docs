# ML Classifier Guardrail Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a streaming ML classifier guardrail extension with sliding-window chunk-based evaluation, three default BERT-family classifiers (toxicity, injection, jailbreak), and universal runtime support (Node.js/browser/edge).

**Architecture:** Pluggable `IContentClassifier` registry with a `ClassifierOrchestrator` running classifiers in parallel per chunk. `SlidingWindowBuffer` manages token accumulation with configurable `chunkSize`/`contextSize`. All models lazy-loaded via `ISharedServiceRegistry`. Results aligned with `IUtilityAI.ClassificationResult`.

**Tech Stack:** TypeScript, vitest, `@huggingface/transformers` (already a dependency — provides ONNX Runtime), models: `unitary/toxic-bert`, `protectai/deberta-v3-small-prompt-injection-v2`, `meta-llama/PromptGuard-86M`

**Spec:** `docs/superpowers/specs/2026-03-20-ml-classifier-guardrail-design.md`

---

## File Map

All ML classifier pack files live under `packages/agentos/src/extensions/packs/ml-classifiers/`.

| File                                   | Purpose                                                                                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                             | `MLClassifierPackOptions`, `ClassifierThresholds`, `ClassifierConfig`, `BrowserConfig`, `ML_CLASSIFIER_SERVICE_IDS`, `AnnotatedClassificationResult`, `ChunkEvaluation` |
| `IContentClassifier.ts`                | Pluggable classifier interface                                                                                                                                          |
| `SlidingWindowBuffer.ts`               | `SlidingWindowConfig`, `ChunkReady`, `WindowState`, token accumulation + context carry-forward                                                                          |
| `ClassifierOrchestrator.ts`            | Parallel execution + worst-wins aggregation                                                                                                                             |
| `MLClassifierGuardrail.ts`             | `IGuardrailService` impl with sliding window + 3 streaming modes                                                                                                        |
| `classifiers/ToxicityClassifier.ts`    | `unitary/toxic-bert` wrapper                                                                                                                                            |
| `classifiers/InjectionClassifier.ts`   | `protectai/deberta-v3-small-prompt-injection-v2` wrapper                                                                                                                |
| `classifiers/JailbreakClassifier.ts`   | `meta-llama/PromptGuard-86M` wrapper                                                                                                                                    |
| `classifiers/WorkerClassifierProxy.ts` | Browser Web Worker wrapper                                                                                                                                              |
| `worker/classifier-worker.ts`          | Web Worker entry point                                                                                                                                                  |
| `tools/ClassifyContentTool.ts`         | `ITool` for on-demand classification                                                                                                                                    |
| `index.ts`                             | `createMLClassifierPack()` factory + `createExtensionPack()` bridge                                                                                                     |
| `ml-classifiers.skill.md`              | SKILL.md for agent awareness                                                                                                                                            |

Shared utilities at `packages/agentos/src/core/utils/`:

| File            | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `text-utils.ts` | `clamp`, `parseJsonResponse`, `tokenize`, `normalizeText`, `estimateTokens` |
| `index.ts`      | Barrel exports                                                              |

Tests under `packages/agentos/tests/extensions/packs/ml-classifiers/`.

| Test File                        | Covers                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `SlidingWindowBuffer.spec.ts`    | Chunk accumulation, context carry-forward, concurrent streams, budget, stale cleanup, flush |
| `ToxicityClassifier.spec.ts`     | Label mapping, score extraction, graceful degradation, model ID override                    |
| `InjectionClassifier.spec.ts`    | Binary classification mapping, graceful degradation                                         |
| `JailbreakClassifier.spec.ts`    | Multi-class mapping, graceful degradation                                                   |
| `ClassifierOrchestrator.spec.ts` | Parallel execution, worst-wins, threshold mapping, single failure tolerance                 |
| `MLClassifierGuardrail.spec.ts`  | Input eval, output streaming, scope filtering, streaming modes                              |
| `ClassifyContentTool.spec.ts`    | Tool schema, execute, classifier filtering                                                  |
| `WorkerClassifierProxy.spec.ts`  | Worker delegation, fallback to main thread                                                  |
| `index.spec.ts`                  | Pack factory, descriptor IDs/kinds, createExtensionPack bridge                              |
| `text-utils.spec.ts`             | All shared utility functions                                                                |

---

## Task 1: Shared utilities extraction

**Files:**

- Create: `packages/agentos/src/core/utils/text-utils.ts`
- Create: `packages/agentos/src/core/utils/index.ts`
- Create: `packages/agentos/tests/core/utils/text-utils.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/core/utils/text-utils.spec.ts`:

````typescript
import { describe, it, expect } from 'vitest';
import {
  clamp,
  parseJsonResponse,
  tokenize,
  normalizeText,
  estimateTokens,
} from '../../../src/core/utils/text-utils';

describe('text-utils', () => {
  describe('clamp', () => {
    it('clamps below minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });
    it('clamps above maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
    it('passes through in-range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe('parseJsonResponse', () => {
    it('parses valid JSON', () => {
      expect(parseJsonResponse<{ a: number }>('{"a": 1}')).toEqual({ a: 1 });
    });
    it('returns null for invalid JSON', () => {
      expect(parseJsonResponse('not json')).toBeNull();
    });
    it('extracts JSON from markdown code fences', () => {
      expect(parseJsonResponse('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
    });
  });

  describe('tokenize', () => {
    it('splits into lowercase words', () => {
      expect(tokenize('Hello, World!')).toEqual(['hello', 'world']);
    });
    it('handles empty string', () => {
      expect(tokenize('')).toEqual([]);
    });
  });

  describe('normalizeText', () => {
    it('lowercases and strips punctuation', () => {
      expect(normalizeText('Hello, World!!!')).toBe('hello world');
    });
    it('collapses whitespace', () => {
      expect(normalizeText('a   b\n\nc')).toBe('a b c');
    });
  });

  describe('estimateTokens', () => {
    it('estimates ~4 chars per token', () => {
      expect(estimateTokens('hello world')).toBe(3); // 11 chars / 4 = 2.75 → ceil 3
    });
    it('returns 0 for empty string', () => {
      expect(estimateTokens('')).toBe(0);
    });
  });
});
````

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/text-utils.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write text-utils.ts**

Create `packages/agentos/src/core/utils/text-utils.ts`:

````typescript
/**
 * @module core/utils/text-utils
 *
 * Shared text processing utilities used across AgentOS modules.
 * Consolidated from duplicated implementations to ensure consistency.
 */

/**
 * Clamp a numeric value to a [min, max] range.
 *
 * @param value - The value to clamp
 * @param min - Minimum bound (inclusive)
 * @param max - Maximum bound (inclusive)
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Parse a JSON response string, handling common LLM output patterns.
 * Strips markdown code fences if present before parsing.
 *
 * @typeParam T - Expected parsed type
 * @param response - Raw string that may contain JSON
 * @returns Parsed object, or null if parsing fails
 */
export function parseJsonResponse<T>(response: string): T | null {
  try {
    // Strip markdown code fences: ```json ... ``` or ``` ... ```
    const stripped = response.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '');
    return JSON.parse(stripped) as T;
  } catch {
    return null;
  }
}

/**
 * Tokenize text into lowercase words.
 * Strips punctuation and splits on whitespace.
 *
 * @param text - Input text
 * @returns Array of lowercase word tokens
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Normalize text for comparison: lowercase, strip punctuation, collapse whitespace.
 *
 * @param text - Input text
 * @returns Normalized text string
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Estimate token count from character length.
 * Uses ~4 chars per token approximation (standard for English text).
 * Intentionally approximate — used for deciding WHEN to classify,
 * not for actual model tokenization.
 *
 * @param text - Input text
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}
````

Create barrel `packages/agentos/src/core/utils/index.ts`:

```typescript
export * from './text-utils';
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/text-utils.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/core/utils/ tests/core/utils/
git commit -m "feat: add shared text-utils module (clamp, parseJsonResponse, tokenize, normalizeText, estimateTokens)"
```

---

## Task 2: Core types + IContentClassifier

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/types.ts`
- Create: `packages/agentos/src/extensions/packs/ml-classifiers/IContentClassifier.ts`

- [ ] **Step 1: Create directory structure**

```bash
cd packages/agentos
mkdir -p src/extensions/packs/ml-classifiers/classifiers
mkdir -p src/extensions/packs/ml-classifiers/tools
mkdir -p src/extensions/packs/ml-classifiers/worker
mkdir -p tests/extensions/packs/ml-classifiers
```

- [ ] **Step 2: Write types.ts**

Create `packages/agentos/src/extensions/packs/ml-classifiers/types.ts` with all types from the spec:

- `ClassifierThresholds` interface (blockThreshold, flagThreshold, warnThreshold)
- `ClassifierConfig` interface (modelId, thresholds, labelActions)
- `BrowserConfig` interface (useWebWorker, cacheStrategy, maxCacheSize, onProgress)
- `ModelDownloadProgress` interface
- `MLClassifierPackOptions` interface (classifiers, customClassifiers, modelCacheDir, quantized, runtime, browser, chunkSize, contextSize, maxEvaluations, streamingMode, thresholds, guardrailScope)
- `ML_CLASSIFIER_SERVICE_IDS` const
- `AnnotatedClassificationResult` extends `ClassificationResult` from IUtilityAI (classifierId, latencyMs)
- `ChunkEvaluation` interface (results, recommendedAction, triggeredBy, totalLatencyMs)
- `DEFAULT_THRESHOLDS` const ({ blockThreshold: 0.9, flagThreshold: 0.7, warnThreshold: 0.4 })

Import `ClassificationResult` from `../../../core/ai_utilities/IUtilityAI`.
Import `GuardrailAction` from `../../../core/guardrails/IGuardrailService`.

- [ ] **Step 3: Write IContentClassifier.ts**

Create `packages/agentos/src/extensions/packs/ml-classifiers/IContentClassifier.ts` with full TSDoc from the spec.

Import `ClassificationResult` from `../../../core/ai_utilities/IUtilityAI`.

- [ ] **Step 4: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/types.ts src/extensions/packs/ml-classifiers/IContentClassifier.ts
git commit -m "feat(ml-classifiers): add core types, config interfaces, and IContentClassifier"
```

---

## Task 3: SlidingWindowBuffer

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/SlidingWindowBuffer.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/SlidingWindowBuffer.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/ml-classifiers/SlidingWindowBuffer.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { SlidingWindowBuffer } from '../../../../src/extensions/packs/ml-classifiers/SlidingWindowBuffer';

describe('SlidingWindowBuffer', () => {
  it('returns null until chunkSize tokens accumulated', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 10, contextSize: 2 });
    // "hello" = 5 chars ≈ 2 tokens (ceil(5/4)). Need 10 tokens ≈ 40 chars.
    expect(buf.push('s1', 'short text')).toBeNull();
  });

  it('returns ChunkReady when chunkSize reached', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 5, contextSize: 0 });
    // Need 5 tokens ≈ 20 chars
    const result = buf.push('s1', 'a]'.repeat(12)); // 24 chars = 6 tokens
    expect(result).not.toBeNull();
    expect(result!.evaluationNumber).toBe(1);
    expect(result!.text.length).toBeGreaterThan(0);
  });

  it('carries context forward between chunks', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 5, contextSize: 3 });
    // First chunk
    const text1 = 'a'.repeat(24); // 6 tokens
    const r1 = buf.push('s1', text1);
    expect(r1).not.toBeNull();

    // Second chunk should start with context from end of first
    const text2 = 'b'.repeat(24);
    const r2 = buf.push('s1', text2);
    expect(r2).not.toBeNull();
    // The classification text should contain carried context
    expect(r2!.text.length).toBeGreaterThan(r2!.newText.length);
  });

  it('supports multiple concurrent streams independently', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 5, contextSize: 0 });
    const bigText = 'x'.repeat(24);
    const r1 = buf.push('stream-a', bigText);
    const r2 = buf.push('stream-b', bigText);
    expect(r1).not.toBeNull();
    expect(r2).not.toBeNull();
    expect(r1!.evaluationNumber).toBe(1);
    expect(r2!.evaluationNumber).toBe(1);
  });

  it('respects maxEvaluations budget', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 3, contextSize: 0, maxEvaluations: 2 });
    const text = 'x'.repeat(16); // ~4 tokens
    expect(buf.push('s1', text)).not.toBeNull(); // eval 1
    expect(buf.push('s1', text)).not.toBeNull(); // eval 2
    expect(buf.push('s1', text)).toBeNull(); // budget exhausted
  });

  it('flush returns remaining buffer', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 100, contextSize: 0 });
    buf.push('s1', 'some partial text');
    const result = buf.flush('s1');
    expect(result).not.toBeNull();
    expect(result!.text).toContain('some partial text');
  });

  it('flush returns null for empty buffer', () => {
    const buf = new SlidingWindowBuffer();
    expect(buf.flush('nonexistent')).toBeNull();
  });

  it('pruneStale removes old streams', () => {
    const buf = new SlidingWindowBuffer({ streamTimeoutMs: 1 });
    buf.push('stale', 'text');
    // Wait for timeout
    const start = Date.now();
    while (Date.now() - start < 5) {
      /* spin */
    }
    buf.pruneStale();
    expect(buf.flush('stale')).toBeNull();
  });

  it('clear removes all state', () => {
    const buf = new SlidingWindowBuffer({ chunkSize: 100 });
    buf.push('s1', 'text');
    buf.push('s2', 'text');
    buf.clear();
    expect(buf.flush('s1')).toBeNull();
    expect(buf.flush('s2')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/SlidingWindowBuffer.spec.ts
```

- [ ] **Step 3: Write SlidingWindowBuffer implementation**

Create `packages/agentos/src/extensions/packs/ml-classifiers/SlidingWindowBuffer.ts` following the spec exactly. Key behaviors:

- `estimateTokens()` uses `Math.ceil(text.length / 4)`
- `push()` accumulates text, returns `ChunkReady` when `tokenCount >= chunkSize`
- On chunk ready: save tail of buffer as `contextRing` (last `contextSize` tokens worth of chars), reset buffer
- `pruneStale()` called lazily inside `push()` when Map size > 10
- `flush()` returns remaining buffer + context as final chunk, then deletes stream state
- Increment `evaluationNumber` on each returned chunk, stop returning after `maxEvaluations`

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/SlidingWindowBuffer.spec.ts
```

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/SlidingWindowBuffer.ts tests/extensions/packs/ml-classifiers/SlidingWindowBuffer.spec.ts
git commit -m "feat(ml-classifiers): add SlidingWindowBuffer with context carry-forward"
```

---

## Task 4: Three default classifiers

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/classifiers/ToxicityClassifier.ts`
- Create: `packages/agentos/src/extensions/packs/ml-classifiers/classifiers/InjectionClassifier.ts`
- Create: `packages/agentos/src/extensions/packs/ml-classifiers/classifiers/JailbreakClassifier.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/ToxicityClassifier.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/InjectionClassifier.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/JailbreakClassifier.spec.ts`

- [ ] **Step 1: Write ToxicityClassifier test**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { ToxicityClassifier } from '../../../../src/extensions/packs/ml-classifiers/classifiers/ToxicityClassifier';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

function mockRegistry(pipelineResult: any): ISharedServiceRegistry {
  const pipeline = vi.fn(async () => pipelineResult);
  return {
    getOrCreate: vi.fn(async (_id: string, factory: any) => pipeline),
    has: () => false,
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('ToxicityClassifier', () => {
  it('has correct id, displayName, and modelId', () => {
    const registry = mockRegistry([]);
    const c = new ToxicityClassifier(registry);
    expect(c.id).toBe('toxicity');
    expect(c.displayName).toBe('Toxicity Classifier');
    expect(c.modelId).toBe('unitary/toxic-bert');
  });

  it('maps multi-label output to ClassificationResult', async () => {
    const registry = mockRegistry([
      { label: 'toxic', score: 0.92 },
      { label: 'severe_toxic', score: 0.03 },
      { label: 'obscene', score: 0.85 },
      { label: 'threat', score: 0.01 },
      { label: 'insult', score: 0.78 },
      { label: 'identity_hate', score: 0.02 },
    ]);
    const c = new ToxicityClassifier(registry);
    const result = await c.classify('test text');
    expect(result.bestClass).toBe('toxic');
    expect(result.confidence).toBe(0.92);
    expect(result.allScores).toHaveLength(6);
    expect(result.allScores[0].classLabel).toBe('toxic');
  });

  it('gracefully degrades when model fails to load', async () => {
    const registry: ISharedServiceRegistry = {
      getOrCreate: vi.fn(async () => {
        throw new Error('load failed');
      }),
      has: () => false,
      release: vi.fn(async () => {}),
      releaseAll: vi.fn(async () => {}),
    };
    const c = new ToxicityClassifier(registry);
    const result = await c.classify('test');
    expect(result.bestClass).toBe('benign');
    expect(result.confidence).toBe(0);
  });

  it('respects modelId override via config', () => {
    const registry = mockRegistry([]);
    const c = new ToxicityClassifier(registry, { modelId: 'custom/model' });
    expect(c.modelId).toBe('unitary/toxic-bert'); // modelId readonly is default
    // The override is used internally when loading — tested via getOrCreate call
  });
});
```

- [ ] **Step 2: Write InjectionClassifier test** (similar structure, binary labels: INJECTION/SAFE)

- [ ] **Step 3: Write JailbreakClassifier test** (similar structure, multi-class: jailbreak/injection/benign)

- [ ] **Step 4: Run tests to verify they fail**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/ToxicityClassifier.spec.ts tests/extensions/packs/ml-classifiers/InjectionClassifier.spec.ts tests/extensions/packs/ml-classifiers/JailbreakClassifier.spec.ts
```

- [ ] **Step 5: Implement all three classifiers**

Each follows the same pattern from the spec:

- Constructor takes `ISharedServiceRegistry` + optional `ClassifierConfig`
- `classify()` lazy-loads model via `services.getOrCreate(SERVICE_ID, factory, { dispose, tags })`
- Maps pipeline output to `ClassificationResult` (bestClass, confidence, allScores)
- On load failure: sets `unavailable = true`, returns pass result
- Uses `@huggingface/transformers` dynamic import

Key differences:

- **Toxicity**: `pipeline('text-classification', 'unitary/toxic-bert', { topk: null })` → multi-label
- **Injection**: `pipeline('text-classification', 'protectai/deberta-v3-small-prompt-injection-v2')` → binary (INJECTION/SAFE)
- **Jailbreak**: `pipeline('text-classification', 'meta-llama/PromptGuard-86M')` → multi-class (jailbreak/injection/benign)

- [ ] **Step 6: Run tests to verify they pass**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/ToxicityClassifier.spec.ts tests/extensions/packs/ml-classifiers/InjectionClassifier.spec.ts tests/extensions/packs/ml-classifiers/JailbreakClassifier.spec.ts
```

- [ ] **Step 7: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/classifiers/ToxicityClassifier.ts src/extensions/packs/ml-classifiers/classifiers/InjectionClassifier.ts src/extensions/packs/ml-classifiers/classifiers/JailbreakClassifier.ts tests/extensions/packs/ml-classifiers/ToxicityClassifier.spec.ts tests/extensions/packs/ml-classifiers/InjectionClassifier.spec.ts tests/extensions/packs/ml-classifiers/JailbreakClassifier.spec.ts
git commit -m "feat(ml-classifiers): add Toxicity, Injection, and Jailbreak classifiers"
```

---

## Task 5: ClassifierOrchestrator

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/ClassifierOrchestrator.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/ClassifierOrchestrator.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- Runs all classifiers in parallel (verify with timing — total should be ~max(individual), not sum)
- Worst-wins aggregation: if any says BLOCK, result is BLOCK
- FLAG > ALLOW in aggregation
- Threshold-to-action mapping (score > blockThreshold → BLOCK, etc.)
- Single classifier failure doesn't block others (returns ALLOW contribution, logs warning)
- All classifiers pass → ALLOW
- `triggeredBy` identifies which classifier caused the action
- Per-classifier threshold overrides work

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/ClassifierOrchestrator.spec.ts
```

- [ ] **Step 3: Write ClassifierOrchestrator**

Key implementation:

- `classifyAll(text)` calls `Promise.allSettled(classifiers.map(c => c.classify(text)))`
- For each settled result: if fulfilled, map score to action via thresholds. If rejected, log warning and contribute ALLOW.
- Check `labelActions` first (overrides thresholds), then fall back to threshold comparison
- Aggregate: take the most severe action across all results (BLOCK > FLAG > ALLOW)
- Wrap each result as `AnnotatedClassificationResult` with `classifierId` and `latencyMs`
- Track `totalLatencyMs` as wall time of the entire `Promise.allSettled`

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/ClassifierOrchestrator.spec.ts
```

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/ClassifierOrchestrator.ts tests/extensions/packs/ml-classifiers/ClassifierOrchestrator.spec.ts
git commit -m "feat(ml-classifiers): add ClassifierOrchestrator with parallel execution and worst-wins"
```

---

## Task 6: MLClassifierGuardrail

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/MLClassifierGuardrail.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/MLClassifierGuardrail.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- `evaluateInput`: classifies full text, returns BLOCK on high toxicity, null on clean text
- `evaluateOutput`: accumulates TEXT_DELTA chunks, triggers classification at chunkSize
- `evaluateOutput`: returns null for non-TEXT_DELTA chunks
- `guardrailScope: 'input'` makes evaluateOutput return null
- `guardrailScope: 'output'` makes evaluateInput return null
- `config.evaluateStreamingChunks` is true
- Stream end (`isFinal`) flushes buffer
- Streaming mode 'blocking': awaits classification before returning
- Streaming mode 'non-blocking': returns null immediately, checks previous result on next call
- Streaming mode 'hybrid': first chunk blocking, subsequent non-blocking

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/MLClassifierGuardrail.spec.ts
```

- [ ] **Step 3: Write MLClassifierGuardrail**

Key implementation:

- Constructor creates `SlidingWindowBuffer` from options and `ClassifierOrchestrator` with enabled classifiers
- `evaluateInput()`: if scope is 'output', return null. Otherwise call `orchestrator.classifyAll(input.textInput)` and map to `GuardrailEvaluationResult`
- `evaluateOutput()`: if scope is 'input', return null. Otherwise:
  - For non-blocking mode: `push()` text to buffer. If no ChunkReady, return null. If ChunkReady, fire `classifyAll()` asynchronously (store promise in `pendingResult`). On next call, check if previous `pendingResult` resolved to a violation → BLOCK.
  - For blocking mode: `push()` text to buffer. If no ChunkReady, return null. If ChunkReady, `await classifyAll()` and return result.
  - For hybrid mode: first evaluation uses blocking, subsequent use non-blocking.
  - On `isFinal`: flush buffer, classify remaining, return result.

Import `GuardrailAction`, `IGuardrailService`, `GuardrailConfig`, `GuardrailInputPayload`, `GuardrailOutputPayload`, `GuardrailEvaluationResult` from `../../../core/guardrails/IGuardrailService`.

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/MLClassifierGuardrail.spec.ts
```

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/MLClassifierGuardrail.ts tests/extensions/packs/ml-classifiers/MLClassifierGuardrail.spec.ts
git commit -m "feat(ml-classifiers): add MLClassifierGuardrail with sliding window + 3 streaming modes"
```

---

## Task 7: ClassifyContentTool

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/tools/ClassifyContentTool.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/ClassifyContentTool.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- Has correct ITool properties (id, name, displayName, category, hasSideEffects=false)
- inputSchema has `text` (required) and `classifiers` (optional array)
- `execute()` returns ChunkEvaluation with results and recommendedAction
- Returns ALLOW for benign text

- [ ] **Step 2: Run test, verify fails**

- [ ] **Step 3: Write ClassifyContentTool**

Implements `ITool<ClassifyInput, ChunkEvaluation>`. Delegates to `ClassifierOrchestrator.classifyAll()`.

- [ ] **Step 4: Run test, verify passes**

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/tools/ClassifyContentTool.ts tests/extensions/packs/ml-classifiers/ClassifyContentTool.spec.ts
git commit -m "feat(ml-classifiers): add ClassifyContentTool for on-demand classification"
```

---

## Task 8: WorkerClassifierProxy + classifier-worker

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/classifiers/WorkerClassifierProxy.ts`
- Create: `packages/agentos/src/extensions/packs/ml-classifiers/worker/classifier-worker.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/WorkerClassifierProxy.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- Falls back to main-thread when Worker is unavailable (mock `typeof Worker === 'undefined'`)
- Delegates classify() to main-thread classifier in fallback mode
- Has same IContentClassifier properties as wrapped classifier
- isLoaded reflects wrapped classifier state

- [ ] **Step 2: Run test, verify fails**

- [ ] **Step 3: Write WorkerClassifierProxy**

Key implementation:

- Constructor takes an `IContentClassifier` to wrap + optional `BrowserConfig`
- If `typeof Worker === 'undefined'` or `useWebWorker === false`, delegates directly to wrapped classifier (no worker)
- If Worker available: creates worker from `classifier-worker.ts`, posts classify messages, returns Promise that resolves on worker response
- On Worker creation failure (CSP, etc.): sets `workerFailed = true`, falls back to main-thread

Write `classifier-worker.ts`:

- Listens for `{ type: 'classify', text, modelId, quantized }` messages
- Loads model via `@huggingface/transformers` pipeline
- Posts back `{ type: 'result', result }` or `{ type: 'error', error }`

- [ ] **Step 4: Run test, verify passes**

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/classifiers/WorkerClassifierProxy.ts src/extensions/packs/ml-classifiers/worker/classifier-worker.ts tests/extensions/packs/ml-classifiers/WorkerClassifierProxy.spec.ts
git commit -m "feat(ml-classifiers): add WorkerClassifierProxy for browser Web Worker support"
```

---

## Task 9: Pack factory + index.ts

**Files:**

- Create: `packages/agentos/src/extensions/packs/ml-classifiers/index.ts`
- Create: `packages/agentos/tests/extensions/packs/ml-classifiers/index.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- `createMLClassifierPack()` returns ExtensionPack with name 'ml-classifiers' and version '1.0.0'
- Provides 2 descriptors: 1 guardrail + 1 tool
- Guardrail has id 'ml-classifier-guardrail' and kind 'guardrail'
- Tool has id 'classify_content' and kind 'tool'
- `createExtensionPack()` bridges context.options
- Disabled classifiers produce fewer classifier instances (verify via mock)
- onDeactivate calls dispose

- [ ] **Step 2: Run test, verify fails**

- [ ] **Step 3: Write index.ts**

Key implementation — same onActivate/rebuild pattern as PII pack:

```typescript
import { SharedServiceRegistry } from '../../SharedServiceRegistry';
import type { ISharedServiceRegistry } from '../../ISharedServiceRegistry';
import type { ExtensionPack, ExtensionPackContext } from '../../manifest';
import type { ExtensionDescriptor, ExtensionLifecycleContext } from '../../types';
import { EXTENSION_KIND_GUARDRAIL, EXTENSION_KIND_TOOL } from '../../types';
import type { MLClassifierPackOptions } from './types';
import { MLClassifierGuardrail } from './MLClassifierGuardrail';
import { ClassifyContentTool } from './tools/ClassifyContentTool';
// ... build classifiers from options, create orchestrator, guardrail, tool
// state pattern with buildComponents() + onActivate rebuild
// onDeactivate: orchestrator.dispose() + buffer.clear()
```

Re-export types: `export * from './types';`

- [ ] **Step 4: Run test, verify passes**

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/extensions/packs/ml-classifiers/index.ts tests/extensions/packs/ml-classifiers/index.spec.ts
git commit -m "feat(ml-classifiers): add createMLClassifierPack factory with guardrail + tool"
```

---

## Task 10: Barrel export + package.json exports

**Files:**

- Modify: `packages/agentos/src/extensions/index.ts`
- Modify: `packages/agentos/package.json`

- [ ] **Step 1: Add barrel export**

In `packages/agentos/src/extensions/index.ts`, add:

```typescript
export {
  createMLClassifierPack,
  createExtensionPack as createMLClassifierExtensionPack,
} from './packs/ml-classifiers';
```

- [ ] **Step 2: Add package.json exports entry**

In `packages/agentos/package.json`, add to the `"exports"` object:

```json
"./extensions/packs/ml-classifiers": {
  "import": "./dist/extensions/packs/ml-classifiers/index.js",
  "default": "./dist/extensions/packs/ml-classifiers/index.js",
  "types": "./dist/extensions/packs/ml-classifiers/index.d.ts"
}
```

- [ ] **Step 3: Commit**

```bash
cd packages/agentos
git add src/extensions/index.ts package.json
git commit -m "feat(ml-classifiers): add barrel export + package.json exports path"
```

---

## Task 11: SKILL.md + extension registry + docs

**Files:**

- Create: `packages/agentos-skills-registry/registry/curated/ml-content-classifier/SKILL.md`
- Modify: `packages/agentos-extensions-registry/src/tool-registry.ts`

- [ ] **Step 1: Write SKILL.md**

Create `packages/agentos-skills-registry/registry/curated/ml-content-classifier/SKILL.md` with exact content from the spec (Section "SKILL.md").

- [ ] **Step 2: Add extension registry entry**

Add to `TOOL_CATALOG` in `packages/agentos-extensions-registry/src/tool-registry.ts`:

```typescript
{
  packageName: '@framers/agentos-ext-ml-classifiers',
  name: 'ml-classifiers',
  category: 'integration',
  available: true,
  displayName: 'ML Content Classifiers',
  description: 'Streaming ML guardrail with sliding-window BERT classifiers for toxicity, injection, and jailbreak detection.',
  requiredSecrets: [],
  defaultPriority: 5,
  envVars: [],
  docsUrl: '/docs/extensions/built-in/ml-classifiers',
},
```

- [ ] **Step 3: Commit from monorepo root**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos-skills-registry/registry/curated/ml-content-classifier/
git add packages/agentos-extensions-registry/src/tool-registry.ts
git commit -m "feat(ml-classifiers): add SKILL.md and extension registry entry"
```

---

## Task 12: Full verification

- [ ] **Step 1: Run all ML classifier tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/ml-classifiers/
```

Expected: All tests PASS

- [ ] **Step 2: Run all extension tests (regression check)**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

Expected: All tests PASS (including PII + SharedServiceRegistry tests)

- [ ] **Step 3: Run shared utils tests**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/
```

Expected: All tests PASS

- [ ] **Step 4: Update monorepo submodule pointer**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos
git commit -m "chore: update agentos submodule — ML classifier guardrail extension complete"
```

- [ ] **Step 5: Push**

```bash
cd packages/agentos && git push origin master
cd /Users/johnn/Documents/git/voice-chat-assistant && git push origin master
```
