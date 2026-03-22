---
title: 'PII Redaction'
sidebar_position: 18
---

# PII Redaction

Automatic and on-demand detection and redaction of personally identifiable information via a four-tier detection pipeline: regex with checksum validation → NLP pre-filter → ML NER model → LLM-as-judge.

**Package:** `@framers/agentos-ext-pii-redaction`

---

## Overview

The PII Redaction extension provides two modes of operation:

- **Passive protection** via a built-in guardrail that automatically intercepts and sanitizes input and output content
- **Active capability** via two agent-callable tools (`pii_scan`, `pii_redact`) for deliberate, on-demand PII handling

It detects:

- **Structured PII** — SSN, credit card numbers, email addresses, phone numbers, IP addresses, IBAN, passports, driver's licences, government IDs across 50+ countries, dates of birth, API keys, AWS keys, crypto addresses
- **Unstructured PII** — person names, organizations, locations, medical terms (via NER/NLP models)

Heavy dependencies (NLP model, BERT NER model, LLM client) are lazy-loaded and shared across extensions via `ISharedServiceRegistry`, so the extension costs only ~300KB if no names are detected in a session.

---

## Installation

```bash
npm install @framers/agentos-ext-pii-redaction
```

The optional NLP and NER tiers require additional packages:

```bash
# Optional — enables Tier 2 (NLP pre-filter)
npm install compromise

# Optional — enables Tier 3 (ML NER, ~110MB BERT model)
npm install @huggingface/transformers

# Optional — enables Tier 4 (LLM-as-judge)
npm install openai
```

---

## Usage

### Direct factory usage

```typescript
import { AgentOS } from '@framers/agentos';
import { createPiiRedactionGuardrail } from '@framers/agentos-ext-pii-redaction';

const piiPack = createPiiRedactionGuardrail({
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

### Manifest-based loading

```typescript
await agent.initialize({
  manifest: {
    packs: [
      {
        package: '@framers/agentos-ext-pii-redaction',
        options: {
          redactionStyle: 'mask',
          enableNerModel: false,
        },
      },
    ],
  },
});
```

### Via curated registry

```typescript
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

