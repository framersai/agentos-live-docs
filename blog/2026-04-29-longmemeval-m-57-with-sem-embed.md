---
title: "57.6% on LongMemEval-M: First Public M Number Above 50%"
description: "AgentOS hits 57.6% [53.2%, 61.8%] on LongMemEval-M at Phase B N=500. +12.2 pp over the prior CharHash-era 45.4% baseline, CIs disjoint. The same two axes (semantic embedder + per-category reader router) that drove S 85.6% transfer to the 1.5M-token M variant."
authors: [jddunn]
audience: engineer
tags: [memory, benchmarks, longmemeval, longmemeval-m, semantic-embedding, reader-router, scale]
keywords: [longmemeval-m, agentos memory benchmark, semantic embedding, reader router, multi-session memory at scale]
image: /img/blog/longmemeval-m-57.png
---

> "A measurement is the comparison of an unknown to a standard, where the standard has been agreed to and is reproducible."
>
> — paraphrased after the Bureau International des Poids et Mesures

Two benchmark axes — the embedder and the reader router — moved together in this post. The +12.2 pp lift is attributable to those two changes with the third axis (top-K) deliberately held constant so the result could be isolated. A day later we moved the third axis and the number jumped again. This is what disciplined ablation looks like when each variable gets its own Phase B budget.

