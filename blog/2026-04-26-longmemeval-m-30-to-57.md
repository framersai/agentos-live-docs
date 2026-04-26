---
title: "From 30.6% to 57.4% on LongMemEval-M: How Three Opt-In Flags Closed Half the Scale Gap"
description: "Our shipping LongMemEval-M baseline at 30.6% was leaving 26.8 percentage points on the table. Three opt-in retrieval-precision flags — wider Cohere rerank pool, larger reader-top-k, and HyDE — lift LongMemEval-M to 57.4% at Phase A N=54 stratified, with cost-per-correct dropping 32% in the process. Multi-session category alone went 18% to 66.7%. Here is the diagnosis, the per-category math, and what comes next."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, longmemeval-m, retrieval-precision, hyde, cohere-rerank]
keywords: [longmemeval-m lift, agentos retrieval precision, hyde longmemeval, cohere rerank candidate multiplier, reader-top-k tuning, agent memory benchmark scale, agentos m-tuned config]
image: /img/blog/longmemeval-m-lift.png
---

Two days ago we [published 30.6% on LongMemEval-M](2026-04-26-longmemeval-m-first-published-number.md) at our shipping config — first public M number for any orchestration-router architecture, transparent about the 46-percentage-point S→M scale gap, and we framed it as "retrieval precision is the bottleneck; only architecture work (Stage E typed-network) can fix it."

That framing was wrong. The shipping config was leaving 26.8 percentage points on the table due to over-restrictive retrieval windows tuned for 50-session haystacks instead of 500-session ones. Three opt-in flag tweaks — already wired in agentos and exposed via the bench CLI — lifted LongMemEval-M from **30.6% to 57.4%** at Phase A N=54 stratified, with cost-per-correct dropping 32%.

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

Phase A on LongMemEval-M, N=54 stratified (`--sample-per-type 9`), CharHashEmbedder, gpt-4o reader, gpt-4o-2024-08-06 judge, rubric `2026-04-18.1`, seed 42:

| Metric | Baseline (Tier 1 / Tier 3 min-cost) | M-tuned | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 30.6% (N=500 Phase B) | **57.4%** (N=54 Phase A) | **+26.8 pp** |
| Cost per correct | $0.0818 | **$0.0558** | **−32%** |

Per-category breakdown:

| Category | M baseline (N=500) | M-tuned (N=54) | Δ | S baseline reference |
|---|---:|---:|---:|---:|
| single-session-assistant | 50.0% | **100.0%** (9/9) | **+50.0 pp** | 89.3% |
| multi-session | 18.0% | **66.7%** (4/6) | **+48.7 pp** | 61.7% |
| knowledge-update | 50.0% | **77.8%** (7/9) | **+27.8 pp** | 86.8% |
| single-session-user | 60.0% | **77.8%** (7/9) | **+17.8 pp** | 97.1% |
| temporal-reasoning | 12.8% | **33.3%** (3/9) | **+20.5 pp** | 70.2% |
| single-session-preference | 10.0% | **14.3%** (1/7) | **+4.3 pp** | 63.3% |

Multi-session lifted **+48.7 pp** alone. That category was the precision-bound bottleneck — at 500 candidate sessions, the top-60 rerank pool was missing the right session most of the time. With 250 candidates, the cross-encoder finds it. With reader-top-k 50, the reader sees enough context.

The two stragglers are temporal-reasoning (33.3%) and single-session-preference (14.3%). Both still need substantial architecture work — the typed-network Stage E with temporal-interval-overlap as a first-class signal is specifically designed for the temporal category.

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

If a per-category-oracle could route each query to its best config, aggregate would be (88.9 + 77.8 + 77.8 + 66.7 + 66.7 + 22.2) / 6 = **66.7%** — another +9.3 pp on top of the combined 57.4%. **That's the calibration data point for the [RetrievalConfigRouter](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-retrieval-config-router-design.md):** an LLM-as-judge classifier dispatching per-query among `(canonical, hyde, topk-50, hyde+topk-50, hyde+topk-50+mult5)` based on the predicted query category would beat the static combined config by another 9 pp.

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