const manifest = await createCuratedManifest({
  tools: ['pii-redaction'],
  channels: 'none',
});
```

---

## Configuration

All fields are optional. The factory is safe to call with no arguments for sensible defaults.

### `PiiRedactionPackOptions`

| Option                    | Type                                                  | Default         | Description                                                                                                                               |
| ------------------------- | ----------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `entityTypes`             | `PiiEntityType[]`                                     | all types       | Restrict detection to specific entity types. When omitted, all supported types are enabled.                                               |
| `confidenceThreshold`     | `number`                                              | `0.5`           | Minimum confidence score to trigger redaction. Entities below this threshold are discarded. Applied after LLM judge resolution.           |
| `redactionStyle`          | `'placeholder' \| 'mask' \| 'hash' \| 'category-tag'` | `'placeholder'` | How to replace detected PII in output text.                                                                                               |
| `allowlist`               | `string[]`                                            | `[]`            | Terms to never flag as PII (e.g., product names). Case-insensitive string matching against detected entity text. Reduces false positives. |
| `denylist`                | `string[]`                                            | `[]`            | Terms to always flag as PII regardless of confidence. Case-insensitive. Ensures critical terms are never missed.                          |
| `enableNerModel`          | `boolean`                                             | `true`          | Whether to load and use the BERT NER model (Tier 3). Set to `false` in low-resource environments to skip the ~110MB model.                |
| `llmJudge`                | `LlmJudgeConfig`                                      | `undefined`     | Configuration for the LLM-as-judge tier. When omitted, Tier 4 is disabled entirely.                                                       |
| `guardrailScope`          | `'input' \| 'output' \| 'both'`                       | `'both'`        | Which direction(s) the guardrail applies to.                                                                                              |
| `evaluateStreamingChunks` | `boolean`                                             | `true`          | Whether to evaluate TEXT_DELTA chunks in real-time during streaming. When `false`, only FINAL_RESPONSE is evaluated.                      |
| `maxStreamingEvaluations` | `number`                                              | `50`            | Rate limit for streaming evaluations per request. With sentence-boundary buffering, each evaluation covers a full sentence.               |

### `LlmJudgeConfig`

| Option           | Type     | Default | Description                                                                                    |
| ---------------- | -------- | ------- | ---------------------------------------------------------------------------------------------- |
| `provider`       | `string` | —       | LLM provider identifier (e.g., `'openai'`, `'anthropic'`, `'openrouter'`, `'ollama'`).         |
| `model`          | `string` | —       | Model ID to use for PII classification (e.g., `'claude-haiku-4-5-20251001'`, `'gpt-4o-mini'`). |
| `apiKey`         | `string` | —       | API key. Falls back to `getSecret('pii.llm.apiKey')` if omitted.                               |
| `baseUrl`        | `string` | —       | Base URL override for self-hosted or proxy endpoints.                                          |
| `maxConcurrency` | `number` | `3`     | Maximum concurrent LLM calls for PII classification.                                           |
| `cacheSize`      | `number` | `500`   | LRU cache size for repeat pattern results, keyed by `(span_text, context_hash)`.               |

---

## Detection Tiers

The pipeline runs four tiers in sequence. Each tier feeds its results to the next, and a final EntityMerger deduplicates overlapping spans before the confidence threshold is applied.

### Tier 1 — Regex (always runs, ~0ms)

**Dependency:** `openredaction` (required)

Detects structured PII using regex patterns with checksum validation (Luhn for credit cards, country-specific SSN formats, etc.). Context enhancement then scans ±50 characters around each match for keywords (`"social security" → +0.2`, `"name:" → +0.2`, `"date of birth" → +0.2`) to boost confidence scores.

Detected types: `SSN`, `CREDIT_CARD`, `EMAIL`, `PHONE`, `IP_ADDRESS`, `IBAN`, `PASSPORT`, `DRIVERS_LICENSE`, `GOV_ID`, `DATE_OF_BIRTH`, `API_KEY`, `AWS_KEY`, `CRYPTO_ADDRESS`

### Tier 2 — NLP Pre-filter (lazy, ~250KB)

**Dependency:** `compromise` (optional)

Fast rule-based NLP scan that identifies candidate tokens that might be names, places, or organizations. This tier acts as a gate: Tier 3 (the heavy BERT model) only runs if Tier 2 found at least one `PERSON`, `ORGANIZATION`, or `LOCATION` candidate. In most agent messages that contain no person names, the 110MB NER model never loads.

### Tier 3 — NER Model (lazy, ~110MB)

**Dependency:** `@huggingface/transformers` (optional)

A quantized BERT NER model (`q8`, ~110MB) from HuggingFace Transformers for ML-grade entity recognition. Only runs when Tier 2 identified candidates, making the worst-case memory cost opt-in rather than constant.

Detected types: `PERSON`, `ORGANIZATION`, `LOCATION`, `MEDICAL_TERM`

### Tier 4 — LLM Judge (lazy, per-call cost)

**Dependency:** `openai` (optional)

A lightweight LLM resolves ambiguous cases — entities where the merged confidence score from Tiers 1–3 falls in the 0.3–0.7 range. Uses chain-of-thought prompting to analyze context: "Is 'Jordan' a person's name, a country, or a basketball reference in this sentence?"

When the LLM returns `NOT_PII`, the entity is discarded (treated as a false positive). When it confirms PII, the entity's `score` and `entityType` are updated with the LLM's values. Results are cached (LRU, default 500 entries) to avoid repeat calls for identical patterns.

Note: `confidenceThreshold` is applied **after** LLM judge resolution, giving the judge a chance to resolve ambiguity before threshold filtering.

---

## Redaction Styles

| Style          | Input        | Output                              | Notes                                                                                                                                                                 |
| -------------- | ------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`  | `John Smith` | `[PERSON]`                          | Simple type tag. Default.                                                                                                                                             |
| `mask`         | `John Smith` | `J*** S****`                        | First letter kept, rest masked.                                                                                                                                       |
| `hash`         | `John Smith` | `[PERSON:a1b2c3d4e5]`               | Deterministic SHA-256 (10 hex chars). Same entity always produces the same hash — enables cross-document correlation without revealing original text. Not reversible. |
| `category-tag` | `John Smith` | `<PII type="PERSON">REDACTED</PII>` | XML-style tag. Useful for structured downstream parsing.                                                                                                              |

---

## Agent Tools

The pack registers two agent-callable tools alongside the guardrail.

### `pii_scan`

Scan text for PII and return detected entities without modifying the input. Use this to audit data before storage or before passing to external APIs.

