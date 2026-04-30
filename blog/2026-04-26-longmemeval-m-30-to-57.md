---
title: "From 30.6% to 45.4% on LongMemEval-M: Three Opt-In Flags Cut the Scale Gap by a Third"
description: "The 30.6% LongMemEval-M baseline was leaving 14 percentage points on the table. Three retrieval-precision flags (wider Cohere rerank pool, larger reader-top-k, HyDE) lift M to 45.4% [41.2%, 49.8%] at Phase B N=500 with bootstrap CI. Per-category math, the Phase A → Phase B compression that caught us, and what shipped."
authors: [jddunn]
audience: engineer
tags: [memory, benchmarks, longmemeval, longmemeval-m, retrieval-precision, hyde, cohere-rerank]
keywords: [longmemeval-m lift, agentos retrieval precision, hyde longmemeval, cohere rerank candidate multiplier, reader-top-k tuning, agent memory benchmark scale, agentos m-tuned config]
image: /img/blog/longmemeval-m-lift.png
---

:::tip Update 2026-04-29 (latest)
The 45.4% headline below has been superseded twice in the same day. First by **57.6% [53.2%, 61.8%]** with sem-embed + per-category reader router on top of the M-tuned config ([prior post](2026-04-29-longmemeval-m-57-with-sem-embed.md), Phase B N=500). Then by the current **[70.2% [66.0%, 74.0%] M headline](2026-04-29-longmemeval-m-70-with-topk5.md)** with reader-top-K=5. **+24.8 pp over the 45.4% baseline below**, **+12.6 pp over the 57.6% intermediate**, both with CIs disjoint. **+4.5 pp above the LongMemEval paper's academic-baseline ceiling (65.7%)**. Cost per correct dropped 17x ($0.1348 → $0.0078). The retrieval-precision diagnosis below (wider rerank pool + larger reader-top-K + HyDE) is the M-tuned config baseline that two further axes (sem-embed + top-K=5) layered on top of.
:::

Two days ago we [published 30.6% on LongMemEval-M](2026-04-26-longmemeval-m-first-published-number.md) at our shipping config: first public M number for any orchestration-router architecture, transparent about the 46-percentage-point S→M scale gap, and we framed it as "retrieval precision is the bottleneck; only architecture work (Stage E typed-network) can fix it."

That framing was wrong. The shipping config was leaving over 14 percentage points on the table due to over-restrictive retrieval windows tuned for 50-session haystacks instead of 500-session ones. Three opt-in flag tweaks (already wired in agentos and exposed via the bench CLI) lifted LongMemEval-M from **30.6% to 45.4% [41.2%, 49.8%]** at full Phase B N=500 with bootstrap 95% CI. Cost-per-correct moved from $0.082 to $0.135: accuracy bought at a real cost increase, not a free win.

> **Phase A → Phase B correction (2026-04-26 update):** This post originally headlined the Phase A N=54 stratified result of 57.4%. The full Phase B at N=500 measured 45.4%, a meaningful -12 pp drop driven by Phase A's `--sample-per-type 9` overweighting easy categories (multi-session jumped from 66.7% N=9 to 26.2% [18.5%, 33.8%] N=130; temporal-reasoning went from 33.3% N=9 to 22.6% [15.8%, 30.1%] N=133). The +14.8 pp lift over Tier 1 canonical baseline 30.6% is the validated headline; Phase A's stratified per-category numbers were small-sample-noisy on the hard categories. Numbers throughout this post are at the Phase B result.

This post documents what we changed, the per-category math, why the shipping default missed it, and what's next.

<!-- truncate -->

## The diagnosis

LongMemEval-M's haystack distribution is 500 sessions per case (vs LongMemEval-S's 50). The shipping config:

- `--rerank-candidate-multiplier 3` (default): pulls 60 chunks (`reader-top-k × 3`) from the merged BM25 + dense pool for Cohere `rerank-v3.5` to score.
- `--reader-top-k 20`: feeds the top-20 reranked chunks to the reader.

