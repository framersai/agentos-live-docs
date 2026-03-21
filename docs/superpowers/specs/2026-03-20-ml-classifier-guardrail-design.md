# ML Classifier Guardrail Extension — Design Specification

**Date:** 2026-03-20
**Status:** Approved
**Author:** Claude (brainstorming session)
**Sub-project:** 1 of 5 (SOTA Guardrails Parity)

## Summary

A streaming ML classifier guardrail extension for AgentOS that provides real-time content safety classification using sliding-window chunk-based evaluation. Ships with three default BERT-family classifiers (toxicity, prompt injection, jailbreak detection) running via `@huggingface/transformers` with ONNX Runtime. Supports Node.js (native ONNX), browser (WASM + Web Worker), and edge (WASM) runtimes.

This is a self-contained AgentOS extension pack — no dependency on Wunderland or any other higher-level framework. Load it via manifest and it works.

## Goals

1. **Sliding-window streaming classification** — chunk-based evaluation with configurable `chunkSize` (default 200 tokens) and `contextSize` (default 50 tokens) context carry-forward, matching NeMo Guardrails' production pattern
2. **Three default classifiers** — toxicity (`unitary/toxic-bert`), prompt injection (`protectai/deberta-v3-small-prompt-injection-v2`), jailbreak (`meta-llama/PromptGuard-86M`), each independently toggleable and configurable
3. **Pluggable classifier registry** — `IContentClassifier` interface for adding custom classifiers without modifying the core guardrail
4. **Universal runtime** — runs in Node.js (native ONNX, ~20ms/chunk), browser (WASM + Web Worker, ~50ms/chunk), and edge (WASM) using the same `@huggingface/transformers` dependency already in the codebase
5. **IUtilityAI alignment** — classification results use the existing `ClassificationResult` type from `packages/agentos/src/core/ai_utilities/IUtilityAI.ts`
6. **Shared services** — ONNX model sessions registered in `ISharedServiceRegistry` for cross-extension singleton sharing (same pattern as PII NER model)
7. **Shared utilities consolidation** — extract duplicated helpers (`clamp`, `parseJsonResponse`, `tokenize`, `normalizeText`) into `packages/agentos/src/core/utils/text-utils.ts`
8. **Thorough TSDoc/JSDoc comments** and inline comments on every interface, class, method, property, and non-obvious logic path

## Non-Goals

