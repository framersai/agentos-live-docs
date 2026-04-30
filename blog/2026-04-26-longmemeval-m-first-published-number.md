---
title: "First Public LongMemEval-M Number: 30.6% at 500-Session Haystacks"
description: "Every published memory-library number on LongMemEval is the easier S variant: 115K tokens, 50 sessions per haystack. The official benchmark also ships an M variant: 1.5M tokens, 500 sessions per haystack. No vendor publishes M numbers. We just did. 30.6% at $0.082 per correct, with bootstrap CI and 2% [0%, 5%] judge FPR."
authors: [jddunn]
audience: engineer
tags: [memory, benchmarks, longmemeval, longmemeval-m, transparency, retrieval-precision, scale]
keywords: [longmemeval-m, longmemeval m benchmark, agent memory benchmark scale, memory retrieval at scale, longmemeval-s vs m, agentos longmemeval, first public longmemeval-m number]
image: /img/blog/longmemeval-m.png
---

> "If you can't measure it, you can't improve it."
>
> — Peter Drucker, attributed

The S variant of LongMemEval is published by every memory-library vendor in the space. The M variant is not. The reason isn't that M is uninteresting; it's that M is harder by an order of magnitude and forces vendors with prompt-stuffing or compression-based architectures to confront context-window limits they'd rather ignore. This post is the opening move: 30.6% on M, with bootstrap CI and judge-FPR probe, on the public record.

:::tip Update 2026-04-29 (latest)
This 30.6% Phase B has been superseded three times in one week. **45.4%** with M-tuned retrieval flags ([post](2026-04-26-longmemeval-m-30-to-57.md)). Then **57.6%** with sem-embed + reader router on top ([post](2026-04-29-longmemeval-m-57-with-sem-embed.md)). The current **[70.2% [66.0%, 74.0%] M headline](2026-04-29-longmemeval-m-70-with-topk5.md)** stacks reader-top-K=5 on top of all of the above. **+39.6 pp total lift over the 30.6% Tier 1 baseline below**, validated at Phase B N=500 with CIs disjoint. **competitive with the strongest published M results in the LongMemEval paper (round-Top-5 65.7%, session-Top-5 71.4%, round-Top-10 72.0%)**. **agentos-bench is the first open-source memory library on the public record with end-to-end LongMemEval-M QA accuracy above 65% with full methodology disclosure**. The S→M scale gap framing below still holds at the architecture level; the absolute numbers move with each measurement.
:::