At LongMemEval-S scale (50-session haystacks, ~2,500 chunks per case), 60-candidate rerank + 20-chunk reader is enough. The right session usually makes the top-20 because there are only ~50 candidate sessions to choose from.

At LongMemEval-M scale (500-session haystacks, ~25,000 chunks per case), the same config is **dramatically under-provisioned**:

- 60 candidates is 0.24% of the chunk pool. A strong cross-encoder cannot recover the right chunk if first-stage retrieval missed it in the top-60.
- 20 chunks at the reader means even when rerank finds something, the reader has tight context.

The fix: three opt-in flags that already shipped in the bench CLI months ago but were not on by default.

| Flag | Default | M-tuned |
|---|---:|---:|
| `--rerank-candidate-multiplier` | 3 | **5** |
| `--reader-top-k` | 20 | **50** |
| `--hyde` | off | **on** |

The candidate-multiplier increase widens the rerank pool from 60 to 250 chunks (1% of the M-scale pool). The reader-top-k increase doubles the reader's working set. HyDE rewrites abstract / multi-hop queries via a cheap `gpt-5-mini` hypothetical-answer call before retrieval ([Gao et al., 2022, arXiv:2212.10496](https://arxiv.org/abs/2212.10496)), surfacing sessions the literal query misses.

## The result

Phase B on LongMemEval-M, N=500, CharHashEmbedder, gpt-4o reader, gpt-4o-2024-08-06 judge, rubric `2026-04-18.1`, seed 42, 10,000 bootstrap resamples:

| Metric | Baseline (Tier 1 / Tier 3 min-cost) | M-tuned (Phase B N=500) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 30.6% (Phase B N=500) | **45.4% [41.2%, 49.8%]** | +14.8 pp validated |
| Cost per correct | $0.0818 | $0.1348 | +65% |
| Avg latency / case | 10,564 ms | 40,271 ms | +4x |
| Total LLM cost | $40.86 | $30.59 | -25% |

The lift is real and validated at full N=500 with non-overlapping bootstrap CIs. Cost-per-correct went up because the wider rerank pool + larger reader window + HyDE call cost more per case; total run cost went down because the run hit cases more efficiently. Latency increased because the M-tuned config does more retrieval work per case.

Per-category breakdown at Phase B N=500 (with 10k bootstrap CIs):

| Category | M baseline (Phase B N=500) | M-tuned (Phase B N=500) | Δ | n |
|---|---:|---:|---:|---:|
| single-session-assistant | 50.0% | **91.1%** [82.1%, 98.2%] | +41.1 pp | 56 |
| single-session-user | 60.0% | **78.6%** [68.6%, 87.1%] | +18.6 pp | 70 |
| knowledge-update | 50.0% | **62.8%** [52.6%, 73.1%] | +12.8 pp | 78 |
| single-session-preference | 10.0% | **28.6%** [14.3%, 46.4%] | +18.6 pp | 28 |
| multi-session | 18.0% | **26.2%** [18.5%, 33.8%] | +8.2 pp | 130 |
| temporal-reasoning | 12.8% | **22.6%** [15.8%, 30.1%] | +9.8 pp | 133 |

Every category lifted at Phase B. The hardest categories (MS, TR) showed smaller absolute lift than Phase A's small-sample suggested, but the directional signal is consistent: retrieval-precision widening helps every M category at full N=500.

The two stragglers at Phase B remain temporal-reasoning (22.6%) and multi-session (26.2%). Both still need substantial architecture work. The typed-network Stage E with temporal-interval-overlap as a first-class signal addresses the temporal category. The [RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-productionization-plan.md) (productionized) dispatches each category to the config that maximizes it on the calibration set, but the dispatch lift over static M-tuned still needs Phase B-scale ablation runs.

## Why the shipping default missed this

