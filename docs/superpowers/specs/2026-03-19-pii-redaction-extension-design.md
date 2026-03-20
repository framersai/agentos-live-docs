# PII Redaction Extension — Design Specification

**Date:** 2026-03-19
**Status:** Approved
**Author:** Claude (brainstorming session)

## Summary

A first-class PII redaction extension for AgentOS that provides automatic and on-demand detection and redaction of personally identifiable information. The system uses a four-tier detection pipeline (regex + NLP pre-filter + ML NER + LLM-as-judge) with lazy-loaded shared dependencies via a new `ISharedServiceRegistry` core primitive.

## Goals

1. Detect **structured PII** (SSN, credit card, email, phone, IP, passport, IBAN, government IDs across 50+ countries) via regex with checksum validation
2. Detect **unstructured PII** (person names, organizations, locations) via NLP/NER models
3. Resolve **ambiguous cases** via LLM-as-judge with chain-of-thought prompting using a separately configurable lightweight model
4. Provide both **passive protection** (guardrail) and **active capability** (agent-callable tools)
5. Introduce **ISharedServiceRegistry** on `ExtensionLifecycleContext` so heavy dependencies (NLP models, embedding engines) are lazy-loaded singletons shared across extensions
6. Thoroughly document with TSDoc/JSDoc comments and inline comments on every interface, class, method, property, and non-obvious logic path

## Non-Goals

- Public pluggable recognizer API (internal `IEntityRecognizer[]` stays private for now)
- Presidio sidecar integration (pure TypeScript/WASM, no Python dependency)
- Pseudonymization with reversible encryption (hash style provides deterministic correlation, not encryption)
- Real-time keystroke-level evaluation (sentence-boundary buffering for streaming)

---

## Architecture

### 1. ISharedServiceRegistry (New Core Primitive)

A new interface added to `ExtensionLifecycleContext` enabling lazy-loaded singleton sharing across extensions.

**Location:** `packages/agentos/src/extensions/ISharedServiceRegistry.ts`

````typescript
/**
 * Registry for sharing heavyweight service instances across extensions.
 *
 * When multiple extensions need the same resource (e.g., an NLP model,
 * an embedding engine, a database connection pool), this registry ensures
 * only one instance is created and shared. The first caller's factory
 * initializes the service; subsequent callers receive the cached instance.
 *
 * @example
 * ```typescript
 * // In PII extension:
 * const nlp = await context.services.getOrCreate(
 *   'agentos:nlp:compromise',
 *   async () => (await import('compromise')).default
 * );
 *
 * // In sentiment extension (same process):
 * const nlp = await context.services.getOrCreate(
 *   'agentos:nlp:compromise',
 *   async () => (await import('compromise')).default  // factory never called
 * );
 * // → Returns the same cached instance, zero additional memory
 * ```
 */
export interface ISharedServiceRegistry {
  /**
   * Retrieve an existing shared service, or create it using the provided factory.
   *
   * Concurrent calls with the same `serviceId` are coalesced — only one factory
   * invocation occurs, and all callers await the same promise.
   *
   * @typeParam T - The type of the shared service instance
   * @param serviceId - Unique identifier for the service (convention: 'agentos:<domain>:<name>')
   * @param factory - Async or sync function that creates the service instance
   * @param options - Optional configuration for disposal and tagging
   * @returns The shared service instance (cached after first creation)
   */
  getOrCreate<T>(
    serviceId: string,
    factory: () => Promise<T> | T,
    options?: SharedServiceOptions
  ): Promise<T>;

  /**
   * Check whether a service has already been initialized.
   * Does not trigger lazy creation.
   *
   * @param serviceId - The service identifier to check
   * @returns True if the service is initialized and cached
   */
  has(serviceId: string): boolean;

  /**
   * Release and dispose a specific service.
   * Calls the service's dispose callback if one was registered.
   *
   * @param serviceId - The service identifier to release
   */
  release(serviceId: string): Promise<void>;

  /**
   * Release and dispose all registered services.
   * Called automatically by `ExtensionManager.shutdown()`.
   */
  releaseAll(): Promise<void>;
}

/**
 * Options for configuring a shared service's lifecycle and discoverability.
 */
