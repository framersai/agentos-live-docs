# Grounding Guard Extension — Design Specification

**Date:** 2026-03-21
**Status:** Approved
**Author:** Claude (brainstorming session)
**Sub-project:** 5 of 5 (SOTA Guardrails Parity)

## Summary

A hallucination/grounding verification guardrail for AgentOS that detects unfaithful claims in LLM output by checking them against RAG source documents. Uses a hybrid NLI cross-encoder + LLM-as-judge pipeline: fast NLI model classifies (claim, source) pairs as entailment/contradiction/neutral, LLM escalation resolves ambiguous cases. Claims are extracted via heuristic sentence splitting with LLM decomposition for complex sentences.

Requires new typed RAG source plumbing: `ragSources?: RagRetrievedChunk[]` on `AgentOSFinalResponseChunk` and `GuardrailOutputPayload`, threaded from GMI through the response stream to the guardrail layer.

Self-contained AgentOS extension pack. No Wunderland dependency.

## Goals

1. **RAG source plumbing (Path B)** — add typed `ragSources?: RagRetrievedChunk[]` to `AgentOSFinalResponseChunk` and `GuardrailOutputPayload`, threaded from GMI retrieval through response stream to guardrails
2. **Hybrid claim verification** — NLI cross-encoder (`cross-encoder/nli-deberta-v3-small`, ~40MB) for fast entailment/contradiction detection (~30ms per pair), LLM-as-judge escalation for ambiguous claims
3. **Hybrid claim extraction** — heuristic sentence splitting for simple sentences, LLM decomposition for complex compound sentences (>20 words, multiple clauses)
4. **Streaming + final evaluation** — sentence-boundary NLI during streaming (fast first-pass), comprehensive claim extraction + NLI + LLM escalation on final response
5. **Grounding metrics** — per-claim verdicts (supported/contradicted/unverifiable), aggregate faithfulness ratio, source attribution per claim
6. **Thorough TSDoc/JSDoc comments** and inline comments everywhere

## Non-Goals

- Fact-checking against external knowledge (that's the existing FactCheckTool's job)
- Replacing the DualLLMAuditor's LLM-based hallucination heuristic (it serves a different purpose — world-knowledge checks)
- Citation generation or formatting (just verification, not output modification)
- Training custom NLI models
- Grounding for non-RAG responses (no sources → no-op)

---

## Architecture

### 1. RAG Source Plumbing

This is the prerequisite infrastructure change that benefits the entire guardrail ecosystem.

**Location:** Multiple files across AgentOS core

#### 1.1 AgentOSFinalResponseChunk extension

**File:** `packages/agentos/src/api/types/AgentOSResponse.ts`

```typescript
export interface AgentOSFinalResponseChunk extends AgentOSResponseChunk {
  // ... existing fields (finalResponseText, reasoningTrace, usage, audioOutput, etc.)

  /**
   * RAG source chunks that were used to generate this response.
   *
   * Populated by the GMI when RAG retrieval was performed for this request.
   * Contains the structured chunk data (content, document ID, source metadata,
   * relevance score) from the RetrievalAugmentor.
   *
   * Used by grounding guardrails to verify response faithfulness against
   * the retrieved source documents. When no RAG retrieval was performed,
   * this field is undefined.
   */
  ragSources?: import('../../rag').RagRetrievedChunk[];
}
```

#### 1.2 GuardrailOutputPayload extension

**File:** `packages/agentos/src/core/guardrails/IGuardrailService.ts`

```typescript
export interface GuardrailOutputPayload {
  context: GuardrailContext;
  chunk: AgentOSResponse;

  /**
   * RAG source chunks retrieved for this request.
   *
   * Available to output guardrails for grounding verification.
   * Populated by the orchestrator from the RAG retrieval result.
   * Persists across all chunks in a stream (not just the final chunk).
   *
   * When no RAG retrieval was performed, this field is undefined.
   */
  ragSources?: import('../../rag').RagRetrievedChunk[];
}
```

#### 1.3 Threading through the pipeline

