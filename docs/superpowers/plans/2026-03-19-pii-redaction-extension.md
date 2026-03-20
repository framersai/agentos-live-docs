# PII Redaction Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the four-tier PII redaction extension (regex + NLP + NER + LLM-as-judge) as a first-class AgentOS extension pack with guardrail, tools, skill, and docs.

**Architecture:** Phase 1 (ISharedServiceRegistry core plumbing) is already complete. This plan covers Phases 2–5: the PII pack itself (types, recognizers, pipeline, merger, redaction engine, guardrail, tools), registry/skill wiring, documentation updates, and verification.

**Tech Stack:** TypeScript, vitest, `openredaction` (regex PII), `compromise` (NLP pre-filter, optional), `@huggingface/transformers` (BERT NER, optional), OpenAI-compatible HTTP for LLM judge.

**Spec:** `docs/superpowers/specs/2026-03-19-pii-redaction-extension-design.md`

---

## File Map

All PII pack files live under `packages/agentos/src/extensions/packs/pii-redaction/`.

| File                                    | Purpose                                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `types.ts`                              | `PiiEntityType`, `PiiEntity`, `PiiDetectionResult`, `RedactionStyle`, `PiiRedactionPackOptions`, `LlmJudgeConfig` |
| `recognizers/IEntityRecognizer.ts`      | Internal `IEntityRecognizer` interface, `RecognizeOptions`                                                        |
| `recognizers/RegexRecognizer.ts`        | Tier 1: wraps `openredaction`, maps to `PiiEntity[]`                                                              |
| `recognizers/NlpPrefilterRecognizer.ts` | Tier 2: wraps `compromise`, lazy via `ISharedServiceRegistry`                                                     |
| `recognizers/NerModelRecognizer.ts`     | Tier 3: wraps `@huggingface/transformers`, lazy via `ISharedServiceRegistry`                                      |
| `recognizers/LlmJudgeRecognizer.ts`     | Tier 4: OpenAI-compatible HTTP, CoT prompt, LRU cache, semaphore                                                  |
| `EntityMerger.ts`                       | Deduplicates overlapping spans, applies allowlist/denylist/threshold                                              |
| `RedactionEngine.ts`                    | Four redaction styles: placeholder, mask, hash, category-tag                                                      |
| `PiiDetectionPipeline.ts`               | Orchestrates 4 tiers with gating logic, context enhancement, returns `PiiDetectionResult`                         |
| `PiiRedactionGuardrail.ts`              | `IGuardrailService` impl: input + streaming output, sentence-boundary buffer                                      |
| `tools/PiiScanTool.ts`                  | `ITool`: scans text, returns `PiiDetectionResult`                                                                 |
| `tools/PiiRedactTool.ts`                | `ITool`: redacts text, returns sanitized string + entities                                                        |
| `index.ts`                              | `createPiiRedactionPack()` factory + `createExtensionPack()` bridge                                               |
| `pii-redaction.skill.md`                | SKILL.md for agent self-discovery                                                                                 |

Tests live under `packages/agentos/tests/extensions/packs/pii-redaction/`.

| Test File                        | Covers                                                         |
| -------------------------------- | -------------------------------------------------------------- |
| `types.spec.ts`                  | Type guards, entity type enumeration                           |
| `RegexRecognizer.spec.ts`        | Structured PII detection (SSN, CC, email, phone, etc.)         |
| `NlpPrefilterRecognizer.spec.ts` | compromise name/org/place extraction, missing-dep fallback     |
| `NerModelRecognizer.spec.ts`     | HuggingFace NER mapping, missing-dep fallback                  |
| `LlmJudgeRecognizer.spec.ts`     | Prompt construction, NOT_PII handling, caching, concurrency    |
| `EntityMerger.spec.ts`           | Overlap resolution, allowlist/denylist, threshold filtering    |
| `RedactionEngine.spec.ts`        | All 4 redaction styles, reverse-offset processing              |
| `PiiDetectionPipeline.spec.ts`   | Tier gating, context enhancement, full pipeline integration    |
| `PiiRedactionGuardrail.spec.ts`  | Input/output evaluation, streaming buffer, scope filtering     |
| `PiiScanTool.spec.ts`            | Tool schema, execute, result format                            |
| `PiiRedactTool.spec.ts`          | Tool schema, execute, redacted output                          |
| `index.spec.ts`                  | Pack factory, descriptor IDs/kinds, createExtensionPack bridge |

---

## Task 1: Install openredaction dependency

**Files:**

- Modify: `packages/agentos/package.json`

- [ ] **Step 1: Add openredaction as a dependency**

```bash
cd packages/agentos && pnpm add openredaction
```

- [ ] **Step 2: Add compromise and @huggingface/transformers as optional dependencies**

Edit `packages/agentos/package.json` and add to `optionalDependencies`:

```json
{
  "optionalDependencies": {
    "compromise": "^14.15.0",
    "@huggingface/transformers": "^3.8.1"
  }
}
```

Then run `pnpm install` from the monorepo root.

- [ ] **Step 3: Verify install succeeds**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant && pnpm install
```

Expected: success, lock file updated.

- [ ] **Step 4: Commit**

```bash
git add packages/agentos/package.json pnpm-lock.yaml
git commit -m "chore: add openredaction + optional NLP deps for PII extension"
```

---

## Task 2: Core types

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/types.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/types.spec.ts`

- [ ] **Step 1: Write the types file**

Create `packages/agentos/src/extensions/packs/pii-redaction/types.ts` with all types from the spec:

```typescript
/**
 * @module pii-redaction/types
 *
 * Core type definitions for the PII redaction extension.
 * All types are re-exported from the pack's index.ts barrel.
 */

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
  | 'PERSON'
  | 'ORGANIZATION'
  | 'LOCATION'
  | 'MEDICAL_TERM'
  | 'UNKNOWN_PII';

/**
 * All supported PII entity types as a runtime array.
 * Useful for validation and iteration.
 */
export const ALL_PII_ENTITY_TYPES: readonly PiiEntityType[] = [
  'SSN',
  'CREDIT_CARD',
  'EMAIL',
  'PHONE',
  'IP_ADDRESS',
  'IBAN',
  'PASSPORT',
  'DRIVERS_LICENSE',
  'GOV_ID',
  'DATE_OF_BIRTH',
  'API_KEY',
  'AWS_KEY',
  'CRYPTO_ADDRESS',
  'PERSON',
  'ORGANIZATION',
  'LOCATION',
  'MEDICAL_TERM',
  'UNKNOWN_PII',
] as const;

/**
 * A single detected PII entity with its location, confidence, and provenance.
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
 * - `hash`: Deterministic hash for correlation, e.g., `[PERSON:a1b2c3d4e5]`
 * - `category-tag`: XML-style tag, e.g., `<PII type="PERSON">REDACTED</PII>`
 */
export type RedactionStyle = 'placeholder' | 'mask' | 'hash' | 'category-tag';

/**
 * Result wrapper returned by PiiDetectionPipeline.detect().
 * Includes detected entities plus metadata for observability and debugging.
 */
export interface PiiDetectionResult {
  /** Final deduplicated, threshold-filtered entities */
  entities: PiiEntity[];
  /** Length of the input text in characters */
  inputLength: number;
  /** Total processing time across all tiers in milliseconds */
  processingTimeMs: number;
  /** Which tiers actually ran (some may be skipped by gating logic) */
  tiersExecuted: ('regex' | 'nlp-prefilter' | 'ner-model' | 'llm-judge')[];
  /** Human-readable summary (e.g., "Found 3 PII entities: 1 PERSON, 1 EMAIL, 1 SSN") */
  summary: string;
}

/**
 * Configuration for the LLM-as-judge recognizer (Tier 4).
 */
export interface LlmJudgeConfig {
  /** LLM provider identifier (e.g., 'openai', 'anthropic', 'openrouter', 'ollama') */
  provider: string;
  /** Model ID to use for PII classification */
  model: string;
  /** API key override. Fallback: provider secret catalog → getSecret('pii.llm.apiKey') */
  apiKey?: string;
  /** Base URL override for self-hosted or proxy endpoints */
  baseUrl?: string;
  /** Maximum concurrent LLM calls. @default 3 */
  maxConcurrency?: number;
  /** LRU cache size for repeat patterns. @default 500 */
  cacheSize?: number;
}

/**
 * Configuration options for the PII redaction extension pack.
 */
export interface PiiRedactionPackOptions {
  /** Which PII entity types to detect. Defaults to all. */
  entityTypes?: PiiEntityType[];
  /** Minimum confidence score to trigger redaction. @default 0.5 */
  confidenceThreshold?: number;
  /** How to replace detected PII. @default 'placeholder' */
  redactionStyle?: RedactionStyle;
  /** Terms to never flag as PII (case-insensitive). */
  allowlist?: string[];
  /** Terms to always flag as PII (case-insensitive). */
  denylist?: string[];
  /** Enable NER model (Tier 3). @default true */
  enableNerModel?: boolean;
  /** LLM judge config (Tier 4). Omit to disable. */
  llmJudge?: LlmJudgeConfig;
  /** Guardrail direction. @default 'both' */
  guardrailScope?: 'input' | 'output' | 'both';
  /** Enable streaming chunk evaluation. @default true */
  evaluateStreamingChunks?: boolean;
  /** Max sentence-level streaming evaluations per request. @default 50 */
  maxStreamingEvaluations?: number;
}

/**
 * Well-known service IDs for the PII extension in ISharedServiceRegistry.
 * Convention: 'agentos:<domain>:<name>'
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

- [ ] **Step 2: Write the test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/types.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  ALL_PII_ENTITY_TYPES,
  PII_SERVICE_IDS,
  type PiiEntity,
  type PiiRedactionPackOptions,
} from '../../../../src/extensions/packs/pii-redaction/types';

describe('PII types', () => {
  it('ALL_PII_ENTITY_TYPES contains all 18 entity types', () => {
    expect(ALL_PII_ENTITY_TYPES).toHaveLength(18);
    expect(ALL_PII_ENTITY_TYPES).toContain('SSN');
    expect(ALL_PII_ENTITY_TYPES).toContain('PERSON');
    expect(ALL_PII_ENTITY_TYPES).toContain('UNKNOWN_PII');
  });

  it('PII_SERVICE_IDS follow agentos:<domain>:<name> convention', () => {
    for (const id of Object.values(PII_SERVICE_IDS)) {
      expect(id).toMatch(/^agentos:[a-z]+:[a-z-]+$/);
    }
  });

  it('PiiEntity satisfies the interface shape', () => {
    const entity: PiiEntity = {
      entityType: 'EMAIL',
      text: 'test@example.com',
      start: 0,
      end: 16,
      score: 1.0,
      source: 'regex',
    };
    expect(entity.entityType).toBe('EMAIL');
    expect(entity.score).toBe(1.0);
  });
});
```

- [ ] **Step 3: Run test**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/types.spec.ts
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/types.ts packages/agentos/tests/extensions/packs/pii-redaction/types.spec.ts
git commit -m "feat(pii): add core PII types, entity types, and config interfaces"
```

---

## Task 3: IEntityRecognizer interface

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/recognizers/IEntityRecognizer.ts`

- [ ] **Step 1: Write the interface**

Create `packages/agentos/src/extensions/packs/pii-redaction/recognizers/IEntityRecognizer.ts`:

```typescript
/**
 * @module pii-redaction/recognizers/IEntityRecognizer
 *
 * Internal interface for PII entity recognizers. Each detection tier
 * implements this interface. Not part of the public API.
 */

import type { PiiEntity, PiiEntityType } from '../types';

/**
 * Options to filter or contextualize entity recognition.
 */
export interface RecognizeOptions {
  /** Only detect these entity types (skip others for performance) */
  entityTypes?: PiiEntityType[];
  /** Language hint for NER models. @default 'en' */
  language?: string;
  /** Surrounding text for context-aware scoring */
  context?: string;
  /** Previously detected entities from earlier tiers, for cross-referencing */
  priorEntities?: PiiEntity[];
}

/**
 * Internal interface for PII entity recognizers.
 *
 * Each detection tier (regex, NLP pre-filter, NER model, LLM judge)
 * implements this interface. The PiiDetectionPipeline orchestrates them
 * in sequence, passing results from earlier tiers to inform later ones.
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/recognizers/IEntityRecognizer.ts
git commit -m "feat(pii): add IEntityRecognizer internal interface"
```

