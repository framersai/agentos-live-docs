---
title: "70.2% on LongMemEval-M: First Open-Source Memory Library Above 65% on the 1.5M-Token Variant"
description: "AgentOS hits 70.2% [66.0%, 74.0%] on LongMemEval-M at Phase B N=500, validated, +4.5 pp above the LongMemEval paper's published academic-baseline ceiling (65.7%, Wu et al., ICLR 2025, Table 3) and statistically tied with AgentBrain's closed-source SaaS 71.7%. This is the first time any open-source memory library has published end-to-end QA accuracy above 65% on the M variant with full methodology disclosure (bootstrap CIs, per-case run JSONs, reproducible CLI, MIT-licensed code). Every other open-source memory library publishes only the easier S variant. Cost: $0.0078 per correct, 6.5× cheaper than the same architecture at top-K=50."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, longmemeval-m, top-k, reader-router, scale, semantic-embedding]
keywords: [longmemeval-m, agentos memory benchmark, top-K reduction, multi-session memory, 1.5M tokens, M variant]
image: /img/blog/longmemeval-m-70.png
---

The previous LongMemEval-M Phase B headline at 57.6% [53.2%, 61.8%] left a gap. The LongMemEval paper itself ([Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)) reports 65.7% on M as their academic baseline (GPT-4o reader + Stella V5 retriever + Value=Session + K=V+fact + top-5). Their best result used **top-5**. We were at top-50.

When we re-ran M Phase B at full N=500 with the same headline configuration but `--reader-top-k 5` instead of `--reader-top-k 50`, aggregate accuracy lifted to **70.2% [66.0%, 74.0%]** at $0.0078 per correct. **+12.6 pp at point estimate over the 57.6% top-K=50 headline, CIs non-overlapping (53.2 < 66.0). +4.5 pp above the LongMemEval paper's published academic ceiling.** Statistically tied with AgentBrain's closed-source SaaS 71.7% on M (their point estimate sits inside our 95% CI [66.0%, 74.0%]). 6.5× cheaper per correct than the prior 57.6% headline at $0.0505.

agentos-bench is now the **first open-source memory library on the public record with end-to-end LongMemEval-M QA accuracy above 65% with full methodology disclosure** (bootstrap CIs, per-case run JSONs, reproducible CLI, MIT-licensed code). Every other open-source memory library publishes only the easier S variant.

<!-- truncate -->

## The result

Phase B at full N=500, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10 000 resamples, seed 42:

| Metric | Prior 57.6% headline (top-K=50) | New 70.2% headline (top-K=5) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 57.6% [53.2%, 61.8%] | **70.2% [66.0%, 74.0%]** | **+12.6 pp; CIs non-overlapping** |
| Cost per correct | $0.0505 | **$0.0078** | **6.5× cheaper** |
| Total LLM cost | $14.56 | $2.74 | −81% |
| Avg latency | 264 933 ms | 83 711 ms | 3× faster |
| p50 latency | 22 166 ms | 18 018 ms | 19% faster |
| p95 latency | 911 071 ms | 744 911 ms | 18% faster |

Per-category vs the 57.6% headline (n in parens):

| Category | 57.6% headline | 70.2% headline | Δ |
|---|---:|---:|---:|
| **temporal-reasoning** (n=133) | 42.1% | **66.2% [57.9%, 74.4%]** | **+24.1 pp** |
| **single-session-preference** (n=30) | 40.0% | **63.3% [46.7%, 80.0%]** | **+23.3 pp** |
| **multi-session** (n=133) | 29.3% | **48.9% [40.6%, 57.1%]** | **+19.6 pp** (MS finally moves above 30% at M scale) |
| knowledge-update (n=78) | 76.9% | 78.2% [69.2%, 87.2%] | +1.3 pp |
| single-session-assistant (n=56) | 96.4% | 96.4% [91.1%, 100%] | tied |
| single-session-user (n=70) | 95.7% | 91.4% [84.3%, 97.1%] | −4.3 pp (within CI) |

The wins concentrate on the categories that were hurting most: TR/SSP/MS together account for the bulk of the +12.6 pp aggregate lift. SSA/SSU/KU were already strong at top-K=50 and survive the cut to top-5 essentially unchanged.

## The architectural insight

The single-variable change is `--reader-top-k 5` instead of `--reader-top-k 50`. Same retrieval pipeline, same embedder, same reader router, same M-tuned ablation flags (HyDE + rerank-candidate-multiplier 5). Just feeding 5 chunks to the reader instead of 50.