**GMI.ts** (~5 lines): After `retrieveContext()` returns `ragResult`, store `ragResult.retrievedChunks` in a request-scoped variable. Attach to the final response chunk's `ragSources` field.

**GuardrailOutputOptions** (~2 lines): Add `ragSources?: RagRetrievedChunk[]` to the `GuardrailOutputOptions` type in `guardrailDispatcher.ts`.

**ParallelGuardrailDispatcher.wrapOutput** (~10 lines): Thread `ragSources` from options into every `GuardrailOutputPayload` at all 4 call sites where the payload is constructed (streaming sanitizer eval, streaming parallel eval, final sanitizer eval, final parallel eval). Each call site spreads `ragSources` into the payload object.

**AgentOS.processRequest** (~2 lines): Pass the stored `retrievedChunks` into `wrapOutputGuardrails` options.

Total: ~20 lines across 4 files. Fully backwards compatible — both fields are optional.

**Note on ragSources placement:** `ragSources` lives on `GuardrailOutputPayload` (payload-level), NOT duplicated on individual chunk types. This ensures streaming TEXT_DELTA evaluations have access to sources (even though the chunk itself is a TEXT_DELTA, not a FINAL_RESPONSE). The `AgentOSFinalResponseChunk.ragSources` field is retained for non-guardrail consumers (logging, analytics, UI source display) but the guardrail reads from the payload, not the chunk.

---

### 2. ClaimExtractor

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/ClaimExtractor.ts`

```typescript
/**
 * Decomposes text into atomic factual claims for grounding verification.
 *
 * Two-tier extraction:
 * 1. Heuristic sentence splitting for simple sentences (≤20 words, single clause)
 *    - Splits on sentence boundaries (. ? ! \n)
 *    - Filters non-factual content (questions, hedges, meta, greetings, code blocks)
 *    - Simple sentences pass through as-is
 *
 * 2. LLM decomposition for complex sentences (>20 words or multiple clauses)
 *    - Detected by: word count > 20, conjunctions splitting clauses,
 *      multiple numbers or proper nouns
 *    - Sent to lightweight LLM with structured decomposition prompt
 *    - Returns array of atomic claims
 *
 * When no LLM is configured, all sentences use heuristic mode (no decomposition).
 */
export class ClaimExtractor {
  /**
   * @param llmFn - Optional LLM function for complex sentence decomposition.
   *                If omitted, all sentences use heuristic mode.
   */
  constructor(llmFn?: (prompt: string) => Promise<string>);

  /**
   * Extract atomic factual claims from text.
   *
   * @param text - The response text to extract claims from
   * @returns Array of extracted claims with source offsets
   */
  async extract(text: string): Promise<ExtractedClaim[]>;
}

/**
 * An atomic factual claim extracted from response text.
 */
export interface ExtractedClaim {
  /** The atomic factual claim text */
  claim: string;
  /** Character offset in the original response text */
  sourceOffset: number;
  /** Whether LLM decomposition was used (vs heuristic pass-through) */
  decomposed: boolean;
}
```

**Heuristic filters** (sentences that are NOT factual claims):

- Questions: ends with `?`
- Hedges: starts with "I think", "maybe", "perhaps", "it seems", "I believe"
- Meta: "I hope this helps", "let me know if", "feel free to", "here's"
- Greetings: "hello", "hi there", "sure!", "great question", "of course"
- Code blocks: anything inside ` ``` ` fences

**Complexity detection** (triggers LLM decomposition):

- Word count > 20
- Contains independent-clause conjunctions: ", and ", "; ", " while ", " however ", " additionally "
- Contains 3+ numbers or proper nouns (capitalized words)

**LLM decomposition prompt:**

```
Extract all independent factual claims from this sentence.
Return a JSON array of strings, one claim per entry.
Only include factual assertions, not opinions or hedges.
If the sentence is a single simple fact, return it as-is in a one-element array.

Sentence: "{sentence}"
```

---

