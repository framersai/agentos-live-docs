# Grounding Guard Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a hallucination/grounding verification guardrail that checks LLM output claims against RAG source documents using NLI cross-encoder + LLM-as-judge, with typed RAG source plumbing from GMI to guardrail layer.

**Architecture:** Two phases: (1) Typed `ragSources` plumbing through AgentOS core (response chunks + guardrail payloads + dispatcher). (2) Grounding guard extension pack with `ClaimExtractor` (heuristic + LLM), `GroundingChecker` (NLI + LLM escalation), `GroundingGuardrail` (streaming + final), and `CheckGroundingTool`.

**Tech Stack:** TypeScript, vitest, `@huggingface/transformers` (NLI model: `cross-encoder/nli-deberta-v3-small`), `ISharedServiceRegistry` for model sharing

**Spec:** `docs/superpowers/specs/2026-03-21-grounding-guard-design.md`

---

## File Map

### Phase 1: RAG Source Plumbing (core modifications)

| File                                                                  | Change | Purpose                                                               |
| --------------------------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| `packages/agentos/src/api/types/AgentOSResponse.ts`                   | Modify | Add `ragSources?: RagRetrievedChunk[]` to `AgentOSFinalResponseChunk` |
| `packages/agentos/src/core/guardrails/IGuardrailService.ts`           | Modify | Add `ragSources?: RagRetrievedChunk[]` to `GuardrailOutputPayload`    |
| `packages/agentos/src/core/guardrails/guardrailDispatcher.ts`         | Modify | Add `ragSources` to `GuardrailOutputOptions`                          |
| `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts` | Modify | Thread `ragSources` into all 4 `GuardrailOutputPayload` call sites    |

### Phase 2: Grounding Guard Pack (all new)

Under `packages/agentos/src/extensions/packs/grounding-guard/`:

| File                          | Purpose                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `types.ts`                    | `GroundingGuardOptions`, `GroundingVerdict`, `ClaimVerification`, `ExtractedClaim`, `GroundingResult`, `GROUNDING_SERVICE_IDS` |
| `ClaimExtractor.ts`           | Heuristic sentence split + LLM decomposition for complex sentences                                                             |
| `GroundingChecker.ts`         | NLI cross-encoder + LLM escalation for ambiguous claims                                                                        |
| `GroundingGuardrail.ts`       | `IGuardrailService` impl with streaming + final verification                                                                   |
| `tools/CheckGroundingTool.ts` | `ITool` for on-demand grounding check                                                                                          |
| `index.ts`                    | `createGroundingGuardPack()` factory + `createExtensionPack()` bridge                                                          |
| `grounding-guard.skill.md`    | SKILL.md for agent awareness                                                                                                   |

Tests under `packages/agentos/tests/extensions/packs/grounding-guard/`:

| Test File                    | Covers                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `ClaimExtractor.spec.ts`     | Sentence splitting, filtering, complexity detection, LLM decomposition |
| `GroundingChecker.spec.ts`   | NLI entailment/contradiction/neutral, LLM escalation, multi-source     |
| `GroundingGuardrail.spec.ts` | Streaming contradiction, final check, no ragSources, reason codes      |
| `CheckGroundingTool.spec.ts` | Tool schema, execute, synthetic source wrapping                        |
| `index.spec.ts`              | Pack factory, descriptors, onActivate/onDeactivate                     |

---

## Task 1: RAG source plumbing

**Files:**

- Modify: `packages/agentos/src/api/types/AgentOSResponse.ts`
- Modify: `packages/agentos/src/core/guardrails/IGuardrailService.ts`
- Modify: `packages/agentos/src/core/guardrails/guardrailDispatcher.ts`
- Modify: `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts`

- [ ] **Step 1: Add ragSources to AgentOSFinalResponseChunk**

In `src/api/types/AgentOSResponse.ts`, find the `AgentOSFinalResponseChunk` interface and add:

```typescript
  /**
   * RAG source chunks used to generate this response.
   * Populated by the GMI when RAG retrieval was performed.
   * Used by grounding guardrails for faithfulness verification.
   */
  ragSources?: import('../../rag').RagRetrievedChunk[];
```