export interface SharedServiceOptions {
  /**
   * Cleanup callback invoked when the service is released.
   * Use this to free model memory, close connections, etc.
   *
   * @param instance - The service instance being disposed
   */
  dispose?: (instance: unknown) => Promise<void> | void;

  /**
   * Tags for service discoverability.
   * Other extensions can use these to understand what shared services exist.
   *
   * @example ['nlp', 'ner', 'ml-model']
   */
  tags?: string[];
}
````

**Integration into core:**

```typescript
// Updated ExtensionLifecycleContext (packages/agentos/src/extensions/types.ts)

/**
 * Context provided to extensions during their lifecycle.
 * Extended with `services` for shared singleton management.
 */
export interface ExtensionLifecycleContext {
  /** Logger instance scoped to the extension */
  logger?: ILogger;
  /** Resolve secrets by ID (checks explicit map → env vars → extension-secrets.json) */
  getSecret?: (secretId: string) => string | undefined;
  /** Shared service registry for lazy-loaded cross-extension singletons */
  services: ISharedServiceRegistry;
}
```

**Concrete implementation:**

```typescript
// packages/agentos/src/extensions/SharedServiceRegistry.ts

/**
 * Thread-safe implementation of ISharedServiceRegistry.
 *
 * Uses a two-map pattern:
 * - `instances`: fully initialized service singletons
 * - `pending`: in-flight factory promises (prevents duplicate initialization)
 *
 * When two extensions call `getOrCreate('foo', factory)` simultaneously,
 * only one factory runs. The second caller awaits the first's promise.
 */
export class SharedServiceRegistry implements ISharedServiceRegistry {
  /** Cached service instances, keyed by serviceId */
  private readonly instances = new Map<string, unknown>();

  /**
   * In-flight factory promises for services currently being initialized.
   * Prevents duplicate factory invocations during concurrent access.
   */
  private readonly pending = new Map<string, Promise<unknown>>();

  /** Registered dispose callbacks, invoked during release */
  private readonly disposers = new Map<string, (instance: unknown) => Promise<void> | void>();

  /** Tags associated with each service for discoverability */
  private readonly tagMap = new Map<string, string[]>();

  async getOrCreate<T>(
    serviceId: string,
    factory: () => Promise<T> | T,
    options?: SharedServiceOptions
  ): Promise<T> {
    // Fast path: service already initialized
    if (this.instances.has(serviceId)) {
      return this.instances.get(serviceId) as T;
    }

    // Coalesce path: another caller is already initializing this service
    if (this.pending.has(serviceId)) {
      return this.pending.get(serviceId) as Promise<T>;
    }

    // Cold path: we are the first caller — run the factory
    const promise = Promise.resolve(factory()).then((instance) => {
      this.instances.set(serviceId, instance);
      this.pending.delete(serviceId);

      // Register dispose callback and tags if provided
      if (options?.dispose) {
        this.disposers.set(serviceId, options.dispose);
      }
      if (options?.tags) {
        this.tagMap.set(serviceId, options.tags);
      }

      return instance;
    });

    this.pending.set(serviceId, promise);
    return promise as Promise<T>;
  }

  has(serviceId: string): boolean {
    return this.instances.has(serviceId);
  }

  async release(serviceId: string): Promise<void> {
    const instance = this.instances.get(serviceId);
    if (instance !== undefined) {
      // Call dispose callback if registered
      const disposer = this.disposers.get(serviceId);
      if (disposer) {
        await Promise.resolve(disposer(instance));
      }
      this.instances.delete(serviceId);
      this.disposers.delete(serviceId);
      this.tagMap.delete(serviceId);
    }
  }

  async releaseAll(): Promise<void> {
    // Wait for any in-flight initializations to complete before disposing
    await Promise.allSettled([...this.pending.values()]);

    // Dispose all services in parallel
    const releasePromises = [...this.instances.keys()].map((id) => this.release(id));
    await Promise.allSettled(releasePromises);
  }
}
```

---

### 2. Detection Pipeline

**Location:** `packages/agentos/src/extensions/packs/pii-redaction/`

#### 2.1 Core Types

````typescript
// packages/agentos/src/extensions/packs/pii-redaction/types.ts