### 3. GroundingChecker

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/GroundingChecker.ts`

```typescript
/**
 * Verifies claims against source documents using NLI + LLM escalation.
 *
 * Two-tier verification pipeline:
 *
 * Tier 1: NLI Cross-Encoder (fast, ~30ms per claim-source pair)
 *   Model: cross-encoder/nli-deberta-v3-small (~40MB, INT8 quantized)
 *   Input: pipeline({ text: claim, text_pair: source_text }) → entailment / contradiction / neutral
 *   - entailment score > threshold → SUPPORTED
 *   - contradiction score > threshold → CONTRADICTED
 *   - neither above threshold → AMBIGUOUS (escalate to Tier 2)
 *
 * Tier 2: LLM-as-Judge (for ambiguous claims only, ~150-500ms)
 *   Chain-of-thought prompt comparing claim against source
 *   Returns: SUPPORTED / CONTRADICTED / UNVERIFIABLE with reasoning
 *
 * For each claim, all source chunks are compared in parallel.
 * The best-matching source (highest entailment score) is returned
 * as the attribution for that claim.
 */
export class GroundingChecker {
  constructor(services: ISharedServiceRegistry, options?: GroundingCheckerOptions);

  /**
   * Verify a single claim against source documents.
   * Compares against each source chunk, takes the best match.
   */
  async checkClaim(claim: string, sources: RagRetrievedChunk[]): Promise<ClaimVerification>;

  /**
   * Verify multiple claims. Runs claims in parallel.
   */
  async checkClaims(
    claims: ExtractedClaim[],
    sources: RagRetrievedChunk[]
  ): Promise<ClaimVerification[]>;

  /** Release NLI model resources */
  async dispose(): Promise<void>;
}

/**
 * Verdict for a single claim's grounding status.
 */
export type GroundingVerdict = 'supported' | 'contradicted' | 'unverifiable';

/**
 * Result of verifying a single claim against source documents.
 */
export interface ClaimVerification {
  /** The claim that was checked */
  claim: string;
  /** Grounding verdict */
  verdict: GroundingVerdict;
  /** Confidence score (0.0–1.0) */
  confidence: number;
  /** Best matching source chunk (null if unverifiable) */
  bestSource: {
    chunkId: string;
    content: string;
    score: number;
  } | null;
  /** Whether LLM escalation was used for this claim */
  escalated: boolean;
  /** LLM reasoning (only present when escalated) */
  reasoning?: string;
}
```

**NLI model loading** — same `ISharedServiceRegistry` pattern:

```typescript
const nliPipeline = await services.getOrCreate(
  GROUNDING_SERVICE_IDS.NLI_PIPELINE,
  async () => {
    const { pipeline } = await import('@huggingface/transformers');
    return pipeline('text-classification', 'cross-encoder/nli-deberta-v3-small', {
      quantized: true,
    });
  },
  { dispose: async (p: any) => p?.dispose?.(), tags: ['ml', 'nli', 'grounding'] }
);
```

**Claim × source comparison:**

For each claim, compare against the top N source chunks (default 5, sorted by relevance score). When `relevanceScore` is undefined on a chunk, it defaults to `1.0` (assume maximum relevance — the retrieval system returned it for a reason):

```
Claim: "The API rate limit is 1000 req/min"

Source 1 (relevance 0.91): "Premium users get 1000 requests per minute"
  → NLI: entailment 0.92 → SUPPORTED

Source 2 (relevance 0.85): "Free tier is limited to 500 req/min"
  → NLI: contradiction 0.78 → (not best match, source 1 wins)

Best match: Source 1, verdict: SUPPORTED, confidence: 0.92
```

If NO source produces entailment or contradiction above threshold → verdict is `unverifiable`.

**LLM escalation prompt** (for ambiguous claims):

```
You are a grounding verification expert. Determine whether the claim
is supported by, contradicts, or is unverifiable from the source text.

Claim: "{claim}"
Source: "{source_text}"

Analyze step by step:
1. What does the claim assert?
2. Does the source explicitly support, contradict, or not address this?
3. Are there any subtle contradictions or missing context?

Respond with JSON:
{
  "verdict": "supported" | "contradicted" | "unverifiable",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}
```

---

### 4. GroundingGuardrail

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/GroundingGuardrail.ts`