- [ ] **Step 2: Add ragSources to GuardrailOutputPayload**

In `src/core/guardrails/IGuardrailService.ts`, find `GuardrailOutputPayload` and add:

```typescript
  /**
   * RAG source chunks retrieved for this request.
   * Available to output guardrails for grounding verification.
   * Persists across all chunks in a stream (not just final).
   */
  ragSources?: import('../../rag').RagRetrievedChunk[];
```

- [ ] **Step 3: Add ragSources to GuardrailOutputOptions**

In `src/core/guardrails/guardrailDispatcher.ts`, find `GuardrailOutputOptions` and add:

```typescript
  /** RAG sources to pass through to output guardrails for grounding verification */
  ragSources?: import('../../rag').RagRetrievedChunk[];
```

- [ ] **Step 4: Thread ragSources through ParallelGuardrailDispatcher**

In `src/core/guardrails/ParallelGuardrailDispatcher.ts`, read the `wrapOutput` method. Find all call sites where `GuardrailOutputPayload` is constructed (there are ~4: streaming sanitizer eval, streaming parallel eval, final sanitizer eval, final parallel eval). At each site, add `ragSources: options.ragSources` to the payload:

```typescript
// Before:
{ context, chunk: workingChunk }

// After:
{ context, chunk: workingChunk, ragSources: options.ragSources }
```

- [ ] **Step 5: Run existing guardrail tests (regression check)**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/
```

Expected: ALL PASS (ragSources is optional, existing tests don't use it)

- [ ] **Step 6: Commit and push**

```bash
cd packages/agentos
git add src/api/types/AgentOSResponse.ts src/core/guardrails/IGuardrailService.ts src/core/guardrails/guardrailDispatcher.ts src/core/guardrails/ParallelGuardrailDispatcher.ts
git commit -m "feat(guardrails): add ragSources plumbing from response chunks to guardrail payloads"
git push origin master
```

---

## Task 2: Types + ClaimExtractor

**Files:**

- Create: `packages/agentos/src/extensions/packs/grounding-guard/types.ts`
- Create: `packages/agentos/src/extensions/packs/grounding-guard/ClaimExtractor.ts`
- Create: `packages/agentos/tests/extensions/packs/grounding-guard/ClaimExtractor.spec.ts`

- [ ] **Step 1: Create directories**

```bash
cd packages/agentos
mkdir -p src/extensions/packs/grounding-guard/tools
mkdir -p tests/extensions/packs/grounding-guard
```

- [ ] **Step 2: Write types.ts**

All types from the spec:

- `GroundingVerdict` type: 'supported' | 'contradicted' | 'unverifiable'
- `ExtractedClaim` interface: { claim, sourceOffset, decomposed }
- `ClaimVerification` interface: { claim, verdict, confidence, bestSource, escalated, reasoning? }
- `GroundingResult` interface: { grounded, claims, totalClaims, supportedCount, contradictedCount, unverifiableCount, unverifiableRatio, summary }
- `GroundingGuardOptions` interface (full config from spec)
- `GROUNDING_SERVICE_IDS` const: { NLI_PIPELINE: 'agentos:grounding:nli-pipeline' }

Full TSDoc on everything.

- [ ] **Step 3: Write ClaimExtractor tests**

Create `tests/extensions/packs/grounding-guard/ClaimExtractor.spec.ts`:

````typescript
import { describe, it, expect, vi } from 'vitest';
import { ClaimExtractor } from '../../../../src/extensions/packs/grounding-guard/ClaimExtractor';

describe('ClaimExtractor', () => {
  it('splits text into sentences', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('The API returns JSON. It supports pagination.');
    expect(claims).toHaveLength(2);
    expect(claims[0].claim).toContain('API returns JSON');
    expect(claims[1].claim).toContain('supports pagination');
  });

  it('filters out questions', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('The rate limit is 1000. Do you need more info?');
    expect(claims).toHaveLength(1);
    expect(claims[0].claim).toContain('rate limit');
  });

  it('filters out hedges', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('I think this might work. The timeout is 30 seconds.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claim).toContain('timeout');
  });

  it('filters out meta statements', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('I hope this helps! The API key expires monthly.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claim).toContain('API key');
  });

  it('filters out code blocks', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract(
      'The endpoint is /api/v1.\n```js\nfetch("/api")\n```\nIt returns JSON.'
    );
    // Should NOT extract code block content as claims
    expect(claims.every((c) => !c.claim.includes('fetch'))).toBe(true);
  });

  it('uses LLM for complex sentences when configured', async () => {
    const mockLlm = vi.fn(async () =>
      JSON.stringify([
        'The API supports REST',
        'The API supports GraphQL',
        'The API returns JSON by default',
      ])
    );
    const extractor = new ClaimExtractor(mockLlm);
    const claims = await extractor.extract(
      'The API supports both REST and GraphQL, returns JSON by default, and has comprehensive documentation.'
    );
    expect(mockLlm).toHaveBeenCalled();
    expect(claims.length).toBeGreaterThanOrEqual(3);
    expect(claims.some((c) => c.decomposed)).toBe(true);
  });

  it('falls back to heuristic when no LLM configured', async () => {
    const extractor = new ClaimExtractor(); // no LLM
    const claims = await extractor.extract(
      'The API supports both REST and GraphQL, returns JSON by default, and has comprehensive documentation.'
    );
    // Without LLM, the whole sentence is one claim
    expect(claims).toHaveLength(1);
    expect(claims[0].decomposed).toBe(false);
  });

  it('returns empty for empty text', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('');
    expect(claims).toHaveLength(0);
  });

  it('includes source offsets', async () => {
    const extractor = new ClaimExtractor();
    const claims = await extractor.extract('First claim. Second claim.');
    for (const claim of claims) {
      expect(claim.sourceOffset).toBeGreaterThanOrEqual(0);
    }
  });
});
````

- [ ] **Step 4: Write ClaimExtractor**

Create `src/extensions/packs/grounding-guard/ClaimExtractor.ts`:

Key implementation:

- Split on sentence boundaries: `. `, `? `, `! `, `\n` (same as PII guardrail)
- Filter non-factual: regex checks for questions, hedges, meta, greetings
- Strip code blocks before splitting (remove ` ```...``` ` content)
- Complexity detection: wordCount > 20 OR has independent-clause conjunctions
- If complex + LLM available: call LLM with decomposition prompt, parse JSON array
- If complex + no LLM: pass through as single claim
- Track sourceOffset per claim

- [ ] **Step 5: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/grounding-guard/ClaimExtractor.spec.ts
```