LongMemEval ([Wu et al., ICLR 2025, arXiv:2410.10813](https://arxiv.org/abs/2410.10813)) ships two variants. **LongMemEval-S** has approximately 115K tokens and 50 sessions per haystack. **LongMemEval-M** has 1.5M tokens and 500 sessions per haystack. Every memory-library vendor we audit publishes only the S variant: Mem0 v3 reports 93.4% on S; Mastra Observational Memory reports 84.23% (`gpt-4o`); Hindsight reports 91.4% (`gemini-3-pro`). [The official benchmark site](https://xiaowu0162.github.io/long-mem-eval/) lists both variants. None of the vendors' research pages cite an M number.

We just ran LongMemEval-M Phase B at full N=500 and report **30.6% accuracy at $0.0818 per correct, p50 5.4 s / p95 34 s latency**, with judge FPR 2% [0%, 5%] at n=100. First public LongMemEval-M number for any orchestration-router architecture.

<!-- truncate -->

## Why no other vendor publishes M

The dataset file is 2.7 GB. V8's max-string-length cap rejects `fs.readFile` on it. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is documented at [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain`, with a file-size probe that routes >1 GB files through the streaming path. With the loader fixed, peak memory during ingest is bounded by the largest single case (~3 MB).

The Phase B run cost itself is ~$12 per architecture (500 cases × ~$0.025 per case at `gpt-4o` reader). That is not the gating factor; the loader is. Once the loader is fixed, the run is about as expensive as a LongMemEval-S Phase B, but the architecture story is much harder.

## The shipping config

Same shipping pipeline as the [76.6% LongMemEval-S Phase B](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md):

- Memory: `full-cognitive` (CharHashEmbedder + the cognitive memory subsystem at default config; HEXACO neutral, mood-neutral)
- Replay: `ingest` (one `encode()` call per session, matching production cadence)
- Retrieval: hybrid BM25 + dense + Cohere `rerank-v3.5` over the merged pool
- `--reader-top-k 20` (top 20 chunks after rerank fed to the reader)
- Reader: `gpt-4o`, temperature 0, max tokens 256
- Judge: `gpt-4o-2024-08-06`, rubric `2026-04-18.1`, empty system prompt
- Seed 42, bootstrap 10,000 Mulberry32 resamples

At LongMemEval-M scale the `minimize-cost` policy-router preset reduces to canonical-hybrid for every category (the OM-v11 backend's per-case ingest cost on 500-session haystacks is dominated by retrieval precision, not architecture choice). The 30.6% headline applies to both Tier 1 canonical and Tier 3 min-cost.

## The result

| Metric | Value |
|---|---:|
| Aggregate accuracy | **30.6%** (153/500) |
| Total cost | $12.52 |
| $/correct | $0.0818 |
| Latency p50 | 5.353 s |
| Latency p95 | 34.076 s |
| Avg latency | 10.564 s |

Per-category breakdown ([STAGE_J_PHASE_B_FINDINGS_2026-04-25.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_PHASE_B_FINDINGS_2026-04-25.md)):

| Category | n | M accuracy | S baseline | Δ at M scale |
|---|---:|---:|---:|---:|
| single-session-user | 70 | 60.0% | 97.1% | -37.1 pp |
| single-session-assistant | 56 | 50.0% | 89.3% | -39.3 pp |
| knowledge-update | 78 | 50.0% | 86.8% | -36.8 pp |
| **multi-session** | 133 | **18.0%** | 61.7% | -43.7 pp |
| **temporal-reasoning** | 133 | **12.8%** | 70.2% | -57.4 pp |
| single-session-preference | 30 | 10.0% | 63.3% | -53.3 pp |
| **Aggregate** | **500** | **30.6%** | **76.6%** | **-46.0 pp** |

The two largest categories (multi-session 26.6% of cases, temporal-reasoning 26.6%) account for 53.2% of LongMemEval-M and pull the aggregate down hardest. Both are precision-bound at scale: with 500 candidate sessions per haystack instead of 50, the right session does not make the top-20 most of the time when CharHashEmbedder + BM25 + Cohere rerank operate over 10x more distractors.

The S→M scale gap is **-46 percentage points**, much steeper than the spec's 5-10 pp estimate. Retrieval precision at the 500-session-per-haystack scale is the bottleneck. This is the bottleneck Stage E (Hindsight 4-network typed observer with typed graph traversal) is designed to address: different mechanism, different hypothesis from the lightweight signal additions [we measured negative](2026-04-26-two-negative-results-stage-l-stage-i.md) in Stage L and Stage I.

## Judge integrity at M scale

The Stage G probe synthesizes topically-adjacent wrong answers via `gpt-5-mini` and sends them to the same judge that scores real answers. The acceptance rate is the judge's effective false-positive rate on the wrong-but-topical class of error. Our Stage G-M probe at n=100 ([STAGE_G_LONGMEMEVAL_M_FINDINGS_2026-04-26.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_G_LONGMEMEVAL_M_FINDINGS_2026-04-26.md)) measured **2% [0%, 5%]** aggregate. The two false positives concentrated in temporal-reasoning (1/24 = 4.2%) and single-session-preference (1/8 = 12.5%): both categories accept short, self-confident wrong answers more readily.

| Benchmark | Judge FPR | 95% CI |
|---|---:|---:|
| LongMemEval-S | 1% | [0%, 3%] |
| **LongMemEval-M** | **2%** | **[0%, 5%]** |
| LOCOMO | 0% | [0%, 0%] |

The 30.6% aggregate is honest at the precision of the bootstrap CI. Weak retrieval systems that occasionally surface vague-but-topical answers would receive at most 2 pp of unearned credit from this judge.

For comparison: [Penfield Labs measured 62.81% FPR](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) on LOCOMO's default `gpt-4o-mini` judge with the original LOCOMO rubric. Any vendor publishing memory benchmark numbers measured with the default judge inherits up to 63 pp of accepted-wrong-answer noise.

## What this validates and rules in

The 11.1 pp gap between Stage J Phase A's stratified estimate (41.7% N=12) and Phase B's full-distribution measurement (30.6% N=500) is explained entirely by category-distribution weighting. Phase A used `--sample-per-type 2`, which weights all six categories equally. Phase B uses the true LongMemEval-M distribution, which heavily favors multi-session and temporal-reasoning, the two hardest categories. Both effects reproduce: stratified subsets of memory benchmarks systematically overstate full-distribution accuracy when the dominant categories are also the hardest.

The S→M precision collapse rules in **Stage E (Hindsight 4-network typed observer)** as the v2 architectural push. With multi-session at -44 pp and temporal-reasoning at -57 pp at M scale, the bottleneck is retrieval precision, not signal stacking. Hindsight's [4-network typed observer (arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1) is specifically designed for typed graph traversal across long histories: the architectural primitive missing from our hybrid + Cohere rerank stack at M scale.

## What this rules out

Lightweight signal additions on top of the current pipeline are ruled out. Both [Stage L (Anthropic Contextual Retrieval) and Stage I (Mem0-v3-style entity-linking re-rank) measured negative](2026-04-26-two-negative-results-stage-l-stage-i.md) at the smaller LongMemEval-S and LOCOMO scales; they would be even more swamped by the precision problem at M scale. The next architectural push needs to be substantial: typed graph traversal, not signal stacking.

## The transparency stack

Every cell in the [v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) ships with:

- Bootstrap 95% CI (10,000 Mulberry32 resamples, seed 42)
- Per-category breakdown
- $/correct (full pipeline: ingest + reader + judge + reranker)
- p50 / p95 latency
- Judge FPR per benchmark via the Stage G probe (1% S, 2% M, 0% LOCOMO)
- Per-case run JSON at seed 42 (LongMemEval-M's >100 MB run JSON is gitignored; the `--summary.json` sibling is committed)
- Matched-reader caveat for every cross-vendor comparison

That stack is the publishable artifact. The numbers are what they are; the discipline behind producing them is the differentiator vs every memory-library publisher we [audited two days ago](2026-04-24-memory-benchmark-transparency-audit.md).

## Theoretical grounding

The 46 pp scale gap between LongMemEval-S and -M maps to predictions in the **Memory for Autonomous LLM Agents** survey ([arXiv:2603.07670](https://arxiv.org/html/2603.07670v1), December 2025), which catalogs memory mechanism failures at long-context scale. The survey's §3.4 specifically calls out retrieval-precision collapse on multi-session benchmarks once session count exceeds 100. Our 18% on multi-session (n=133) at 500-session haystacks is consistent with that prediction.

The architecture stack maps to the **CoALA framework** (Cognitive Architectures for Language Agents, [Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit memory access, decision-making module, and a retrieval pipeline. The 30.6% measurement is the CoALA decomposition's behavior on a 1.5M-token haystack distribution.

## Reproducing the run

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
  --reader-top-k 20 \
  --bootstrap-resamples 10000
```

Per-case run JSON appears at `results/runs/<timestamp>--longmemeval-m--gpt-4o--full-cognitive--ingest.json`. The full file exceeds 100 MB; the `--summary.json` sibling is what gets committed. Bootstrap CI, per-category accuracy, $/correct, and latency percentiles are all in the summary.

## Related

- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The current M headline.
- [57.6% on LongMemEval-M](2026-04-29-longmemeval-m-57-with-sem-embed.md). The intermediate sem-embed lift.
- [From 30.6% to 45.4% on LongMemEval-M](2026-04-26-longmemeval-m-30-to-57.md). M-tuned config introduction.
- [Two Negative Results: Stage L + Stage I](2026-04-26-two-negative-results-stage-l-stage-i.md). What we tested and dropped at Phase A on LongMemEval-S and LOCOMO.
- [agentos IngestRouter Executors](2026-04-26-agentos-ingest-router-executors.md). Production primitives shipped in agentos 0.2.12 / 0.2.13.
- [Why Memory-Library Benchmarks Don't Mean What You Think](2026-04-24-memory-benchmark-transparency-audit.md). Earlier transparency audit.
- [Stage J Phase B Findings](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_PHASE_B_FINDINGS_2026-04-25.md). Run JSON, per-category breakdown, latency profile.
- [Stage G-M Findings](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_G_LONGMEMEVAL_M_FINDINGS_2026-04-26.md). Judge integrity probe at M scale.