/**
 * Supported PII entity types across all detection tiers.
 *
 * Structured types (detected by regex with checksums):
 * - SSN, CREDIT_CARD, EMAIL, PHONE, IP_ADDRESS, IBAN, PASSPORT,
 *   DRIVERS_LICENSE, GOV_ID, DATE_OF_BIRTH, API_KEY, AWS_KEY, CRYPTO_ADDRESS
 *
 * Unstructured types (detected by NER/NLP models):
 * - PERSON, ORGANIZATION, LOCATION, MEDICAL_TERM
 *
 * Catch-all for unclassified detections:
 * - UNKNOWN_PII
 */
export type PiiEntityType =
  // Structured (regex-detectable with validation)
  | 'SSN'
  | 'CREDIT_CARD'
  | 'EMAIL'
  | 'PHONE'
  | 'IP_ADDRESS'
  | 'IBAN'
  | 'PASSPORT'
  | 'DRIVERS_LICENSE'
  | 'GOV_ID'
  | 'DATE_OF_BIRTH'
  | 'API_KEY'
  | 'AWS_KEY'
  | 'CRYPTO_ADDRESS'
  // Unstructured (NER/NLP-detectable)
  | 'PERSON'
  | 'ORGANIZATION'
  | 'LOCATION'
  | 'MEDICAL_TERM'
  // Catch-all
  | 'UNKNOWN_PII';

/**
 * A single detected PII entity with its location, confidence, and provenance.
 *
 * @example
 * ```typescript
 * {
 *   entityType: 'PERSON',
 *   text: 'John Smith',
 *   start: 15,
 *   end: 25,
 *   score: 0.92,
 *   source: 'ner-model',
 *   metadata: { nerLabel: 'PER', modelConfidence: 0.923 }
 * }
 * ```
 */
export interface PiiEntity {
  /** The classified PII type */
  entityType: PiiEntityType;
  /** The raw matched text */
  text: string;
  /** Start character offset in the input string */
  start: number;
  /** End character offset in the input string (exclusive) */
  end: number;
  /** Confidence score from 0.0 (uncertain) to 1.0 (certain) */
  score: number;
  /** Which detection tier produced this match */
  source: 'regex' | 'nlp-prefilter' | 'ner-model' | 'llm-judge';
  /** Tier-specific metadata (e.g., checksumValid, nerLabel, reasoning) */
  metadata?: Record<string, unknown>;
}

/**
 * How to replace detected PII in the output text.
 *
 * - `placeholder`: Replace with type tag, e.g., `[PERSON]`
 * - `mask`: Partial masking, e.g., `J*** S****`
 * - `hash`: Deterministic hash for correlation, e.g., `[PERSON:a1b2c3]`
 * - `category-tag`: XML-style tag, e.g., `<PII type="PERSON">REDACTED</PII>`
 */
export type RedactionStyle = 'placeholder' | 'mask' | 'hash' | 'category-tag';

/**
 * Configuration options for the PII redaction extension pack.
 */
export interface PiiRedactionPackOptions {
  /**
   * Which PII entity types to detect.
   * When omitted, all supported types are enabled.
   */
  entityTypes?: PiiEntityType[];

  /**
   * Minimum confidence score to trigger redaction.
   * Entities below this threshold are ignored.
   * @default 0.5
   */
  confidenceThreshold?: number;

  /**
   * How to replace detected PII in output.
   * @default 'placeholder'
   */
  redactionStyle?: RedactionStyle;

  /**
   * Terms to never flag as PII (e.g., product names, company name).
   * Case-insensitive string matching against detected entity text.
   * Reduces false positives.
   */
  allowlist?: string[];

  /**
   * Terms to always flag as PII regardless of confidence score.
   * Case-insensitive string matching.
   * Ensures critical terms are never missed.
   */
  denylist?: string[];

  /**
   * Whether to load and use the NER model (Tier 3: BERT via HuggingFace).
   * Set to false for low-resource environments to skip the ~110MB model.
   * @default true
   */
  enableNerModel?: boolean;

  /**
   * Configuration for the LLM-as-judge tier (Tier 4).
   * When omitted, the LLM judge tier is disabled entirely.
   * Only invoked for entities with ambiguous confidence (0.3–0.7).
   */
  llmJudge?: LlmJudgeConfig;