```typescript
/**
 * IGuardrailService implementation for hallucination/grounding detection.
 *
 * Streaming phase (TEXT_DELTA):
 * - Sentence-boundary buffer (same pattern as PII guardrail)
 * - On each complete sentence: filter non-factual, run NLI against ragSources
 * - Contradiction → FLAG immediately (fast first-pass)
 *
 * Final phase (isFinal / FINAL_RESPONSE):
 * - Full claim extraction (heuristic + LLM for complex)
 * - Comprehensive NLI against ragSources
 * - LLM escalation for ambiguous claims
 * - Aggregate: any contradicted → FLAG/BLOCK, >50% unverifiable → FLAG
 *
 * Only runs when ragSources are present. No sources → no-op.
 *
 * canSanitize: false — runs in Phase 2 (parallel).
 * Priority 8 — runs late, most expensive guardrail.
 *
 * Reason codes:
 * - GROUNDING_CONTRADICTION: claim contradicts a source
 * - GROUNDING_UNVERIFIABLE: too many claims not found in sources
 * - GROUNDING_NO_SOURCES: informational flag when response has no RAG sources
 */
export class GroundingGuardrail implements IGuardrailService {
  readonly config: GuardrailConfig = {
    evaluateStreamingChunks: true,
    canSanitize: false,
  };

  constructor(services: ISharedServiceRegistry, options: GroundingGuardOptions);

  /**
   * Always returns null. Grounding verification only applies to output —
   * cannot verify faithfulness of user input against RAG sources.
   */
  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null>;

  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null>;
}
```

**Streaming behavior detail:**

```
TEXT_DELTA arrives
    │
    ├── Append to sentence buffer
    │
    ├── Sentence boundary detected? (". ", "? ", "! ", "\n")
    │     │
    │     ├── No → return null (keep accumulating)
    │     │
    │     └── Yes → extract sentence
    │           │
    │           ├── Is it a factual claim? (filter questions/hedges/meta)
    │           │     │
    │           │     ├── No → skip, return null
    │           │     │
    │           │     └── Yes → NLI against top-5 ragSources
    │           │           │
    │           │           ├── Contradiction > 0.7 → FLAG (GROUNDING_CONTRADICTION)
    │           │           ├── Entailment > 0.7 → pass (supported)
    │           │           └── Neutral → defer to final phase
    │           │
    │           └── Reset sentence buffer
    │
    └── return null or FLAG

isFinal arrives
    │
    ├── 1. Extract ALL claims from full response text
    │      (heuristic split + LLM decomposition for complex)
    │
    ├── 2. For each claim: NLI against ragSources (top-5 per claim)
    │
    ├── 3. Ambiguous claims: escalate to LLM-as-judge
    │
    ├── 4. Aggregate:
    │      contradicted > 0 → FLAG/BLOCK (GROUNDING_CONTRADICTION)
    │      unverifiable / total > maxUnverifiableRatio → FLAG (GROUNDING_UNVERIFIABLE)
    │      all supported → pass
    │
    └── return FLAG/BLOCK or null
```

---

### 5. Configuration

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/types.ts`

```typescript
/**
 * Configuration for the grounding guard extension pack.
 */
export interface GroundingGuardOptions {
  /**
   * NLI cross-encoder model for entailment/contradiction detection.
   * @default 'cross-encoder/nli-deberta-v3-small'
   */
  nliModelId?: string;

  /**
   * NLI score threshold for entailment classification.
   * Claim-source pairs scoring above this are considered SUPPORTED.
   * @default 0.7
   */
  entailmentThreshold?: number;

  /**
   * NLI score threshold for contradiction classification.
   * Claim-source pairs scoring above this are considered CONTRADICTED.
   * @default 0.7
   */
  contradictionThreshold?: number;

  /**
   * Maximum ratio of unverifiable claims before flagging.
   * If more than this fraction of extracted claims cannot be verified
   * against any source, the response is flagged as potentially hallucinated.
   * @default 0.5
   */
  maxUnverifiableRatio?: number;

  /**
   * Action when a contradiction is detected.
   * @default 'flag'
   */
  contradictionAction?: 'flag' | 'block';

  /**
   * Action when unverifiable ratio is exceeded.
   * @default 'flag'
   */
  unverifiableAction?: 'flag' | 'block';