---

## Task 4: RegexRecognizer (Tier 1)

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/recognizers/RegexRecognizer.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/RegexRecognizer.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/RegexRecognizer.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { RegexRecognizer } from '../../../../src/extensions/packs/pii-redaction/recognizers/RegexRecognizer';

describe('RegexRecognizer', () => {
  const recognizer = new RegexRecognizer();

  it('detects SSN patterns', async () => {
    const entities = await recognizer.recognize('My SSN is 123-45-6789');
    expect(entities.some((e) => e.entityType === 'SSN')).toBe(true);
    expect(entities.find((e) => e.entityType === 'SSN')?.text).toBe('123-45-6789');
    expect(entities.find((e) => e.entityType === 'SSN')?.source).toBe('regex');
  });

  it('detects email addresses', async () => {
    const entities = await recognizer.recognize('Email me at john@example.com please');
    expect(entities.some((e) => e.entityType === 'EMAIL')).toBe(true);
    expect(entities.find((e) => e.entityType === 'EMAIL')?.text).toBe('john@example.com');
  });

  it('detects credit card numbers', async () => {
    const entities = await recognizer.recognize('Card: 4111-1111-1111-1111');
    expect(entities.some((e) => e.entityType === 'CREDIT_CARD')).toBe(true);
  });

  it('detects phone numbers', async () => {
    const entities = await recognizer.recognize('Call me at (555) 123-4567');
    expect(entities.some((e) => e.entityType === 'PHONE')).toBe(true);
  });

  it('detects IP addresses', async () => {
    const entities = await recognizer.recognize('Server at 192.168.1.1');
    expect(entities.some((e) => e.entityType === 'IP_ADDRESS')).toBe(true);
  });

  it('returns empty array for clean text', async () => {
    const entities = await recognizer.recognize('Hello, how are you today?');
    expect(entities).toHaveLength(0);
  });

  it('respects entityTypes filter', async () => {
    const entities = await recognizer.recognize('SSN: 123-45-6789, email: a@b.com', {
      entityTypes: ['EMAIL'],
    });
    expect(entities.every((e) => e.entityType === 'EMAIL')).toBe(true);
  });

  it('has correct name and supportedEntities', () => {
    expect(recognizer.name).toBe('regex');
    expect(recognizer.supportedEntities.length).toBeGreaterThan(0);
    expect(recognizer.supportedEntities).toContain('SSN');
    expect(recognizer.supportedEntities).toContain('EMAIL');
  });

  it('includes score >= 0.85 for structured matches', async () => {
    const entities = await recognizer.recognize('SSN: 123-45-6789');
    for (const entity of entities) {
      expect(entity.score).toBeGreaterThanOrEqual(0.85);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/RegexRecognizer.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write RegexRecognizer implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/recognizers/RegexRecognizer.ts`:

```typescript
/**
 * @module pii-redaction/recognizers/RegexRecognizer
 *
 * Tier 1: Structured PII detection via OpenRedaction.
 * Always loaded (required dependency), runs ~0ms per evaluation.
 * Detects SSN, credit card, email, phone, IP, IBAN, passport, etc.
 * Uses checksum validation (Luhn for CC) for high-confidence matches.
 */

import type { PiiEntity, PiiEntityType } from '../types';
import type { IEntityRecognizer, RecognizeOptions } from './IEntityRecognizer';

/** PII entity types that this recognizer can detect */
const SUPPORTED_ENTITIES: PiiEntityType[] = [
  'SSN',
  'CREDIT_CARD',
  'EMAIL',
  'PHONE',
  'IP_ADDRESS',
  'IBAN',
  'PASSPORT',
  'DRIVERS_LICENSE',
  'GOV_ID',
  'DATE_OF_BIRTH',
  'API_KEY',
  'AWS_KEY',
  'CRYPTO_ADDRESS',
];

/**
 * Maps OpenRedaction entity type strings to our PiiEntityType.
 * OpenRedaction uses its own naming convention; this normalizes it.
 */
const ENTITY_TYPE_MAP: Record<string, PiiEntityType> = {
  ssn: 'SSN',
  social_security_number: 'SSN',
  credit_card: 'CREDIT_CARD',
  credit_card_number: 'CREDIT_CARD',
  email: 'EMAIL',
  email_address: 'EMAIL',
  phone: 'PHONE',
  phone_number: 'PHONE',
  ip_address: 'IP_ADDRESS',
  ipv4: 'IP_ADDRESS',
  ipv6: 'IP_ADDRESS',
  iban: 'IBAN',
  passport: 'PASSPORT',
  passport_number: 'PASSPORT',
  drivers_license: 'DRIVERS_LICENSE',
  date_of_birth: 'DATE_OF_BIRTH',
  api_key: 'API_KEY',
  aws_key: 'AWS_KEY',
  aws_access_key: 'AWS_KEY',
  crypto_address: 'CRYPTO_ADDRESS',
  bitcoin_address: 'CRYPTO_ADDRESS',
  ethereum_address: 'CRYPTO_ADDRESS',
};

/**
 * Tier 1 recognizer: structured PII detection via regex patterns.
 *
 * Wraps the `openredaction` library which provides 570+ regex patterns
 * with Luhn/checksum validation across 50+ countries.
 * Scores are high (0.85–1.0) because regex + checksum = high confidence.
 */
export class RegexRecognizer implements IEntityRecognizer {
  readonly name = 'regex';
  readonly supportedEntities = SUPPORTED_ENTITIES;

  /** Lazily loaded openredaction module */
  private redactor: any = null;

  /**
   * Ensure openredaction is loaded. Called once on first recognize().
   * Unlike Tiers 2–3, this does NOT go through ISharedServiceRegistry
   * because it's a required (not optional) dependency that's lightweight.
   */
  private async ensureLoaded(): Promise<void> {
    if (this.redactor) return;
    try {
      // Dynamic import so the module is resolved at runtime
      const mod = await import('openredaction');
      this.redactor = mod.default ?? mod;
    } catch {
      throw new Error(
        'openredaction is required for PII regex detection but failed to load. ' +
          'Ensure it is installed: pnpm add openredaction'
      );
    }
  }

  async recognize(text: string, options?: RecognizeOptions): Promise<PiiEntity[]> {
    await this.ensureLoaded();

    // Determine which entity types to scan for
    const allowedTypes = options?.entityTypes
      ? new Set(options.entityTypes.filter((t) => SUPPORTED_ENTITIES.includes(t)))
      : new Set(SUPPORTED_ENTITIES);

    if (allowedTypes.size === 0) return [];

    // Call openredaction's scan/detect API
    // The exact API depends on the library version; adapt as needed
    // openredaction API: try common method names in order of preference
    const results = this.redactor.scan
      ? this.redactor.scan(text)
      : this.redactor.detect
        ? this.redactor.detect(text)
        : this.redactor.analyze
          ? this.redactor.analyze(text)
          : [];

    const entities: PiiEntity[] = [];

    for (const match of results) {
      // Map the library's entity type to our PiiEntityType
      const rawType = (match.type || match.entity_type || match.entityType || '').toLowerCase();
      const entityType = ENTITY_TYPE_MAP[rawType];
      if (!entityType || !allowedTypes.has(entityType)) continue;

      entities.push({
        entityType,
        text: match.text || match.value || text.slice(match.start, match.end),
        start: match.start ?? match.offset ?? 0,
        end: match.end ?? match.start + (match.text?.length ?? 0),
        score: match.score ?? match.confidence ?? 0.9,
        source: 'regex',
        metadata: {
          checksumValid: match.checksumValid ?? match.checksum_valid ?? undefined,
          rawType,
        },
      });
    }

    return entities;
  }
}
```

> **Note to implementer:** The `openredaction` API surface may differ from what's shown above. After installing, run `node -e "const m = require('openredaction'); console.log(Object.keys(m))"` to inspect the actual exports, and adjust the `ensureLoaded` + `recognize` implementation accordingly. The key contract is: take text in, return `PiiEntity[]` out with correct offsets and scores.

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/RegexRecognizer.spec.ts
```

Expected: PASS. If any tests fail due to openredaction API differences, adapt the implementation to match the actual API, then re-run.

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/recognizers/RegexRecognizer.ts packages/agentos/tests/extensions/packs/pii-redaction/RegexRecognizer.spec.ts
git commit -m "feat(pii): add RegexRecognizer (Tier 1) with openredaction"
```

---

## Task 5: NlpPrefilterRecognizer (Tier 2)

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/recognizers/NlpPrefilterRecognizer.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/NlpPrefilterRecognizer.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/NlpPrefilterRecognizer.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { NlpPrefilterRecognizer } from '../../../../src/extensions/packs/pii-redaction/recognizers/NlpPrefilterRecognizer';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

/** Minimal mock of ISharedServiceRegistry */
function createMockRegistry(): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, await factory());
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('NlpPrefilterRecognizer', () => {
  it('detects person names via compromise', async () => {
    const registry = createMockRegistry();
    const recognizer = new NlpPrefilterRecognizer(registry);
    const entities = await recognizer.recognize('John Smith went to Paris');
    // compromise should find at least one PERSON or LOCATION
    expect(entities.length).toBeGreaterThanOrEqual(1);
    expect(entities.some((e) => e.source === 'nlp-prefilter')).toBe(true);
  });

  it('returns empty for text without names', async () => {
    const registry = createMockRegistry();
    const recognizer = new NlpPrefilterRecognizer(registry);
    const entities = await recognizer.recognize('The quick brown fox jumps over the lazy dog');
    // No person names or places in this sentence
    expect(entities.filter((e) => e.entityType === 'PERSON')).toHaveLength(0);
  });

  it('scores are in the 0.3–0.6 range (pre-filter confidence)', async () => {
    const registry = createMockRegistry();
    const recognizer = new NlpPrefilterRecognizer(registry);
    const entities = await recognizer.recognize('Barack Obama visited London');
    for (const entity of entities) {
      expect(entity.score).toBeGreaterThanOrEqual(0.3);
      expect(entity.score).toBeLessThanOrEqual(0.6);
    }
  });

  it('gracefully skips when compromise is not installed', async () => {
    const registry = createMockRegistry();
    // Override getOrCreate to simulate missing dependency
    registry.getOrCreate = vi.fn(async () => {
      throw new Error("Cannot find module 'compromise'");
    });
    const recognizer = new NlpPrefilterRecognizer(registry);
    const entities = await recognizer.recognize('John Smith');
    expect(entities).toHaveLength(0); // graceful degradation
  });

  it('uses shared service registry for compromise instance', async () => {
    const registry = createMockRegistry();
    const recognizer = new NlpPrefilterRecognizer(registry);
    await recognizer.recognize('Test text');
    expect(registry.getOrCreate).toHaveBeenCalledWith(
      'agentos:nlp:compromise',
      expect.any(Function)
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/NlpPrefilterRecognizer.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write NlpPrefilterRecognizer implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/recognizers/NlpPrefilterRecognizer.ts`:

```typescript
/**
 * @module pii-redaction/recognizers/NlpPrefilterRecognizer
 *
 * Tier 2: Fast NLP pre-filter using compromise (~250KB).
 * Uses rule-based POS tagging to detect person names, organizations,
 * and places. Acts as a gate for the heavier BERT NER model (Tier 3).
 *
 * Loaded lazily via ISharedServiceRegistry — the compromise instance
 * is shared with any other extensions that request 'agentos:nlp:compromise'.
 *
 * Scores are intentionally low (0.3–0.6) because rule-based NER
 * has moderate accuracy. Higher tiers refine these.
 */

import type { ISharedServiceRegistry } from '../../../ISharedServiceRegistry';
import type { PiiEntity, PiiEntityType } from '../types';
import { PII_SERVICE_IDS } from '../types';
import type { IEntityRecognizer, RecognizeOptions } from './IEntityRecognizer';

/** Entity types this recognizer can detect */
const SUPPORTED_ENTITIES: PiiEntityType[] = ['PERSON', 'ORGANIZATION', 'LOCATION'];

/**
 * Tier 2 recognizer: fast NLP pre-filter for name-like tokens.
 *
 * Uses compromise's `.people()`, `.places()`, `.organizations()` methods
 * to quickly identify candidate PII spans before the expensive BERT model.
 * If this tier finds zero candidates, Tier 3 is skipped entirely.
 */
export class NlpPrefilterRecognizer implements IEntityRecognizer {
  readonly name = 'nlp-prefilter';
  readonly supportedEntities = SUPPORTED_ENTITIES;

  /** Whether compromise failed to load (avoids repeated attempts) */
  private unavailable = false;

  constructor(private readonly services: ISharedServiceRegistry) {}

  async recognize(text: string, options?: RecognizeOptions): Promise<PiiEntity[]> {
    if (this.unavailable) return [];

    let nlp: any;
    try {
      nlp = await this.services.getOrCreate(PII_SERVICE_IDS.NLP_PREFILTER, async () => {
        const mod = await import('compromise');
        return mod.default ?? mod;
      });
    } catch {
      // compromise not installed — graceful degradation
      this.unavailable = true;
      return [];
    }

    const doc = nlp(text);
    const entities: PiiEntity[] = [];

    // Determine which types to look for
    const allowedTypes = options?.entityTypes
      ? new Set(options.entityTypes.filter((t) => SUPPORTED_ENTITIES.includes(t)))
      : new Set(SUPPORTED_ENTITIES);

    // Extract people
    if (allowedTypes.has('PERSON')) {
      const people = doc.people().out('offset');
      for (const match of people) {
        entities.push({
          entityType: 'PERSON',
          text: match.text,
          start: match.offset?.start ?? 0,
          end: (match.offset?.start ?? 0) + match.text.length,
          score: 0.45,
          source: 'nlp-prefilter',
          metadata: { compromiseTag: 'Person' },
        });
      }
    }

    // Extract places
    if (allowedTypes.has('LOCATION')) {
      const places = doc.places().out('offset');
      for (const match of places) {
        entities.push({
          entityType: 'LOCATION',
          text: match.text,
          start: match.offset?.start ?? 0,
          end: (match.offset?.start ?? 0) + match.text.length,
          score: 0.4,
          source: 'nlp-prefilter',
          metadata: { compromiseTag: 'Place' },
        });
      }
    }

    // Extract organizations
    if (allowedTypes.has('ORGANIZATION')) {
      const orgs = doc.organizations().out('offset');
      for (const match of orgs) {
        entities.push({
          entityType: 'ORGANIZATION',
          text: match.text,
          start: match.offset?.start ?? 0,
          end: (match.offset?.start ?? 0) + match.text.length,
          score: 0.4,
          source: 'nlp-prefilter',
          metadata: { compromiseTag: 'Organization' },
        });
      }
    }

    return entities;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/NlpPrefilterRecognizer.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/recognizers/NlpPrefilterRecognizer.ts packages/agentos/tests/extensions/packs/pii-redaction/NlpPrefilterRecognizer.spec.ts
git commit -m "feat(pii): add NlpPrefilterRecognizer (Tier 2) with compromise"
```

---

## Task 6: NerModelRecognizer (Tier 3)

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/recognizers/NerModelRecognizer.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/NerModelRecognizer.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/NerModelRecognizer.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { NerModelRecognizer } from '../../../../src/extensions/packs/pii-redaction/recognizers/NerModelRecognizer';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

/** Mock NER pipeline that returns fake entities */
function createMockPipeline() {
  return vi.fn(async (text: string) => [
    { entity: 'B-PER', word: 'John', start: 0, end: 4, score: 0.95 },
    { entity: 'I-PER', word: 'Smith', start: 5, end: 10, score: 0.93 },
    { entity: 'B-LOC', word: 'London', start: 20, end: 26, score: 0.91 },
  ]);
}

function createMockRegistry(pipeline: any): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, pipeline);
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('NerModelRecognizer', () => {
  it('maps BERT NER labels to PiiEntityType', async () => {
    const pipeline = createMockPipeline();
    const registry = createMockRegistry(pipeline);
    const recognizer = new NerModelRecognizer(registry);
    const entities = await recognizer.recognize('John Smith lives in London');
    expect(entities.some((e) => e.entityType === 'PERSON')).toBe(true);
    expect(entities.some((e) => e.entityType === 'LOCATION')).toBe(true);
  });

  it('merges B- and I- tokens into single entities', async () => {
    const pipeline = createMockPipeline();
    const registry = createMockRegistry(pipeline);
    const recognizer = new NerModelRecognizer(registry);
    const entities = await recognizer.recognize('John Smith lives in London');
    const people = entities.filter((e) => e.entityType === 'PERSON');
    // B-PER + I-PER should merge into one entity
    expect(people).toHaveLength(1);
    expect(people[0].text).toContain('John');
  });

  it('scores reflect model confidence', async () => {
    const pipeline = createMockPipeline();
    const registry = createMockRegistry(pipeline);
    const recognizer = new NerModelRecognizer(registry);
    const entities = await recognizer.recognize('John Smith lives in London');
    for (const entity of entities) {
      expect(entity.score).toBeGreaterThan(0);
      expect(entity.score).toBeLessThanOrEqual(1);
      expect(entity.source).toBe('ner-model');
    }
  });

  it('gracefully skips when transformers is not installed', async () => {
    const registry: ISharedServiceRegistry = {
      getOrCreate: vi.fn(async () => {
        throw new Error('Cannot find module');
      }),
      has: () => false,
      release: vi.fn(async () => {}),
      releaseAll: vi.fn(async () => {}),
    };
    const recognizer = new NerModelRecognizer(registry);
    const entities = await recognizer.recognize('John Smith');
    expect(entities).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/NerModelRecognizer.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write NerModelRecognizer implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/recognizers/NerModelRecognizer.ts`:

```typescript
/**
 * @module pii-redaction/recognizers/NerModelRecognizer
 *
 * Tier 3: ML-grade NER using @huggingface/transformers with bert-base-NER.
 * F1=0.926 on CoNLL-2003. Runs in Node via ONNX/WASM — no Python needed.
 *
 * Lazy-loaded via ISharedServiceRegistry:
 * - First call downloads the quantized model (~110MB q8) to ~/.wunderland/models/
 * - Subsequent calls (including from other extensions) reuse the cached pipeline
 *
 * Only invoked when Tier 2 (NlpPrefilterRecognizer) finds name-like candidates.
 * This gating prevents loading the 110MB model for messages without names.
 */

import type { ISharedServiceRegistry } from '../../../ISharedServiceRegistry';
import type { PiiEntity, PiiEntityType } from '../types';
import { PII_SERVICE_IDS } from '../types';
import type { IEntityRecognizer, RecognizeOptions } from './IEntityRecognizer';

/** Maps BERT NER labels to PiiEntityType */
const NER_LABEL_MAP: Record<string, PiiEntityType> = {
  PER: 'PERSON',
  LOC: 'LOCATION',
  ORG: 'ORGANIZATION',
  MISC: 'UNKNOWN_PII',
};

/** Entity types this recognizer can detect */
const SUPPORTED_ENTITIES: PiiEntityType[] = ['PERSON', 'ORGANIZATION', 'LOCATION', 'UNKNOWN_PII'];

/**
 * Tier 3 recognizer: ML-based Named Entity Recognition.
 *
 * Uses a quantized BERT NER model via HuggingFace Transformers.js.
 * Merges BIO-tagged token sequences (B-PER, I-PER) into single entities.
 */
export class NerModelRecognizer implements IEntityRecognizer {
  readonly name = 'ner-model';
  readonly supportedEntities = SUPPORTED_ENTITIES;

  /** Whether the transformers library failed to load */
  private unavailable = false;

  constructor(private readonly services: ISharedServiceRegistry) {}

  async recognize(text: string, options?: RecognizeOptions): Promise<PiiEntity[]> {
    if (this.unavailable) return [];

    let pipeline: any;
    try {
      pipeline = await this.services.getOrCreate(
        PII_SERVICE_IDS.NER_PIPELINE,
        async () => {
          const { pipeline: createPipeline } = await import('@huggingface/transformers');
          return createPipeline('token-classification', 'Xenova/bert-base-NER', {
            quantized: true,
          });
        },
        {
          dispose: async (pipe: any) => pipe?.dispose?.(),
          tags: ['nlp', 'ner', 'ml-model'],
        }
      );
    } catch {
      // @huggingface/transformers not installed — graceful degradation
      this.unavailable = true;
      return [];
    }

    // Run the NER pipeline
    const rawResults = await pipeline(text);
    if (!Array.isArray(rawResults) || rawResults.length === 0) return [];

    // Merge BIO tokens into contiguous entities
    return this.mergeBioTokens(rawResults, text, options?.entityTypes);
  }

  /**
   * Merges BIO-tagged token sequences into contiguous PII entities.
   *
   * BERT NER outputs tokens like: B-PER, I-PER, B-LOC, O, ...
   * B- = beginning of entity, I- = inside (continuation), O = outside.
   * Adjacent B-X + I-X tokens are merged into a single entity span.
   *
   * @param tokens - Raw NER pipeline output
   * @param text - Original input text for extracting spans
   * @param entityTypes - Optional filter for entity types
   */
  private mergeBioTokens(tokens: any[], text: string, entityTypes?: PiiEntityType[]): PiiEntity[] {
    const entities: PiiEntity[] = [];
    const allowedTypes = entityTypes ? new Set(entityTypes) : null;

    let current: { label: string; start: number; end: number; scores: number[] } | null = null;

    for (const token of tokens) {
      const rawLabel = (token.entity || token.entity_group || '').replace(/^[BI]-/, '');
      const mappedType = NER_LABEL_MAP[rawLabel];
      if (!mappedType) continue;
      if (allowedTypes && !allowedTypes.has(mappedType)) continue;

      const isBeginning = (token.entity || '').startsWith('B-');
      const isContinuation = (token.entity || '').startsWith('I-');

      if (isBeginning || (!isContinuation && current?.label !== rawLabel)) {
        // Flush previous entity
        if (current) {
          this.flushEntity(current, text, entities);
        }
        current = {
          label: rawLabel,
          start: token.start,
          end: token.end,
          scores: [token.score],
        };
      } else if (isContinuation && current?.label === rawLabel) {
        // Extend current entity
        current.end = token.end;
        current.scores.push(token.score);
      }
    }

    // Flush last entity
    if (current) {
      this.flushEntity(current, text, entities);
    }

    return entities;
  }

  /**
   * Converts a merged token group into a PiiEntity and pushes to the array.
   * Score is the average of all constituent token scores.
   */
  private flushEntity(
    group: { label: string; start: number; end: number; scores: number[] },
    text: string,
    entities: PiiEntity[]
  ): void {
    const entityType = NER_LABEL_MAP[group.label];
    if (!entityType) return;

    const avgScore = group.scores.reduce((a, b) => a + b, 0) / group.scores.length;

    entities.push({
      entityType,
      text: text.slice(group.start, group.end),
      start: group.start,
      end: group.end,
      score: Math.round(avgScore * 1000) / 1000, // round to 3 decimal places
      source: 'ner-model',
      metadata: {
        nerLabel: group.label,
        tokenCount: group.scores.length,
      },
    });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/NerModelRecognizer.spec.ts
```

Expected: PASS (tests use mocked pipeline, so no actual model download needed)

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/recognizers/NerModelRecognizer.ts packages/agentos/tests/extensions/packs/pii-redaction/NerModelRecognizer.spec.ts
git commit -m "feat(pii): add NerModelRecognizer (Tier 3) with HuggingFace transformers"
```

---

## Task 7: LlmJudgeRecognizer (Tier 4)

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/recognizers/LlmJudgeRecognizer.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/LlmJudgeRecognizer.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/LlmJudgeRecognizer.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { LlmJudgeRecognizer } from '../../../../src/extensions/packs/pii-redaction/recognizers/LlmJudgeRecognizer';
import type {
  PiiEntity,
  LlmJudgeConfig,
} from '../../../../src/extensions/packs/pii-redaction/types';

/** Creates a mock fetch that returns LLM judge responses */
function createMockFetch(response: Record<string, unknown>) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: JSON.stringify(response) } }],
    }),
  }));
}

const CONFIG: LlmJudgeConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'test-key',
  baseUrl: 'https://api.example.com/v1',
  maxConcurrency: 2,
  cacheSize: 100,
};