  /**
   * Which direction(s) the guardrail applies to.
   * - `input`: scan user messages before orchestration
   * - `output`: scan agent responses before streaming to client
   * - `both`: scan in both directions
   * @default 'both'
   */
  guardrailScope?: 'input' | 'output' | 'both';

  /**
   * Enable real-time streaming chunk evaluation for output guardrail.
   * When true, TEXT_DELTA chunks are evaluated as they stream.
   * When false, only FINAL_RESPONSE is evaluated.
   * @default true
   */
  evaluateStreamingChunks?: boolean;

  /**
   * Maximum number of streaming evaluations per request.
   * Rate-limits how often the NER/LLM tiers run during streaming.
   * @default 200
   */
  maxStreamingEvaluations?: number;
}

/**
 * Configuration for the LLM-as-judge recognizer (Tier 4).
 * Uses a lightweight model to resolve ambiguous PII classifications
 * via chain-of-thought prompting.
 */
export interface LlmJudgeConfig {
  /** LLM provider identifier (e.g., 'openai', 'anthropic', 'openrouter', 'ollama') */
  provider: string;
  /** Model ID to use for PII classification (e.g., 'claude-haiku-4-5-20251001', 'gpt-4o-mini') */
  model: string;
  /** API key for the LLM provider. Falls back to getSecret('pii.llm.apiKey') if omitted. */
  apiKey?: string;
  /** Base URL override for self-hosted or proxy endpoints */
  baseUrl?: string;
  /**
   * Maximum concurrent LLM calls for PII classification.
   * Prevents overwhelming the LLM provider with parallel requests.
   * @default 3
   */
  maxConcurrency?: number;
  /**
   * LRU cache size for repeat pattern results.
   * Caches LLM judge decisions keyed by (span_text, context_hash).
   * @default 500
   */
  cacheSize?: number;
}
````

#### 2.2 Internal Recognizer Interface

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/recognizers/IEntityRecognizer.ts

/**
 * Internal interface for PII entity recognizers.
 *
 * Each detection tier (regex, NLP pre-filter, NER model, LLM judge)
 * implements this interface. The PiiDetectionPipeline orchestrates them
 * in sequence, passing results from earlier tiers to inform later ones.
 *
 * This interface is internal to the PII extension and not part of the
 * public API. It may be promoted to a public extension point in a
 * future release once the pattern is proven.
 */
export interface IEntityRecognizer {
  /** Human-readable name for logging and debugging */
  readonly name: string;

  /** Which PII entity types this recognizer can detect */
  readonly supportedEntities: PiiEntityType[];

  /**
   * Scan text for PII entities.
   *
   * @param text - The input text to scan
   * @param options - Optional filters and context
   * @returns Array of detected PII entities with confidence scores
   */
  recognize(text: string, options?: RecognizeOptions): Promise<PiiEntity[]>;

  /**
   * Release any resources held by this recognizer.
   * Called during extension deactivation / shutdown.
   */
  dispose?(): Promise<void>;
}

/**
 * Options to filter or contextualize entity recognition.
 */
export interface RecognizeOptions {
  /** Only detect these entity types (skip others for performance) */
  entityTypes?: PiiEntityType[];
  /** Language hint for NER models. @default 'en' */
  language?: string;
  /** Surrounding text for context-aware scoring (e.g., boost SSN near "Social Security") */
  context?: string;
  /** Previously detected entities from earlier tiers, for cross-referencing */
  priorEntities?: PiiEntity[];
}
```

#### 2.3 Four-Tier Detection Pipeline

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/PiiDetectionPipeline.ts

/**
 * Orchestrates the four-tier PII detection pipeline.
 *
 * Detection flows through tiers sequentially:
 *
 * 1. **RegexRecognizer** (always runs, ~0ms) — structured PII with checksums
 * 2. **NlpPrefilterRecognizer** (lazy, ~250KB) — fast name/place/org scan
 * 3. **NerModelRecognizer** (lazy, ~110MB) — ML-grade NER, only if Tier 2 found candidates
 * 4. **LlmJudgeRecognizer** (lazy, per-call cost) — CoT prompt for ambiguous spans only
 *
 * After all tiers run, EntityMerger deduplicates overlapping spans,
 * applies the confidence threshold, and returns final results.
 *
 * The pipeline uses ISharedServiceRegistry for heavy dependencies,
 * ensuring NLP models are shared across extensions.
 */
```

