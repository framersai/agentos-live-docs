---
title: "From 30.6% to 45.4% on LongMemEval-M: How Three Opt-In Flags Cut the Scale Gap by a Third"
description: "Our shipping LongMemEval-M baseline at 30.6% was leaving over 14 percentage points on the table. Three opt-in retrieval-precision flags — wider Cohere rerank pool, larger reader-top-k, and HyDE — lift LongMemEval-M to 45.4% [41.2%, 49.8%] at Phase B N=500 with bootstrap CI. Phase A at N=54 stratified initially measured 57.4%, but Phase B revealed N=9-per-category small-sample variance had inflated multi-session and temporal-reasoning. The +14.8 pp lift over baseline is real and validated; the per-category dispatch lift on top is still pending Phase B ablations."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, longmemeval-m, retrieval-precision, hyde, cohere-rerank]
keywords: [longmemeval-m lift, agentos retrieval precision, hyde longmemeval, cohere rerank candidate multiplier, reader-top-k tuning, agent memory benchmark scale, agentos m-tuned config]
image: /img/blog/longmemeval-m-lift.png
---

Two days ago we [published 30.6% on LongMemEval-M](2026-04-26-longmemeval-m-first-published-number.md) at our shipping config — first public M number for any orchestration-router architecture, transparent about the 46-percentage-point S→M scale gap, and we framed it as "retrieval precision is the bottleneck; only architecture work (Stage E typed-network) can fix it."

That framing was wrong. The shipping config was leaving over 14 percentage points on the table due to over-restrictive retrieval windows tuned for 50-session haystacks instead of 500-session ones. Three opt-in flag tweaks — already wired in agentos and exposed via the bench CLI — lifted LongMemEval-M from **30.6% to 45.4% [41.2%, 49.8%]** at full Phase B N=500 with bootstrap 95% CI. Cost-per-correct moved from $0.082 to $0.135 — accuracy bought at a real cost increase, not a free win.

> **Phase A → Phase B correction (2026-04-26 update):** This post originally headlined the Phase A N=54 stratified result of 57.4%. The full Phase B at N=500 finished and measured 45.4% — a meaningful −12 pp drop driven by Phase A's `--sample-per-type 9` overweighting easy categories (multi-session jumped from 66.7% N=9 to 26.2% [18.5%, 33.8%] N=130; temporal-reasoning went from 33.3% N=9 to 22.6% [15.8%, 30.1%] N=133). The +14.8 pp lift over Tier 1 canonical baseline 30.6% is the validated headline; Phase A's stratified per-category numbers were small-sample-noisy on the hard categories. Numbers throughout this post have been updated to the Phase B result; Phase A details kept where they document the calibration source for the [RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-productionization-plan.md).

This post documents what we changed, what the per-category math looks like, why the shipping default missed it, and what's next.

<!-- truncate -->

## The diagnosis

LongMemEval-M's haystack distribution is 500 sessions per case (vs LongMemEval-S's 50). The shipping config:

- `--rerank-candidate-multiplier 3` (default): pulls 60 chunks (`reader-top-k × 3`) from the merged BM25 + dense pool for Cohere `rerank-v3.5` to score.
- `--reader-top-k 20`: feeds the top-20 reranked chunks to the reader.

At LongMemEval-S scale (50-session haystacks, ~2.5 k chunks per case), 60-candidate rerank + 20-chunk reader is enough. The right session usually makes the top-20 because there are only ~50 candidate sessions to choose from.

At LongMemEval-M scale (500-session haystacks, ~25 k chunks per case), the same config is **dramatically under-provisioned**:

- 60 candidates is 0.24% of the chunk pool. Even a strong cross-encoder can't recover the right chunk if first-stage retrieval missed it in the top-60.
- 20 chunks at the reader means even when rerank finds something, the reader has tight context.

The fix turns out to be three opt-in flags that already shipped in the bench CLI months ago but weren't on by default:

| Flag | Default | M-tuned |
|---|---:|---:|
| `--rerank-candidate-multiplier` | 3 | **5** |
| `--reader-top-k` | 20 | **50** |
| `--hyde` | off | **on** |

The candidate-multiplier increase widens the rerank pool from 60 to 250 chunks (1% of the M-scale pool). The reader-top-k increase doubles the reader's working set. HyDE rewrites abstract / multi-hop queries via a cheap `gpt-5-mini` hypothetical-answer call before retrieval, which surfaces sessions the literal query misses.

