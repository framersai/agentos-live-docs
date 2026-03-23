# Guardrail Extension Packs Implementation

## Goal

Implement all 5 guardrail extension packs (currently stubs) and add sentence boundary buffering to the streaming evaluator. The core framework (two-phase dispatch, input/output, streaming eval, timeouts, rate limiting) already works — this fills in the actual detector implementations.

## Architecture

Each pack exports `createExtensionPack()` returning `{ descriptors: [{ kind: 'guardrail', payload: IGuardrailService }] }`. ML-dependent packs use `@huggingface/transformers` for local ONNX inference when available, falling back to LLM-as-judge via the shared `llmInvoker` callback pattern. Pure regex packs have zero external dependencies.

## Pack 1: Code Safety (`@framers/agentos-ext-code-safety`)

Regex-based code risk scanning. Scans fenced code blocks and tool args for dangerous patterns.

**Patterns:**

- SQL injection: `' OR 1=1`, `UNION SELECT`, `DROP TABLE`, `; --`
- Command injection: `` `rm -rf` ``, `$(...)`, `| sh`, `curl | bash`
- Path traversal: `../`, `..\\`, `%2e%2e`
- XSS: `<script>`, `onerror=`, `javascript:`
- SSRF: `http://169.254.169.254`, `http://localhost`, `file:///`
- Dangerous ops: `eval(`, `exec(`, `chmod 777`, `dd if=`, `mkfs`
- Crypto/exfil: reverse shells, `nc -e`, `curl -d @`, base64-encoded payloads

**Behavior:**