**Tier gating logic:**

- Tier 2 (compromise) is always run when enabled — it's cheap (~250KB, sub-millisecond)
- Tier 3 (BERT NER) only runs if Tier 2 detected at least one PERSON, ORGANIZATION, or LOCATION candidate. This is the key optimization: most messages contain no names, so the 110MB model never loads.
- Tier 4 (LLM judge) only runs for entities where the merged confidence score falls in the ambiguous range (0.3 < score < 0.7 by default). The LLM resolves "Is 'Jordan' a person or a country in this context?"

**Context enhancement** runs after Tier 1:

- Scans ±50 characters around each regex match for context keywords
- Keyword map: `"social security" → SSN +0.2`, `"name:" → PERSON +0.2`, `"date of birth" → DOB +0.2`, `"address:" → LOCATION +0.15`, etc.
- Boosts the confidence score of the match, which can push it above or below thresholds

#### 2.4 Entity Merger

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/EntityMerger.ts

/**
 * Deduplicates and reconciles PII entities from multiple detection tiers.
 *
 * Merge rules:
 * - **Exact overlap** (same start/end): keep the entity with the highest score
 * - **Partial overlap**: prefer the longer span (subsumes the shorter)
 * - **Adjacent spans** (within 2 chars): merge if same entity type
 * - **Allowlist filtering**: remove entities whose text matches an allowlist entry
 * - **Denylist boosting**: set score to 1.0 for entities matching a denylist entry
 * - **Threshold filtering**: remove entities below the configured confidence threshold
 *
 * @param entities - Raw entities from all tiers (may contain duplicates/overlaps)
 * @param options - Allowlist, denylist, and threshold configuration
 * @returns Deduplicated, filtered, sorted (by start offset) entity array
 */
```

#### 2.5 LLM Judge Chain-of-Thought Prompt

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/recognizers/LlmJudgeRecognizer.ts

/**
 * Tier 4: LLM-as-judge for resolving ambiguous PII classifications.
 *
 * Only invoked for entities with confidence between the ambiguity thresholds
 * (default: 0.3–0.7). Uses chain-of-thought prompting to analyze whether
 * a detected span is truly PII in its surrounding context.
 *
 * Results are cached in an LRU cache keyed by (span_text, context_hash)
 * to avoid repeat LLM calls for identical patterns.
 *
 * Concurrency is limited via a semaphore to prevent overwhelming the
 * LLM provider with parallel classification requests.
 */

/**
 * System prompt for the LLM judge.
 * Instructs the model to analyze PII candidates with structured reasoning.
 */
const LLM_JUDGE_SYSTEM_PROMPT = `You are a PII classification expert. Your task is to determine whether a highlighted text span constitutes personally identifiable information (PII) given its surrounding context.

Analyze carefully — context matters. "Jordan" could be a person's name, a country, a brand, or a basketball reference. "Apple" could be a company or a fruit. Your job is to disambiguate.

Think step by step:
1. What is the literal text of the candidate span?
2. What does the surrounding context suggest about its meaning?
3. Could this identify a specific real person, or is it generic/fictional/organizational?
4. What PII type best describes it, if any?

Respond with JSON only:
{
  "isPii": boolean,
  "entityType": "PERSON" | "ORGANIZATION" | "LOCATION" | "MEDICAL_TERM" | "UNKNOWN_PII" | "NOT_PII",
  "confidence": number,  // 0.0 to 1.0
  "reasoning": "brief explanation"
}`;

/**
 * User prompt template for each candidate entity.
 * Variables: {{CONTEXT_BEFORE}}, {{SPAN}}, {{CONTEXT_AFTER}},
 *            {{DETECTED_TYPE}}, {{DETECTED_SCORE}}, {{DETECTED_SOURCE}}
 */
const LLM_JUDGE_USER_PROMPT = `Analyze this candidate PII span:

Context: "...{{CONTEXT_BEFORE}} **{{SPAN}}** {{CONTEXT_AFTER}}..."

Candidate: "{{SPAN}}"
Initially detected as: {{DETECTED_TYPE}} (score: {{DETECTED_SCORE}}, source: {{DETECTED_SOURCE}})

Is this PII? Classify it.`;
```

---

### 3. Extension Pack Structure

**Location:** `packages/agentos/src/extensions/packs/pii-redaction/`

```
pii-redaction/
├── index.ts                          # createPiiRedactionPack() factory, exports
├── types.ts                          # PiiEntity, PiiEntityType, config interfaces
├── PiiRedactionGuardrail.ts          # IGuardrailService implementation
├── PiiDetectionPipeline.ts           # Orchestrates 4-tier recognizer chain
├── EntityMerger.ts                   # Deduplicates overlapping spans
├── RedactionEngine.ts                # Applies redaction styles to text
├── recognizers/
│   ├── IEntityRecognizer.ts          # Internal recognizer interface
│   ├── RegexRecognizer.ts            # Tier 1: OpenRedaction wrapper
│   ├── NlpPrefilterRecognizer.ts     # Tier 2: compromise wrapper
│   ├── NerModelRecognizer.ts         # Tier 3: @huggingface/transformers wrapper
│   └── LlmJudgeRecognizer.ts        # Tier 4: configurable LLM with CoT
├── tools/
│   ├── PiiScanTool.ts                # ITool: scan text → PiiEntity[]
│   └── PiiRedactTool.ts             # ITool: redact text → sanitized string
└── pii-redaction.skill.md            # SKILL.md for agent self-awareness
```

#### 3.1 Factory Function

````typescript
// packages/agentos/src/extensions/packs/pii-redaction/index.ts

/**
 * Creates the PII redaction extension pack.
 *
 * Provides three descriptors:
 * 1. A guardrail (`kind: 'guardrail'`) for automatic input/output PII redaction
 * 2. A `pii_scan` tool (`kind: 'tool'`) for on-demand PII detection
 * 3. A `pii_redact` tool (`kind: 'tool'`) for on-demand PII redaction
 *
 * Heavy dependencies (compromise NLP, BERT NER model, LLM client) are
 * lazy-loaded via ISharedServiceRegistry — they only initialize when
 * first needed and are shared across extensions.
 *
 * @param options - Configuration for detection thresholds, redaction style,
 *                  entity type filtering, NER toggle, and LLM judge setup
 * @returns An ExtensionPack ready to load via AgentOS manifest
 *
 * @example
 * ```typescript
 * import { createPiiRedactionPack } from '@framers/agentos/extensions/packs/pii-redaction';
 *
 * const piiPack = createPiiRedactionPack({
 *   confidenceThreshold: 0.5,
 *   redactionStyle: 'placeholder',
 *   enableNerModel: true,
 *   llmJudge: {
 *     provider: 'anthropic',
 *     model: 'claude-haiku-4-5-20251001',
 *     apiKey: process.env.ANTHROPIC_API_KEY,
 *   },
 * });
 *
 * const agent = new AgentOS();
 * await agent.initialize({
 *   ...config,
 *   manifest: { packs: [{ factory: () => piiPack }] },
 * });
 * ```
 */
export function createPiiRedactionPack(options?: PiiRedactionPackOptions): ExtensionPack {
  // ... implementation
}
````

#### 3.2 Guardrail Implementation

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts

/**
 * IGuardrailService implementation for automatic PII redaction.
 *
 * Intercepts content at two points:
 * - **Input**: Scans user messages before orchestration. Detected PII is
 *   redacted (SANITIZE action) or flagged (FLAG action) depending on config.
 * - **Output**: Evaluates agent response chunks in real-time during streaming.
 *   Uses a sentence-boundary buffer to avoid partial-word false positives.
 *
 * Streaming behavior:
 * - Text is accumulated in a sliding buffer until a sentence boundary
 *   (`. `, `? `, `! `, `\n`) is detected
 * - The complete sentence is evaluated through the detection pipeline
 * - If PII is found, the chunk's textDelta is replaced with redacted text
 * - Rate-limited by `maxStreamingEvaluations` to control NER/LLM costs
 *
 * The guardrail uses PiiDetectionPipeline internally, which lazily loads
 * NLP models via ISharedServiceRegistry on first use.
 */