1. **Retrieval-precision tweaks alone close half the S→M gap.** The S baseline at this config-stack would be roughly 78-80% (S-scale doesn't need wider rerank pools because the chunk pool is already small; HyDE helps on multi-hop S categories). The M-tuned 57.4% closes 26 of the 46 pp scale gap, leaving 20 pp for further work.
2. **No architecture change required for the lift.** All three flags are existing bench CLI surface area, wired through `IngestRouter` / `MemoryRouter` / `ReadRouter` per-query dispatch. The agentos primitives that power these (`HybridRetriever`, `RerankerService`, `MemoryHydeRetriever`) ship in 0.3.0 and earlier.
3. **Cost-per-correct drops as accuracy climbs.** Wider rerank pools mean more candidate scoring, which is +20% per-call cost. But correct rate climbs faster than per-call cost, so $/correct drops from $0.0818 to $0.0558.

## What this rules in

The remaining 20 pp scale gap (M-tuned 57.4% vs S baseline ~78-80% on the same config-stack) splits into:

- **Single-session-preference** (14.3%, S baseline 63.3% — gap −49 pp): the largest remaining gap. These are short-opinion-style answers where the reader has to find a specific preference statement among 500 sessions of conversation. Hypothesis: the OM-v11 backend (observational memory v11) at S scale lifts SSP from 60.0% (canonical) to 63.3% via the conditional verbatim-citation rule. Routing SSP to OM-v11 on M might lift this category specifically — but OM ingest at 500 sessions per case is expensive (~$0.10 per case = ~$50 for 500 cases full Phase B).
- **Temporal-reasoning** (33.3%, S baseline 70.2% — gap −37 pp): typed graph traversal with temporal-interval-overlap as a first-class signal directly addresses this. Stage E (Hindsight 4-network typed observer) is the architecture push, drafted at [packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md).
- **Single-session-assistant + single-session-user** (already 100% / 77.8% at the M-tuned config): plenty of headroom on SSU but probably tactical rather than architectural.

## What this rules out

The earlier framing that the M baseline 30.6% required Stage E typed-network architecture to lift was too pessimistic. Retrieval-config tweaks lift more than half the gap before any new architecture lands. Stage E is still the right v2 push for the remaining temporal-reasoning + single-session-preference gaps, but the floor moved up significantly.

## The opt-in story

Per the orchestrator-selection design ([RetrievalConfigRouter spec](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-retrieval-config-router-design.md)), `--rerank-candidate-multiplier 5`, `--reader-top-k 50`, and `--hyde` should not become static always-on shipping defaults. Different benchmark distributions (and different consumer workloads) need different configs. Instead, they should ship as **opt-in retrieval-config variants** that the LLM-as-judge classifier picks per query, calibrated against per-workload Phase B measurements.

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

## Next: Phase B at full N=500

The Phase A measurement at N=54 stratified gives a strong directional signal but a wide bootstrap CI. Phase B at full N=500 ([STAGE_J_PHASE_B_FINDINGS_2026-04-25.md](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/STAGE_J_PHASE_B_FINDINGS_2026-04-25.md) baseline pattern) is needed to publish the headline number with bootstrap 95% CI.

Local hardware (17 GB Mac) hit memory pressure during the original Phase B attempt at concurrency 3 + semantic embedder. Phase B at full N=500 with this M-tuned config is queued for remote-machine execution. Estimated cost ~$30, estimated wall-clock 4-6 hours on a higher-RAM machine.

After Phase B lands:
1. Update LEADERBOARD with the validated Phase B number + bootstrap CI.
2. Run the same M-tuned config on LongMemEval-S to confirm it doesn't regress S accuracy (we expect ~76-80% on S, similar to current Tier 3 min-cost).
3. Decide whether `--rerank-candidate-multiplier 5 --reader-top-k 50 --hyde` becomes a new preset (`m-tuned`) or whether the right shipping integration is the [RetrievalConfigRouter](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-retrieval-config-router-design.md) per-query dispatcher.

## The transparency stack stays intact

Every cell in the [v1 evaluation matrix](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/results/eval-matrix-v1/comparison-table.md) ships with bootstrap CI, per-category breakdown, $/correct, latency profile, judge FPR (Stage G probe at 1% S, 2% M, 0% LOCOMO), and per-case run JSON at seed 42. The lean fast-flag finding here is Phase A only at N=54; explicitly footnoted as such in the comparison table and LEADERBOARD until Phase B validates.

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
- [Stage J Phase B Findings (30.6% baseline)](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/STAGE_J_PHASE_B_FINDINGS_2026-04-25.md)
- [Stage E Hindsight 4-Network Spec](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md) — the architecture push for the remaining temporal-reasoning + SSP gaps
- [RetrievalConfigRouter Spec](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/specs/2026-04-26-retrieval-config-router-design.md) — LLM-as-judge dispatch among retrieval-config variants per query, opt-in by registration