- [ ] **Step 6: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/grounding-guard/types.ts src/extensions/packs/grounding-guard/ClaimExtractor.ts tests/extensions/packs/grounding-guard/ClaimExtractor.spec.ts
git commit -m "feat(grounding): add types, ClaimExtractor with heuristic split + LLM decomposition"
git push origin master
```

---

## Task 3: GroundingChecker

**Files:**

- Create: `packages/agentos/src/extensions/packs/grounding-guard/GroundingChecker.ts`
- Create: `packages/agentos/tests/extensions/packs/grounding-guard/GroundingChecker.spec.ts`

- [ ] **Step 1: Write GroundingChecker tests**

Use mocked NLI pipeline:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { GroundingChecker } from '../../../../src/extensions/packs/grounding-guard/GroundingChecker';
import type { ISharedServiceRegistry } from '../../../../src/extensions/ISharedServiceRegistry';

/** Mock NLI pipeline returning configurable results */
function createMockRegistry(nliResult: { label: string; score: number }[]): ISharedServiceRegistry {
  const pipeline = vi.fn(async () => nliResult);
  return {
    getOrCreate: vi.fn(async () => pipeline),
    has: () => false,
    release: vi.fn(async () => {}),
    releaseAll: vi.fn(async () => {}),
  };
}

const mockSource = (content: string) => ({
  id: 'chunk-1',
  content,
  relevanceScore: 0.9,
  metadata: {},
  originalDocumentId: 'doc-1',
  source: 'test',
});

describe('GroundingChecker', () => {
  it('returns supported when NLI entailment score > threshold', async () => {
    const registry = createMockRegistry([{ label: 'entailment', score: 0.92 }]);
    const checker = new GroundingChecker(registry);
    const result = await checker.checkClaim('API rate limit is 1000', [
      mockSource('Rate limit is 1000 req/min'),
    ]);
    expect(result.verdict).toBe('supported');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('returns contradicted when NLI contradiction score > threshold', async () => {
    const registry = createMockRegistry([{ label: 'contradiction', score: 0.85 }]);
    const checker = new GroundingChecker(registry);
    const result = await checker.checkClaim('Limit is 1000', [mockSource('Limit is 500')]);
    expect(result.verdict).toBe('contradicted');
  });

  it('returns unverifiable when NLI neutral (below both thresholds)', async () => {
    const registry = createMockRegistry([{ label: 'neutral', score: 0.6 }]);
    const checker = new GroundingChecker(registry); // no LLM
    const result = await checker.checkClaim('Some random claim', [mockSource('Unrelated source')]);
    expect(result.verdict).toBe('unverifiable');
  });

  it('escalates ambiguous to LLM when configured', async () => {
    const registry = createMockRegistry([{ label: 'neutral', score: 0.5 }]);
    const mockLlm = vi.fn(async () =>
      JSON.stringify({
        verdict: 'supported',
        confidence: 0.8,
        reasoning: 'implied by context',
      })
    );
    const checker = new GroundingChecker(registry, { llmFn: mockLlm });
    const result = await checker.checkClaim('Claim', [mockSource('Source')]);
    expect(mockLlm).toHaveBeenCalled();
    expect(result.escalated).toBe(true);
    expect(result.verdict).toBe('supported');
  });

  it('picks best source across multiple chunks', async () => {
    const registry = createMockRegistry([{ label: 'entailment', score: 0.95 }]);
    const checker = new GroundingChecker(registry);
    const sources = [mockSource('Irrelevant'), mockSource('Matching source')];
    const result = await checker.checkClaim('Claim', sources);
    expect(result.bestSource).not.toBeNull();
  });

  it('checkClaims runs claims in parallel', async () => {
    const registry = createMockRegistry([{ label: 'entailment', score: 0.9 }]);
    const checker = new GroundingChecker(registry);
    const claims = [
      { claim: 'Claim 1', sourceOffset: 0, decomposed: false },
      { claim: 'Claim 2', sourceOffset: 10, decomposed: false },
    ];
    const results = await checker.checkClaims(claims, [mockSource('Source')]);
    expect(results).toHaveLength(2);
  });

  it('gracefully degrades when NLI model fails', async () => {
    const registry: ISharedServiceRegistry = {
      getOrCreate: vi.fn(async () => {
        throw new Error('model load failed');
      }),
      has: () => false,
      release: vi.fn(async () => {}),
      releaseAll: vi.fn(async () => {}),
    };
    const checker = new GroundingChecker(registry);
    const result = await checker.checkClaim('Claim', [mockSource('Source')]);
    expect(result.verdict).toBe('unverifiable');
  });

  it('handles undefined relevanceScore (defaults to 1.0)', async () => {
    const registry = createMockRegistry([{ label: 'entailment', score: 0.9 }]);
    const checker = new GroundingChecker(registry);
    const source = { ...mockSource('Source'), relevanceScore: undefined };
    const result = await checker.checkClaim('Claim', [source as any]);
    expect(result.verdict).toBe('supported');
  });
});
```