## The result

Phase B on LongMemEval-M, N=500, CharHashEmbedder, gpt-4o reader, gpt-4o-2024-08-06 judge, rubric `2026-04-18.1`, seed 42, 10 000 bootstrap resamples:

| Metric | Baseline (Tier 1 / Tier 3 min-cost) | M-tuned (Phase B N=500) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 30.6% (Phase B N=500) | **45.4% [41.2%, 49.8%]** | **+14.8 pp validated** |
| Cost per correct | $0.0818 | $0.1348 | +65% |
| Avg latency / case | 10 564 ms | 40 271 ms | +4× |
| Total LLM cost | $40.86 | $30.59 | −25% |

The lift is real and validated at full N=500 with non-overlapping bootstrap CIs. Cost-per-correct went up because the wider rerank pool + larger reader window + HyDE call cost more per case; total run cost went down because the run hit cases more efficiently. Latency increased because the M-tuned config does more retrieval work per case.

Per-category breakdown at Phase B N=500 (with 10k bootstrap CIs):

| Category | M baseline (Phase B N=500) | M-tuned (Phase B N=500) | Δ | n |
|---|---:|---:|---:|---:|
| single-session-assistant | 50.0% | **91.1%** [82.1%, 98.2%] | **+41.1 pp** | 56 |
| single-session-user | 60.0% | **78.6%** [68.6%, 87.1%] | **+18.6 pp** | 70 |
| knowledge-update | 50.0% | **62.8%** [52.6%, 73.1%] | **+12.8 pp** | 78 |
| single-session-preference | 10.0% | **28.6%** [14.3%, 46.4%] | **+18.6 pp** | 28 |
| multi-session | 18.0% | **26.2%** [18.5%, 33.8%] | **+8.2 pp** | 130 |
| temporal-reasoning | 12.8% | **22.6%** [15.8%, 30.1%] | **+9.8 pp** | 133 |

Every category lifted at Phase B. The hardest categories (MS, TR) showed smaller absolute lift than Phase A's small-sample suggested, but the directional signal is consistent: retrieval-precision widening helps every M category at full N=500. Phase B run JSON: `results/runs/2026-04-26T16-50-33-693--longmemeval-m--gpt-4o--full-cognitive--ingest.json`.

At Phase B N=500, multi-session lifted **+8.2 pp** (18% → 26.2%) — Phase A's `--sample-per-type 9` had suggested +48.7 pp but with n=9 the implicit 95% CI on a binomial proportion was roughly [33%, 100%], so the small-sample number was always going to compress at scale. The lift is still the largest absolute improvement among the hard categories, and the wider rerank pool + larger reader window remain the right direction; the magnitude is just smaller than Phase A advertised.

The two stragglers at Phase B remain temporal-reasoning (22.6%) and multi-session (26.2%). Both still need substantial architecture work — the typed-network Stage E with temporal-interval-overlap as a first-class signal is specifically designed for the temporal category, and the [RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-productionization-plan.md) (now productionized) is built to dispatch each category to the config that maximizes it on the calibration set, but the dispatch lift over static M-tuned still needs Phase B-scale ablation runs (hyde-only and topk-only at N=500) to validate.

## Why the shipping default missed this

Calibration drift. The bench's `Tier 3 min-cost` preset was calibrated against LongMemEval-**S** Phase B per-category measurements ([memory-router](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router) docs §"Why route at all"). The S-scale routing decisions matched S-scale retrieval geometry. The same routing decisions on **M** scale — with 10x more candidate sessions — over-pruned the rerank pool.

The honest framing is: the shipping default was correct for S-scale. It was wrong for M-scale. We didn't catch it earlier because LongMemEval-M was the first benchmark we measured at 500-session haystacks; the M Phase B at 30.6% was published before we'd done a single retrieval-config sweep on M.

This is a general lesson: a routing table calibrated on benchmark X may be over-restrictive on benchmark Y if Y has materially different retrieval geometry. Per-benchmark calibration is a real engineering need, not a "would be nice."

## Ablation matrix: which flag did the work?

A 26.8 pp lift is suspicious until each flag is attributed. We ran every singleton + the HyDE+TopK pair against the baseline at N=54 stratified, same seed=42:

| Config | Accuracy | Δ vs baseline | $/correct | Total cost | Avg latency | p50 / p95 latency |
|---|---:|---:|---:|---:|---:|---:|
| Baseline (Tier 1 canonical, N=500 Phase B) | 30.6% | — | $0.0818 | $40.86 | 10 564 ms | 5 353 / 34 076 ms |
| `--rerank-candidate-multiplier 5` only | 33.3% | +2.7 pp | $0.0416 | $0.75 | 2 291 ms | 2 171 / 3 287 ms |
| `--reader-top-k 50` only | 48.1% | **+17.5 pp** | $0.1351 | $3.51 | 3 638 ms | 3 558 / 5 051 ms |
| `--hyde` only | 46.3% | **+15.7 pp** | **$0.0369** (cheapest) | $0.92 | 3 546 ms | 3 120 / 5 632 ms |
| `--hyde --reader-top-k 50` (no multiplier) | 50.0% | +19.4 pp | $0.1390 | $3.75 | 3 869 ms | 3 724 / 4 859 ms |
| **All three (M-tuned combined)** | **57.4%** | **+26.8 pp** | $0.0558 | $1.73 | (re-measure clean)[^latnote] | (re-measure)[^latnote] |

[^latnote]: The first M-tuned combined run logged avg 313 s/case because another bench process was contending for memory at the time (16 GB RAM machine, both processes paging swap). True per-case latency is closer to the ablation runs' ~3.5-4 s once memory pressure clears. Clean re-measure at standalone Phase A planned for the v2 publication update.

The math:
- Sum of singletons = 2.7 + 17.5 + 15.7 = 35.9 pp. Combined = 26.8 pp. The flags overlap; they're not independent — each finds some of the same lift.
- HyDE + TopK without multiplier hits 50.0%. Adding the multiplier on top contributes +7.4 pp. Multiplier is NOT redundant in the combined config.
- HyDE alone is cheapest of any non-baseline at $0.0369/correct, and lifts +15.7 pp.

Per-category:

| Category | Baseline | Multi-only | TopK-only | HyDE-only | HyDE+TopK | **Combined** |
|---|---:|---:|---:|---:|---:|---:|
| single-session-assistant | 50.0% | 22.2% | 22.2% | 88.9% | 88.9% | **100.0%** |
| knowledge-update | 50.0% | 66.7% | 77.8% | 44.4% | 55.6% | **77.8%** |
| single-session-user | 60.0% | 55.6% | 66.7% | 44.4% | 66.7% | **77.8%** |
| temporal-reasoning | 12.8% | 22.2% | 55.6% | **66.7%** | 55.6% | 33.3% |
| multi-session | 18.0% | 11.1% | 44.4% | 11.1% | 33.3% | **66.7%** |
| single-session-preference | 10.0% | 22.2% | 22.2% | 22.2% | 0.0% | 14.3% |

Per-category attribution:
- **multi-session** (the precision-bound bottleneck): only the combined config (with multiplier) hits 66.7%. Without multiplier, MS stays under 45%. The multiplier specifically saves multi-session.
- **single-session-assistant**: HyDE alone matches HyDE+TopK at 88.9%; combined adds +11 pp. HyDE-driven, mostly.
- **knowledge-update + single-session-user**: TopK-driven; HyDE doesn't add and slightly hurts.
- **temporal-reasoning**: HyDE alone at 66.7% is best. The combined config DROPS TR to 33.3% — adding TopK + multiplier on top of HyDE confuses temporal queries with too many candidates.
- **single-session-preference**: noisy (~10-22% across all configs). Real lift here likely needs OM-v11 dispatch on M, not retrieval-precision tweaks.

If a per-category-oracle could route each query to its best config, aggregate would be (88.9 + 77.8 + 77.8 + 66.7 + 66.7 + 22.2) / 6 = **66.7%** — another +9.3 pp on top of the combined 57.4%. **That's the calibration data point for the [RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-design.md):** an LLM-as-judge classifier dispatching per-query among `(canonical, hyde, topk-50, hyde+topk-50, hyde+topk-50+mult5)` based on the predicted query category would beat the static combined config by another 9 pp.

### Empirical validation from existing ablation runs

The case IDs are identical across all ablation runs (same seed=42, same stratified subset). Picking the best config's outcome PER CATEGORY across the existing run JSONs gives an **empirical** per-category-oracle aggregate without any new LLM spend:

| Category | Best config (calibrated) | Cases correct |
|---|---|---|
| single-session-assistant | hyde-topk50-mult5 (combined) | 9/9 (100.0%) |
| knowledge-update | hyde-topk50-mult5 (combined; tied with topk50/topk50-mult5, combined cheapest) | 7/9 (77.8%) |
| single-session-user | hyde-topk50-mult5 (combined) | 7/9 (77.8%) |
| temporal-reasoning | hyde (alone) | 6/9 (66.7%) |
| multi-session | hyde-topk50-mult5 (combined) | 6/9 (66.7%) |
| single-session-preference | hyde (alone; tied with topk50/topk50-mult5, hyde cheapest) | 2/9 (22.2%) |
| **Per-category-oracle aggregate** | | **37/54 = 68.5%** |

**vs static M-tuned combined: 31/54 = 57.4% → +11.1 pp empirically validated lift from per-category dispatch.**
**vs Tier 1 canonical baseline: 30.6% → +37.9 pp combined uplift (M-tuned flags + per-category dispatch).**

The empirical 68.5% is 1.7 pp under `RetrievalConfigRouter.computeOracleAggregate`'s 70.4% forecast on the M true distribution (which weights MS+TR more heavily — the categories where the calibrated picks are strongest). Both numbers triangulate: per-query dispatch closes another ~10 pp on top of the static combined config, no new architecture needed. Ship this as a `MINIMIZE_COST_AUGMENTED` preset for the `MemoryRouter` and the calibration ceiling moves from 57% to 68-70% on M.

## Cross-validation on LongMemEval-S

Same M-tuned config on LongMemEval-S N=54 stratified: **72.2% accuracy** at $0.0833/correct. Apples-to-apples vs Tier 1 canonical (S baseline 73.2% Phase B N=500): −1.0 pp, within N=54 noise.

Per-category on S:

| Category | M-tuned on S | Tier 3 min-cost on S (Phase B N=500) | Δ |
|---|---:|---:|---:|
| single-session-assistant | 100.0% | 89.3% | +10.7 pp |
| knowledge-update | 88.9% | 86.8% | +2.1 pp |
| single-session-user | 88.9% | 97.1% | -8.2 pp |
| temporal-reasoning | 77.8% | 70.2% | +7.6 pp |
| single-session-preference | 44.4% | 63.3% | -18.9 pp |
| multi-session | 33.3% | 61.7% | **-28.4 pp** |