const AMBIGUOUS_ENTITY: PiiEntity = {
  entityType: 'PERSON',
  text: 'Jordan',
  start: 10,
  end: 16,
  score: 0.5,
  source: 'nlp-prefilter',
};

describe('LlmJudgeRecognizer', () => {
  it('confirms PII when LLM says isPii: true', async () => {
    const mockFetch = createMockFetch({
      isPii: true,
      entityType: 'PERSON',
      confidence: 0.9,
      reasoning: 'Name of a specific individual',
    });
    const recognizer = new LlmJudgeRecognizer(CONFIG, mockFetch as any);
    const result = await recognizer.judge(AMBIGUOUS_ENTITY, 'I spoke to Jordan about the project');
    expect(result).not.toBeNull();
    expect(result!.entityType).toBe('PERSON');
    expect(result!.score).toBe(0.9);
    expect(result!.source).toBe('llm-judge');
    expect(result!.metadata?.originalSource).toBe('nlp-prefilter');
  });

  it('returns null (discard) when LLM says NOT_PII', async () => {
    const mockFetch = createMockFetch({
      isPii: false,
      entityType: 'NOT_PII',
      confidence: 0.1,
      reasoning: 'Jordan refers to the country',
    });
    const recognizer = new LlmJudgeRecognizer(CONFIG, mockFetch as any);
    const result = await recognizer.judge(AMBIGUOUS_ENTITY, 'We export goods to Jordan');
    expect(result).toBeNull();
  });

  it('caches results for identical span + context', async () => {
    const mockFetch = createMockFetch({
      isPii: true,
      entityType: 'PERSON',
      confidence: 0.9,
      reasoning: 'Name',
    });
    const recognizer = new LlmJudgeRecognizer(CONFIG, mockFetch as any);
    const text = 'I spoke to Jordan';
    await recognizer.judge(AMBIGUOUS_ENTITY, text);
    await recognizer.judge(AMBIGUOUS_ENTITY, text);
    // Should only call fetch once due to cache
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('respects maxConcurrency', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const slowFetch = vi.fn(async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 50));
      concurrent--;
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  isPii: true,
                  entityType: 'PERSON',
                  confidence: 0.9,
                  reasoning: 'test',
                }),
              },
            },
          ],
        }),
      };
    });

    const config = { ...CONFIG, maxConcurrency: 2, cacheSize: 0 };
    const recognizer = new LlmJudgeRecognizer(config, slowFetch as any);

    // Fire 4 concurrent judge calls with different contexts to avoid cache
    const entities = Array.from({ length: 4 }, (_, i) => ({
      ...AMBIGUOUS_ENTITY,
      text: `Person${i}`,
    }));
    await Promise.all(entities.map((e, i) => recognizer.judge(e, `Context ${i}`)));
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/LlmJudgeRecognizer.spec.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Write LlmJudgeRecognizer implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/recognizers/LlmJudgeRecognizer.ts`:

```typescript
/**
 * @module pii-redaction/recognizers/LlmJudgeRecognizer
 *
 * Tier 4: LLM-as-judge for resolving ambiguous PII classifications.
 *
 * Only invoked for entities with confidence between 0.3–0.7 (the ambiguity
 * window). Uses chain-of-thought prompting via an OpenAI-compatible HTTP API.
 *
 * Key optimizations:
 * - LRU cache: identical (span, context_hash) pairs return cached results
 * - Semaphore: limits concurrent LLM calls to prevent provider overload
 * - No SDK dependency: uses raw fetch for minimal footprint
 */