```
Agent: I'll scan this customer record for PII before storing it.
→ pii_scan({ text: "Contact John Smith at john@example.com, SSN 123-45-6789" })
← {
    entities: [
      { entityType: "PERSON", text: "John Smith", score: 0.95, source: "ner-model" },
      { entityType: "EMAIL", text: "john@example.com", score: 1.0, source: "regex" },
      { entityType: "SSN", text: "123-45-6789", score: 1.0, source: "regex" }
    ],
    summary: "Found 3 PII entities: 1 PERSON, 1 EMAIL, 1 SSN",
    processingTimeMs: 42,
    tiersExecuted: ["regex", "nlp-prefilter", "ner-model"]
  }
```

### `pii_redact`

Scan text for PII and return a sanitized version with detected entities replaced according to the configured redaction style. Supports an optional per-call style override.

```
Agent: Let me redact the PII from this before saving.
→ pii_redact({
    text: "Email john@acme.com about the 4111-1111-1111-1111 charge",
    style: "placeholder"
  })
← {
    redactedText: "Email [EMAIL] about the [CREDIT_CARD] charge",
    entitiesFound: 2,
    entities: [...]
  }
```

Agents should use `pii_redact` before:

- Storing user data in memory or databases
- Passing text to untrusted third-party extensions
- Sharing content across agents in multi-agent systems
- Responding with user-provided data that may contain PII

---

## Shared Service Registry Integration

Heavy dependencies are loaded once and shared across extensions via `ISharedServiceRegistry` on `ExtensionLifecycleContext`. This means if another extension (e.g., a sentiment analyzer) also uses the `compromise` NLP library, it calls `context.services.getOrCreate('agentos:nlp:compromise', factory)` and receives the same cached instance — zero additional memory.

The PII extension registers three service IDs:

| Service ID                 | Dependency                  | Size   |
| -------------------------- | --------------------------- | ------ |
| `agentos:nlp:compromise`   | `compromise`                | ~250KB |
| `agentos:nlp:ner-pipeline` | `@huggingface/transformers` | ~110MB |
| `agentos:pii:llm-client`   | `openai`                    | ~5MB   |

Concurrent calls to `getOrCreate` with the same service ID are coalesced — only one factory invocation occurs, and all callers await the same promise.

---

## Performance

| Component                           | Memory     | When Loaded                                  |
| ----------------------------------- | ---------- | -------------------------------------------- |
| RegexRecognizer (openredaction)     | ~50KB      | Always (pack activation)                     |
| NlpPrefilterRecognizer (compromise) | ~250KB     | First message with text to scan              |
| NerModelRecognizer (BERT q8)        | ~110MB     | First time compromise finds name-like tokens |
| LlmJudgeRecognizer (openai client)  | ~5MB       | First ambiguous span (score 0.3–0.7)         |
| **Total if no names detected**      | **~300KB** | —                                            |
| **Total worst case (all tiers)**    | **~115MB** | —                                            |

For memory-constrained environments, set `enableNerModel: false` and omit `llmJudge`. The pipeline degrades gracefully to regex + optional LLM judge, which remains effective for all structured PII types.

The streaming guardrail uses sentence-boundary buffering (splits on `. `, `? `, `! `, `\n`) to avoid partial-word false positives. Buffers are scoped per-request (keyed by `sessionId + conversationId`) and cleaned up on stream end or after a 30-second timeout.

---

## Optional Dependency Fallback

| Dependency                  | Missing Behavior                                                                                              | Impact                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `openredaction`             | **Required** — pack fails to load with a clear error message                                                  | Extension cannot function without the regex tier               |
| `compromise`                | Tier 2 skipped, warning logged. Tier 3 runs unconditionally on all text instead of being gated by pre-filter. | Higher NER costs but no loss of detection accuracy             |
| `@huggingface/transformers` | Tier 3 skipped, warning logged. Only regex + LLM judge available for name detection.                          | Reduced recall for unstructured PII (names, orgs)              |
| `openai`                    | Tier 4 skipped, warning logged. Ambiguous entities use their raw confidence score without LLM resolution.     | Some false positives/negatives in the 0.3–0.7 confidence range |

---

## Related Documentation

- [Guardrails](/docs/features/guardrails)
- [Extension Architecture](/docs/extensions/extension-architecture)
- [Extensions Overview](/docs/extensions/overview)
- [Safety Primitives](/docs/features/safety-primitives)