  /**
   * LLM configuration for claim decomposition and ambiguous escalation.
   * When omitted, heuristic-only claims + NLI-only verification.
   */
  llm?: {
    /** LLM provider */
    provider: string;
    /** Model ID */
    model: string;
    /** API key (falls back to getSecret) */
    apiKey?: string;
    /** Base URL override */
    baseUrl?: string;
  };

  /**
   * Max source chunks to compare each claim against.
   * Sources are pre-sorted by relevance score; only the top N are used.
   * @default 5
   */
  maxSourcesPerClaim?: number;

  /**
   * Enable streaming sentence-level NLI checks.
   * When false, only the final comprehensive check runs.
   * @default true
   */
  enableStreamingChecks?: boolean;

  /**
   * Use INT8 quantized NLI model for lower memory.
   * @default true
   */
  quantized?: boolean;

  /** Guardrail scope. @default 'output' */
  guardrailScope?: 'input' | 'output' | 'both';
}

/**
 * Well-known service IDs for grounding guard resources.
 */
export const GROUNDING_SERVICE_IDS = {
  /** NLI cross-encoder pipeline (cross-encoder/nli-deberta-v3-small) */
  NLI_PIPELINE: 'agentos:grounding:nli-pipeline',
} as const;

/**
 * Aggregate grounding result for the full response.
 */
export interface GroundingResult {
  /** Whether the response is grounded (no contradictions, acceptable unverifiable ratio) */
  grounded: boolean;
  /** Per-claim verification results */
  claims: ClaimVerification[];
  /** Total claims extracted */
  totalClaims: number;
  /** Claims supported by sources */
  supportedCount: number;
  /** Claims contradicting sources */
  contradictedCount: number;
  /** Claims not found in any source */
  unverifiableCount: number;
  /** Ratio of unverifiable claims (0.0–1.0) */
  unverifiableRatio: number;
  /** Human-readable summary */
  summary: string;
}
```

---

### 6. check_grounding Tool

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/tools/CheckGroundingTool.ts`

```typescript
/**
 * Agent-callable tool for on-demand grounding verification.
 *
 * Lets agents proactively verify claims against source text
 * before including them in responses.
 *
 * @example
 * → check_grounding({
 *     text: "The API rate limit is 1000 req/min",
 *     sources: ["Premium users get 1000 requests per minute."]
 *   })
 * ← {
 *     grounded: true,
 *     claims: [{ claim: "The API rate limit is 1000 req/min",
 *                verdict: "supported", confidence: 0.92 }],
 *     summary: "1/1 claims supported"
 *   }
 */
export class CheckGroundingTool implements ITool<CheckGroundingInput, GroundingResult> {
  readonly id = 'check_grounding';
  readonly name = 'check_grounding';
  readonly displayName = 'Grounding Checker';
  readonly description =
    'Verify that claims in text are supported by source documents using NLI entailment.';
  readonly category = 'security';
  readonly version = '1.0.0';
  readonly hasSideEffects = false;
  readonly inputSchema = {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text containing claims to verify' },
      sources: {
        type: 'array',
        items: { type: 'string' },
        description: 'Source texts to verify against',
      },
    },
    required: ['text', 'sources'],
  };
}
```

The tool accepts `sources: string[]` (plain text) for simplicity.

```typescript
async execute(
  args: CheckGroundingInput,
  _context: ToolExecutionContext,
): Promise<ToolExecutionResult<GroundingResult>> {
  // Wrap plain string sources as synthetic RagRetrievedChunk objects
  const syntheticSources = args.sources.map((text, i) => ({
    id: `tool-source-${i}`,
    content: text,
    relevanceScore: 1.0,  // tool-provided sources are fully relevant
    metadata: {},
  } as RagRetrievedChunk));

  const claims = await this.claimExtractor.extract(args.text);
  const verifications = await this.checker.checkClaims(claims, syntheticSources);
  return { success: true, output: this.buildResult(verifications) };
}
```

---

### 7. Extension Pack Structure & Factory

**Location:** `packages/agentos/src/extensions/packs/grounding-guard/`