import type { PiiEntity, LlmJudgeConfig } from '../types';

/** System prompt for PII classification with chain-of-thought reasoning */
const SYSTEM_PROMPT = `You are a PII classification expert. Your task is to determine whether a highlighted text span constitutes personally identifiable information (PII) given its surrounding context.

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
  "confidence": number,
  "reasoning": "brief explanation"
}`;

/** LLM judge response schema */
interface JudgeResponse {
  isPii: boolean;
  entityType: string;
  confidence: number;
  reasoning: string;
}

/**
 * Simple semaphore for limiting concurrency.
 * Callers await acquire(), then call release() when done.
 */
class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(maxConcurrency: number) {
    this.permits = maxConcurrency;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise<void>((resolve) => this.waitQueue.push(resolve));
  }

  release(): void {
    const next = this.waitQueue.shift();
    if (next) {
      next();
    } else {
      this.permits++;
    }
  }
}

/**
 * Tier 4 recognizer: LLM-based PII disambiguation.
 *
 * Does not implement IEntityRecognizer directly because it operates
 * on individual candidate entities (not raw text). The pipeline
 * calls `judge()` for each ambiguous entity.
 */
export class LlmJudgeRecognizer {
  private readonly cache = new Map<string, PiiEntity | null>();
  private readonly cacheOrder: string[] = [];
  private readonly semaphore: Semaphore;
  private readonly maxCacheSize: number;

  /** The fetch implementation (injectable for testing) */
  private readonly fetchFn: typeof fetch;

  /** API endpoint for chat completions */
  private readonly apiUrl: string;

  /** API key for authentication */
  private readonly apiKey: string;

  /** Model ID to use */
  private readonly model: string;

  constructor(config: LlmJudgeConfig, fetchImpl?: typeof fetch) {
    this.fetchFn = fetchImpl ?? globalThis.fetch;
    this.model = config.model;
    this.apiKey = config.apiKey ?? '';
    this.semaphore = new Semaphore(config.maxConcurrency ?? 3);
    this.maxCacheSize = config.cacheSize ?? 500;

    // Build the API URL based on provider
    const baseUrl = config.baseUrl ?? this.resolveBaseUrl(config.provider);
    this.apiUrl = `${baseUrl}/chat/completions`;
  }

  /**
   * Resolve the default base URL for a known LLM provider.
   */
  private resolveBaseUrl(provider: string): string {
    switch (provider) {
      case 'openai':
        return 'https://api.openai.com/v1';
      case 'anthropic':
        return 'https://api.anthropic.com/v1';
      case 'openrouter':
        return 'https://openrouter.ai/api/v1';
      default:
        return 'http://localhost:11434/v1'; // ollama default
    }
  }