```

#### 3.3 Redaction Engine

```typescript
// packages/agentos/src/extensions/packs/pii-redaction/RedactionEngine.ts

/**
 * Applies redaction transformations to text based on detected PII entities.
 *
 * Supports four redaction styles:
 *
 * | Style          | Input         | Output                          |
 * |----------------|---------------|---------------------------------|
 * | `placeholder`  | John Smith    | [PERSON]                        |
 * | `mask`         | John Smith    | J*** S****                      |
 * | `hash`         | John Smith    | [PERSON:a1b2c3]                 |
 * | `category-tag` | John Smith    | <PII type="PERSON">REDACTED</PII> |
 *
 * The `hash` style uses a deterministic hash (SHA-256 truncated to 6 hex chars)
 * so the same entity text always produces the same hash. This enables
 * cross-document correlation of redacted entities without revealing the
 * original text. The hash is NOT reversible without the original input.
 *
 * Entities are processed in reverse order (highest start offset first) to
 * preserve character offsets during replacement.
 */
```

#### 3.4 Tools

**pii_scan:**

````typescript
// packages/agentos/src/extensions/packs/pii-redaction/tools/PiiScanTool.ts

/**
 * Agent-callable tool for on-demand PII scanning.
 *
 * Unlike the guardrail (which runs automatically), this tool lets agents
 * deliberately scan specific text for PII. Useful for:
 * - Auditing user-provided data before storage
 * - Checking documents before sending to external APIs
 * - Generating PII reports for compliance
 *
 * Returns detected entities without modifying the input text.
 *
 * @example Agent usage:
 * ```
 * Agent: I'll scan this customer record for PII before storing it.
 * → pii_scan({ text: "Contact John Smith at john@example.com, SSN 123-45-6789" })
 * ← { entities: [
 *     { entityType: "PERSON", text: "John Smith", score: 0.95, ... },
 *     { entityType: "EMAIL", text: "john@example.com", score: 1.0, ... },
 *     { entityType: "SSN", text: "123-45-6789", score: 1.0, ... }
 *   ], summary: "Found 3 PII entities: 1 PERSON, 1 EMAIL, 1 SSN" }
 * ```
 */
````

**pii_redact:**

````typescript
// packages/agentos/src/extensions/packs/pii-redaction/tools/PiiRedactTool.ts

/**
 * Agent-callable tool for on-demand PII redaction.
 *
 * Scans text for PII and returns a sanitized version with detected
 * entities replaced according to the configured redaction style.
 *
 * Agents should use this before:
 * - Storing user data in memory or databases
 * - Passing text to untrusted third-party extensions
 * - Sharing content across agents in multi-agent systems
 * - Responding with user-provided data that may contain PII
 *
 * @example Agent usage:
 * ```
 * Agent: Let me redact the PII from this before saving.
 * → pii_redact({
 *     text: "Email john@acme.com about the 4111-1111-1111-1111 charge",
 *     style: "placeholder"
 *   })
 * ← {
 *     redactedText: "Email [EMAIL] about the [CREDIT_CARD] charge",
 *     entitiesFound: 2,
 *     entities: [...]
 *   }
 * ```
 */
````

---

### 4. Lazy Loading & Service ID Conventions

#### 4.1 Service IDs

```typescript
/**
 * Well-known service IDs used by the PII extension in ISharedServiceRegistry.
 *
 * Convention: 'agentos:<domain>:<name>'
 * - Domain groups related services (e.g., 'nlp', 'pii', 'embedding')
 * - Name identifies the specific resource
 *
 * Other extensions can request these same IDs to share instances:
 * - A sentiment extension using 'agentos:nlp:compromise' gets the same
 *   compromise instance the PII extension initialized
 * - A medical coding extension using 'agentos:nlp:ner-pipeline' gets the
 *   same BERT model the PII extension downloaded
 */
