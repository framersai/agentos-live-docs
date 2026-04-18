---
title: "Citation Verification"
sidebar_position: 4.5
---

Decompose agent responses into atomic claims, verify each against sources using cosine similarity, and flag unsupported or contradicted statements.

## Why Citation Verification?

LLMs confidently generate claims that may not be grounded in the sources they retrieved. Citation verification closes the loop: after generation, each claim is checked against the actual source material to produce per-claim verdicts with confidence scores.

## Architecture

```
Agent generates response with sources
  → ClaimExtractor: split into atomic claims
  → Batch embed: claims[] + sources[] (one API call)
  → Cosine similarity matrix: claims × sources
  → Per-claim verdict: supported / weak / unverifiable / contradicted
  → Optional: NLI contradiction check
  → Optional: web search fallback for unverifiable claims
  → VerifiedResponse with per-claim verdicts
```

## Core API

### CitationVerifier

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

```typescript
const result = await verifier.verify(
  "Tokyo has 14 million people. It was founded in 1457.",
  [
    { content: "Tokyo proper has a population of about 14 million.", url: "https://example.com" },
    { content: "Tokyo is the capital of Japan, established in 1603.", url: "https://example.com/history" },
  ]
);
```

### VerifiedResponse

```typescript
{
  claims: [
    {
      text: "Tokyo has 14 million people.",
      verdict: "supported",       // matches source 0
      confidence: 0.87,           // cosine similarity
      sourceIndex: 0,
      sourceSnippet: "Tokyo proper has a population of about 14 million.",
      sourceRef: "https://example.com"
    },
    {
      text: "It was founded in 1457.",
      verdict: "weak",            // partial match (source says 1603)
      confidence: 0.45,
      sourceIndex: 1,
      sourceSnippet: "Tokyo is the capital of Japan, established in 1603."
    }
  ],
  overallGrounded: true,          // no contradictions
  supportedRatio: 0.5,            // 1 of 2 claims fully supported
  totalClaims: 2,
  supportedCount: 1,
  weakCount: 1,
  unverifiableCount: 0,
  contradictedCount: 0,
  summary: "1/2 claims verified (50%)"
}
```

## Verdicts

| Verdict | Cosine Similarity | Meaning |
|---------|-------------------|---------|
| `supported` | >= 0.6 | Claim semantically matches a source |
| `weak` | 0.3 - 0.6 | Partial match, lower confidence |
| `unverifiable` | < 0.3 | No source matches this claim |
| `contradicted` | N/A (NLI) | NLI model detects contradiction with source |

## When Verification Runs

### Automatic (via QueryRouter)

```json title="agent.config.json"
{
  "queryRouter": {
    "verifyCitations": true
  }
}
```

| Research Depth | Behavior |
|---|---|
| `deep` | Always verifies automatically |
| `moderate` | Only if `verifyCitations: true` |
| `quick` / `none` | Never automatic |

When enabled, `QueryResult.grounding` contains the full `VerifiedResponse`.

### On-Demand (via Tool)

Agents can call `verify_citations` explicitly:

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

The `fact-grounding` skill instructs the agent to:
1. Verify key factual claims before presenting to the user
2. Mark unverified claims with "[unverified]"
3. Cite sources inline: "According to [Source Title]..."
4. Flag contradictions with both sides presented

## Web Fallback

When `webFallback: true`, unverifiable claims are checked via the `fact_check` tool (web search):

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

For higher quality extraction, install `@framers/agentos-ext-grounding-guard` which provides LLM-based claim decomposition that handles complex sentences with multiple assertions.

## Performance

- **Embedding cost**: One batch call per verification (claims + sources)
- **Compute**: Cosine similarity matrix is O(claims × sources) — sub-millisecond for typical sizes
- **Total overhead**: ~50ms for 5 claims × 5 sources (excluding embedding latency)
- **No LLM calls** unless NLI or web fallback is triggered

## Related Features

- [Grounding Guard](/extensions/built-in/grounding-guard) — real-time NLI streaming verification (guardrail)
- [Reranker Chain](/features/reranker-chain) — multi-stage result ranking before citation
- [Deep Research](/features/deep-research) — automatic citation verification on synthesis
- [Content Policy Rewriter](/extensions/built-in/content-policy-rewriter) — content filtering guardrail
