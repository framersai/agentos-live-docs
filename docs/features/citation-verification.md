---
title: "Citation Verification"
sidebar_position: 4.5
displayed_sidebar: guideSidebar
description: "Per-claim citation verification for AI agents: decompose answers into atomic claims, embed against retrieved sources, verdict ladder (supported/weak/unverifiable/contradicted) with optional NLI contradiction check and web-search fallback."
keywords: [citation verification, llm hallucination, claim verification, atomic claims, cosine similarity, nli, grounded llm, ai source verification]
---

LLMs hallucinate citations: they reference papers that do not exist, quote sources unrelated to the claim, or synthesize plausible facts the underlying retrieval never returned. Longer answers compound the failure rate.

AgentOS attaches per-claim verdicts to every generation behind a single flag. Each statement gets decomposed into an atomic claim, embedded against the sources the agent retrieved, scored on cosine similarity, and tagged with one of four verdicts: `supported`, `weak`, `unverifiable`, or `contradicted`. Optional NLI promotes contradictions where the source disagrees with the claim. Optional web-search fallback rescues `unverifiable` claims that could have been answered from general knowledge.

The full implementation lives in [`packages/agentos/src/cognition/rag/citation/`](https://github.com/framersai/agentos/tree/master/src/cognition/rag/citation). The runtime ships [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts), the [`VerifiedResponse`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/types.ts) and [`VerificationSource`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/types.ts) types, and the [`formatVerifiedResponse`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/format.ts) helper.

![Citation verification flow: a generated answer has its claims extracted; each claim is matched against retrieved chunks and scored by an NLI judge; verdicts (ENTAILED, NEUTRAL, CONTRADICTED) are stamped on the verified answer with citation markers, and contradictions get flagged for revision](/img/diagrams/citation-verification-flow.svg)

## The one-flag path

For most use cases you never touch the verifier directly. Configure `verifyCitations` on the agent and the per-claim verdicts land on `result.grounding` automatically:

```typescript
import { agent } from '@framers/agentos';

const docsAgent = agent({
  provider: 'openai', model: 'gpt-4o',
  verifyCitations: {
    embedFn:  (texts) => embeddingManager.embedBatch(texts),
    retrieve: (query) => retriever.search(query),
  },
});

const result = await docsAgent.generate('How do I configure a guardrail?');

console.log(result.text);
console.log(result.grounding?.overallGrounded);   // single boolean — safe to ship?
for (const claim of result.grounding?.claims ?? []) {
  if (claim.verdict !== 'supported') console.warn(claim);
}
```

The agent retrieves sources for each user input, generates the response, and runs [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts) over the text+sources pair on the way out. Same flag works on [`QueryRouter`](https://github.com/framersai/agentos/blob/master/src/orchestration/pipeline/query/QueryRouter.ts) (`verifyCitations: true` there reuses the router's existing retrieval and embedding paths).

Reach for [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts) directly only when you already own both sides — generated text in one place and source chunks in another — and want to run scoring without an agent in the loop.

## Architecture

```
Agent generates response with sources
  → ClaimExtractor: split into atomic claims         (grounding-guard ext)
  → Batch embed: claims[] + sources[] (one API call) (your embedFn)
  → Cosine similarity matrix: claims × sources       (CitationVerifier)
  → Per-claim verdict: supported / weak / unverifiable / contradicted
  → Optional: NLI contradiction check                (grounding-guard nliFn)
  → Optional: web search fallback (verify_citations) (citation-verifier ext)
  → VerifiedResponse with per-claim verdicts         (citation/types.ts)
```

Each step maps to a real source surface:

- [`ClaimExtractor`](https://github.com/framersai/agentos-ext-grounding-guard/blob/master/src/ClaimExtractor.ts) ships in the [`@framers/agentos-ext-grounding-guard`](https://github.com/framersai/agentos-ext-grounding-guard) package.
- [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts) owns the similarity scoring and aggregation.
- The [`verify_citations` tool](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/citation-verifier/src/VerifyCitationsTool.ts) and its [`fact_check` companion](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/web-search/src/tools/factCheck.ts) live in the extensions registry.

## Core API

### CitationVerifier

Source: [`packages/agentos/src/cognition/rag/citation/CitationVerifier.ts`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts).

```typescript
import { CitationVerifier } from '@framers/agentos';

const verifier = new CitationVerifier({
  // Required: batch embedding function
  embedFn: async (texts: string[]) => embeddingManager.embedBatch(texts),

  // Optional: similarity thresholds (defaults shown)
  supportThreshold: 0.6,      // >= this = "supported"
  unverifiableThreshold: 0.3,  // < this = "unverifiable"

  // Optional: NLI for contradiction detection (from grounding-guard)
  nliFn: async (premise, hypothesis) => nliModel.predict(premise, hypothesis),

  // Optional: custom claim extractor (from grounding-guard)
  extractClaims: async (text) => claimExtractor.extract(text),
});
```

### Verify Claims

`verify()` accepts the input in two shapes — pick whichever matches what you already have on the calling side.

**Pattern A — pass raw LLM text and let the verifier decompose:**

```typescript
// Use this when the input is one block of LLM-generated prose and you
// want the verifier to handle decomposition (LLM-driven if you've
// configured `extractClaims`, otherwise built-in sentence splitting).
const result = await verifier.verify(
  "Tokyo is the capital of Japan. " +
  "Tokyo proper has roughly 14 million residents. " +
  "Tokyo hosted the 2020 Summer Olympics in 1457.",
  [
    { content: "Tokyo is the capital and seat of government of Japan.", url: "https://example.com/japan" },
    { content: "The population of Tokyo proper is approximately 14 million.", url: "https://example.com/tokyo" },
  ]
);
```

**Pattern B — pass a pre-decomposed claim array directly:**

```typescript
// Use this when you've already extracted the claims yourself (your own
// parser, an NER step, a user-edited list, etc.) and want each item
// scored as-is without any further decomposition. The verifier preserves
// caller-provided order in result.claims.
const claims = [
  "Tokyo is the capital of Japan.",
  "Tokyo proper has roughly 14 million residents.",
  "Tokyo hosted the 2020 Summer Olympics in 1457.",
];

const result = await verifier.verify(claims, [
  { content: "Tokyo is the capital and seat of government of Japan.", url: "https://example.com/japan" },
  { content: "The population of Tokyo proper is approximately 14 million.", url: "https://example.com/tokyo" },
]);
```

**Or inspect the extracted claims before verifying:**

```typescript
// extractClaims() exposes the same decomposition Pattern A uses
// internally, so you can filter or edit the claim list before scoring.
const claims = await verifier.extractClaims(llmGeneratedText);
const filtered = claims.filter((c) => c.length > 20);  // skip stubs
const result = await verifier.verify(filtered, sources);
```

### VerifiedResponse

Source: [`packages/agentos/src/cognition/rag/citation/types.ts`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/types.ts).

```typescript
{
  claims: [
    {
      text: "Tokyo is the capital of Japan.",
      verdict: "supported",       // matches source 0
      confidence: 0.87,           // cosine similarity
      sourceIndex: 0,
      sourceSnippet: "Tokyo is the capital and seat of government of Japan.",
      sourceRef: "https://example.com/japan",
    },
    {
      text: "Tokyo proper has roughly 14 million residents.",
      verdict: "supported",       // matches source 1
      confidence: 0.83,
      sourceIndex: 1,
      sourceSnippet: "The population of Tokyo proper is approximately 14 million.",
      sourceRef: "https://example.com/tokyo",
    },
    {
      text: "Tokyo hosted the 2020 Summer Olympics in 1457.",
      verdict: "unverifiable",    // no source covers this claim
      confidence: 0.12,
    },
  ],
  overallGrounded: true,          // no contradictions
  supportedRatio: 0.67,           // 2 of 3 claims fully supported
  totalClaims: 3,
  supportedCount: 2,
  weakCount: 0,
  unverifiableCount: 1,
  contradictedCount: 0,
}
```

For a one-line human summary (`"2/3 claims verified (67%)"`), import the
[`formatVerifiedResponse`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/format.ts) helper:

```typescript
import { formatVerifiedResponse } from '@framers/agentos';
console.log(formatVerifiedResponse(result));
```

## Verdicts

| Verdict | Cosine Similarity | Meaning |
|---------|-------------------|---------|
| `supported` | >= 0.6 | Claim semantically matches a source |
| `weak` | 0.3 - 0.6 | Partial match, lower confidence |
| `unverifiable` | < 0.3 | No source matches this claim |
| `contradicted` | N/A (NLI) | NLI model detects contradiction with source |

## When Verification Runs

### QueryRouter Integration

The default [`QueryRouter`](https://github.com/framersai/agentos/blob/master/src/orchestration/pipeline/query/QueryRouter.ts) runtime can now trigger `CitationVerifier`
automatically when `verifyCitations: true` is set.

Verification runs only when both of these conditions are true:

- `route()` retrieved source chunks to verify against
- the router has an active embedding path available for similarity scoring

When verification runs successfully, the result is attached to
`QueryResult.grounding`. If either prerequisite is missing, QueryRouter skips
verification gracefully.

Outside QueryRouter, you can still use the verifier directly in host-managed
flows:

- call [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts) directly after generation
- call the [`verify_citations` tool](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/citation-verifier/src/VerifyCitationsTool.ts) from an agent workflow
- wire it into your own host/runtime around `deep_research` synthesis (see below)

### Deep Research Synthesis

[Deep Research](/features/rag-memory#query-classification) emits a synthesized report with inline
citations to every source it discovered during search and extraction. The
verifier closes the loop on that report by decomposing it into atomic claims
and scoring each against the retrieved sources — turning "the model cited it"
into "the source actually says it."

Two integration paths:

- **Automatic via QueryRouter** — set `verifyCitations: true` and the router
  attaches per-claim verdicts to `QueryResult.grounding` whenever the route
  retrieves source chunks.
- **Host-managed** — call `CitationVerifier.verify(report, sources)` directly
  after `deep_research` resolves, mapping the engine's extracted source
  content into the [`VerificationSource`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/types.ts) shape.

### On-Demand (via Tool)

Agents can call [`verify_citations`](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/citation-verifier/src/VerifyCitationsTool.ts) explicitly:

```typescript
verify_citations({
  text: "The speed of light is 300,000 km/s in a vacuum.",
  sources: [
    { content: "Light travels at 299,792 km/s in vacuum.", title: "Physics Reference" }
  ],
  webFallback: true  // search web if sources don't match
})
```

### Via Skill

The [`fact-grounding` skill](https://github.com/framersai/agentos-skills/blob/master/registry/curated/fact-grounding/SKILL.md) instructs the agent to:
1. Verify key factual claims before presenting to the user
2. Mark unverified claims with "[unverified]"
3. Cite sources inline: "According to [Source Title]..."
4. Flag contradictions with both sides presented

## Web Fallback

When `webFallback: true`, unverifiable claims are checked via the [`fact_check` tool](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/web-search/src/tools/factCheck.ts) (web search):

```
Claim: "Mars has two moons"
  → No matching source in provided documents
  → Web search: "Mars has two moons fact check"
  → Verdict: TRUE (multiple sources confirm)
  → Updated to "supported" with webVerified: true
```

Requires a search API key (`SERPER_API_KEY`, `TAVILY_API_KEY`, or `BRAVE_API_KEY`).

## Claim Extraction

Claims are extracted using sentence splitting by default:

1. Strip code blocks
2. Split on sentence boundaries (`. `, `! `, `? `)
3. Filter: remove questions, hedging ("I think..."), meta-text ("Let me know...")
4. Keep claims longer than 15 characters

For higher quality extraction, install [`@framers/agentos-ext-grounding-guard`](https://github.com/framersai/agentos-ext-grounding-guard) — its [`ClaimExtractor`](https://github.com/framersai/agentos-ext-grounding-guard/blob/master/src/ClaimExtractor.ts) provides LLM-based claim decomposition that handles complex sentences with multiple assertions.

## Performance

- **Embedding cost**: One batch call per verification (claims + sources)
- **Compute**: Cosine similarity matrix is O(claims × sources) — sub-millisecond for typical sizes
- **Total overhead**: ~50ms for 5 claims × 5 sources (excluding embedding latency)
- **No LLM calls** unless NLI or web fallback is triggered

## Source Files

| Symbol | Repo | Path |
|---|---|---|
| [`CitationVerifier`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/CitationVerifier.ts) | `framersai/agentos` | `src/cognition/rag/citation/CitationVerifier.ts` |
| [`VerifiedResponse`, `VerificationSource`, `ClaimVerdict`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/types.ts) (types) | `framersai/agentos` | `src/cognition/rag/citation/types.ts` |
| [`formatVerifiedResponse`](https://github.com/framersai/agentos/blob/master/src/cognition/rag/citation/format.ts) | `framersai/agentos` | `src/cognition/rag/citation/format.ts` |
| [Citation tree (re-exports)](https://github.com/framersai/agentos/tree/master/src/cognition/rag/citation) | `framersai/agentos` | `src/cognition/rag/citation/` |
| [`QueryRouter`](https://github.com/framersai/agentos/blob/master/src/orchestration/pipeline/query/QueryRouter.ts) | `framersai/agentos` | `src/orchestration/pipeline/query/QueryRouter.ts` |
| [`ClaimExtractor`](https://github.com/framersai/agentos-ext-grounding-guard/blob/master/src/ClaimExtractor.ts) | `framersai/agentos-ext-grounding-guard` | `src/ClaimExtractor.ts` |
| [Grounding Guard package root](https://github.com/framersai/agentos-ext-grounding-guard) | `framersai/agentos-ext-grounding-guard` | (root) |
| [`verify_citations` tool (`VerifyCitationsTool`)](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/citation-verifier/src/VerifyCitationsTool.ts) | `framersai/agentos-extensions` | `registry/curated/research/citation-verifier/src/VerifyCitationsTool.ts` |
| [`fact_check` tool](https://github.com/framersai/agentos-extensions/blob/master/registry/curated/research/web-search/src/tools/factCheck.ts) | `framersai/agentos-extensions` | `registry/curated/research/web-search/src/tools/factCheck.ts` |
| [`fact-grounding` skill (`SKILL.md`)](https://github.com/framersai/agentos-skills/blob/master/registry/curated/fact-grounding/SKILL.md) | `framersai/agentos-skills` | `registry/curated/fact-grounding/SKILL.md` |

## Related Features

- [Grounding Guard](/extensions/built-in/grounding-guard) — real-time NLI streaming verification (guardrail)
- [Reranker Chain](/features/rag-memory#reranker-chain) — multi-stage result ranking before citation
- [Deep Research](/features/rag-memory#query-classification) — multi-source research pipeline whose synthesized report feeds directly into the verifier
- [Content Policy Rewriter](/extensions/built-in/content-policy-rewriter) — content filtering guardrail