export const PII_SERVICE_IDS = {
  /** compromise NLP instance (~250KB, rule-based NER pre-filter) */
  NLP_PREFILTER: 'agentos:nlp:compromise',
  /** HuggingFace transformers NER pipeline (~110MB q8 BERT model) */
  NER_PIPELINE: 'agentos:nlp:ner-pipeline',
  /** OpenAI-compatible LLM client for PII judge calls */
  PII_LLM_CLIENT: 'agentos:pii:llm-client',
} as const;
```

#### 4.2 Memory Impact

| Component                           | Memory     | When Loaded                                  |
| ----------------------------------- | ---------- | -------------------------------------------- |
| RegexRecognizer (OpenRedaction)     | ~50KB      | Always (pack activation)                     |
| NlpPrefilterRecognizer (compromise) | ~250KB     | First message with text to scan              |
| NerModelRecognizer (BERT q8)        | ~110MB     | First time compromise finds name-like tokens |
| LlmJudgeRecognizer (OpenAI client)  | ~5MB       | First ambiguous span (score 0.3–0.7)         |
| **Total if no names detected**      | **~300KB** | —                                            |
| **Total worst case (all tiers)**    | **~115MB** | —                                            |

---

### 5. Documentation & Integration

#### 5.1 Guardrails Page Updates

The existing [guardrails.md](apps/agentos-live-docs/docs/features/guardrails.md) will be updated:

1. **Replace** the placeholder `PIIRedactionGuardrail` regex-only example with a reference to the real extension using `createPiiRedactionPack()`
2. **Add** a dedicated "PII Redaction Extension" section covering: detection tiers, configuration, redaction styles, agent tools, performance
3. **Add** an `ISharedServiceRegistry` section under "Advanced" explaining the shared service pattern

#### 5.2 Extension Docs Updates

- **Extensions overview**: Add `pii-redaction` to the official extensions list alongside auth, web-search, giphy, etc.
- **Extension architecture**: Add `ISharedServiceRegistry` section explaining the shared singleton pattern with cross-extension usage examples
- **New dedicated page**: `docs/extensions/pii-redaction.md` with full configuration reference

#### 5.3 Extension Registry Entry

```typescript
// In packages/agentos-extensions-registry curated manifest
{
  id: 'pii-redaction',
  name: 'PII Redaction',
  description: 'Four-tier PII detection and redaction (regex + NLP + NER + LLM-as-judge)',
  category: 'security',
  kind: ['guardrail', 'tool'],
  package: '@framers/agentos-ext-pii-redaction',
  official: true,
  tags: ['pii', 'privacy', 'gdpr', 'hipaa', 'compliance', 'redaction'],
}
```

#### 5.4 Skills Registry Entry

The `pii-redaction.skill.md` file is added to `packages/agentos-skills-registry/registry/curated/` so agents automatically discover PII capabilities via the existing skill resolution system.

#### 5.5 Package Dependencies

```json
{
  "dependencies": {
    "openredaction": "^1.1.2"
  },
  "optionalDependencies": {
    "compromise": "^14.0.0",
    "@huggingface/transformers": "^3.0.0",
    "openai": "^4.0.0"
  }
}
```

Optional dependencies ensure users who disable NER or LLM tiers don't pay the install cost. Lazy `import()` calls handle missing packages gracefully with try/catch, logging a warning and skipping the tier.

---

## Testing Strategy

1. **Unit tests** for each recognizer tier (regex patterns, NER output mapping, LLM prompt construction)
2. **Integration tests** for the full pipeline with known PII samples (structured + unstructured)
3. **SharedServiceRegistry tests** for concurrency safety (parallel getOrCreate), disposal, and cross-extension sharing
4. **Guardrail integration tests** for streaming chunk evaluation, sentence buffering, and SANITIZE action
5. **Edge cases**: partial PII in streaming chunks, allowlist/denylist behavior, missing optional dependencies, LLM timeout/failure fallback

## Open Questions (Deferred)

1. Should `IEntityRecognizer` become a public extension point for community recognizers? (Deferred to v2)
2. Should the hash redaction style support an optional encryption key for reversible pseudonymization? (Deferred)
3. Should there be a compliance mode selector (GDPR, HIPAA, PCI-DSS) that pre-configures entity types and thresholds? (Could use OpenRedaction's built-in presets)