- [ ] **Step 2: Write GroundingChecker**

Create `src/extensions/packs/grounding-guard/GroundingChecker.ts`:

Key implementation:

- Load NLI via `services.getOrCreate(GROUNDING_SERVICE_IDS.NLI_PIPELINE, ...)`
- `checkClaim(claim, sources)`:
  1. Sort sources by `relevanceScore ?? 1.0` descending, take top N (default 5)
  2. For each source: call NLI pipeline with `{ text: claim, text_pair: source.content }`
  3. Find best match: highest entailment score or highest contradiction score
  4. If entailment > threshold → SUPPORTED
  5. If contradiction > threshold → CONTRADICTED
  6. If neither (neutral) and LLM available → escalate
  7. If neither and no LLM → UNVERIFIABLE
- `checkClaims(claims, sources)`: `Promise.all(claims.map(c => checkClaim(c.claim, sources)))`
- Graceful degradation: NLI load failure → set unavailable, return unverifiable

- [ ] **Step 3: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/grounding-guard/GroundingChecker.spec.ts
```

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/grounding-guard/GroundingChecker.ts tests/extensions/packs/grounding-guard/GroundingChecker.spec.ts
git commit -m "feat(grounding): add GroundingChecker with NLI + LLM escalation"
git push origin master
```