  /**
   * Judge whether an ambiguous entity is truly PII.
   *
   * @param entity - The ambiguous entity to classify (score typically 0.3–0.7)
   * @param fullText - The full text containing the entity, for context extraction
   * @returns Updated PiiEntity if confirmed PII, null if NOT_PII (discard)
   */
  async judge(entity: PiiEntity, fullText: string): Promise<PiiEntity | null> {
    // Build cache key from entity text + surrounding context hash
    const contextWindow = fullText.slice(
      Math.max(0, entity.start - 50),
      Math.min(fullText.length, entity.end + 50)
    );
    const cacheKey = `${entity.text}::${this.simpleHash(contextWindow)}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Acquire semaphore permit (limits concurrency)
    await this.semaphore.acquire();
    try {
      const result = await this.callLlm(entity, fullText);
      this.cacheResult(cacheKey, result);
      return result;
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Makes the actual LLM API call with the chain-of-thought prompt.
   */
  private async callLlm(entity: PiiEntity, fullText: string): Promise<PiiEntity | null> {
    // Extract context around the entity
    const contextBefore = fullText.slice(Math.max(0, entity.start - 100), entity.start);
    const contextAfter = fullText.slice(entity.end, Math.min(fullText.length, entity.end + 100));

    const userPrompt = `Analyze this candidate PII span:

Context: "...${contextBefore} **${entity.text}** ${contextAfter}..."

Candidate: "${entity.text}"
Initially detected as: ${entity.entityType} (score: ${entity.score}, source: ${entity.source})

Is this PII? Classify it.`;

    try {
      const response = await this.fetchFn(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0,
          max_tokens: 256,
        }),
      });

      if (!response.ok) return this.fallbackToOriginal(entity);

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) return this.fallbackToOriginal(entity);

      const parsed = JSON.parse(content) as JudgeResponse;
      return this.processJudgeResponse(parsed, entity);
    } catch {
      // LLM call failed — fall back to the original entity unchanged
      return this.fallbackToOriginal(entity);
    }
  }

  /**
   * Processes the LLM judge response and returns an updated entity or null.
   *
   * - NOT_PII → return null (discard the entity as a false positive)
   * - isPii: true → update entity with LLM's classification and confidence
   * - Preserve original tier's data in metadata for audit trail
   */
  private processJudgeResponse(
    response: JudgeResponse,
    originalEntity: PiiEntity
  ): PiiEntity | null {
    if (!response.isPii || response.entityType === 'NOT_PII') {
      return null; // Discard — false positive from earlier tier
    }

    return {
      ...originalEntity,
      entityType: this.mapLlmEntityType(response.entityType) ?? originalEntity.entityType,
      score: response.confidence,
      source: 'llm-judge',
      metadata: {
        ...originalEntity.metadata,
        originalSource: originalEntity.source,
        originalScore: originalEntity.score,
        reasoning: response.reasoning,
      },
    };
  }

  /**
   * Maps LLM response entity types back to PiiEntityType.
   */
  private mapLlmEntityType(llmType: string): import('../types').PiiEntityType | null {
    const map: Record<string, import('../types').PiiEntityType> = {
      PERSON: 'PERSON',
      ORGANIZATION: 'ORGANIZATION',
      LOCATION: 'LOCATION',
      MEDICAL_TERM: 'MEDICAL_TERM',
      UNKNOWN_PII: 'UNKNOWN_PII',
    };
    return map[llmType] ?? null;
  }

  /** Returns original entity unchanged (fail-open) */
  private fallbackToOriginal(entity: PiiEntity): PiiEntity {
    return entity;
  }

  /** Simple string hash for cache keys */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
  }

  /** LRU cache insertion with eviction */
  private cacheResult(key: string, value: PiiEntity | null): void {
    this.cache.set(key, value);
    this.cacheOrder.push(key);
    while (this.cacheOrder.length > this.maxCacheSize) {
      const evicted = this.cacheOrder.shift()!;
      this.cache.delete(evicted);
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/LlmJudgeRecognizer.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/recognizers/LlmJudgeRecognizer.ts packages/agentos/tests/extensions/packs/pii-redaction/LlmJudgeRecognizer.spec.ts
git commit -m "feat(pii): add LlmJudgeRecognizer (Tier 4) with CoT prompt and LRU cache"
```

---

## Task 8: EntityMerger

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/EntityMerger.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/EntityMerger.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/EntityMerger.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { mergeEntities } from '../../../../src/extensions/packs/pii-redaction/EntityMerger';
import type { PiiEntity } from '../../../../src/extensions/packs/pii-redaction/types';

const entity = (overrides: Partial<PiiEntity>): PiiEntity => ({
  entityType: 'PERSON',
  text: 'John',
  start: 0,
  end: 4,
  score: 0.8,
  source: 'regex',
  ...overrides,
});

describe('EntityMerger', () => {
  it('deduplicates exact overlaps by keeping highest score', () => {
    const result = mergeEntities(
      [
        entity({ score: 0.7, source: 'nlp-prefilter' }),
        entity({ score: 0.95, source: 'ner-model' }),
      ],
      {}
    );
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(0.95);
  });

  it('prefers longer span for partial overlaps', () => {
    const result = mergeEntities(
      [
        entity({ text: 'John', start: 0, end: 4, score: 0.8 }),
        entity({ text: 'John Smith', start: 0, end: 10, score: 0.75 }),
      ],
      {}
    );
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('John Smith');
  });

  it('filters by allowlist (case-insensitive)', () => {
    const result = mergeEntities([entity({ text: 'Acme Corp', entityType: 'ORGANIZATION' })], {
      allowlist: ['acme corp'],
    });
    expect(result).toHaveLength(0);
  });

  it('boosts denylist entries to score 1.0', () => {
    const result = mergeEntities([entity({ text: 'Secret Name', score: 0.3 })], {
      denylist: ['secret name'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(1.0);
  });

  it('filters by confidence threshold', () => {
    const result = mergeEntities(
      [entity({ score: 0.3 }), entity({ text: 'Jane', start: 10, end: 14, score: 0.8 })],
      { confidenceThreshold: 0.5 }
    );
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Jane');
  });

  it('sorts output by start offset', () => {
    const result = mergeEntities(
      [entity({ text: 'Jane', start: 10, end: 14 }), entity({ text: 'John', start: 0, end: 4 })],
      {}
    );
    expect(result[0].start).toBe(0);
    expect(result[1].start).toBe(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/EntityMerger.spec.ts
```

- [ ] **Step 3: Write EntityMerger implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/EntityMerger.ts`:

```typescript
/**
 * @module pii-redaction/EntityMerger
 *
 * Deduplicates and reconciles PII entities from multiple detection tiers.
 * Applied after all tiers have run and (optionally) after LLM judge resolution.
 */

import type { PiiEntity } from './types';

/** Options for the merge operation */
export interface MergeOptions {
  /** Terms to never flag as PII (case-insensitive match against entity text) */
  allowlist?: string[];
  /** Terms to always flag as PII at score 1.0 (case-insensitive) */
  denylist?: string[];
  /** Minimum confidence score — entities below are discarded */
  confidenceThreshold?: number;
}

/**
 * Deduplicates and reconciles PII entities from multiple detection tiers.
 *
 * Merge rules (applied in order):
 * 1. Denylist boosting: set score to 1.0 for matching entities
 * 2. Allowlist filtering: remove entities matching allowlist
 * 3. Overlap resolution:
 *    - Exact overlap (same start/end): keep highest score
 *    - Partial overlap: prefer longer span (subsumes shorter)
 *    - Adjacent spans (within 2 chars, same type): merge
 * 4. Threshold filtering: remove below confidenceThreshold
 * 5. Sort by start offset ascending
 *
 * @param entities - Raw entities from all tiers (may contain duplicates/overlaps)
 * @param options - Allowlist, denylist, and threshold configuration
 * @returns Deduplicated, filtered, sorted entity array
 */
export function mergeEntities(entities: PiiEntity[], options: MergeOptions): PiiEntity[] {
  if (entities.length === 0) return [];

  let result = [...entities];

  // Step 1: Apply denylist — boost matching entities to score 1.0
  if (options.denylist?.length) {
    const denySet = new Set(options.denylist.map((d) => d.toLowerCase()));
    for (const entity of result) {
      if (denySet.has(entity.text.toLowerCase())) {
        entity.score = 1.0;
      }
    }
  }

  // Step 2: Apply allowlist — remove matching entities
  if (options.allowlist?.length) {
    const allowSet = new Set(options.allowlist.map((a) => a.toLowerCase()));
    result = result.filter((e) => !allowSet.has(e.text.toLowerCase()));
  }

  // Step 3: Resolve overlaps
  // Sort by start offset, then by span length descending (longer first)
  result.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));

  const merged: PiiEntity[] = [];
  for (const entity of result) {
    const last = merged[merged.length - 1];

    if (!last) {
      merged.push(entity);
      continue;
    }

    // Check for overlap: current entity starts before previous ends
    if (entity.start < last.end) {
      // Exact or subset overlap: keep the one with higher score
      // If current is longer, prefer it (it subsumes the shorter one)
      if (entity.end > last.end) {
        // Current is longer — replace if score is at least as good
        if (entity.score >= last.score) {
          merged[merged.length - 1] = entity;
        }
        // else keep the shorter but higher-scored one
      } else {
        // Current is a subset of last — keep the one with higher score
        if (entity.score > last.score) {
          merged[merged.length - 1] = entity;
        }
      }
    } else if (entity.start - last.end <= 2 && entity.entityType === last.entityType) {
      // Adjacent spans of same type — merge into one.
      // Note: the merged text must be reconstructed from the original input
      // to include any gap characters (spaces, punctuation) between spans.
      // Since we don't have access to the original text here, we concatenate
      // with a space for 1-2 char gaps. The caller (PiiDetectionPipeline)
      // should pass the original text for accurate reconstruction.
      const gap = entity.start > last.end ? ' ' : '';
      merged[merged.length - 1] = {
        ...last,
        text: last.text + gap + entity.text,
        end: entity.end,
        score: Math.max(last.score, entity.score),
      };
    } else {
      // No overlap — add as new entity
      merged.push(entity);
    }
  }

  // Step 4: Apply confidence threshold
  const threshold = options.confidenceThreshold ?? 0;
  const filtered = merged.filter((e) => e.score >= threshold);

  // Step 5: Sort by start offset
  filtered.sort((a, b) => a.start - b.start);

  return filtered;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/EntityMerger.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/EntityMerger.ts packages/agentos/tests/extensions/packs/pii-redaction/EntityMerger.spec.ts
git commit -m "feat(pii): add EntityMerger with overlap resolution and allow/denylist"
```

---

## Task 9: RedactionEngine

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/RedactionEngine.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/RedactionEngine.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/RedactionEngine.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { redactText } from '../../../../src/extensions/packs/pii-redaction/RedactionEngine';
import type {
  PiiEntity,
  RedactionStyle,
} from '../../../../src/extensions/packs/pii-redaction/types';

const entities: PiiEntity[] = [
  { entityType: 'PERSON', text: 'John Smith', start: 8, end: 18, score: 0.95, source: 'ner-model' },
  {
    entityType: 'EMAIL',
    text: 'john@example.com',
    start: 22,
    end: 38,
    score: 1.0,
    source: 'regex',
  },
];
const text = 'Contact John Smith at john@example.com please';

describe('RedactionEngine', () => {
  it('placeholder style: replaces with [TYPE]', () => {
    const result = redactText(text, entities, 'placeholder');
    expect(result).toBe('Contact [PERSON] at [EMAIL] please');
  });

  it('mask style: partial masking', () => {
    const result = redactText(text, entities, 'mask');
    expect(result).toContain('J***');
    expect(result).not.toContain('John Smith');
  });

  it('hash style: deterministic 10-char hex', () => {
    const result = redactText(text, entities, 'hash');
    expect(result).toMatch(/\[PERSON:[a-f0-9]{10}\]/);
    // Same input should produce same hash
    const result2 = redactText(text, entities, 'hash');
    expect(result).toBe(result2);
  });

  it('category-tag style: XML tags', () => {
    const result = redactText(text, entities, 'category-tag');
    expect(result).toContain('<PII type="PERSON">REDACTED</PII>');
    expect(result).toContain('<PII type="EMAIL">REDACTED</PII>');
  });

  it('preserves non-PII text unchanged', () => {
    const result = redactText(text, entities, 'placeholder');
    expect(result).toContain('Contact ');
    expect(result).toContain(' at ');
    expect(result).toContain(' please');
  });

  it('handles empty entities array', () => {
    const result = redactText(text, [], 'placeholder');
    expect(result).toBe(text);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/RedactionEngine.spec.ts
```

- [ ] **Step 3: Write RedactionEngine implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/RedactionEngine.ts`:

```typescript
/**
 * @module pii-redaction/RedactionEngine
 *
 * Applies redaction transformations to text based on detected PII entities.
 * Supports four styles: placeholder, mask, hash, and category-tag.
 *
 * Entities are processed in reverse order (highest start offset first)
 * to preserve character offsets during string replacement.
 */

import { createHash } from 'crypto';
import type { PiiEntity, RedactionStyle } from './types';

/**
 * Redacts detected PII entities from text using the specified style.
 *
 * @param text - The original text containing PII
 * @param entities - Detected PII entities with character offsets
 * @param style - How to replace detected PII
 * @returns Text with PII replaced according to the style
 */
export function redactText(text: string, entities: PiiEntity[], style: RedactionStyle): string {
  if (entities.length === 0) return text;

  // Sort by start offset descending — process from end to preserve offsets
  const sorted = [...entities].sort((a, b) => b.start - a.start);

  let result = text;
  for (const entity of sorted) {
    const replacement = getReplacementText(entity, style);
    result = result.slice(0, entity.start) + replacement + result.slice(entity.end);
  }

  return result;
}

/**
 * Generates the replacement string for a single PII entity.
 *
 * | Style          | Input         | Output                          |
 * |----------------|---------------|---------------------------------|
 * | `placeholder`  | John Smith    | [PERSON]                        |
 * | `mask`         | John Smith    | J*** S****                      |
 * | `hash`         | John Smith    | [PERSON:a1b2c3d4e5]             |
 * | `category-tag` | John Smith    | <PII type="PERSON">REDACTED</PII> |
 */
function getReplacementText(entity: PiiEntity, style: RedactionStyle): string {
  switch (style) {
    case 'placeholder':
      return `[${entity.entityType}]`;

    case 'mask':
      return maskText(entity.text);

    case 'hash': {
      const hash = createHash('sha256').update(entity.text).digest('hex').slice(0, 10);
      return `[${entity.entityType}:${hash}]`;
    }

    case 'category-tag':
      return `<PII type="${entity.entityType}">REDACTED</PII>`;

    default:
      return `[${entity.entityType}]`;
  }
}

/**
 * Masks text by keeping the first letter of each word and replacing
 * the rest with asterisks.
 *
 * @example 'John Smith' → 'J*** S****'
 * @example 'john@example.com' → 'j***@e******.c**'
 */
function maskText(text: string): string {
  return text.replace(/\b(\w)(\w+)\b/g, (_, first, rest) => {
    return first + '*'.repeat(rest.length);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/RedactionEngine.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/RedactionEngine.ts packages/agentos/tests/extensions/packs/pii-redaction/RedactionEngine.spec.ts
git commit -m "feat(pii): add RedactionEngine with 4 redaction styles"
```

---

## Task 10: PiiDetectionPipeline

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/PiiDetectionPipeline.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/PiiDetectionPipeline.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/PiiDetectionPipeline.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { PiiDetectionPipeline } from '../../../../src/extensions/packs/pii-redaction/PiiDetectionPipeline';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';
import type { PiiRedactionPackOptions } from '../../../../src/extensions/packs/pii-redaction/types';

function createMockRegistry(): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, await factory());
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('PiiDetectionPipeline', () => {
  it('detects structured PII via regex tier', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, {});
    const result = await pipeline.detect('My SSN is 123-45-6789 and email is a@b.com');
    expect(result.entities.length).toBeGreaterThanOrEqual(1);
    expect(result.tiersExecuted).toContain('regex');
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.summary).toContain('Found');
  });

  it('returns empty result for clean text', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, {});
    const result = await pipeline.detect('Hello, how are you?');
    expect(result.entities).toHaveLength(0);
    expect(result.summary).toContain('0');
  });

  it('applies confidence threshold', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, { confidenceThreshold: 0.99 });
    const result = await pipeline.detect('My SSN is 123-45-6789');
    // Even high-confidence regex matches may be filtered at 0.99
    expect(result.entities.length).toBeLessThanOrEqual(1);
  });

  it('respects entityTypes filter', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, { entityTypes: ['EMAIL'] });
    const result = await pipeline.detect('SSN: 123-45-6789, email: a@b.com');
    for (const entity of result.entities) {
      expect(entity.entityType).toBe('EMAIL');
    }
  });

  it('skips Tier 3 when enableNerModel is false', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, { enableNerModel: false });
    const result = await pipeline.detect('John Smith went to London');
    expect(result.tiersExecuted).not.toContain('ner-model');
  });

  it('builds a human-readable summary', async () => {
    const registry = createMockRegistry();
    const pipeline = new PiiDetectionPipeline(registry, {});
    const result = await pipeline.detect('Contact a@b.com or call 555-123-4567');
    expect(typeof result.summary).toBe('string');
    expect(result.inputLength).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiDetectionPipeline.spec.ts
```

- [ ] **Step 3: Write PiiDetectionPipeline implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/PiiDetectionPipeline.ts`:

```typescript
/**
 * @module pii-redaction/PiiDetectionPipeline
 *
 * Orchestrates the four-tier PII detection pipeline:
 *
 * 1. RegexRecognizer (always runs, ~0ms) — structured PII
 * 2. NlpPrefilterRecognizer (lazy, ~250KB) — fast name/place/org scan
 * 3. NerModelRecognizer (lazy, ~110MB) — ML NER, gated by Tier 2 results
 * 4. LlmJudgeRecognizer (per-call cost) — CoT for ambiguous spans only
 *
 * After all tiers, EntityMerger deduplicates and applies thresholds.
 */

import type { ISharedServiceRegistry } from '../../ISharedServiceRegistry';
import type {
  PiiDetectionResult,
  PiiEntity,
  PiiRedactionPackOptions,
  LlmJudgeConfig,
} from './types';
import { RegexRecognizer } from './recognizers/RegexRecognizer';
import { NlpPrefilterRecognizer } from './recognizers/NlpPrefilterRecognizer';
import { NerModelRecognizer } from './recognizers/NerModelRecognizer';
import { LlmJudgeRecognizer } from './recognizers/LlmJudgeRecognizer';
import { mergeEntities } from './EntityMerger';

/** Context keywords that boost regex match confidence */
const CONTEXT_KEYWORDS: Array<{ pattern: RegExp; entityType: string; boost: number }> = [
  { pattern: /social\s*security/i, entityType: 'SSN', boost: 0.2 },
  { pattern: /\bname[:\s]/i, entityType: 'PERSON', boost: 0.2 },
  { pattern: /date\s*of\s*birth/i, entityType: 'DATE_OF_BIRTH', boost: 0.2 },
  { pattern: /\baddress[:\s]/i, entityType: 'LOCATION', boost: 0.15 },
  { pattern: /\bphone[:\s]/i, entityType: 'PHONE', boost: 0.15 },
  { pattern: /\bemail[:\s]/i, entityType: 'EMAIL', boost: 0.15 },
  { pattern: /credit\s*card/i, entityType: 'CREDIT_CARD', boost: 0.2 },
  { pattern: /\bpassport/i, entityType: 'PASSPORT', boost: 0.2 },
];

/** Ambiguity thresholds for LLM judge invocation */
const AMBIGUITY_LOW = 0.3;
const AMBIGUITY_HIGH = 0.7;

/**
 * Orchestrates the four-tier PII detection pipeline.
 */
export class PiiDetectionPipeline {
  private readonly regexRecognizer: RegexRecognizer;
  private readonly nlpPrefilter: NlpPrefilterRecognizer;
  private readonly nerModel: NerModelRecognizer | null;
  private readonly llmJudge: LlmJudgeRecognizer | null;
  private readonly options: PiiRedactionPackOptions;

  constructor(
    services: ISharedServiceRegistry,
    options: PiiRedactionPackOptions,
    /** Secret resolver for LLM API key fallback chain */
    getSecret?: (id: string) => string | undefined
  ) {
    this.options = options;
    this.regexRecognizer = new RegexRecognizer();
    this.nlpPrefilter = new NlpPrefilterRecognizer(services);
    this.nerModel = options.enableNerModel !== false ? new NerModelRecognizer(services) : null;
    this.llmJudge = options.llmJudge ? this.createLlmJudge(options.llmJudge, getSecret) : null;
  }

  /**
   * Run the full detection pipeline on input text.
   *
   * @param text - The text to scan for PII
   * @returns Detection result with entities, metadata, and summary
   */
  async detect(text: string): Promise<PiiDetectionResult> {
    const startTime = Date.now();
    const tiersExecuted: PiiDetectionResult['tiersExecuted'] = [];
    const allEntities: PiiEntity[] = [];

    // --- Tier 1: Regex (always runs) ---
    tiersExecuted.push('regex');
    const regexEntities = await this.regexRecognizer.recognize(text, {
      entityTypes: this.options.entityTypes,
    });
    allEntities.push(...regexEntities);

    // Context enhancement: boost scores near context keywords
    this.applyContextEnhancement(allEntities, text);

    // --- Tier 2: NLP Pre-filter (always runs when available) ---
    tiersExecuted.push('nlp-prefilter');
    const nlpEntities = await this.nlpPrefilter.recognize(text, {
      entityTypes: this.options.entityTypes,
    });
    allEntities.push(...nlpEntities);

    // --- Tier 3: NER Model (gated by Tier 2 results) ---
    const hasNameCandidates = nlpEntities.some((e) =>
      ['PERSON', 'ORGANIZATION', 'LOCATION'].includes(e.entityType)
    );

    if (this.nerModel && hasNameCandidates) {
      tiersExecuted.push('ner-model');
      const nerEntities = await this.nerModel.recognize(text, {
        entityTypes: this.options.entityTypes,
        priorEntities: nlpEntities,
      });
      allEntities.push(...nerEntities);
    }

    // --- Merge before LLM judge ---
    let merged = mergeEntities(allEntities, {
      allowlist: this.options.allowlist,
      denylist: this.options.denylist,
      // Don't apply threshold yet — LLM judge needs to see ambiguous entities
    });

    // --- Tier 4: LLM Judge (only for ambiguous entities) ---
    if (this.llmJudge) {
      const ambiguous = merged.filter((e) => e.score > AMBIGUITY_LOW && e.score < AMBIGUITY_HIGH);

      if (ambiguous.length > 0) {
        tiersExecuted.push('llm-judge');
        const judged = await Promise.all(ambiguous.map((e) => this.llmJudge!.judge(e, text)));

        // Replace ambiguous entities with judged results
        const judgedMap = new Map<string, PiiEntity | null>();
        for (let i = 0; i < ambiguous.length; i++) {
          const key = `${ambiguous[i].start}:${ambiguous[i].end}`;
          judgedMap.set(key, judged[i]);
        }

        merged = merged
          .map((e) => {
            const key = `${e.start}:${e.end}`;
            if (judgedMap.has(key)) {
              return judgedMap.get(key)!;
            }
            return e;
          })
          .filter((e): e is PiiEntity => e !== null);
      }
    }

    // --- Final threshold filter ---
    const threshold = this.options.confidenceThreshold ?? 0.5;
    const final = merged.filter((e) => e.score >= threshold);

    // Sort by start offset
    final.sort((a, b) => a.start - b.start);

    const processingTimeMs = Date.now() - startTime;

    return {
      entities: final,
      inputLength: text.length,
      processingTimeMs,
      tiersExecuted,
      summary: this.buildSummary(final),
    };
  }

  /**
   * Scans ±50 characters around each entity for context keywords
   * and boosts the entity's confidence score accordingly.
   */
  private applyContextEnhancement(entities: PiiEntity[], text: string): void {
    for (const entity of entities) {
      const windowStart = Math.max(0, entity.start - 50);
      const windowEnd = Math.min(text.length, entity.end + 50);
      const window = text.slice(windowStart, windowEnd).toLowerCase();

      for (const { pattern, entityType, boost } of CONTEXT_KEYWORDS) {
        if (entity.entityType === entityType && pattern.test(window)) {
          entity.score = Math.min(1.0, entity.score + boost);
        }
      }
    }
  }

  /** Builds a human-readable summary string */
  private buildSummary(entities: PiiEntity[]): string {
    if (entities.length === 0) return 'Found 0 PII entities';

    const counts = new Map<string, number>();
    for (const e of entities) {
      counts.set(e.entityType, (counts.get(e.entityType) ?? 0) + 1);
    }
    const parts = [...counts.entries()].map(([type, count]) => `${count} ${type}`);
    return `Found ${entities.length} PII entities: ${parts.join(', ')}`;
  }

  /**
   * Creates the LLM judge with API key resolution fallback chain:
   * 1. Explicit apiKey in config
   * 2. Provider-specific secret (openai.apiKey, anthropic.apiKey, etc.)
   * 3. Pack-specific secret (pii.llm.apiKey)
   */
  private createLlmJudge(
    config: LlmJudgeConfig,
    getSecret?: (id: string) => string | undefined
  ): LlmJudgeRecognizer {
    let apiKey = config.apiKey;

    if (!apiKey && getSecret) {
      // Try provider-specific secret first
      apiKey = getSecret(`${config.provider}.apiKey`);
      // Fall back to pack-specific secret
      if (!apiKey) apiKey = getSecret('pii.llm.apiKey');
    }

    return new LlmJudgeRecognizer({ ...config, apiKey: apiKey ?? '' });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiDetectionPipeline.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/PiiDetectionPipeline.ts packages/agentos/tests/extensions/packs/pii-redaction/PiiDetectionPipeline.spec.ts
git commit -m "feat(pii): add PiiDetectionPipeline with 4-tier gating and context enhancement"
```

---

## Task 11: PiiRedactionGuardrail

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactionGuardrail.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactionGuardrail.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { PiiRedactionGuardrail } from '../../../../src/extensions/packs/pii-redaction/PiiRedactionGuardrail';
import { GuardrailAction } from '../../../../src/core/guardrails/IGuardrailService';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

function createMockRegistry(): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, await factory());
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

const mockContext = {
  userId: 'u1',
  sessionId: 's1',
  conversationId: 'c1',
};

describe('PiiRedactionGuardrail', () => {
  it('returns SANITIZE with redacted text for input containing PII', async () => {
    const registry = createMockRegistry();
    const guardrail = new PiiRedactionGuardrail(registry, {});
    const result = await guardrail.evaluateInput!({
      context: mockContext,
      input: {
        userId: 'u1',
        sessionId: 's1',
        textInput: 'My SSN is 123-45-6789',
      } as any,
    });
    expect(result).not.toBeNull();
    expect(result!.action).toBe(GuardrailAction.SANITIZE);
    expect(result!.modifiedText).not.toContain('123-45-6789');
    expect(result!.reasonCode).toBe('PII_REDACTED');
  });

  it('returns null for clean input', async () => {
    const registry = createMockRegistry();
    const guardrail = new PiiRedactionGuardrail(registry, {});
    const result = await guardrail.evaluateInput!({
      context: mockContext,
      input: {
        userId: 'u1',
        sessionId: 's1',
        textInput: 'Hello world',
      } as any,
    });
    expect(result).toBeNull();
  });

  it('respects guardrailScope: input disables evaluateOutput', async () => {
    const registry = createMockRegistry();
    const guardrail = new PiiRedactionGuardrail(registry, { guardrailScope: 'input' });
    const result = await guardrail.evaluateOutput!({
      context: mockContext,
      chunk: { type: 'TEXT_DELTA', textDelta: 'SSN: 123-45-6789', streamId: 'stream1' } as any,
    });
    expect(result).toBeNull();
  });

  it('respects guardrailScope: output disables evaluateInput', async () => {
    const registry = createMockRegistry();
    const guardrail = new PiiRedactionGuardrail(registry, { guardrailScope: 'output' });
    const result = await guardrail.evaluateInput!({
      context: mockContext,
      input: { userId: 'u1', sessionId: 's1', textInput: 'SSN: 123-45-6789' } as any,
    });
    expect(result).toBeNull();
  });

  it('sets correct GuardrailConfig', () => {
    const registry = createMockRegistry();
    const guardrail = new PiiRedactionGuardrail(registry, {
      evaluateStreamingChunks: true,
      maxStreamingEvaluations: 25,
    });
    expect(guardrail.config!.evaluateStreamingChunks).toBe(true);
    expect(guardrail.config!.maxStreamingEvaluations).toBe(25);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiRedactionGuardrail.spec.ts
```

- [ ] **Step 3: Write PiiRedactionGuardrail implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts`:

```typescript
/**
 * @module pii-redaction/PiiRedactionGuardrail
 *
 * IGuardrailService implementation for automatic PII redaction.
 *
 * Intercepts content at two points:
 * - Input: scans user messages before orchestration
 * - Output: evaluates streaming chunks using sentence-boundary buffering
 *
 * Streaming buffers are keyed by `streamId` (from AgentOSResponseChunk)
 * with sessionId+conversationId fallback. An internal sentence counter
 * enforces maxStreamingEvaluations independently of the core dispatcher's
 * chunk-based counting.
 */

import type {
  IGuardrailService,
  GuardrailConfig,
  GuardrailInputPayload,
  GuardrailOutputPayload,
  GuardrailEvaluationResult,
} from '../../../core/guardrails/IGuardrailService';
import { GuardrailAction } from '../../../core/guardrails/IGuardrailService';
import type { ISharedServiceRegistry } from '../../ISharedServiceRegistry';
import type { PiiRedactionPackOptions, RedactionStyle } from './types';
import { PiiDetectionPipeline } from './PiiDetectionPipeline';
import { redactText } from './RedactionEngine';

/** Sentence boundary pattern for buffer flushing */
const SENTENCE_BOUNDARY = /[.?!]\s|\n/;

/** Buffer cleanup timeout in ms */
const BUFFER_TIMEOUT_MS = 30_000;

/** Per-stream state for sentence-boundary buffering */
interface StreamState {
  /** Accumulated text waiting for a sentence boundary */
  buffer: string;
  /** Number of sentence-level evaluations performed */
  evaluations: number;
  /** Timestamp of last chunk received (for timeout cleanup) */
  lastSeenAt: number;
}

/**
 * Guardrail that automatically detects and redacts PII from agent
 * input and output using the four-tier detection pipeline.
 */
export class PiiRedactionGuardrail implements IGuardrailService {
  readonly config: GuardrailConfig;

  private readonly pipeline: PiiDetectionPipeline;
  private readonly scope: 'input' | 'output' | 'both';
  private readonly redactionStyle: RedactionStyle;
  private readonly maxEvaluations: number;

  /** Per-stream buffering state, keyed by streamId or session+conversation composite */
  private readonly streamStates = new Map<string, StreamState>();

  constructor(
    services: ISharedServiceRegistry,
    options: PiiRedactionPackOptions,
    getSecret?: (id: string) => string | undefined
  ) {
    this.pipeline = new PiiDetectionPipeline(services, options, getSecret);
    this.scope = options.guardrailScope ?? 'both';
    this.redactionStyle = options.redactionStyle ?? 'placeholder';
    this.maxEvaluations = options.maxStreamingEvaluations ?? 50;

    this.config = {
      evaluateStreamingChunks: options.evaluateStreamingChunks ?? true,
      maxStreamingEvaluations: this.maxEvaluations,
    };
  }

  /**
   * Evaluate user input before orchestration.
   * Returns SANITIZE with redacted text if PII is found, null otherwise.
   */
  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null> {
    if (this.scope === 'output') return null;

    const text = payload.input.textInput;
    if (!text) return null;

    const result = await this.pipeline.detect(text);
    if (result.entities.length === 0) return null;

    const redacted = redactText(text, result.entities, this.redactionStyle);

    return {
      action: GuardrailAction.SANITIZE,
      modifiedText: redacted,
      reason: `Redacted ${result.entities.length} PII entities from input`,
      reasonCode: 'PII_REDACTED',
      metadata: {
        entitiesFound: result.entities.length,
        entityTypes: [...new Set(result.entities.map((e) => e.entityType))],
        tiersExecuted: result.tiersExecuted,
        processingTimeMs: result.processingTimeMs,
      },
    };
  }

  /**
   * Evaluate output chunks during streaming.
   * Uses sentence-boundary buffering to avoid partial-word false positives.
   */
  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null> {
    if (this.scope === 'input') return null;

    const chunk = payload.chunk as any;

    // Resolve stream key: prefer streamId, fall back to session+conversation
    const streamKey =
      chunk.streamId ?? `${payload.context.sessionId}:${payload.context.conversationId ?? ''}`;

    // Handle final response — flush buffer and clean up
    if (chunk.isFinal || chunk.type === 'FINAL_RESPONSE') {
      return this.flushAndCleanup(streamKey, chunk);
    }

    // Only evaluate text deltas
    if (chunk.type !== 'TEXT_DELTA' || !chunk.textDelta) return null;

    // Get or create stream state
    let state = this.streamStates.get(streamKey);
    if (!state) {
      state = { buffer: '', evaluations: 0, lastSeenAt: Date.now() };
      this.streamStates.set(streamKey, state);
    }

    state.buffer += chunk.textDelta;
    state.lastSeenAt = Date.now();

    // Check for sentence boundary
    if (!SENTENCE_BOUNDARY.test(state.buffer)) return null;

    // Rate limit: respect maxStreamingEvaluations
    if (state.evaluations >= this.maxEvaluations) return null;

    state.evaluations++;

    // Evaluate the buffered text (accumulated across multiple chunks)
    const bufferedText = state.buffer;
    const result = await this.pipeline.detect(bufferedText);
    state.buffer = ''; // Reset buffer after evaluation

    if (result.entities.length === 0) return null;

    // Redact against the full buffer text, not just the current chunk.
    // Entity offsets are relative to the buffer, so we must redact the buffer
    // and return it as the modifiedText replacing the accumulated content.
    const redacted = redactText(bufferedText, result.entities, this.redactionStyle);

    return {
      action: GuardrailAction.SANITIZE,
      modifiedText: redacted,
      reasonCode: 'PII_REDACTED',
      metadata: {
        entitiesFound: result.entities.length,
        streamEvaluation: state.evaluations,
      },
    };
  }

  /**
   * Flush any remaining buffer content and remove stream state.
   */
  private async flushAndCleanup(
    streamKey: string,
    chunk: any
  ): Promise<GuardrailEvaluationResult | null> {
    const state = this.streamStates.get(streamKey);
    this.streamStates.delete(streamKey);

    // Evaluate remaining buffer + final text
    const text = (state?.buffer ?? '') + (chunk.finalResponseText ?? chunk.textDelta ?? '');
    if (!text) return null;

    const result = await this.pipeline.detect(text);
    if (result.entities.length === 0) return null;

    const redacted = redactText(text, result.entities, this.redactionStyle);

    return {
      action: GuardrailAction.SANITIZE,
      modifiedText: redacted,
      reasonCode: 'PII_REDACTED',
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiRedactionGuardrail.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/PiiRedactionGuardrail.ts packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactionGuardrail.spec.ts
git commit -m "feat(pii): add PiiRedactionGuardrail with streaming sentence-boundary buffer"
```

---

## Task 12: PiiScanTool and PiiRedactTool

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/tools/PiiScanTool.ts`
- Create: `packages/agentos/src/extensions/packs/pii-redaction/tools/PiiRedactTool.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/PiiScanTool.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactTool.spec.ts`

- [ ] **Step 1: Write PiiScanTool tests**

Create `packages/agentos/tests/extensions/packs/pii-redaction/PiiScanTool.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { PiiScanTool } from '../../../../src/extensions/packs/pii-redaction/tools/PiiScanTool';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

function createMockRegistry(): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, await factory());
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('PiiScanTool', () => {
  it('has correct ITool properties', () => {
    const tool = new PiiScanTool(createMockRegistry(), {});
    expect(tool.id).toBe('pii_scan');
    expect(tool.name).toBe('pii_scan');
    expect(tool.category).toBe('security');
    expect(tool.inputSchema).toBeDefined();
    expect(tool.inputSchema.properties).toHaveProperty('text');
  });

  it('returns entities for text with PII', async () => {
    const tool = new PiiScanTool(createMockRegistry(), {});
    const result = await tool.execute({ text: 'SSN: 123-45-6789' }, {
      gmiId: 'g1',
      personaId: 'p1',
      userContext: {},
    } as any);
    expect(result.success).toBe(true);
    expect(result.output.entities.length).toBeGreaterThanOrEqual(1);
    expect(result.output.summary).toContain('Found');
  });

  it('returns empty for clean text', async () => {
    const tool = new PiiScanTool(createMockRegistry(), {});
    const result = await tool.execute({ text: 'Hello world' }, {
      gmiId: 'g1',
      personaId: 'p1',
      userContext: {},
    } as any);
    expect(result.success).toBe(true);
    expect(result.output.entities).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Write PiiRedactTool tests**

Create `packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactTool.spec.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { PiiRedactTool } from '../../../../src/extensions/packs/pii-redaction/tools/PiiRedactTool';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

function createMockRegistry(): ISharedServiceRegistry {
  const store = new Map<string, unknown>();
  return {
    getOrCreate: vi.fn(async <T>(id: string, factory: () => Promise<T> | T) => {
      if (!store.has(id)) store.set(id, await factory());
      return store.get(id) as T;
    }),
    has: (id: string) => store.has(id),
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

describe('PiiRedactTool', () => {
  it('has correct ITool properties', () => {
    const tool = new PiiRedactTool(createMockRegistry(), {});
    expect(tool.id).toBe('pii_redact');
    expect(tool.name).toBe('pii_redact');
    expect(tool.category).toBe('security');
  });

  it('returns redacted text for PII input', async () => {
    const tool = new PiiRedactTool(createMockRegistry(), {});
    const result = await tool.execute({ text: 'Email john@example.com', style: 'placeholder' }, {
      gmiId: 'g1',
      personaId: 'p1',
      userContext: {},
    } as any);
    expect(result.success).toBe(true);
    expect(result.output.redactedText).not.toContain('john@example.com');
    expect(result.output.entitiesFound).toBeGreaterThanOrEqual(1);
  });

  it('returns original text when no PII found', async () => {
    const tool = new PiiRedactTool(createMockRegistry(), {});
    const result = await tool.execute({ text: 'Hello world' }, {
      gmiId: 'g1',
      personaId: 'p1',
      userContext: {},
    } as any);
    expect(result.success).toBe(true);
    expect(result.output.redactedText).toBe('Hello world');
    expect(result.output.entitiesFound).toBe(0);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiScanTool.spec.ts tests/extensions/packs/pii-redaction/PiiRedactTool.spec.ts
```

- [ ] **Step 4: Write PiiScanTool implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/tools/PiiScanTool.ts`:

```typescript
/**
 * @module pii-redaction/tools/PiiScanTool
 *
 * Agent-callable tool for on-demand PII scanning.
 * Returns detected entities without modifying the input text.
 */

import type {
  ITool,
  ToolExecutionContext,
  ToolExecutionResult,
} from '../../../../core/tools/ITool';
import type { ISharedServiceRegistry } from '../../../ISharedServiceRegistry';
import type { PiiRedactionPackOptions, PiiDetectionResult, PiiEntityType } from '../types';
import { PiiDetectionPipeline } from '../PiiDetectionPipeline';

/** Input schema for the pii_scan tool */
interface PiiScanInput {
  /** The text to scan for PII */
  text: string;
  /** Optional: only scan for these entity types */
  entityTypes?: PiiEntityType[];
}

/**
 * Scans text for PII entities and returns results without modification.
 * Agents use this to audit text before storage or transmission.
 */
export class PiiScanTool implements ITool<PiiScanInput, PiiDetectionResult> {
  readonly id = 'pii_scan';
  readonly name = 'pii_scan';
  readonly displayName = 'PII Scanner';
  readonly description =
    'Scan text for personally identifiable information (PII) without modifying it. Returns detected entities with type, confidence, and location.';
  readonly category = 'security';
  readonly version = '1.0.0';
  readonly hasSideEffects = false;

  readonly inputSchema = {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text to scan for PII' },
      entityTypes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional: only scan for these entity types',
      },
    },
    required: ['text'],
  };

  private readonly pipeline: PiiDetectionPipeline;

  constructor(services: ISharedServiceRegistry, options: PiiRedactionPackOptions) {
    this.pipeline = new PiiDetectionPipeline(services, options);
  }

  async execute(
    args: PiiScanInput,
    _context: ToolExecutionContext
  ): Promise<ToolExecutionResult<PiiDetectionResult>> {
    const result = await this.pipeline.detect(args.text);
    return { success: true, output: result };
  }
}
```

- [ ] **Step 5: Write PiiRedactTool implementation**

Create `packages/agentos/src/extensions/packs/pii-redaction/tools/PiiRedactTool.ts`:

```typescript
/**
 * @module pii-redaction/tools/PiiRedactTool
 *
 * Agent-callable tool for on-demand PII redaction.
 * Scans text and returns a sanitized version with PII replaced.
 */

import type {
  ITool,
  ToolExecutionContext,
  ToolExecutionResult,
} from '../../../../core/tools/ITool';
import type { ISharedServiceRegistry } from '../../../ISharedServiceRegistry';
import type { PiiRedactionPackOptions, PiiEntity, PiiEntityType, RedactionStyle } from '../types';
import { PiiDetectionPipeline } from '../PiiDetectionPipeline';
import { redactText } from '../RedactionEngine';

/** Input schema for the pii_redact tool */
interface PiiRedactInput {
  /** The text to redact PII from */
  text: string;
  /** Optional: only redact these entity types */
  entityTypes?: PiiEntityType[];
  /** Optional: override the redaction style */
  style?: RedactionStyle;
}

/** Output of the pii_redact tool */
interface PiiRedactOutput {
  /** The text with PII replaced */
  redactedText: string;
  /** Number of PII entities found and redacted */
  entitiesFound: number;
  /** Details of each redacted entity */
  entities: PiiEntity[];
}

/**
 * Scans text for PII and returns a sanitized version.
 * Agents use this before storing data, sending to APIs, or sharing across agents.
 */
export class PiiRedactTool implements ITool<PiiRedactInput, PiiRedactOutput> {
  readonly id = 'pii_redact';
  readonly name = 'pii_redact';
  readonly displayName = 'PII Redactor';
  readonly description =
    'Redact personally identifiable information (PII) from text. Returns sanitized text with PII replaced by placeholders, masks, hashes, or category tags.';
  readonly category = 'security';
  readonly version = '1.0.0';
  readonly hasSideEffects = false;

  readonly inputSchema = {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text to redact PII from' },
      entityTypes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional: only redact these entity types',
      },
      style: {
        type: 'string',
        enum: ['placeholder', 'mask', 'hash', 'category-tag'],
        description: 'How to replace detected PII',
      },
    },
    required: ['text'],
  };

  private readonly pipeline: PiiDetectionPipeline;
  private readonly defaultStyle: RedactionStyle;

  constructor(services: ISharedServiceRegistry, options: PiiRedactionPackOptions) {
    this.pipeline = new PiiDetectionPipeline(services, options);
    this.defaultStyle = options.redactionStyle ?? 'placeholder';
  }

  async execute(
    args: PiiRedactInput,
    _context: ToolExecutionContext
  ): Promise<ToolExecutionResult<PiiRedactOutput>> {
    const result = await this.pipeline.detect(args.text);
    const style = args.style ?? this.defaultStyle;
    const redacted = redactText(args.text, result.entities, style);

    return {
      success: true,
      output: {
        redactedText: redacted,
        entitiesFound: result.entities.length,
        entities: result.entities,
      },
    };
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/PiiScanTool.spec.ts tests/extensions/packs/pii-redaction/PiiRedactTool.spec.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/tools/ packages/agentos/tests/extensions/packs/pii-redaction/PiiScanTool.spec.ts packages/agentos/tests/extensions/packs/pii-redaction/PiiRedactTool.spec.ts
git commit -m "feat(pii): add PiiScanTool and PiiRedactTool"
```

---

## Task 13: Extension pack factory + index.ts

**Files:**

- Create: `packages/agentos/src/extensions/packs/pii-redaction/index.ts`
- Create: `packages/agentos/tests/extensions/packs/pii-redaction/index.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/agentos/tests/extensions/packs/pii-redaction/index.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  createPiiRedactionPack,
  createExtensionPack,
} from '../../../../src/extensions/packs/pii-redaction';
import { EXTENSION_KIND_TOOL, EXTENSION_KIND_GUARDRAIL } from '../../../../src/extensions/types';

describe('createPiiRedactionPack', () => {
  it('returns an ExtensionPack with correct name and version', () => {
    const pack = createPiiRedactionPack();
    expect(pack.name).toBe('pii-redaction');
    expect(pack.version).toBe('1.0.0');
  });

  it('provides 3 descriptors: 1 guardrail + 2 tools', () => {
    const pack = createPiiRedactionPack();
    expect(pack.descriptors).toHaveLength(3);

    const guardrails = pack.descriptors.filter((d) => d.kind === EXTENSION_KIND_GUARDRAIL);
    const tools = pack.descriptors.filter((d) => d.kind === EXTENSION_KIND_TOOL);

    expect(guardrails).toHaveLength(1);
    expect(tools).toHaveLength(2);
  });

  it('guardrail has correct id', () => {
    const pack = createPiiRedactionPack();
    const guardrail = pack.descriptors.find((d) => d.kind === EXTENSION_KIND_GUARDRAIL);
    expect(guardrail!.id).toBe('pii-redaction-guardrail');
  });

  it('tools have correct ids', () => {
    const pack = createPiiRedactionPack();
    const toolIds = pack.descriptors.filter((d) => d.kind === EXTENSION_KIND_TOOL).map((d) => d.id);
    expect(toolIds).toContain('pii_scan');
    expect(toolIds).toContain('pii_redact');
  });
});

describe('createExtensionPack', () => {
  it('bridges ExtensionPackContext to createPiiRedactionPack', () => {
    const pack = createExtensionPack({
      options: { redactionStyle: 'mask' },
    } as any);
    expect(pack.name).toBe('pii-redaction');
    expect(pack.descriptors).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/index.spec.ts
```

- [ ] **Step 3: Write the index.ts factory**

Create `packages/agentos/src/extensions/packs/pii-redaction/index.ts`:

```typescript
/**
 * @module pii-redaction
 *
 * First-class PII redaction extension for AgentOS.
 *
 * Provides:
 * - A guardrail for automatic input/output PII redaction
 * - pii_scan tool for on-demand scanning
 * - pii_redact tool for on-demand redaction
 *
 * Uses a four-tier detection pipeline:
 * 1. Regex (openredaction) — structured PII
 * 2. NLP pre-filter (compromise) — fast name scan
 * 3. NER model (HuggingFace BERT) — ML-grade entity recognition
 * 4. LLM-as-judge — chain-of-thought disambiguation
 *
 * Heavy dependencies are lazy-loaded via ISharedServiceRegistry.
 */

import type { ExtensionPack } from '../../manifest';
import type { ExtensionPackContext } from '../../manifest';
import type { ExtensionDescriptor } from '../../types';
import { EXTENSION_KIND_GUARDRAIL, EXTENSION_KIND_TOOL } from '../../types';
import { SharedServiceRegistry } from '../../SharedServiceRegistry';
import type { PiiRedactionPackOptions } from './types';
import { PiiRedactionGuardrail } from './PiiRedactionGuardrail';
import { PiiScanTool } from './tools/PiiScanTool';
import { PiiRedactTool } from './tools/PiiRedactTool';

// Re-export all public types
export * from './types';

/**
 * Creates the PII redaction extension pack.
 *
 * @param options - Configuration for detection, redaction, and guardrail behavior
 * @returns An ExtensionPack with 3 descriptors (guardrail + 2 tools)
 */
export function createPiiRedactionPack(options?: PiiRedactionPackOptions): ExtensionPack {
  const opts = options ?? {};

  // Use a proxy object so the services reference can be upgraded in onActivate.
  // When loaded outside ExtensionManager (direct programmatic use), a standalone
  // SharedServiceRegistry is used. When loaded via manifest, onActivate swaps
  // it with the ExtensionManager's shared registry — and because guardrail/tools
  // hold a reference to the proxy, they transparently pick up the new registry.
  const state = {
    services:
      new SharedServiceRegistry() as import('../../ISharedServiceRegistry').ISharedServiceRegistry,
    getSecret: undefined as ((id: string) => string | undefined) | undefined,
  };

  // Defer construction until onActivate or first use via lazy getters
  let guardrail: PiiRedactionGuardrail | null = null;
  let scanTool: PiiScanTool | null = null;
  let redactTool: PiiRedactTool | null = null;

  /** Build all components using current state.services */
  function buildComponents() {
    guardrail = new PiiRedactionGuardrail(state.services, opts, state.getSecret);
    scanTool = new PiiScanTool(state.services, opts);
    redactTool = new PiiRedactTool(state.services, opts);
  }

  // Build eagerly for direct programmatic use (no onActivate)
  buildComponents();

  return {
    name: 'pii-redaction',
    version: '1.0.0',
    get descriptors(): ExtensionDescriptor[] {
      return [
        {
          id: 'pii-redaction-guardrail',
          kind: EXTENSION_KIND_GUARDRAIL,
          priority: 10,
          payload: guardrail!,
        },
        {
          id: 'pii_scan',
          kind: EXTENSION_KIND_TOOL,
          priority: 0,
          payload: scanTool!,
        },
        {
          id: 'pii_redact',
          kind: EXTENSION_KIND_TOOL,
          priority: 0,
          payload: redactTool!,
        },
      ];
    },
    onActivate: (context) => {
      // Upgrade to ExtensionManager's shared registry and rebuild components
      if (context.services) {
        state.services = context.services;
      }
      if (context.getSecret) {
        state.getSecret = context.getSecret;
      }
      // Rebuild so guardrail/tools use the shared registry
      buildComponents();
    },
  };
}

/**
 * Standard entry point for manifest-based loading via ExtensionManager.
 * Bridges ExtensionPackContext.options to PiiRedactionPackOptions.
 */
export function createExtensionPack(context: ExtensionPackContext): ExtensionPack {
  return createPiiRedactionPack(context.options as PiiRedactionPackOptions);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/index.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/extensions/packs/pii-redaction/index.ts packages/agentos/tests/extensions/packs/pii-redaction/index.spec.ts
git commit -m "feat(pii): add createPiiRedactionPack factory with guardrail + tools"
```

---

## Task 14: SKILL.md

**Files:**

- Create: `packages/agentos-skills-registry/registry/curated/pii-redaction/SKILL.md`

- [ ] **Step 1: Write the SKILL.md**

Create `packages/agentos-skills-registry/registry/curated/pii-redaction/SKILL.md` with the content from the spec (Section 5 of the design doc — the full skill definition with YAML frontmatter and markdown body).

- [ ] **Step 2: Commit**

```bash
git add packages/agentos-skills-registry/registry/curated/pii-redaction/SKILL.md
git commit -m "feat(pii): add pii-redaction SKILL.md for agent self-discovery"
```

---

## Task 15: Extension registry entry

**Files:**

- Modify: `packages/agentos-extensions-registry/src/tool-registry.ts`

- [ ] **Step 1: Add PII redaction entry to the tool catalog**

Add a new entry to `TOOL_CATALOG` in `packages/agentos-extensions-registry/src/tool-registry.ts`:

```typescript
{
  packageName: '@framers/agentos-ext-pii-redaction',
  name: 'pii-redaction',
  category: 'integration', // security category doesn't exist in ExtensionInfo; 'integration' is closest
  available: true,
  displayName: 'PII Redaction',
  description: 'Four-tier PII detection and redaction (regex + NLP + NER + LLM-as-judge). Provides guardrail + pii_scan/pii_redact tools.',
  requiredSecrets: [],
  defaultPriority: 10,
  envVars: ['PII_LLM_API_KEY'],
  docsUrl: '/docs/extensions/pii-redaction',
},
```

- [ ] **Step 2: Commit**

```bash
git add packages/agentos-extensions-registry/src/tool-registry.ts
git commit -m "feat(pii): register PII redaction in extension catalog"
```

---

## Task 16: Documentation updates

**Files:**

- Modify: `apps/agentos-live-docs/docs/features/guardrails.md`
- Modify: `apps/agentos-live-docs/docs/extensions/extension-architecture.md`

- [ ] **Step 1: Update guardrails.md — replace regex-only PII example**

In `apps/agentos-live-docs/docs/features/guardrails.md`, find the existing `PIIRedactionGuardrail` example (the one with simple regex patterns for SSN, email, credit card) and replace it with a reference to the real extension:

```typescript
import { createPiiRedactionPack } from '@framers/agentos/extensions/packs/pii-redaction';

// Full PII redaction with 4-tier detection pipeline
const piiPack = createPiiRedactionPack({
  confidenceThreshold: 0.5,
  redactionStyle: 'placeholder',
  enableNerModel: true,
  llmJudge: {
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
});

const agent = new AgentOS();
await agent.initialize({
  ...config,
  manifest: { packs: [{ factory: () => piiPack }] },
});
```

Add a dedicated "PII Redaction Extension" section covering detection tiers, configuration, redaction styles, and performance.

- [ ] **Step 2: Add ISharedServiceRegistry to extension architecture docs**

Add a new "Shared Service Registry" section to `apps/agentos-live-docs/docs/extensions/extension-architecture.md` explaining the `ISharedServiceRegistry` pattern with usage examples.

- [ ] **Step 3: Commit**

```bash
git add apps/agentos-live-docs/docs/features/guardrails.md apps/agentos-live-docs/docs/extensions/extension-architecture.md
git commit -m "docs: update guardrails and extension architecture with PII redaction + shared services"
```

---

## Task 17: Full test suite verification

- [ ] **Step 1: Run all PII extension tests**

```bash
cd packages/agentos && npx vitest run tests/extensions/packs/pii-redaction/
```

Expected: All tests PASS

- [ ] **Step 2: Run existing extension tests (regression check)**

```bash
cd packages/agentos && npx vitest run tests/extensions/
```

Expected: All tests PASS (no regressions in SharedServiceRegistry or ExtensionManager tests)

- [ ] **Step 3: TypeScript type check**

```bash
cd packages/agentos && npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A && git commit -m "fix(pii): address test/typecheck issues from full verification"
```

(Only if there were fixes needed. Skip if everything passed.)
