---
sidebar_position: 30
---

# Citation Verifier

Verify claims in agent responses against sources using semantic similarity with optional web fallback.

## Overview

The citation verifier decomposes text into atomic claims, embeds them alongside source documents, and uses cosine similarity to determine whether each claim is supported by a source. Claims that can't be verified against provided sources can optionally be checked via web search.

**Package:** `@framers/agentos-ext-citation-verifier`

## When Citations Are Verified

| Research Depth | Automatic Verification | Config Override |
|---|---|---|
| `none` / `quick` | No | `verifyCitations: true` in config |
| `moderate` | No | `verifyCitations: true` in config |
| `deep` | **Yes** (automatic) | Always on |
| On-demand | Agent calls `verify_citations` tool | N/A |

## Tool: `verify_citations`

```typescript
verify_citations({
  text: "The Earth orbits the Sun at ~150 million km.",
  sources: [{ content: "Earth's orbital distance averages 149.6 million km." }],
  webFallback: true
})
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text containing claims to verify |
| `sources` | array | No | Sources to check against |
| `webFallback` | boolean | No | Search web for unverifiable claims |

### Output

```json
{
  "claims": [
    {
      "text": "The Earth orbits the Sun at ~150 million km.",
      "verdict": "supported",
      "confidence": 0.87,
      "source": { "snippet": "Earth's orbital distance averages 149.6 million km." }
    }
  ],
  "totalClaims": 1,
  "supportedCount": 1,
  "supportedRatio": 1.0,
  "summary": "1/1 claims verified (100%)"
}
```

## Verdicts

- **supported** (similarity >= 0.6) — claim matches a source
- **weak** (similarity 0.3-0.6) — partial match, lower confidence
- **unverifiable** (similarity < 0.3) — no source matches
- **contradicted** — NLI model detects contradiction with source

## Configuration

```json title="agent.config.json"
{
  "queryRouter": {
    "verifyCitations": true
  }
}
```

When enabled, responses from `moderate` and `deep` research queries include a `grounding` field with per-claim verdicts.

## Core API (Programmatic)

```typescript
import { CitationVerifier } from '@framers/agentos';

const verifier = new CitationVerifier({
  embedFn: async (texts) => embeddingManager.embed(texts),
  supportThreshold: 0.6,
  unverifiableThreshold: 0.3,
});

const result = await verifier.verify(
  "Tokyo has a population of 14 million.",
  [{ content: "Greater Tokyo metropolitan area: 37 million. Tokyo proper: 14 million." }]
);
// result.claims[0].verdict === 'supported'
```

## Related

- **`fact-grounding` skill** — instructs agents to verify claims before presenting
- **`grounding-guard` guardrail** — real-time NLI streaming verification
- **`fact_check` tool** — web-based single-claim verification
- **Reranker chain** — multi-stage result ranking before citation