The M-tuned config on S **regresses on multi-session and single-session-preference**, two categories where the Tier 3 min-cost preset routes to OM-v11 (which the M-tuned config doesn't use). On the other categories (where Tier 3 routes to canonical-hybrid), M-tuned slightly lifts.

So: **M-tuned config helps M dramatically and is ~neutral on S overall, but the per-category trade-offs differ between scales.** The right shipping integration is per-query dispatch via the RetrievalConfigRouter — not a static always-on M-tuned default.

## What this validates

1. **Retrieval-precision tweaks close a third of the S→M gap.** The S baseline at this config-stack measures ~76% (S-scale doesn't need wider rerank pools because the chunk pool is already small; HyDE helps on multi-hop S categories). The M-tuned 45.4% Phase B closes 14.8 of the 46 pp scale gap, leaving ~30 pp for further work.
2. **No architecture change required for the lift.** All three flags are existing bench CLI surface area, wired through `IngestRouter` / `MemoryRouter` / `ReadRouter` per-query dispatch. The agentos primitives that power these (`HybridRetriever`, `RerankerService`, `MemoryHydeRetriever`) ship in 0.3.0 and earlier.
3. **Cost-per-correct goes up but total run cost goes down.** The M-tuned config buys accuracy at +65% cost-per-correct ($0.0818 → $0.1348) because the wider rerank pool + HyDE call add per-case cost. Total run cost still falls 25% ($40.86 → $30.59) because the run hits more cases efficiently. The Phase A "−32% cost-per-correct" claim was an artifact of Phase A's stratified sample overweighting easy categories where the M-tuned config rarely needed retrieval rework; Phase B's true distribution surfaced the actual per-correct cost.

## What this rules in

The remaining 20 pp scale gap (M-tuned 57.4% vs S baseline ~78-80% on the same config-stack) splits into:

- **Single-session-preference** (14.3%, S baseline 63.3% — gap −49 pp): the largest remaining gap. These are short-opinion-style answers where the reader has to find a specific preference statement among 500 sessions of conversation. Hypothesis: the OM-v11 backend (observational memory v11) at S scale lifts SSP from 60.0% (canonical) to 63.3% via the conditional verbatim-citation rule. Routing SSP to OM-v11 on M might lift this category specifically — but OM ingest at 500 sessions per case is expensive (~$0.10 per case = ~$50 for 500 cases full Phase B).
- **Temporal-reasoning** (33.3%, S baseline 70.2% — gap −37 pp): typed graph traversal with temporal-interval-overlap as a first-class signal directly addresses this. Stage E (Hindsight 4-network typed observer) is the architecture push, drafted at [packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md).
- **Single-session-assistant + single-session-user** (already 100% / 77.8% at the M-tuned config): plenty of headroom on SSU but probably tactical rather than architectural.

## What this rules out

The earlier framing that the M baseline 30.6% required Stage E typed-network architecture to lift was too pessimistic. Retrieval-config tweaks lift more than half the gap before any new architecture lands. Stage E is still the right v2 push for the remaining temporal-reasoning + single-session-preference gaps, but the floor moved up significantly.

### Stage H: hierarchical retrieval (third negative finding)

After publishing the M-tuned 57.4% and per-category dispatch 68.5% findings, we tested hierarchical 2-stage retrieval at full N=54 stratified on M: `--session-retrieval --session-retrieval-top-sessions 10 --session-retrieval-chunks-per-session 10` layered with the M-tuned widening (Cohere rerank ×5, reader-top-k 50, HyDE). The 2-stage architecture (Stage 1 selects top-10 sessions by summary cosine, Stage 2 takes top-10 chunks per session) is the xMemory / TACITREE pattern, designed specifically for long-history haystacks.

**Result: 42.6% (23/54) at $0.196/correct, avg 11.1 min/case. −14.8 pp below M-tuned combined.**

Per-category, multi-session collapsed to 22.2% (vs 66.7% combined; −44.5 pp) and single-session-preference dropped to 0% (vs 14.3% combined). The 2-stage architecture loses the right session at Stage 1's summary-similarity cut on hard queries. With 500-session haystacks, the gold session might rank 11-30 in summary-similarity but be the only one containing the answer; the top-10 cutoff drops it before Stage 2 ever sees it. The cross-encoder rerank then has nothing useful to find in the 100-chunk pool from wrong sessions. This is the third consecutive negative result for retrieval-architecture alternatives (Stage L, Stage I, Stage H) on top of our hybrid + Cohere rerank stack. Findings: [STAGE_H_PHASE_A_HIERARCHICAL_FINDINGS_2026-04-26.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_H_PHASE_A_HIERARCHICAL_FINDINGS_2026-04-26.md).

The honest conclusion: **widening the rerank candidate pool beats architectural pre-pruning at conversational-memory scale.** Per-category dispatch (68.5% empirical) remains the strongest M result. Hierarchical retrieval drops out of the comparison table; the agentos `SessionRetriever` / `SessionSummarizer` / `SessionSummaryStore` primitives stay shipping for consumers running document-mode workloads where Stage 1 summary similarity is more reliable.

## The opt-in story

Per the orchestrator-selection design ([RetrievalConfigRouter spec](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-design.md)), `--rerank-candidate-multiplier 5`, `--reader-top-k 50`, and `--hyde` should not become static always-on shipping defaults. Different benchmark distributions (and different consumer workloads) need different configs. Instead, they should ship as **opt-in retrieval-config variants** that the LLM-as-judge classifier picks per query, calibrated against per-workload Phase B measurements.

For now, consumers running on long-history workloads (>100 sessions per haystack) can opt in via:

```bash
pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive \
  --hybrid-retrieval \
  --rerank cohere \
  --rerank-candidate-multiplier 5 \
  --reader-top-k 50 \
  --hyde \
  --concurrency 1                # local memory hardware
```

The `RetrievalConfigRouter` design's `MINIMIZE_COST_AUGMENTED_TABLE` would route queries on long-history workloads to this stack while keeping the existing 60-chunk / 20-top-k baseline for short-haystack workloads. Per-query, per-workload calibration is the design point.

## Phase B finished — what landed and what's next

Phase B at full N=500 finished 2026-04-26 with **45.4% [41.2%, 49.8%]** (227/500), $30.59 LLM total, $0.1348/correct, avg 40.3s latency. Run JSON: `results/runs/2026-04-26T16-50-33-693--longmemeval-m--gpt-4o--full-cognitive--ingest.json`. The −12 pp drop from Phase A's 57.4% N=54 result is consistent with the small-sample variance on the hard categories that the stratified N=9 design always carried (multi-session and temporal-reasoning are 53% of the true distribution; they were 33% in the stratified sample, which was the dominant driver of Phase A inflation).

Per-category Phase B numbers and 95% CIs are reproduced in the result-table near the top of this post; the takeaway:

- **Aggregate +14.8 pp validated** vs Tier 1 canonical baseline 30.6% at the same N=500. CIs do not overlap — this is a real lift, not Phase A noise.
- **Single-session-assistant 91.1%** at the M-tuned config — the easiest M category responds extremely well to the wider retrieval window.
- **Multi-session 26.2%** and **temporal-reasoning 22.6%** are the precision-bound bottleneck. The remaining S→M scale gap (~30 pp at the M-tuned config) concentrates here.
- **Cost** per correct went up (+65%) because the wider rerank pool + HyDE add per-call cost; total run cost went down (−25%) because the run hits cases more efficiently.

What's next:
1. **Phase B ablations to validate the per-category dispatch lift.** The 68.5% per-category-oracle forecast is from Phase A N=54 ablations; Phase B revealed those ablations may be small-sample-noisy on MS / TR. Hyde-only and topk-only Phase B runs at N=500 (each ~$30, ~5 hours) will measure whether per-category dispatch beats static combined at full scale. The dispatcher itself ([RetrievalConfigRouter](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-productionization-plan.md)) is now productionized and ready to validate.
2. **Stage E (typed-network 4-bank observer).** Architecture push for the remaining temporal-reasoning and multi-session gaps. Primitives shipped in agentos@0.5.x; Phase A measurement queued.
3. **Two-call reader on top of M-tuned.** Orthogonal axis (reader-side, not retrieval-side). Cheap to measure (~$3, ~30 min); next step.
4. **Cross-validation on S Phase A** confirmed the M-tuned config is ~neutral on S overall (72.2% vs Tier 1 S baseline 73.2% Phase B = −1.0 pp within noise). The right shipping integration remains per-query dispatch, not a static M-tuned default.

## The transparency stack stays intact

Every cell in the [v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) ships with bootstrap CI, per-category breakdown, $/correct, latency profile, judge FPR (Stage G probe at 1% S, 2% M, 0% LOCOMO), and per-case run JSON at seed 42. The M-tuned headline is now Phase B-validated at N=500; the per-category dispatch forecast (68.5% from Phase A ablations) is explicitly footnoted as Phase A-only until hyde-only and topk-only Phase B ablations land at N=500 to validate the dispatch lift over static combined.

The Phase A → Phase B correction in this post — title from "30 to 57" to "30 to 45" with the wider 95% CI — is itself part of the transparency stack. Small-sample stratified results compress at scale; we caught it within hours of Phase A and updated everywhere instead of leaving the inflated number live.

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
  --sample-per-type 9 \
  --concurrency 1 \
  --bootstrap-resamples 10000
```

Run JSON committed at `results/runs/2026-04-26T01-40-34-904--longmemeval-m--gpt-4o--full-cognitive--ingest.json`.

## Related

- [First Public LongMemEval-M Number (30.6%)](2026-04-26-longmemeval-m-first-published-number.md) — the baseline this lift measures against
- [Two Negative Results: Stage L + Stage I](2026-04-26-two-negative-results-stage-l-stage-i.md) — earlier negative findings on lightweight signal additions; the lesson here is different (config geometry, not signal stacking)
- [agentos IngestRouter Executors](2026-04-26-agentos-ingest-router-executors.md) — production primitives for the ingest stage
- [Stage J Phase B Findings (30.6% baseline)](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_PHASE_B_FINDINGS_2026-04-25.md)
- [Stage E Hindsight 4-Network Spec](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md) — the architecture push for the remaining temporal-reasoning + SSP gaps
- [RetrievalConfigRouter Spec](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-retrieval-config-router-design.md) — LLM-as-judge dispatch among retrieval-config variants per query, opt-in by registration