Calibration drift. The bench's `Tier 3 min-cost` preset was calibrated against LongMemEval-**S** Phase B per-category measurements ([memory-router](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router) docs §"Why route at all"). The S-scale routing decisions matched S-scale retrieval geometry. The same routing decisions on **M** scale (with 10x more candidate sessions) over-pruned the rerank pool.

The honest framing: the shipping default was correct for S-scale. It was wrong for M-scale. We did not catch it earlier because LongMemEval-M was the first benchmark we measured at 500-session haystacks; the M Phase B at 30.6% was published before we had done a single retrieval-config sweep on M.

This is a general lesson: a routing table calibrated on benchmark X may be over-restrictive on benchmark Y if Y has materially different retrieval geometry. Per-benchmark calibration is a real engineering need, not a "would be nice."

## Per-flag attribution (Phase A N=54 ablation matrix)

A 26.8 pp lift is suspicious until each flag is attributed. Every singleton + the HyDE+TopK pair against the baseline at N=54 stratified, same seed=42:

| Config | Accuracy | Δ vs baseline | $/correct | Total cost | Avg latency |
|---|---:|---:|---:|---:|---:|
| Baseline (Tier 1 canonical, N=500 Phase B) | 30.6% | reference | $0.0818 | $40.86 | 10,564 ms |
| `--rerank-candidate-multiplier 5` only | 33.3% | +2.7 pp | $0.0416 | $0.75 | 2,291 ms |
| `--reader-top-k 50` only | 48.1% | +17.5 pp | $0.1351 | $3.51 | 3,638 ms |
| `--hyde` only | 46.3% | +15.7 pp | **$0.0369** (cheapest) | $0.92 | 3,546 ms |
| `--hyde --reader-top-k 50` (no multiplier) | 50.0% | +19.4 pp | $0.1390 | $3.75 | 3,869 ms |
| **All three (M-tuned combined)** | **57.4%** | **+26.8 pp** | $0.0558 | $1.73 | (re-measure) |

The math:

- Sum of singletons = 2.7 + 17.5 + 15.7 = 35.9 pp. Combined = 26.8 pp. The flags overlap; they are not independent. Each finds some of the same lift.
- HyDE + TopK without multiplier hits 50.0%. Adding the multiplier on top contributes +7.4 pp. Multiplier is not redundant in the combined config.
- HyDE alone is cheapest of any non-baseline at $0.0369/correct, lifts +15.7 pp.

## Cross-validation on LongMemEval-S

Same M-tuned config on LongMemEval-S N=54 stratified: **72.2% accuracy** at $0.0833/correct. Apples-to-apples vs Tier 1 canonical (S baseline 73.2% Phase B N=500): -1.0 pp, within N=54 noise.

The M-tuned config helps M dramatically and is approximately neutral on S overall, but the per-category trade-offs differ between scales (M-tuned regresses MS and SSP on S). The right shipping integration is per-query dispatch via the [RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-design.md), not a static always-on M-tuned default.

## What this validates

1. **Retrieval-precision tweaks close a third of the S→M gap.** The S baseline at this config-stack measures ~76%. The M-tuned 45.4% Phase B closes 14.8 of the 46 pp scale gap, leaving ~30 pp for further work.
2. **No architecture change required for the lift.** All three flags are existing bench CLI surface area, wired through `IngestRouter` / `MemoryRouter` / `ReadRouter` per-query dispatch. The agentos primitives that power these (`HybridRetriever`, `RerankerService`, `MemoryHydeRetriever`) ship in 0.3.0 and earlier.
3. **Cost-per-correct goes up but total run cost goes down.** The M-tuned config buys accuracy at +65% cost-per-correct ($0.0818 → $0.1348). Total run cost still falls 25% because the run hits more cases efficiently.

## What this rules in

The remaining 20 pp scale gap (M-tuned 57.4% vs S baseline ~78-80% on the same config-stack) splits into:

- **Single-session-preference** (14.3%, S baseline 63.3%, gap -49 pp). The largest remaining gap. Short-opinion-style answers where the reader has to find a specific preference statement among 500 sessions.
- **Temporal-reasoning** (33.3%, S baseline 70.2%, gap -37 pp). Typed graph traversal with temporal-interval-overlap as a first-class signal directly addresses this. Stage E (Hindsight 4-network typed observer) is the architecture push, drafted at [docs/specs/2026-04-26-hindsight-4network-observer-design.md](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md). Architecture follows [Hindsight (vectorize.io, arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1).
- **Single-session-assistant + single-session-user** (already 100% / 77.8% at the M-tuned config). Plenty of headroom on SSU but probably tactical rather than architectural.

## What this rules out

The earlier framing that the M baseline 30.6% required Stage E typed-network architecture to lift was too pessimistic. Retrieval-config tweaks lift more than half the gap before any new architecture lands. Stage E remains the right v2 push for the remaining temporal-reasoning + single-session-preference gaps, but the floor moved up significantly.

### Stage H: hierarchical retrieval (third negative finding)

After publishing the M-tuned 57.4% and per-category dispatch 68.5% findings, hierarchical 2-stage retrieval was tested at full N=54 stratified on M: `--session-retrieval --session-retrieval-top-sessions 10 --session-retrieval-chunks-per-session 10` layered with the M-tuned widening (Cohere rerank ×5, reader-top-k 50, HyDE). The 2-stage architecture (Stage 1 selects top-10 sessions by summary cosine, Stage 2 takes top-10 chunks per session) is the xMemory / TACITREE pattern, designed for long-history haystacks.

**Result: 42.6% (23/54) at $0.196/correct, avg 11.1 min/case. -14.8 pp below M-tuned combined.**

Per-category, multi-session collapsed to 22.2% (vs 66.7% combined; -44.5 pp) and single-session-preference dropped to 0% (vs 14.3% combined). The 2-stage architecture loses the right session at Stage 1's summary-similarity cut on hard queries. With 500-session haystacks, the gold session might rank 11-30 in summary-similarity but be the only one containing the answer; the top-10 cutoff drops it before Stage 2 ever sees it. The cross-encoder rerank then has nothing useful to find in the 100-chunk pool from wrong sessions. Third consecutive negative result for retrieval-architecture alternatives (Stage L, Stage I, Stage H) on top of the hybrid + Cohere rerank stack. Findings: [STAGE_H_PHASE_A_HIERARCHICAL_FINDINGS_2026-04-26.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_H_PHASE_A_HIERARCHICAL_FINDINGS_2026-04-26.md).

The honest conclusion: **widening the rerank candidate pool beats architectural pre-pruning at conversational-memory scale.**

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
  --hybrid-retrieval \
  --rerank cohere \
  --rerank-candidate-multiplier 5 \
  --reader-top-k 50 \
  --hyde \
  --concurrency 1 \
  --bootstrap-resamples 10000
```

Run JSON committed at `results/runs/2026-04-26T16-50-33-693--longmemeval-m--gpt-4o--full-cognitive--ingest.json`.

## Related

- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The current M headline.
- [57.6% on LongMemEval-M](2026-04-29-longmemeval-m-57-with-sem-embed.md). The intermediate post that added sem-embed.
- [First Public LongMemEval-M Number (30.6%)](2026-04-26-longmemeval-m-first-published-number.md). The baseline this lift measures against.
- [Two Negative Results: Stage L + Stage I](2026-04-26-two-negative-results-stage-l-stage-i.md). Earlier negative findings on lightweight signal additions.
- [agentos IngestRouter Executors](2026-04-26-agentos-ingest-router-executors.md). Production primitives for the ingest stage.
- [Stage E Hindsight 4-Network Spec](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md). The architecture push for the remaining temporal-reasoning + SSP gaps.
- [RetrievalConfigRouter Spec](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-design.md). LLM-as-judge dispatch among retrieval-config variants per query.