---

## Task 4: GroundingGuardrail + CheckGroundingTool

**Files:**

- Create: `packages/agentos/src/extensions/packs/grounding-guard/GroundingGuardrail.ts`
- Create: `packages/agentos/src/extensions/packs/grounding-guard/tools/CheckGroundingTool.ts`
- Create: `packages/agentos/tests/extensions/packs/grounding-guard/GroundingGuardrail.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/grounding-guard/CheckGroundingTool.spec.ts`

- [ ] **Step 1: Read existing guardrail interfaces**

Read these to understand the exact types:

- `src/core/guardrails/IGuardrailService.ts` — GuardrailAction, GuardrailOutputPayload (now with ragSources)
- `src/core/tools/ITool.ts` — ITool interface
- `src/api/types/AgentOSResponse.ts` — AgentOSResponseChunkType

- [ ] **Step 2: Write GroundingGuardrail**

Implements `IGuardrailService`:

```typescript
config = { evaluateStreamingChunks: true, canSanitize: false };
```

Internal state: sentence-boundary buffer per stream (same pattern as PII).

`evaluateInput`: always returns null (grounding is output-only).

`evaluateOutput`:

- If no `payload.ragSources` or empty → return null (can't ground)
- TEXT_DELTA: accumulate in sentence buffer, on sentence boundary → filter non-factual → NLI against ragSources (top 5) → if contradiction > threshold → FLAG (GROUNDING_CONTRADICTION)
- isFinal: full claim extraction via ClaimExtractor → comprehensive NLI via GroundingChecker → aggregate results → if any contradicted → FLAG/BLOCK, if >maxUnverifiableRatio unverifiable → FLAG
- Return GuardrailEvaluationResult with reason code and metadata (per-claim results)

Stale buffer cleanup: lazy prune when map > 100.
`clearBuffers()` method for onDeactivate.

- [ ] **Step 3: Write CheckGroundingTool**

Implements `ITool<CheckGroundingInput, GroundingResult>`:

- id='check_grounding', category='security', hasSideEffects=false
- `execute`: wrap `sources: string[]` as synthetic `RagRetrievedChunk` objects (relevanceScore: 1.0), extract claims, check via GroundingChecker, build GroundingResult

- [ ] **Step 4: Write tests**

GroundingGuardrail.spec.ts:

- Streaming: contradiction in sentence → FLAG with GROUNDING_CONTRADICTION
- Final: comprehensive check with supported + contradicted claims
- No ragSources → null
- Empty ragSources → null
- Scope 'input' → evaluateInput returns null
- evaluateInput always returns null
- Reason codes present in metadata
- Graceful degradation when NLI unavailable

CheckGroundingTool.spec.ts:

- Tool properties (id, name, category)
- Execute with supported claims → grounded=true
- Execute with contradicted claims → grounded=false
- Wraps string sources as synthetic RagRetrievedChunk

- [ ] **Step 5: Run all grounding tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/grounding-guard/
```

- [ ] **Step 6: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/grounding-guard/GroundingGuardrail.ts src/extensions/packs/grounding-guard/tools/CheckGroundingTool.ts tests/extensions/packs/grounding-guard/GroundingGuardrail.spec.ts tests/extensions/packs/grounding-guard/CheckGroundingTool.spec.ts
git commit -m "feat(grounding): add GroundingGuardrail with streaming + final verification + CheckGroundingTool"
git push origin master
```

---

## Task 5: Pack factory + index.ts

**Files:**

- Create: `packages/agentos/src/extensions/packs/grounding-guard/index.ts`
- Create: `packages/agentos/tests/extensions/packs/grounding-guard/index.spec.ts`

- [ ] **Step 1: Write index.ts**

Follow the established onActivate/rebuild pattern (matching ML classifiers and topicality packs):

```typescript
const state = { services, getSecret };
function resolveLlmFn() { /* resolve from config or getSecret */ }
function buildComponents() { /* create checker, guardrail, tool */ }
buildComponents();

return {
  name: 'grounding-guard', version: '1.0.0',
  get descriptors() { return [guardrail(priority 8), tool]; },
  onActivate: (ctx) => { upgrade services, rebuild; },
  onDeactivate: async () => { checker.dispose(); guardrail.clearBuffers(); },
};
```

Export: `export * from './types';`

- [ ] **Step 2: Write index tests**

- Pack name/version
- 2 descriptors: guardrail (id 'grounding-guardrail') + tool (id 'check_grounding')
- createExtensionPack bridge
- onDeactivate calls dispose + clearBuffers

- [ ] **Step 3: Run all grounding tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/grounding-guard/
```

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/grounding-guard/index.ts tests/extensions/packs/grounding-guard/index.spec.ts
git commit -m "feat(grounding): add createGroundingGuardPack factory"
git push origin master
```

---

## Task 6: Barrel export + package.json + SKILL.md + registry

- [ ] **Step 1: Agentos submodule exports**

Add to `src/extensions/index.ts`:

```typescript
export {
  createGroundingGuardPack,
  createExtensionPack as createGroundingGuardExtensionPack,
} from './packs/grounding-guard';
```

Add to `package.json` exports:

```json
"./extensions/packs/grounding-guard": {
  "import": "./dist/extensions/packs/grounding-guard/index.js",
  "default": "./dist/extensions/packs/grounding-guard/index.js",
  "types": "./dist/extensions/packs/grounding-guard/index.d.ts"
}
```

```bash
cd packages/agentos
git add src/extensions/index.ts package.json
git commit -m "feat(grounding): add barrel export + package.json exports path"
git push origin master
```

- [ ] **Step 2: SKILL.md + registry (from monorepo root)**

Create `packages/agentos-skills-registry/registry/curated/grounding-guard/SKILL.md` with content from spec.

Add to `TOOL_CATALOG` in `packages/agentos-extensions-registry/src/tool-registry.ts`:

```typescript
{
  packageName: '@framers/agentos-ext-grounding-guard',
  name: 'grounding-guard',
  category: 'integration',
  available: true,
  displayName: 'Grounding Guard',
  description: 'RAG-grounded hallucination detection using NLI entailment and LLM-as-judge verification.',
  requiredSecrets: [],
  defaultPriority: 8,
  envVars: [],
  docsUrl: '/docs/extensions/built-in/grounding-guard',
},
```

Push submodules first, then monorepo:

```bash
cd packages/agentos-skills-registry && mkdir -p registry/curated/grounding-guard && git add registry/curated/grounding-guard/ && git commit -m "feat(grounding): add SKILL.md" && git push origin master
cd ../agentos-extensions-registry && git add src/tool-registry.ts && git commit -m "feat(grounding): register in extension catalog" && git push origin master
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos-skills-registry packages/agentos-extensions-registry
git commit -m "feat(grounding): add SKILL.md and extension registry entry"
```

---

## Task 7: Full verification

- [ ] **Step 1: Run all grounding guard tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/grounding-guard/
```

- [ ] **Step 2: Run all extension tests (regression)**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

- [ ] **Step 3: Run guardrail dispatcher tests (regression — ragSources plumbing)**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/
```

- [ ] **Step 4: Run integration tests**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails.integration.spec.ts
```

- [ ] **Step 5: Update monorepo submodule pointer and push**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos
git commit -m "chore: update agentos submodule — grounding guard extension complete (SOTA guardrails 5/5)"
git push origin master
```