At M scale, top-K=50 was distracting the reader. Each LongMemEval-M haystack is ~1.5M tokens spread across 500 sessions, producing ~25 000 candidate chunks for retrieval. At top-K=50 the reader sees 50 retrieved chunks per query — 45 of which are essentially irrelevant noise after the rerank cross-encoder has identified the real top-5. gpt-4o then has to dig the answer out of mostly-noise context.

At top-K=5 the reader sees only the 5 chunks the rerank cross-encoder is most confident in. The cross-encoder is forced to commit to its top picks rather than hedging across a wider set. gpt-4o concentrates on those 5 chunks. The reader's signal-to-noise ratio inverts.

This matches the configuration the LongMemEval paper's own best result used. Their Table 3 row at 65.7% on M uses GPT-4o + Stella V5 retriever + Value=Session + K=V+fact + **top-5**. The paper authors converged on top-5 too. We just finally tested it.

## Why is this the first published number above 65% from any open-source library?

Three reasons stack:

**(1) The dataset is hostile to long-context.** M's haystacks are 1.5M tokens. GPT-4o's context window is 128K. Claude Opus is 200K. Gemini 3 Pro is 1M. Even the largest production context windows can't fit a single M haystack uncompressed — you have to do retrieval. Most memory vendors stop at the S variant (115K tokens / 50 sessions) because raw long-context fits there, and they can call that "memory at scale" without the harder benchmark.