- Scans both input and output
- `canSanitize: false` (classifier only — flags or blocks, doesn't rewrite code)
- `evaluateStreamingChunks: true`
- Returns `FLAG` for low-risk matches, `BLOCK` for high-risk (reverse shells, data exfil)

**Files:**

- `packages/agentos-ext-code-safety/src/index.ts` — factory + CodeSafetyGuardrail class
- `packages/agentos-ext-code-safety/src/patterns.ts` — regex pattern definitions
- `packages/agentos-ext-code-safety/test/code-safety.spec.ts`

---

## Pack 2: PII Redaction (`@framers/agentos-ext-pii-redaction`)

4-tier PII detection with progressive depth. Sanitizer mode replaces PII with `[REDACTED:TYPE]`.

**Tier 1 (Regex):** Always active

- SSN: `\d{3}-\d{2}-\d{4}`
- Credit cards: Luhn-validated 13-19 digit sequences
- Email: standard email regex
- Phone: US/international phone patterns
- IP addresses: IPv4 and IPv6

**Tier 2 (Keyword + context):** Always active

- "my name is [NAME]" — extracts NAME
- "I live at [ADDRESS]" — extracts ADDRESS
- Date of birth near "born", "birthday", "DOB"
- "my SSN/passport/license number is..."

**Tier 3 (NER):** Optional — requires `@huggingface/transformers`

- Model: `Xenova/bert-base-NER` (ONNX)
- Entities: PERSON, ORGANIZATION, LOCATION, MISC
- Falls back to Tier 1-2 if model unavailable

**Tier 4 (LLM):** Optional — requires `llmInvoker` in extension context

- Prompt: "Identify any PII in this text. Return JSON array of { type, value, startIndex, endIndex }"
- Catches subtle PII that regex/NER miss (e.g., "I work at the blue building on 5th and Main")
- Falls back to Tier 1-3 if LLM unavailable

**Behavior:**

- `canSanitize: true` — replaces detected PII with `[REDACTED:EMAIL]`, `[REDACTED:SSN]`, etc.
- Runs in Phase 1 (sequential sanitizer)
- `evaluateStreamingChunks: true`
- Companion tool: `pii_scan` (returns detected PII without redacting)

**Files:**

- `packages/agentos-ext-pii-redaction/src/index.ts` — factory + PiiRedactionGuardrail class
- `packages/agentos-ext-pii-redaction/src/patterns.ts` — regex patterns for Tier 1-2
- `packages/agentos-ext-pii-redaction/src/ner.ts` — NER model loader (Tier 3)
- `packages/agentos-ext-pii-redaction/src/llm-judge.ts` — LLM PII detection (Tier 4)
- `packages/agentos-ext-pii-redaction/test/pii-redaction.spec.ts`

---

## Pack 3: ML Classifiers (`@framers/agentos-ext-ml-classifiers`)

Multi-label content classification for toxicity, prompt injection, and NSFW.

**Primary (ONNX):** `@huggingface/transformers` with toxic-bert or similar

- Loads model on first evaluation (lazy init)
- Returns confidence scores per category
- Categories: `toxic`, `severe_toxic`, `obscene`, `threat`, `insult`, `identity_hate`

**Fallback (LLM):** Structured JSON prompt

- "Classify this text. Return JSON: { toxic: bool, injection: bool, nsfw: bool, confidence: float, categories: string[] }"

**Behavior:**

- `canSanitize: false` (classifier only)
- Runs in Phase 2 (parallel)
- `evaluateStreamingChunks: false` (too expensive per-chunk; evaluates final response)
- `FLAG` if any category > 0.5 confidence, `BLOCK` if > 0.8
- Companion tool: `classify_content` (returns classification scores)

**Files:**

- `packages/agentos-ext-ml-classifiers/src/index.ts` — factory + MLClassifierGuardrail class
- `packages/agentos-ext-ml-classifiers/src/onnx-classifier.ts` — ONNX model wrapper
- `packages/agentos-ext-ml-classifiers/src/llm-classifier.ts` — LLM fallback
- `packages/agentos-ext-ml-classifiers/test/ml-classifiers.spec.ts`

---

## Pack 4: Topicality (`@framers/agentos-ext-topicality`)

Embedding-based topic enforcement and session drift detection.

**Config (passed via options):**

```typescript
{
  allowedTopics: ['customer support', 'product questions', 'billing'],
  blockedTopics: ['politics', 'religion', 'medical advice'],
  minSimilarity: 0.3,   // min cosine sim to any allowed topic
  maxBlockedSimilarity: 0.5, // max cosine sim to any blocked topic
}
```

**Primary (Embeddings):** Embed input text + topic strings, compare cosine similarity

- Uses agent's configured embedding provider (EmbeddingManager) if available
- Falls back to `@huggingface/transformers` sentence-transformers model

**Fallback (LLM):** Structured prompt

- "Is this message about [allowed topics]? Return JSON: { onTopic: bool, confidence: float, detectedTopic: string, reason: string }"

**Behavior:**

- `canSanitize: false`
- Runs in Phase 2 (parallel)
- Evaluates input only (not output — the agent should stay on topic regardless)
- `FLAG` if below similarity threshold, `BLOCK` if matches blocked topic
- Companion tool: `check_topic` (returns topic analysis)

**Files:**

- `packages/agentos-ext-topicality/src/index.ts` — factory + TopicalityGuardrail class
- `packages/agentos-ext-topicality/src/embeddings.ts` — embedding + cosine similarity
- `packages/agentos-ext-topicality/test/topicality.spec.ts`

---

## Pack 5: Grounding Guard (`@framers/agentos-ext-grounding-guard`)

NLI-based hallucination detection against RAG sources.

**Input:** `GuardrailOutputPayload.ragSources` (already passed by framework)

**Pipeline:**

1. Split generated output into sentences (claim extraction)
2. For each claim, compare against each RAG source chunk
3. Classify: ENTAILED (supported) / CONTRADICTED / NEUTRAL (no evidence)

**Primary (NLI):** `@huggingface/transformers` with `Xenova/nli-deberta-v3-small`

- Premise: RAG source chunk
- Hypothesis: generated sentence (claim)
- Returns: entailment/contradiction/neutral probabilities

**Fallback (LLM):** Structured prompt

- "Given source: [chunk]. Is this claim supported: [sentence]? Return JSON: { verdict: 'supported'|'contradicted'|'unsupported', confidence: float, evidence: string }"

**Behavior:**

- Output-only (no input evaluation)
- `canSanitize: false`
- `evaluateStreamingChunks: false` (needs full response to extract claims)
- `FLAG` if >30% claims ungrounded, `BLOCK` if >60% contradicted
- Companion tool: `check_grounding` (returns per-claim verdicts)

**Files:**

- `packages/agentos-ext-grounding-guard/src/index.ts` — factory + GroundingGuardrail class
- `packages/agentos-ext-grounding-guard/src/nli.ts` — NLI model wrapper
- `packages/agentos-ext-grounding-guard/src/claim-extractor.ts` — sentence splitting
- `packages/agentos-ext-grounding-guard/test/grounding.spec.ts`

---

## Sentence Boundary Buffering (Framework Enhancement)

**File:** `packages/agentos/src/core/guardrails/SentenceBoundaryBuffer.ts`

```typescript
class SentenceBoundaryBuffer {
  private buffer: string = '';
  private previousSentence: string = '';

  push(chunk: string): string | null {
    this.buffer += chunk;
    const boundary = this.detectBoundary(this.buffer);
    if (boundary === -1) return null; // keep buffering

    const sentence = this.buffer.slice(0, boundary + 1).trim();
    this.buffer = this.buffer.slice(boundary + 1);
    const evalPayload = this.previousSentence ? `${this.previousSentence} ${sentence}` : sentence;
    this.previousSentence = sentence;
    return evalPayload;
  }

  private detectBoundary(text: string): number {
    // Find last sentence-ending punctuation
    for (let i = text.length - 1; i >= 0; i--) {
      if ('.?!\n'.includes(text[i])) return i;
    }
    return -1;
  }

  flush(): string | null {
    if (!this.buffer.trim()) return null;
    const result = this.previousSentence
      ? `${this.previousSentence} ${this.buffer.trim()}`
      : this.buffer.trim();
    this.buffer = '';
    return result;
  }
}
```

**Integration:** Add `streamingMode` to `GuardrailConfig`:

```typescript
streamingMode?: 'per-chunk' | 'sentence-buffered'; // default: 'per-chunk'
```

When `sentence-buffered`, the `ParallelGuardrailDispatcher` uses `SentenceBoundaryBuffer` to accumulate chunks and only evaluates at sentence boundaries.

**Files:**

- `packages/agentos/src/core/guardrails/SentenceBoundaryBuffer.ts`
- `packages/agentos/tests/core/guardrails/SentenceBoundaryBuffer.spec.ts`
- Modify: `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts` — integrate buffer
- Modify: `packages/agentos/src/core/guardrails/IGuardrailService.ts` — add `streamingMode` to config

## Shared Dependencies

| Dependency                  | Used By                                          | Type                         |
| --------------------------- | ------------------------------------------------ | ---------------------------- |
| `@huggingface/transformers` | PII (NER), ML Classifiers, Topicality, Grounding | Optional peer dep            |
| `llmInvoker` callback       | All packs (fallback)                             | Passed via extension context |

`@huggingface/transformers` is already an optional dependency of `@framers/agentos`. Each pack lazy-loads it and falls back to LLM if unavailable.

## Error Handling

- Model load failure → log warning, fall back to LLM or regex-only
- LLM fallback failure → return `null` (no evaluation, fail-open)
- Timeout per-guardrail → handled by existing `callWithTimeout()` in dispatcher
- All packs are non-blocking — a failed guardrail never crashes the pipeline

## Testing Strategy

Each pack tested with:

- Known-bad inputs (should detect)
- Known-good inputs (should pass)
- Edge cases (borderline content)
- Fallback behavior (mock `@huggingface/transformers` as unavailable)
- Integration with `ParallelGuardrailDispatcher` (register pack, run evaluation)