```
grounding-guard/
├── index.ts                    # createGroundingGuardrail() + createExtensionPack()
├── types.ts                    # GroundingGuardOptions, ClaimVerification, GroundingResult, etc.
├── ClaimExtractor.ts           # Heuristic split + LLM decomposition
├── GroundingChecker.ts         # NLI + LLM escalation
├── GroundingGuardrail.ts       # IGuardrailService impl
├── tools/
│   └── CheckGroundingTool.ts   # ITool for on-demand verification
└── grounding-guard.skill.md    # SKILL.md
```

**Factory:**

```typescript
export function createGroundingGuardrail(options?: GroundingGuardOptions): ExtensionPack {
  const opts = options ?? {};

  const state = {
    services: new SharedServiceRegistry() as ISharedServiceRegistry,
    getSecret: undefined as ((id: string) => string | undefined) | undefined,
  };

  let guardrail: GroundingGuardrail;
  let tool: CheckGroundingTool;
  let checker: GroundingChecker;

  function resolveLlmFn() {
    if (!opts.llm) return undefined;
    // Same pattern as PII LlmJudgeRecognizer:
    // resolve API key from config → provider secret → pack secret
    // Return (prompt: string) => Promise<string>
  }

  function buildComponents() {
    const llmFn = resolveLlmFn();
    checker = new GroundingChecker(state.services, {
      nliModelId: opts.nliModelId,
      entailmentThreshold: opts.entailmentThreshold,
      contradictionThreshold: opts.contradictionThreshold,
      llmFn,
    });
    guardrail = new GroundingGuardrail(state.services, opts);
    tool = new CheckGroundingTool(checker);
  }

  buildComponents();

  return {
    name: 'grounding-guard',
    version: '1.0.0',
    get descriptors() {
      return [
        {
          id: 'grounding-guardrail',
          kind: EXTENSION_KIND_GUARDRAIL,
          priority: 8,
          payload: guardrail,
        },
        { id: 'check_grounding', kind: EXTENSION_KIND_TOOL, priority: 0, payload: tool },
      ];
    },
    onActivate: (context) => {
      if (context.services) state.services = context.services;
      if (context.getSecret) state.getSecret = context.getSecret;
      buildComponents();
    },
    onDeactivate: async () => {
      await checker?.dispose(); // release NLI model memory
      guardrail?.clearBuffers(); // clear per-stream sentence buffers
    },
  };
}

export function createExtensionPack(context: ExtensionPackContext): ExtensionPack {
  return createGroundingGuardrail(context.options as GroundingGuardOptions);
}
```

**Descriptors:**

| ID                    | Kind        | Priority | canSanitize | Purpose                          |
| --------------------- | ----------- | -------- | ----------- | -------------------------------- |
| `grounding-guardrail` | `guardrail` | 8        | false       | Automatic grounding verification |
| `check_grounding`     | `tool`      | 0        | —           | On-demand grounding check        |

Priority 8 for stacking purposes (same as all other guardrail priorities). Note: Phase 2 guardrails run concurrently via `Promise.allSettled` — priority does NOT determine execution order within Phase 2. All Phase 2 guardrails (toxicity, code-safety, topicality, grounding) run in parallel. If any other guardrail returns BLOCK, the grounding result is still collected but the stream is terminated regardless.

---

### 8. Memory Impact

| Component                             | Memory          | When Loaded           |
| ------------------------------------- | --------------- | --------------------- |
| NLI model (nli-deberta-v3-small INT8) | ~40MB           | First grounding check |
| ClaimExtractor (heuristic rules)      | ~5KB            | Pack load             |
| Per-stream sentence buffer            | ~1KB per stream | First TEXT_DELTA      |
| **Total**                             | **~40MB**       | —                     |

### Combined guardrail suite memory (all 5 packs):

| Pack                          | Memory     |
| ----------------------------- | ---------- |
| PII Redaction (all tiers)     | ~115MB     |
| ML Classifiers (3 models)     | ~98MB      |
| Topicality (embeddings)       | ~1.7MB     |
| Code Safety (regex)           | ~110KB     |
| Grounding Guard (NLI)         | ~40MB      |
| **Total (everything active)** | **~255MB** |