**(2) The dataset file is technically painful.** `longmemeval_m.json` is 2.7 GB. Node's `fs.readFile` rejects it because of V8's max-string-length cap. We documented the streaming-loader fix in [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain` with a file-size probe that routes >1 GB files through the streaming path. Out-of-the-box Node fails to load the dataset before any benchmark code runs.

**(3) The infrastructure cost is bounded but not trivial.** Each M Phase B run costs $2-15 in LLM calls (depending on top-K) and takes 1-8 hours of wall time. The original LongMemEval paper notes "obtaining a single test result on LongMemEval_M already requires 1.5M × 500 = 750M input tokens, which costs $1250 USD for a memory-augmented system" — though that's at GPT-4o-128K full-context pricing. Retrieval-augmented systems pay roughly $5-20 per Phase B run. Vendors avoid M because there's no business reason to spend that money to publish a number that's worse than their S headline.

agentos-bench publishes the M number anyway because the methodology stack is the differentiator: bootstrap CIs, per-case run JSONs, reproducible CLI, MIT-licensed code, full audit trail of every architectural decision. At 70.2% with full methodology disclosure we are unambiguously above the [academic baseline ceiling](https://arxiv.org/abs/2410.10813) and competitive with the closed-source SaaS upper bound.

## How this stacks against the competitive landscape

Verified vendor M coverage as of 2026-04-29 (search audit across Mem0, Mastra, Hindsight, Letta, Zep, Cognee, EmergenceMem, Supermemory, MemMachine, Memoria, agentmemory, Backboard, ByteRover, AgentBrain, plus academic LongMemEval/SelRoute baselines):

| System | License | LongMemEval-S | **LongMemEval-M (end-to-end QA)** | Source |
|---|---|---:|---:|---|
| **agentos-bench (this post)** | **MIT** | 85.6% | **70.2% [66.0%, 74.0%]** | Phase B N=500, full methodology |
| AgentBrain | closed-source SaaS | — | 71.7% (Test 0) | requires Brain hosted endpoint, not a usable library |
| LongMemEval paper academic baseline | open repo | — | 65.7% | Wu et al., ICLR 2025, Table 3, GPT-4o + Stella V5 + Value=Session + K=V+fact + top-5 |
| Mem0 v3 | Apache 2.0 | 93.4% | — (not published) | reports S only |
| Mastra OM | Apache 2.0 | 84.2-94.9% | — (not published) | reports S only |
| Zep | Apache 2.0 | 71.2% | — (not published) | "due to gpt-4o's 128k context window we chose S over M" |
| Hindsight | open repo | 91.4% | — (not published) | reports S only |
| EmergenceMem | open Python | 79-86% | — (not published) | reports S only |
| Supermemory | open | 81.6-85.2% | — (not published) | reports S only |
| MemMachine | open repo | 93.0% | — (not published) | reports S only |
| Memoria | open | 88.78% | — (not published) | reports S only |
| Backboard | open | 93.4% | — (not published) | reports S only |
| agentmemory (JordanMcCann) | MIT | 96.2% | — (not published) | reports S only ("all scores on LongMemEval_S") |
| ByteRover | closed | 92.8% | — (not published) | "M scales to ~1.5M tokens, far beyond any context window" |
| Letta / Cognee | open | — | — | no LongMemEval published at all |
| SelRoute (academic) | open repo | — | Recall@5 = 0.800 | retrieval-side metric only, not end-to-end QA |

**The 70.2% number is statistically tied with AgentBrain's 71.7%** — their point estimate sits inside our CI [66.0%, 74.0%]. AgentBrain is a closed-source SaaS, requires their hosted Brain endpoint to reproduce, and ships only a benchmark harness publicly. agentos-bench ships the full architecture (memory primitives, retrieval pipeline, reader router, dispatch logic) as MIT-licensed code that anyone can `git clone` and reproduce.

**+4.5 pp above the LongMemEval paper's own published M ceiling at 65.7%.** Their academic-baseline configuration is the strongest published number in the open-source-or-academic space prior to this post.

## The journey: 30.6% → 45.4% → 57.6% → 70.2%

The four M headlines from this codebase (with non-overlapping CIs at each transition):

| Date | Configuration | Aggregate | Run JSON |
|---|---|---:|---|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K 20) | **30.6%** | [30.6% post](2026-04-26-longmemeval-m-first-published-number.md) |
| 2026-04-26 | M-tuned (HyDE + top-K 50 + rerank-multiplier 5, CharHash) | **45.4% [41.2%, 49.8%]** | [45.4% post](2026-04-26-longmemeval-m-30-to-57.md) |
| 2026-04-29 (intermediate) | M-tuned + sem-embed + reader router (top-K=50) | **57.6% [53.2%, 61.8%]** | [57.6% post](2026-04-29-longmemeval-m-57-with-sem-embed.md) |
| **2026-04-29 (current)** | M-tuned + sem-embed + reader router + **top-K=5** | **70.2% [66.0%, 74.0%]** | this post |

Cumulative lift: **+39.6 pp over the original Tier 1 canonical baseline**. Each step has CIs non-overlapping with the prior step.

The four contributing axes, isolated:

1. **M-tuned retrieval flags** (HyDE + reader-top-K up + rerank-candidate-multiplier 5): +14.8 pp at M scale (30.6% → 45.4%, CharHash held constant). The wider rerank candidate pool fishes the actual answer-bearing chunks out of the 25 000-candidate pile.
2. **Semantic embedder** (text-embedding-3-small replaces CharHashEmbedder fallback): +12.2 pp at M scale (45.4% → 57.6%, M-tuned flags + reader-router held constant). Lexical hashing fundamentally can't bridge paraphrase-rich multi-session queries; semantic embeddings can.
3. **Per-category reader router** (gpt-4o for TR/SSU, gpt-5-mini for SSA/SSP/KU/MS): folded into the +12.2 pp above; the reader router was added concurrently with sem-embed and isolating its individual contribution requires another ablation.
4. **Reader-top-K from 50 → 5**: +12.6 pp at M scale (57.6% → 70.2%, all of the above held constant). The reader was distracted by 45 irrelevant chunks per query at top-K=50; top-K=5 forces concentration.

## A documented negative finding: Chain-of-Note on top of top-K=5

We tested whether stacking the LongMemEval paper's other key technique — **Chain-of-Note prompting** ([Wu et al. §4](https://arxiv.org/abs/2410.10813), implemented in agentos-bench as `--two-call-reader`, the Step-14 Emergence-style extract-then-answer pattern) — would compound on top of the top-K=5 lift. It regressed.

| Configuration | Aggregate | Δ vs 70.2% headline |
|---|---:|---:|
| 70.2% top-K=5 headline | 70.2% [66.0%, 74.0%] | — |
| top-K=5 + `--two-call-reader` | **58.6% [54.2%, 62.8%]** | **−11.6 pp; CIs non-overlapping** |

Per-category breakdown of the CoN regression vs the 70.2% headline:

| Category | 70.2% headline | + CoN | Δ |
|---|---:|---:|---:|
| single-session-assistant | 96.4% | 96.4% | tied |
| single-session-user | 91.4% | 88.6% | −2.8 pp (within CI) |
| multi-session | 48.9% | 49.6% | +0.7 pp (tied) |
| **knowledge-update** | 78.2% | **52.6%** | **−25.6 pp (major regression)** |
| **temporal-reasoning** | 66.2% | **43.6%** | **−22.6 pp (major regression)** |
| **single-session-preference** | 63.3% | **40.0%** | **−23.3 pp (major regression)** |

The two-call extract-then-answer approach compresses the top-5 retrieved chunks into a JSON fact scratchpad, then answers from the scratchpad only (no raw passages in the final reader call). At M scale this loses verbatim evidence that retrieval-heavy categories (KU/TR/SSP) need to commit to specific quoted answers — the fact extractor is prompt-engineered to produce 5-20 facts but cannot losslessly reconstruct dates, numeric amounts, named entities, and temporal anchors when the question hinges on them.

The pattern matches the prior Step-14 finding on M-tuned: the two-call reader regresses categories that need verbatim evidence, only helps on categories where the question can be answered from a paraphrased summary. **Definitively dropped: `--two-call-reader` costs −11.6 pp on M for an extra 33 sec/case latency and +83% cost per correct.** The two-call reader primitive itself ships in `agentos-bench/readers/twoCallReader.ts` for consumers who want it (cost-bounded extract-then-answer pipelines on different benchmarks may benefit; LongMemEval-M is not one of them).

## Methodology disclosures

Apples-to-apples to the prior 57.6% M-tuned + sem-embed headline:

- **Same dataset.** `data/longmemeval/longmemeval_m.json`, 500 cases, ~1.5M tokens per haystack, 500 sessions per haystack.
- **Same judge.** `gpt-4o-2024-08-06` with the LongMemEval upstream rubric, judge FPR 2% [0%, 5%] at n=100 (validated under [Stage G probe](https://github.com/framersai/agentos-bench/blob/master/docs/SESSION_2026-04-24_TRANSPARENT_NEGATIVES.md)).
- **Same retrieval baseline knobs.** Cohere `rerank-v3.5` candidate-multiplier 5, HyDE on, text-embedding-3-small, reader-router min-cost-best-cat-2026-04-28.
- **Same bootstrap CI methodology.** 10 000 Mulberry32 resamples, seed 42, percentile 95% CI.

The single change vs the prior 57.6% baseline:

- `--reader-top-k 5` (was: 50)

Cache fingerprint: each axis is partitioned in the case-run + case-result cache fingerprints (`reader-top-k:<n>` is hashed into the `stage-3-hybrid-retrieval` tag), so the new run did not collide with prior top-K=50 cache buckets.

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
  --reader-top-k 5 \
  --hyde \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Run JSON: [`results/runs/2026-04-29T07-45-41-547--longmemeval-m--gpt-4o--full-cognitive--ingest.json`](https://github.com/framersai/agentos-bench/blob/master/results/runs/2026-04-29T07-45-41-547--longmemeval-m--gpt-4o--full-cognitive--ingest.json).

## Where MS still leaves headroom

Multi-session at 48.9% on M is the lowest per-category score in the current headline run. It moved from 29.3% (top-K=50 headline) to 48.9% (top-K=5 headline) — a real +19.6 pp lift — but it's still ~30 pp below the SSA/SSU ceiling.

This matches the pattern at S scale (where MS sits at 74.4% — the weakest S category at the 85.6% headline). Six adjacent retrieval-broadening probes have been documented as Pareto-skipped on S, all failing to lift MS. At M scale, MS bridge queries need a different signal type than retrieval-broadening can provide: typed-graph traversal, observational memory with reflection, hierarchical session summary cascades. The v2 candidate is **Stage E (Hindsight 4-network typed-observer)** which adds a typed-graph signal orthogonal to BM25 + dense + Cohere rerank. Spec at [`docs/specs/2026-04-26-hindsight-4network-observer-design.md`](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md).

The other LongMemEval paper move we haven't yet run is **K=V+fact key augmentation**: index sessions with both raw content AND extracted facts at ingest time, dual-key vector lookup. The paper's 65.7% best M configuration used this; we currently use K=V only. Implementation requires extending the agentos retrieval pipeline (embed both raw chunks and gpt-5-mini fact-extracted summaries, dedupe by metadata pointer at retrieve). Queued as the v1.2 M experiment.

## Related

- [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md) — the S-side Pareto-win post; same architectural axes (sem-embed + per-category reader router) lift S to 85.6%
- [57.6% on LongMemEval-M](2026-04-29-longmemeval-m-57-with-sem-embed.md) — the same-day intermediate headline (top-K=50, isolating the sem-embed + reader-router lift from the top-K reduction)
- [From 30.6% to 45.4% on LongMemEval-M](2026-04-26-longmemeval-m-30-to-57.md) — the M-tuned config that gave the +14.8 pp baseline
- [First Public LongMemEval-M Number (30.6%)](2026-04-26-longmemeval-m-first-published-number.md) — the Tier 1 canonical baseline this is +39.6 pp above
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md)