- Wunderland integration (Wunderland can consume the pack via its own manifest — that's Wunderland's concern, not this spec's)
- Declarative conversation flow engine / Colang equivalent (Sub-project 3)
- Code safety scanning / CodeShield equivalent (Sub-project 4)
- Hallucination / grounding verification (Sub-project 5)
- Guardrail dispatcher parallel execution upgrade (Sub-project 2)
- Training or fine-tuning models (we use pre-trained models from HuggingFace)
- Custom model hosting (models are downloaded from HuggingFace Hub or loaded from local paths)

---

## Architecture

### 1. Sliding Window Buffer

A standalone, reusable class that manages token accumulation and context carry-forward. Decoupled from classification — it only decides "when is a chunk ready?"

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/SlidingWindowBuffer.ts`

```typescript
/**
 * Configuration for the sliding window buffer.
 *
 * Two parameters control the trade-off between classification accuracy
 * and evaluation frequency:
 * - chunkSize: how much NEW text to accumulate before classifying
 * - contextSize: how much PREVIOUS text to carry forward for overlap
 *
 * At 100 tokens/sec LLM generation speed with chunkSize=200:
 * - A new chunk is ready every ~2 seconds
 * - Classification takes ~20-50ms (depending on runtime)
 * - Overhead is <2.5% of wall time
 */
export interface SlidingWindowConfig {
  /**
   * Number of tokens to accumulate before triggering classification.
   * Larger values give better context for classification accuracy
   * but increase the delay before a violation is detected.
   *
   * NeMo Guardrails research recommends:
   * - 128-200 for toxicity and injection (intent is usually local)
   * - 256+ for hallucination detection (needs broader context)
   *
   * @default 200
   */
  chunkSize: number;

  /**
   * Number of tokens to carry forward from the previous chunk's tail
   * as context overlap for the next chunk. Prevents violations that
   * span chunk boundaries from being missed.
   *
   * Example: "here's how to make a" ends chunk N, "pipe bomb using
   * household" starts chunk N+1. With contextSize=50, chunk N+1's
   * classifier input includes "how to make a pipe bomb using household".
   *
   * @default 50
   */
  contextSize: number;

  /**
   * Maximum classification evaluations per stream.
   * Caps total classifier invocations to control compute costs.
   * For a typical 2000-token response at chunkSize=200, this allows
   * ~10 evaluations. Set higher for long-running streams.
   *
   * @default 100
   */
  maxEvaluations: number;

  /**
   * Milliseconds after which a stream with no new tokens is considered
   * stale. Stale streams have their buffer state cleaned up to prevent
   * memory leaks in long-running processes.
   *
   * @default 30000
   */
  streamTimeoutMs: number;
}

/**
 * Per-stream buffering state.
 * One instance per active stream, keyed by streamId.
 */
interface WindowState {
  /** Carried context from the tail of the previous chunk */
  contextRing: string;
  /** Accumulating new tokens for the current chunk */
  buffer: string;
  /** Estimated token count in current buffer (approximation: chars / 4) */
  tokenCount: number;
  /** Number of classifications fired so far for this stream */
  evaluations: number;
  /** Timestamp of last token received (for stale cleanup) */
  lastSeenAt: number;
}

/**
 * Returned when enough tokens have accumulated for classification.
 * null from push() means "keep accumulating, not ready yet."
 */
export interface ChunkReady {
  /** The full text to classify: contextRing + buffer */
  text: string;
  /** Just the new text in this chunk (for SANITIZE replacement if needed) */
  newText: string;
  /** Which evaluation number this is for the stream (1-indexed) */
  evaluationNumber: number;
}

/**
 * Manages token accumulation for chunk-based streaming classification.
 *
 * Unlike sentence-boundary buffering (used by PII redaction), this uses
 * fixed-size token windows because safety classifiers need statistical
 * context, not exact sentence boundaries. A toxicity classifier doesn't
 * care if a chunk ends mid-sentence — 200 tokens provides sufficient
 * context for accurate classification.
 *
 * Supports multiple concurrent streams (multi-agent, multi-turn) via
 * per-stream state keyed by streamId.
 */
export class SlidingWindowBuffer {
  constructor(config?: Partial<SlidingWindowConfig>);

  /**
   * Feed a text fragment into the buffer for a specific stream.
   *
   * @param streamId - Unique stream identifier (from AgentOSResponseChunk.streamId)
   * @param text - New text fragment (typically a TEXT_DELTA chunk)
   * @returns ChunkReady when enough tokens accumulated, null otherwise
   */
  push(streamId: string, text: string): ChunkReady | null;

  /**
   * Flush remaining buffer for a stream (called on stream end).
   * Returns any remaining text as a final chunk, then cleans up state.
   * Returns null if the buffer is empty or below a minimum useful size.
   *
   * @param streamId - Stream to flush and clean up
   */
  flush(streamId: string): ChunkReady | null;

  /**
   * Remove stale streams that haven't received tokens within the timeout.
   * Called automatically on every push() when the stream map exceeds 10 entries,
   * ensuring bounded memory growth without requiring a separate interval timer.
   */
  pruneStale(): void;

  /** Clean up all state (called during extension onDeactivate) */
  clear(): void;
}
```

**Concurrent stream safety:** The AgentOS streaming pipeline serializes `evaluateOutput()` calls per-stream (chunks for a given `streamId` are yielded sequentially). Two different streams may call `push()` concurrently with different `streamId`s, which is safe because they access separate `WindowState` entries in the Map. No additional locking is required. This matches the same guarantee documented in the PII redaction guardrail.

**Stale cleanup:** `pruneStale()` is called lazily inside `push()` when the stream map exceeds 10 entries, rather than via `setInterval`. This avoids timer management complexity and ensures cleanup happens proportionally to usage.

**Token estimation:**

```typescript
/**
 * Estimate token count from character length.
 * ~4 chars per token for English, ~3 for code-heavy text.
 * This is intentionally approximate — we're deciding WHEN to classify,
 * not tokenizing for the model (the model's own tokenizer handles that).
 * Same approximation NeMo Guardrails uses internally.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

---

### 2. IContentClassifier Interface

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/IContentClassifier.ts`

```typescript
/**
 * A pluggable content classifier that evaluates text chunks for
 * safety/policy violations.
 *
 * Each implementation wraps a specific ML model and maps its output
 * to the standard IUtilityAI ClassificationResult type. Classifiers
 * load their models lazily via ISharedServiceRegistry on first call.
 *
 * This interface follows the same pattern as IEntityRecognizer in the
 * PII extension — pluggable, lazy-loaded, independently testable.
 *
 * To add a custom classifier:
 * 1. Implement this interface
 * 2. Register it in MLClassifierPackOptions.customClassifiers
 * 3. It will be loaded lazily and run in parallel with default classifiers
 */
export interface IContentClassifier {
  /** Unique identifier (e.g., 'toxicity', 'prompt-injection', 'jailbreak') */
  readonly id: string;

  /** Human-readable display name for logs and UI */
  readonly displayName: string;

  /** What this classifier detects (shown in docs and SKILL.md) */
  readonly description: string;

  /**
   * HuggingFace model ID or local filesystem path.
   * HuggingFace IDs are downloaded on first use and cached.
   * Local paths must point to an ONNX model directory.
   */
  readonly modelId: string;

  /** Whether the model is loaded and ready for classification */
  readonly isLoaded: boolean;

  /**
   * Classify a text chunk for safety violations.
   *
   * The model is loaded lazily on first call via ISharedServiceRegistry.
   * Subsequent calls reuse the cached model session.
   *
   * @param text - The text chunk to classify (typically contextRing + buffer)
   * @returns Classification result aligned with IUtilityAI.ClassificationResult
   */
  classify(text: string): Promise<ClassificationResult>;

  /** Release model resources (called during extension deactivation) */
  dispose?(): Promise<void>;
}

/**
 * Configuration for action thresholds on a single classifier.
 * Scores above these thresholds trigger the corresponding guardrail action.
 */
export interface ClassifierThresholds {
  /** Score above which the stream is BLOCKED immediately. @default 0.9 */
  blockThreshold: number;
  /** Score above which the result is FLAGGED for escalation. @default 0.7 */
  flagThreshold: number;
  /** Score above which a warning is logged (no action). @default 0.4 */
  warnThreshold: number;
}

/**
 * Per-classifier configuration for overriding model and thresholds.
 */
export interface ClassifierConfig {
  /** Override the default HuggingFace model ID */
  modelId?: string;
  /** Override action thresholds for this specific classifier */
  thresholds?: Partial<ClassifierThresholds>;
  /**
   * Custom label-to-action mapping. When set for a label, that label's
   * action is determined by this map INSTEAD of threshold-based logic.
   * Any score > 0 for a mapped label triggers the specified action.
   * Labels not in this map still use threshold-based logic.
   *
   * Example: { 'identity_hate': 'block', 'insult': 'flag' }
   * means identity_hate always blocks (regardless of score), insult
   * always flags, and other labels use score thresholds.
   */
  labelActions?: Record<string, 'pass' | 'flag' | 'block'>;
}
```

---

### 3. ClassifierOrchestrator

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/ClassifierOrchestrator.ts`

```typescript
/**
 * Aggregated evaluation result from all classifiers for a single chunk.
 */
export interface ChunkEvaluation {
  /**
   * Individual ClassificationResult from each enabled classifier.
   * Aligned with IUtilityAI.ClassificationResult for type compatibility.
   */
  results: ClassificationResult[];

  /**
   * The most severe GuardrailAction across all classifier results.
   * BLOCK > FLAG > ALLOW. If any classifier says BLOCK, the chunk is blocked.
   */
  recommendedAction: GuardrailAction;

  /** Which classifier triggered the action (null if ALLOW) */
  triggeredBy: string | null;

  /** Wall time for the parallel classification pass in ms */
  totalLatencyMs: number;
}

/**
 * Runs all enabled classifiers in parallel on each text chunk
 * and aggregates results using worst-wins semantics.
 *
 * Uses Promise.all() for parallel execution — all classifiers run
 * concurrently. The total latency is max(individual latencies),
 * not sum. With 3 classifiers at 20/50/60ms, total is ~60ms.
 *
 * Failed classifiers (model load failure, timeout) are skipped
 * gracefully — they log a warning and contribute ALLOW to the
 * aggregation, ensuring one broken classifier doesn't block all traffic.
 */
export class ClassifierOrchestrator {
  constructor(
    classifiers: IContentClassifier[],
    defaultThresholds: ClassifierThresholds,
    perClassifierThresholds?: Record<string, Partial<ClassifierThresholds>>
  );

  /**
   * Classify text through all enabled classifiers in parallel.
   *
   * @param text - The text chunk to classify
   * @returns Aggregated evaluation with per-classifier results
   */
  classifyAll(text: string): Promise<ChunkEvaluation>;

  /** Release all classifier resources */
  dispose(): Promise<void>;
}
```

---

### 4. Default Classifiers

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/classifiers/`

#### 4.1 ToxicityClassifier

```typescript
/**
 * Detects toxic content using unitary/toxic-bert.
 *
 * Model: unitary/toxic-bert (66M params, INT8 ~33MB)
 * Labels: toxic, severe_toxic, obscene, threat, insult, identity_hate
 * Latency: ~20ms CPU ONNX, ~5ms GPU
 * AUC: 98.28 mean across 6 categories
 *
 * Multi-label output — each label is scored independently (0.0–1.0).
 * A single input can be both "toxic" and "insult" simultaneously.
 *
 * Loaded lazily via ISharedServiceRegistry with service ID
 * 'agentos:ml-classifier:toxicity'. Other extensions can reuse
 * the same model session.
 */
```

Default thresholds: block > 0.9, flag > 0.7, warn > 0.4

#### 4.2 InjectionClassifier

```typescript
/**
 * Detects prompt injection attacks using protectai/deberta-v3-small-prompt-injection-v2.
 *
 * Model: protectai/deberta-v3-small-prompt-injection-v2 (44M params, INT8 ~22MB)
 * Labels: INJECTION, SAFE (binary classification)
 * Latency: ~50ms CPU ONNX, ~15ms GPU
 *
 * Specifically trained on prompt injection attacks — paraphrased,
 * obfuscated, and indirect injections via tool outputs or RAG context.
 * Does NOT cover jailbreak (use JailbreakClassifier for that).
 *
 * Service ID: 'agentos:ml-classifier:injection'
 */
```

Default thresholds: block INJECTION > 0.85, flag INJECTION > 0.5

#### 4.3 JailbreakClassifier

```typescript
/**
 * Detects jailbreak attempts using meta-llama/PromptGuard-86M.
 *
 * Model: meta-llama/PromptGuard-86M (86M params, INT8 ~43MB)
 * Labels: jailbreak, injection, benign (multi-class, one wins)
 * Latency: ~60ms CPU ONNX, ~15ms GPU
 *
 * From Meta's LlamaFirewall. Covers jailbreak patterns that the
 * DeBERTa injection model misses (role-play attacks, system prompt
 * extraction, constraint bypasses).
 *
 * Smaller 22M variant available via modelOverrides for
 * resource-constrained environments (75% cheaper, minimal accuracy loss).
 *
 * Service ID: 'agentos:ml-classifier:jailbreak'
 */
```

Default thresholds: block jailbreak > 0.8, flag jailbreak > 0.5 OR injection > 0.5

#### All classifiers follow this internal pattern:

```typescript
class ToxicityClassifier implements IContentClassifier {
  readonly id = 'toxicity';
  readonly modelId = 'unitary/toxic-bert';

  private unavailable = false;

  constructor(
    private readonly services: ISharedServiceRegistry,
    private readonly config?: ClassifierConfig
  ) {}

  async classify(text: string): Promise<ClassificationResult> {
    if (this.unavailable) return this.passResult();

    let pipeline: any;
    try {
      pipeline = await this.services.getOrCreate(
        ML_CLASSIFIER_SERVICE_IDS.TOXICITY_PIPELINE,
        async () => {
          const { pipeline: createPipeline } = await import('@huggingface/transformers');
          return createPipeline('text-classification', this.config?.modelId ?? this.modelId, {
            quantized: true,
          });
        },
        {
          dispose: async (pipe: any) => pipe?.dispose?.(),
          tags: ['ml', 'classifier', 'toxicity', 'onnx'],
        }
      );
    } catch {
      this.unavailable = true;
      return this.passResult();
    }

    const raw = await pipeline(text, { topk: null }); // all labels
    return this.mapToClassificationResult(raw);
  }
}
```

---

### 5. MLClassifierGuardrail

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/MLClassifierGuardrail.ts`

```typescript
/**
 * IGuardrailService implementation that evaluates content safety
 * using ML classifiers with sliding-window streaming.
 *
 * Input evaluation:
 * - Classifies the FULL input text (no windowing needed — input
 *   is available all at once). All enabled classifiers run in parallel.
 *
 * Output evaluation (streaming):
 * - Tokens accumulate in a SlidingWindowBuffer per stream.
 * - When chunkSize tokens are accumulated, the chunk (with context
 *   overlap) is classified through all enabled classifiers in parallel.
 * - Results are aggregated: worst-wins (any BLOCK → stream terminated).
 *
 * Streaming modes (implemented within the IGuardrailService contract):
 *
 * The guardrail dispatcher `await`s each `evaluateOutput()` call before
 * yielding the chunk, making all guardrails inherently blocking. The three
 * streaming modes are implemented as follows within that constraint:
 *
 * - non-blocking: `evaluateOutput()` returns `null` immediately for chunks
 *   that are still accumulating. Classification fires asynchronously in the
 *   background. On the NEXT `evaluateOutput()` call, the guardrail checks
 *   the previous async result — if it was a violation, returns BLOCK then.
 *   This means tokens stream with ~0ms added latency, and violations are
 *   caught with a one-chunk delay (~2s at chunkSize=200).
 *
 * - blocking: `evaluateOutput()` awaits classification before returning.
 *   When the buffer hasn't reached chunkSize, returns `null` immediately.
 *   When the buffer IS ready, the call blocks for ~20-60ms while classifiers
 *   run, then returns null (pass) or BLOCK. User sees smooth streaming
 *   with ~60ms micro-pauses every ~2 seconds (imperceptible).
 *
 * - hybrid: first chunk uses blocking (catches injection in the first
 *   response — the most dangerous attack vector). Subsequent chunks use
 *   non-blocking (smooth streaming with one-chunk-delayed violation detection).
 *
 * Guardrail scope:
 * - 'input': only evaluateInput is active
 * - 'output': only evaluateOutput is active
 * - 'both': both active (default)
 */
export class MLClassifierGuardrail implements IGuardrailService {
  readonly config: GuardrailConfig;

  constructor(services: ISharedServiceRegistry, options: MLClassifierPackOptions);

  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null>;

  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null>;
}
```

---

### 6. Client-Side / Universal Runtime Support

**Location:** Browser-specific code in `classifiers/WorkerClassifierProxy.ts` and `worker/classifier-worker.ts`

`@huggingface/transformers` (already a dependency) handles runtime detection automatically:

- **Node.js:** ONNX Runtime Node backend (native, fastest)
- **Browser:** ONNX Runtime WASM backend (~2-3x slower, but works)
- **Edge (Cloudflare Workers, Deno):** ONNX Runtime WASM

The only runtime-specific code is:

1. **Web Worker proxy** (browser only) — offloads ML inference to a worker thread to avoid blocking the UI for 50-100ms per chunk
2. **Model cache location** — filesystem (`~/.wunderland/models/`) in Node.js, Cache API or IndexedDB in browser

```typescript
/**
 * Browser-specific configuration. Ignored in Node.js/edge.
 */
export interface BrowserConfig {
  /**
   * Run classification in a Web Worker to avoid blocking the UI thread.
   * The worker is created lazily on first classification call.
   * Falls back to main-thread if Worker creation fails (CSP, etc.).
   * @default true
   */
  useWebWorker?: boolean;

  /**
   * Browser model cache strategy.
   * - 'cache-api': Cache API (persistent, works in Service Workers)
   * - 'indexeddb': IndexedDB (persistent, larger quota)
   * - 'none': No caching (re-download each page load)
   * @default 'cache-api'
   */
  cacheStrategy?: 'cache-api' | 'indexeddb' | 'none';

  /**
   * Maximum total model cache size in bytes.
   * LRU eviction when exceeded.
   * @default 209715200 (200MB)
   */
  maxCacheSize?: number;

  /**
   * Progress callback during initial model download.
   * Useful for showing download indicators in UI.
   */
  onProgress?: (progress: ModelDownloadProgress) => void;
}

export interface ModelDownloadProgress {
  /** Which model is downloading */
  modelId: string;
  /** Bytes downloaded so far */
  loaded: number;
  /** Total bytes (null if unknown) */
  total: number | null;
  /** Percentage 0-100 (null if total unknown) */
  percent: number | null;
}

/**
 * Wraps an IContentClassifier to run in a Web Worker.
 *
 * Same IContentClassifier interface, but classify() posts a message
 * to the worker and returns a promise that resolves on the worker's
 * response. The worker imports @huggingface/transformers independently.
 *
 * Falls back to main-thread execution if Worker creation fails
 * (e.g., CSP restrictions, SharedArrayBuffer unavailable).
 */
export class WorkerClassifierProxy implements IContentClassifier {
  // Delegates to worker, same IContentClassifier interface
}
```

---

### 7. Configuration Types

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/types.ts`

```typescript
/**
 * Configuration options for the ML classifier extension pack.
 */
export interface MLClassifierPackOptions {
  /**
   * Which classifiers to enable. Each can be toggled independently.
   * Disabled classifiers never load their models (zero memory cost).
   * Pass `true` for defaults, or a ClassifierConfig for overrides.
   * @default { toxicity: true, injection: true, jailbreak: true }
   */
  classifiers?: {
    toxicity?: boolean | ClassifierConfig;
    injection?: boolean | ClassifierConfig;
    jailbreak?: boolean | ClassifierConfig;
  };

  /**
   * Custom classifiers to add alongside (or instead of) the defaults.
   * Each must implement IContentClassifier. Loaded lazily.
   */
  customClassifiers?: IContentClassifier[];

  // NOTE: To override model IDs, use per-classifier config:
  //   classifiers: { toxicity: { modelId: 'custom/my-toxicity-model' } }
  // No separate modelOverrides field — avoids config duplication.

  /**
   * Model cache directory (Node.js only).
   * Browser uses Cache API or IndexedDB (see browser config).
   * @default '~/.wunderland/models/'
   */
  modelCacheDir?: string;

  /**
   * Use INT8 quantized models for lower memory and faster inference.
   * Quantized models are ~50% smaller with minimal accuracy loss.
   * @default true
   */
  quantized?: boolean;

  /**
   * Runtime environment hint. Auto-detected if omitted.
   * - 'node': ONNX Runtime Node (native, fastest)
   * - 'browser': ONNX Runtime WASM + optional Web Worker
   * - 'edge': ONNX Runtime WASM (Cloudflare Workers, Deno)
   * - 'auto': detect from globalThis
   * @default 'auto'
   */
  runtime?: 'node' | 'browser' | 'edge' | 'auto';

  /** Browser-specific configuration. Ignored in Node.js/edge. */
  browser?: BrowserConfig;

  // --- Sliding window ---

  /** Tokens per chunk. @default 200 */
  chunkSize?: number;
  /** Context overlap tokens. @default 50 */
  contextSize?: number;
  /** Max evaluations per stream. @default 100 */
  maxEvaluations?: number;

  // --- Streaming ---

  /**
   * How to handle streaming output evaluation.
   * - 'non-blocking': tokens stream immediately, classify in background
   * - 'blocking': hold tokens until classified safe
   * - 'hybrid': first chunk blocking, rest non-blocking
   * @default 'non-blocking'
   */
  streamingMode?: 'non-blocking' | 'blocking' | 'hybrid';

  // --- Thresholds ---

  /**
   * Default action thresholds applied to all classifiers.
   * Per-classifier thresholds in classifiers config override these.
   */
  thresholds?: Partial<ClassifierThresholds>;

  // --- Scope ---

  /** Guardrail direction. @default 'both' */
  guardrailScope?: 'input' | 'output' | 'both';
}

/**
 * Well-known service IDs for ML classifier ONNX sessions.
 * Registered in ISharedServiceRegistry for cross-extension sharing.
 */
export const ML_CLASSIFIER_SERVICE_IDS = {
  /** ONNX session for unitary/toxic-bert */
  TOXICITY_PIPELINE: 'agentos:ml-classifier:toxicity',
  /** ONNX session for protectai/deberta-v3-small-prompt-injection-v2 */
  INJECTION_PIPELINE: 'agentos:ml-classifier:injection',
  /** ONNX session for meta-llama/PromptGuard-86M */
  JAILBREAK_PIPELINE: 'agentos:ml-classifier:jailbreak',
} as const;
```

---

### 8. Extension Pack Structure & Factory

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/`

```
ml-classifiers/
├── index.ts                           # createMLClassifierPack() + createExtensionPack()
├── types.ts                           # All config types, service IDs, thresholds
├── IContentClassifier.ts              # Pluggable classifier interface
├── SlidingWindowBuffer.ts             # Chunk accumulation + context carry-forward
├── ClassifierOrchestrator.ts          # Parallel execution + result aggregation
├── MLClassifierGuardrail.ts           # IGuardrailService implementation
├── classifiers/
│   ├── ToxicityClassifier.ts          # unitary/toxic-bert wrapper
│   ├── InjectionClassifier.ts         # DeBERTa-v3-small wrapper
│   ├── JailbreakClassifier.ts         # PromptGuard-86M wrapper
│   └── WorkerClassifierProxy.ts       # Browser Web Worker wrapper
├── worker/
│   └── classifier-worker.ts           # Web Worker entry point
├── tools/
│   └── ClassifyContentTool.ts         # ITool for on-demand classification
└── ml-classifiers.skill.md            # SKILL.md for agent awareness
```

Tests under `packages/agentos/tests/extensions/packs/ml-classifiers/`.

**Factory:**

```typescript
/**
 * Creates the ML classifier guardrail extension pack.
 *
 * Provides:
 * 1. A guardrail (id: 'ml-classifier-guardrail') for automatic
 *    input/output content safety classification
 * 2. A tool (id: 'classify_content') for on-demand classification
 *
 * Models are lazy-loaded via ISharedServiceRegistry on first use.
 * Runs in Node.js, browser, and edge runtimes.
 *
 * @param options - Classifier selection, thresholds, sliding window config
 * @returns ExtensionPack with 1 guardrail + 1 tool
 */
export function createMLClassifierPack(options?: MLClassifierPackOptions): ExtensionPack;

/**
 * Manifest-based loading bridge.
 * Enables: { package: '@framers/agentos-ext-ml-classifiers', options: { ... } }
 */
export function createExtensionPack(context: ExtensionPackContext): ExtensionPack;
```

**Descriptors:**

| ID                        | Kind        | Priority | Purpose                                 |
| ------------------------- | ----------- | -------- | --------------------------------------- |
| `ml-classifier-guardrail` | `guardrail` | 5        | Automatic input/output classification   |
| `classify_content`        | `tool`      | 0        | On-demand agent-callable classification |

Priority 5 for stacking (lower than PII redaction at 10). Note: guardrail execution order depends on pack registration order in the manifest, NOT priority values. Priority only controls which descriptor wins when multiple descriptors share the same `id`. To ensure ML classification runs before PII redaction, register the ML classifier pack before the PII pack in the manifest.

**onActivate pattern** (same as PII — rebuild components with shared registry):

```typescript
return {
  name: 'ml-classifiers',
  version: '1.0.0',
  get descriptors() {
    /* returns current guardrail + tool */
  },
  onActivate: (context) => {
    if (context.services) state.services = context.services;
    buildComponents(); // Rebuild with ExtensionManager's shared registry
  },
  onDeactivate: async () => {
    // Release ~98MB of model memory
    await orchestrator?.dispose();
    buffer?.clear();
  },
};
```

---

### 9. classify_content Tool

**Location:** `packages/agentos/src/extensions/packs/ml-classifiers/tools/ClassifyContentTool.ts`

```typescript
/**
 * Agent-callable tool for on-demand content safety classification.
 *
 * Unlike the guardrail (which runs automatically on I/O), this tool
 * lets agents proactively classify arbitrary text. Useful for:
 * - Checking user-provided content before forwarding to external APIs
 * - Evaluating RAG retrieval results before including in responses
 * - Classifying tool outputs before presenting to users
 * - Content moderation workflows
 *
 * @example Agent usage:
 * → classify_content({ text: "user-submitted comment", classifiers: ["toxicity"] })
 * ← { results: [{ classifierId: "toxicity", topLabel: "toxic", topScore: 0.02 }],
 *     recommendedAction: "allow", triggeredBy: null }
 */
export class ClassifyContentTool implements ITool<ClassifyInput, ChunkEvaluation> {
  readonly id = 'classify_content';
  readonly name = 'classify_content';
  readonly displayName = 'Content Safety Classifier';
  readonly description =
    'Classify text for toxicity, prompt injection, and jailbreak attempts using ML models.';
  readonly category = 'security';
  readonly hasSideEffects = false;
}
```

---

### 10. Shared Utilities Consolidation

**Location:** `packages/agentos/src/core/utils/text-utils.ts` (NEW)

```typescript
/**
 * @module core/utils/text-utils
 *
 * Shared text processing utilities used across AgentOS modules.
 * Extracted from duplicated implementations in:
 * - LLMSentimentAnalyzer.ts (clamp, parseJsonResponse)
 * - StyleAdaptation.ts (clamp, parseJsonResponse)
 * - ContentSentimentAnalyzer.ts (tokenize)
 * - ContentSimilarityDedup.ts (normalizeText)
 * - PreLLMClassifier.ts (extractTextInput)
 * - DualLLMAuditor.ts (extractOutputText)
 */

/** Clamp a number to a range. */
export function clamp(value: number, min: number, max: number): number;

/** Parse a JSON response string, returning null on failure. */
export function parseJsonResponse<T>(response: string): T | null;

/** Tokenize text into words (strip punctuation, split whitespace, lowercase). */
export function tokenize(text: string): string[];

/** Normalize text for comparison (lowercase, strip punctuation, collapse whitespace). */
export function normalizeText(text: string): string;

/** Estimate token count from character length (~4 chars/token for English). */
export function estimateTokens(text: string): number;
```

These are extracted and re-exported from `packages/agentos/src/core/utils/index.ts`. Existing callers in Wunderland modules can migrate at their own pace — the functions are the same, just centralized.

---

### 11. Memory Impact

| Component                              | Memory                 | When Loaded                            |
| -------------------------------------- | ---------------------- | -------------------------------------- |
| SlidingWindowBuffer                    | ~1KB per active stream | First TEXT_DELTA chunk                 |
| ToxicityClassifier (toxic-bert INT8)   | ~33MB                  | First chunk when toxicity enabled      |
| InjectionClassifier (DeBERTa INT8)     | ~22MB                  | First chunk when injection enabled     |
| JailbreakClassifier (PromptGuard INT8) | ~43MB                  | First chunk when jailbreak enabled     |
| **Total if nothing enabled**           | **~1KB**               | —                                      |
| **Total all 3 classifiers**            | **~98MB**              | —                                      |
| **Combined with PII (all tiers)**      | **~213MB**             | Only if both packs + all models active |

---

### 12. Graceful Degradation

| Dependency / Condition                    | Behavior                                 | Impact                                      |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| `@huggingface/transformers` not installed | All classifiers skip, warnings logged    | No ML classification, regex-only safety     |
| Model download fails (network)            | That classifier skips, others continue   | Reduced coverage for that category          |
| ONNX Runtime not available for platform   | Classifier falls back to WASM, or skips  | Slower or no classification                 |
| Web Worker creation fails (CSP)           | Falls back to main-thread classification | UI may freeze briefly during classification |
| All classifiers disabled in config        | Guardrail returns ALLOW for everything   | Effectively a no-op (zero overhead)         |

---

## IUtilityAI Alignment

The ML classifier results use the existing `ClassificationResult` type from `packages/agentos/src/core/ai_utilities/IUtilityAI.ts`:

```typescript
// Actual types from IUtilityAI.ts (lines 49-54):
export interface ClassificationScore {
  classLabel: string;
  score: number;
}
export interface ClassificationResult {
  bestClass: string | string[]; // top predicted class(es)
  confidence: number | number[]; // confidence for bestClass(es)
  allScores: ClassificationScore[]; // all class scores
}
```

Each `IContentClassifier.classify()` maps model output to this shape:

```typescript
// Example: ToxicityClassifier maps toxic-bert output to:
{
  bestClass: 'toxic',
  confidence: 0.92,
  allScores: [
    { classLabel: 'toxic', score: 0.92 },
    { classLabel: 'severe_toxic', score: 0.03 },
    { classLabel: 'obscene', score: 0.85 },
    { classLabel: 'threat', score: 0.01 },
    { classLabel: 'insult', score: 0.78 },
    { classLabel: 'identity_hate', score: 0.02 },
  ],
}
```

To track classifier provenance, we define a thin extension:

```typescript
/** ClassificationResult annotated with which classifier produced it */
export interface AnnotatedClassificationResult extends ClassificationResult {
  classifierId: string; // e.g., 'toxicity', 'prompt-injection'
  latencyMs: number; // classification time for this classifier
}
```

The `ClassifierOrchestrator` aggregates `AnnotatedClassificationResult[]` into a `ChunkEvaluation` with the `recommendedAction` and `triggeredBy` fields. This extends (not replaces) the IUtilityAI type.

---

## Testing Strategy

1. **SlidingWindowBuffer tests** — chunk accumulation, context carry-forward, multiple concurrent streams, maxEvaluations budget, stale cleanup, flush on stream end
2. **Per-classifier tests** (mocked pipelines) — label mapping, score extraction, graceful degradation on load failure, model ID override
3. **ClassifierOrchestrator tests** — parallel execution, worst-wins aggregation, threshold-to-action mapping, single classifier failure doesn't block others
4. **MLClassifierGuardrail tests** — input evaluation (full text), output streaming (chunk accumulation + classification), scope filtering, streaming modes (blocking/non-blocking/hybrid)
5. **ClassifyContentTool tests** — tool schema, execute, classifier filtering
6. **Integration tests** — full pipeline with real openredaction regex (PII) + mocked ML classifiers running side-by-side
7. **Browser tests** — WorkerClassifierProxy with mocked Worker, fallback to main thread

---

## SKILL.md

```yaml
---
name: ml-content-classifier
version: '1.0.0'
description: Real-time content safety classification using ML models (toxicity, prompt injection, jailbreak detection)
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, safety, toxicity, injection, jailbreak, classifier, ml, bert, onnx]
requires_tools: [classify_content]
metadata:
  agentos:
    emoji: "\U0001F6E1"
---

# ML Content Classifier

A guardrail automatically classifies your inputs and outputs for safety
violations (toxicity, prompt injection, jailbreak attempts). You also have
a tool for on-demand classification.

## When to Use classify_content

- Before forwarding user-provided text to external APIs
- To evaluate RAG retrieval results before including in responses
- For content moderation workflows
- To check tool outputs before presenting to users

## What It Detects

- **Toxicity**: toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Prompt injection**: attempts to override system instructions
- **Jailbreak**: role-play attacks, constraint bypasses, system prompt extraction

## Constraints

- Models (~98MB total) load lazily on first classification
- Classification takes ~20-60ms per chunk (CPU), ~5-15ms (GPU)
- The guardrail evaluates every ~200 tokens during streaming
```

---

## Open Questions (Deferred)

1. Should the classifier support **fine-tuning on domain-specific data** (e.g., train the injection classifier on your specific prompt templates)? Deferred — the per-classifier `modelId` config already allows swapping in fine-tuned models.
2. Should there be a **guardrail evaluation dashboard** showing classification distribution, false positive rates, and latency percentiles? Deferred to Sub-project 2 (dispatcher upgrade).
3. Should the **sliding window buffer be extracted to AgentOS core** as a reusable primitive (not just internal to this pack)? Could benefit other streaming guardrails. Deferred — keep internal for now, promote if needed.
4. Should we add a **multilingual toxicity classifier** (e.g., `unitary/multilingual-toxic-xlm-roberta`)? Deferred — can be added via `customClassifiers` config today.

---

## Recommended Implementation Sequence

1. **Shared utilities** — extract `text-utils.ts` into `packages/agentos/src/core/utils/`
2. **Types + interfaces** — `types.ts`, `IContentClassifier.ts`, classifier configs
3. **SlidingWindowBuffer** — standalone, fully testable in isolation
4. **Three classifiers** — ToxicityClassifier, InjectionClassifier, JailbreakClassifier (mocked in tests)
5. **ClassifierOrchestrator** — parallel execution + aggregation
6. **MLClassifierGuardrail** — IGuardrailService impl with sliding window
7. **ClassifyContentTool** — on-demand tool
8. **Pack factory** — `createMLClassifierPack()`, barrel exports, package.json exports
9. **Browser support** — WorkerClassifierProxy, classifier-worker.ts
10. **SKILL.md + registry + docs**
11. **Verification** — full test suite, typecheck