:::tip Update 2026-04-29
The 57.6% headline below has been superseded by **[70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md)** at $0.0078/correct, validated at full Phase B N=500. Single-variable change: lowering reader-top-K from 50 to 5. **+12.6 pp aggregate over 57.6%, CIs disjoint. Competitive with the strongest published M results in the LongMemEval paper ([Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813); paper's round-Top-5 65.7%, session-Top-5 71.4%, round-Top-10 72.0%)**. Statistically tied with [AgentBrain's](https://github.com/AgentBrainHQ) closed-source SaaS 71.7%. The 57.6% post below is preserved as a load-bearing intermediate calibration: it isolates the +12.2 pp lift attributable to sem-embed + reader-router (top-K=50 held constant), separate from the +12.6 pp lift attributable to top-K=5 (sem-embed + reader-router held constant).
:::

The prior LongMemEval-M Phase B headline was **45.4% [41.2%, 49.8%]** at the M-tuned config (HyDE + reader-top-K 50 + rerank-candidate-multiplier 5) with the bench's `CharHashEmbedder` lexical-hash fallback. First public LongMemEval-M number for any orchestration-router architecture, run on the same fallback embedder that produced the misleading 76.6% S headline a few weeks ago.

Re-running M Phase B at full N=500 with `text-embedding-3-small` plus the per-category reader router (the same two-axis architecture that drove the [S 85.6% headline](2026-04-28-reader-router-pareto-win.md)) lifts aggregate accuracy to **57.6% [53.2%, 61.8%]** at $0.0505 per correct. **+12.2 pp over the CharHash baseline, CIs disjoint.** First public LongMemEval-M number above 50% from any orchestration-router architecture. Mem0 v3, Mastra OM, Hindsight, Supermemory, and EmergenceMem all publish only the easier S variant.

<!-- truncate -->

## The result

Phase B at full N=500, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10,000 resamples, seed 42:

| Metric | CharHash baseline (prior) | sem-embed + reader router (this post) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 45.4% [41.2%, 49.8%] | **57.6% [53.2%, 61.8%]** | +12.2 pp |
| Cost per correct | $0.1348 | **$0.0505** | -$0.0843 per correct |
| Total LLM cost | $30.59 | $14.56 | -52% |
| Avg latency | 40,271 ms | 264,933 ms | +6.6x |
| p50 latency | not measured | 22,166 ms | reference |
| p95 latency | not measured | 911,071 ms (heavy tail from rate-limit retries on 1.5M-token haystacks) | reference |

Per-category at Phase B (n in parens):

| Category | CharHash baseline | sem-embed + reader router | Δ |
|---|---:|---:|---:|
| **single-session-user** (n=70) | 78.6% | **95.7% [90.0%, 100%]** | +17.1 pp |
| **single-session-assistant** (n=56) | 91.1% | **96.4% [91.1%, 100%]** | +5.3 pp |
| **knowledge-update** (n=78) | 62.8% | **76.9% [66.7%, 85.9%]** | +14.1 pp |
| **temporal-reasoning** (n=133) | 22.6% | **42.1% [33.8%, 51.1%]** | +19.5 pp |
| **single-session-preference** (n=30) | 28.6% | **40.0% [23.3%, 56.7%]** | +11.4 pp |
| multi-session (n=133) | 26.2% | 29.3% [21.8%, 36.8%] | +3.1 pp |

The two retrieval-saturated categories (TR and SSU) move the most. Multi-session lifts the least at +3.1 pp, consistent with the S-side finding: at any haystack scale, MS bridge queries are bottlenecked by something other than retrieval-recall (six adjacent S-side probes documented in [the S Pareto-win post](2026-04-28-reader-router-pareto-win.md), all failing to lift MS).

## Architectural unlock

Two independent axes contribute, both validated separately on S Phase B.

### `text-embedding-3-small` replaces `CharHashEmbedder`

The Stage J Phase B baseline 30.6% canonical and the prior M-tuned 45.4% both used CharHash because the bench falls back to a deterministic lexical-hash stub when no embedder is configured. That fallback exists for smoke tests in CI without API keys. It is not what real consumers wiring `@framers/agentos` memory primitives use in deployment.

The exact same gap surfaced on S Phase B: 76.6% on CharHash → 83.2% on sem-embed at gpt-4o reader, +6.6 pp aggregate, with the lift concentrated on TR and MS where lexical hashing fundamentally cannot bridge paraphrase-rich multi-hop queries.

### Per-category reader router (`min-cost-best-cat-2026-04-28`)

Calibrated from LongMemEval-S Phase B per-category accuracy split between gpt-4o and gpt-5-mini at the same retrieval stack:

| Category | Picked reader | Reason |
|---|---|---|
| temporal-reasoning | gpt-4o | gpt-4o wins by +11.8 pp on TR |
| single-session-user | gpt-4o | gpt-4o wins by +4.3 pp on SSU |
| single-session-preference | gpt-5-mini | gpt-5-mini wins by +23.4 pp |
| single-session-assistant | gpt-5-mini | tied accuracy, gpt-5-mini cheaper |
| knowledge-update | gpt-5-mini | tied accuracy, gpt-5-mini cheaper |
| multi-session | gpt-5-mini | gpt-5-mini wins by +3.5 pp on MS |

The router is opt-in via `--reader-router min-cost-best-cat-2026-04-28` and productionized as the `MIN_COST_BEST_CAT_2026_04_28_TABLE` constant in `@framers/agentos/memory-router` for consumers building their own memory pipelines.

The S-side finding: dropping the Tier 3 minimize-cost policy router (whose CharHash-era MS+SSP → OM-v11 calibration was stale for sem-embed deployments) plus the per-category reader router lifts S from 83.2% → 85.6%. Cost per correct drops from $0.0521 to $0.0090 ($52 per 1,000 calls down to $9 per 1,000). On M, the M-tuned config (HyDE + reader-top-K 50 + rerank-candidate-multiplier 5) is a separate optimization. Sem-embed + reader router layer cleanly on top.

## Cost breakdown

The 2.7x cost reduction vs the prior 45.4% headline is explained by where each LLM call goes:

- **CharHash 45.4% baseline.** Every case used gpt-4o for the full reader pass at top-K 50. 500 × ~$0.06 reader cost ≈ $30.
- **sem-embed + reader router 57.6%.** 47% of cases route to gpt-4o (TR + SSU classified, ~235 cases), 53% route to gpt-5-mini (~265 cases). gpt-5-mini input is $0.00025/1k tokens vs gpt-4o's $0.0025/1k, so the routed half pays the cheaper per-token rate while reading the same top-K 50 chunks. Total LLM cost: $30 → $14.56 (-$15.44 across 500 cases, equivalently -$30.88 per 1,000 cases).

The latency increase (40 sec → 265 sec avg) is real and entirely from rate-limit retries on the 1.5M-token haystacks. p50 latency is 22 sec; p95 is 911 sec. A small set of cases hit OpenAI rate limits during the sem-embed bulk-encoding step and waited 30-180 sec for retry windows. On a paid-tier OpenAI account with higher rate limits, the avg latency would compress significantly. Reader cost per correct (the cleaner Pareto axis) falls 2.7x regardless of the rate-limit tail.

## Methodology disclosures

Apples-to-apples vs the prior 45.4% M-tuned headline:

- **Same dataset.** `data/longmemeval/longmemeval_m.json`, 500 cases, ~1.5M-token haystacks, 500 sessions per haystack.
- **Same judge.** `gpt-4o-2024-08-06` with the LongMemEval upstream rubric, judge FPR 2% [0%, 5%] at n=100 ([Stage G probe](https://github.com/framersai/agentos-bench/blob/master/docs/SESSION_2026-04-24_TRANSPARENT_NEGATIVES.md)).
- **Same retrieval baseline knobs.** Cohere `rerank-v3.5` candidate-multiplier 5, reader-top-K 50, HyDE on. Already calibrated and Phase B-validated as the M-tuned config.
- **Same bootstrap CI methodology.** 10,000 Mulberry32 resamples, seed 42, percentile 95% CI.

Two changes vs the prior 45.4% baseline:

- `--embedder-model text-embedding-3-small` (was: CharHashEmbedder fallback)
- `--reader-router min-cost-best-cat-2026-04-28` (was: single gpt-4o reader)

Cache fingerprint: each axis is partitioned in the case-run + case-result cache fingerprints (`embedderModel:<model>` + `reader-router:<preset>` + `reader-router-standalone-classifier:v1`). The new run did not collide with prior CharHash or single-reader cache buckets.

## Compared to published vendor numbers

| System | Variant | Number | Reader | Source |
|---|---|---:|---|---|
| **AgentOS M-tuned + sem-embed + reader router** | M (1.5M tokens) | **57.6% [53.2%, 61.8%]** | gpt-4o (TR/SSU) + gpt-5-mini (rest) | this post |
| AgentOS M-tuned (CharHash baseline) | M (1.5M tokens) | 45.4% [41.2%, 49.8%] | gpt-4o | [prior post](2026-04-26-longmemeval-m-30-to-57.md) |
| AgentOS Tier 1 canonical | M (1.5M tokens) | 30.6% | gpt-4o | [first M number](2026-04-26-longmemeval-m-first-published-number.md) |
| Mem0 v3 (managed platform) | S (115K tokens) | 93.4% | not specified | [mem0.ai](https://mem0.ai/blog/state-of-ai-agent-memory-2026); only published S |
| Mastra Observational Memory | S (115K tokens) | 84.2% | gpt-4o | [mastra.ai](https://mastra.ai/research/observational-memory); only published S |
| Hindsight | S (115K tokens) | 91.4% | gemini-3-pro | [vectorize.io](https://github.com/vectorize-io/hindsight); only published S |
| EmergenceMem Internal | S (115K tokens) | 86.0% | gpt-4o | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag); only published S |
| Supermemory | S (115K tokens) | 81.6%-85.2% | gpt-4o / gemini-3-pro | only published S |

**No memory-library vendor has published a LongMemEval-M number anywhere.** The dataset file is 2.7 GB and Node's `fs.readFile` rejects it because of the V8 max-string-length cap. The streaming-loader fix is documented in [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md). This is the second M number we publish (the first being the 30.6% canonical baseline) and the first M number above 50% from any architecture.

## Reproducing

```bash
git clone https://github.com/framersai/agentos
cd agentos/packages/agentos-bench
pnpm install
pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive \
  --replay ingest \
  --hybrid-retrieval --rerank cohere --rerank-candidate-multiplier 5 \
  --reader-top-k 50 --hyde \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Run JSON: [`results/runs/2026-04-28T23-35-11-601--longmemeval-m--gpt-4o--full-cognitive--ingest.json`](https://github.com/framersai/agentos-bench/blob/master/results/runs/2026-04-28T23-35-11-601--longmemeval-m--gpt-4o--full-cognitive--ingest.json).

## Where MS still leaves headroom

Multi-session at 29.3% on M is the lowest per-category score in the run, +3.1 pp over the CharHash baseline but well below the other categories. This matches the pattern at S scale, where MS sits at 74.4% as the weakest category at the 85.6% headline. Six adjacent retrieval-broadening probes have been documented as Pareto-skipped on S, all failing to lift MS:

- HyDE-on-MS-only S-tuned router (Phase A 22.2% MS, refuted)
- topk50-mult5-on-MS-only S-tuned router (Phase A 33.3% MS, refuted)
- Stage L Anthropic Contextual Retrieval (Phase B negative)
- Stage I Mem0-style entity-linking re-rank (Phase B negative)
- Stage H hierarchical retrieval (Phase B negative)
- M-tuned compounded on S Phase B (negative)

The architectural conclusion: at S and M scale alike, multi-session bridge queries need a different signal type than retrieval-broadening can provide. The v2 candidate is Stage E (Hindsight 4-network typed-observer), which adds a typed-graph traversal signal orthogonal to BM25 + dense + Cohere rerank. Architecture follows [Hindsight (vectorize.io, arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1).

## Theoretical grounding

The two-axis decomposition (semantic embedder + per-category reader router) maps directly to the **CoALA framework** (Sumers et al., [arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): the embedder sits in the retrieval module; the reader router sits in the decision-making module. CoALA argues that explicit decomposition between memory access and decision-making is what distinguishes a cognitive architecture from a chatbot wrapper. The benchmark numbers in this post measure that decomposition's behavior on a 1.5M-token haystack distribution.

## Related

- [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md). The S-side Pareto-win post; same two axes.
- [83.2% on LongMemEval-S with semantic embedder](2026-04-27-longmemeval-s-83-with-semantic-embedder.md). The prior S sem-embed lift (+6.6 pp over CharHash).
- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The current M headline.
- [From 30.6% to 45.4% on LongMemEval-M](2026-04-26-longmemeval-m-30-to-57.md). The M-tuned config introduction.
- [First Public LongMemEval-M Number](2026-04-26-longmemeval-m-first-published-number.md). The 30.6% Tier 1 canonical baseline.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md).