All models are lazy-loaded — memory is only consumed when the feature is actually used.

---

### 9. Graceful Degradation

| Condition                            | Behavior                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------- |
| No ragSources on payload             | No-op — returns null (can't ground without sources)                         |
| NLI model fails to load              | Falls back to LLM-only (if configured), else no-op                          |
| LLM not configured                   | NLI-only mode — heuristic claims, no decomposition, no ambiguous escalation |
| Both NLI and LLM unavailable         | No-op with warning logged                                                   |
| Empty response (no claims extracted) | Returns null                                                                |
| ragSources present but empty array   | Returns null (no sources to compare against)                                |

---

## Testing Strategy

1. **ClaimExtractor tests** — sentence splitting, hedge/question filtering, complex sentence detection, LLM decomposition with mock, code block filtering, empty input
2. **GroundingChecker tests** (mocked NLI pipeline) — entailment → supported, contradiction → contradicted, neutral → ambiguous, LLM escalation, multiple sources (best match wins), unverifiable when no source matches, checkClaims parallel
3. **GroundingGuardrail tests** — streaming contradiction → FLAG, final comprehensive check, no ragSources → null, reason codes, scope filtering, graceful degradation
4. **CheckGroundingTool tests** — tool schema, execute with supported claims, execute with contradicted claims, plain-text sources wrapped as chunks
5. **Pack factory tests** — descriptors, onActivate/onDeactivate, createExtensionPack bridge
6. **RAG plumbing tests** — ragSources threaded from mock retrieval to guardrail payload

---

## SKILL.md

```yaml
---
name: grounding-guard
version: '1.0.0'
description: Verify response faithfulness against RAG source documents using NLI entailment and LLM-as-judge
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, hallucination, grounding, faithfulness, nli, rag, fact-checking]
requires_tools: [check_grounding]
metadata:
  agentos:
    emoji: "\U0001F50D"
---

# Grounding Guard

A guardrail automatically verifies that your responses are faithful to
the source documents retrieved via RAG. Claims in your output are checked
against the retrieved sources using NLI entailment detection.

## When to Use check_grounding

- Before presenting synthesized answers from multiple RAG sources
- To verify that summarized content faithfully represents the originals
- When combining information from multiple documents

## What It Checks

- **Supported**: claim is entailed by at least one source document
- **Contradicted**: claim directly contradicts a source document
- **Unverifiable**: claim cannot be found in any source (potential hallucination)

## Constraints

- Only runs when RAG sources are available (no sources → no verification)
- NLI model (~40MB) loads lazily on first grounding check
- LLM escalation for ambiguous claims adds ~150-500ms (only when configured)
- Best for factual/informational responses; less useful for creative/opinion content
```

---

## Open Questions (Deferred)

1. Should the grounding guard support **citation insertion** (automatically adding source references to claims)? Deferred — this would require SANITIZE action and is a different feature.
2. Should the **NLI model be configurable** to use a larger cross-encoder for higher accuracy? Already supported via `nliModelId` config.
3. Should there be a **grounding score threshold** on the tool response (e.g., "at least 80% of claims must be supported")? The `maxUnverifiableRatio` config already provides this for the guardrail; the tool returns raw results for the agent to decide.
4. Should the guardrail **include the RAG audit trail** in its metadata? Deferred — the audit trail is available via `RAGAuditCollector` but adding it to guardrail metadata would bloat chunk sizes.

---

## Recommended Implementation Sequence

1. **RAG source plumbing** — add `ragSources` to response chunk + guardrail payload + thread through GMI/dispatcher
2. **Types** — all interfaces, configs, service IDs
3. **ClaimExtractor** — heuristic split + LLM decomposition
4. **GroundingChecker** — NLI + LLM escalation
5. **GroundingGuardrail** — IGuardrailService impl with streaming + final
6. **CheckGroundingTool** — on-demand tool
7. **Pack factory** — createGroundingGuardrail(), barrel exports, package.json
8. **SKILL.md + registry**
9. **Verification** — full test suite, push
