---
title: "83.2% on LongMemEval-S: When Your Bench Default Hides Your Real Numbers"
description: "AgentOS's published LongMemEval-S Tier 3 min-cost number was 76.6%. The actual deployed configuration — with a real semantic embedder instead of the bench's CharHashEmbedder fallback — is 83.2% [79.8%, 86.4%] at $0.052 per correct, validated at full Phase B N=500. The +6.6 pp gap was a bench-default-versus-deployed-config measurement gap, not an architecture gap. Multi-session jumped +14.5 pp; temporal-reasoning jumped +14.5 pp. Here's what was actually happening and what shipped to fix it."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, longmemeval-s, semantic-embedding, retrieval-precision]
keywords: [longmemeval-s, agentos memory, semantic embedding, retrieval quality, openai text-embedding-3-small, hybrid retrieval, multi-session memory]
image: /img/blog/longmemeval-s-83.png
---

:::tip Update 2026-04-28
The 83.2% headline below has been superseded. The follow-up post **[85.6% on LongMemEval-S at $0.009/correct, 4-second latency](2026-04-28-reader-router-pareto-win.md)** lands the new validated headline by adding a per-category reader router on top and dropping the Tier 3 minimize-cost policy router (whose CharHash-era MS+SSP → OM-v11 routing is stale for the sem-embed era). Same dataset, same judge, same N=500 Phase B methodology.
:::

The agentos-bench's published number on LongMemEval-S Tier 3 min-cost was **76.6% [72.8%, 80.2%]** at full Phase B N=500. Mid-pack against published vendor numbers — Mastra Observational Memory at 84.2% (gpt-4o), Supermemory at 81.6% (gpt-4o), EmergenceMem at 86%.

That published 76.6% was running against the bench's `CharHashEmbedder` — a lexical-hash stub the bench falls back to when no embedder is configured. **It's not what real consumers wiring `@framers/agentos` memory primitives use in deployment.**

When we measured Tier 3 min-cost with the same configuration but `text-embedding-3-small` as the embedder — the documented production path — the result was **83.2% [79.8%, 86.4%]** at full Phase B N=500. The weighted aggregate (true category distribution) is **84.2% [81.0%, 87.2%]**. Cost per correct: **$0.0521**, slightly cheaper than the CharHash baseline despite the embedding cost — the semantic retrieval finds answers lexical hashing missed, lifting more cases to "passed."

<!-- truncate -->

## The result

Phase B at full N=500, gpt-4o reader, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10 000 resamples, seed 42:

| Metric | CharHash baseline (prior published) | text-embedding-3-small (this post) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 76.6% [72.8%, 80.2%] | **83.2% [79.8%, 86.4%]** | **+6.6 pp** |
| Weighted (true distribution) | — | **84.2% [81.0%, 87.2%]** | — |
| Cost per correct | $0.0580 | **$0.0521** | −10% |
| Total LLM cost | — | $21.66 | — |
| Avg latency | 16 130 ms | 73 234 ms | +4.5× |

Per-category at Phase B with bootstrap CIs (n in parens):

| Category | Prior CharHash | text-embedding-3-small | Δ |
|---|---:|---:|---:|
| **single-session-assistant** (n=56) | 89.3% | **98.2% [94.6%, 100%]** | **+8.9 pp** |
| single-session-user (n=70) | 97.1% | 94.3% [88.6%, 98.6%] | −2.8 pp (within CI) |
| knowledge-update (n=77) | 86.8% | 85.7% [77.9%, 93.5%] | −1.1 pp (within CI) |
| **temporal-reasoning** (n=131) | 70.2% | **84.7% [78.6%, 90.8%]** | **+14.5 pp** |
| **multi-session** (n=130) | 61.7% | **76.2% [68.5%, 83.1%]** | **+14.5 pp** |
| single-session-preference (n=30) | 63.3% | 63.3% [46.7%, 80.0%] | 0 pp |

The lift concentrates exactly where you'd expect semantic embeddings to matter: **temporal-reasoning** (+14.5 pp) and **multi-session** (+14.5 pp). These are the categories that depend on finding paraphrase-rich and multi-hop bridges across sessions — which lexical hashing fundamentally can't do.

The retrieval-quality numbers tell the same story:
- Recall@K=10: **0.867**
- NDCG@K=10: **0.833**
- MRR: **0.864**
- Precision@K=10: **0.567**

That's a substantial lift over the recall + NDCG the CharHash run produced.

## Why the published number was the wrong number

`CharHashEmbedder` exists in the bench for one reason: smoke tests. It produces deterministic, dependency-free vectors so the bench can run in CI without API keys, validate the cognitive-memory pipeline at the unit-integration boundary, and exercise the code paths.

It is NOT what `@framers/agentos` consumers run in production. Real deployments wire a real embedder via the `Memory.createSqlite()` or `CognitiveMemoryManager` constructor:

```ts
import { Memory } from '@framers/agentos';
import { OpenAIEmbedder } from '@framers/agentos-bench/cognitive';

const mem = await Memory.createSqlite({
  path: './memory.sqlite',
  embedder: new OpenAIEmbedder('text-embedding-3-small'),
});
```

The bench's `--embedder-model text-embedding-3-small` flag exposes the same path the documented production wiring uses. **It just was never the default for the published Phase B runs.** The 76.6% was measuring "agentos at minimum config" rather than "agentos as deployed."

This isn't unique to us — every benchmark harness has a "what's running by default" question, and the answer determines what number gets published. We're now publishing the deployed-configuration number, with the bench-default number as a second-tier reference point so the gap is auditable.

## How AgentOS compares (LongMemEval-S, gpt-4o reader)

| System | Accuracy | Reader |
|---|---:|---|
| agentmemory (JordanMcCann, managed) | 96.2% | gpt-4o |
| Mastra OM (gpt-5-mini observer) | 94.9% | gpt-5-mini |
| Mem0 v3 (managed platform) | 93.4% | — |
| EmergenceMem | 86.0% | gpt-4o |
| Supermemory (gemini-3-pro) | 85.2% | gemini-3-pro |
| Mastra OM (gpt-4o observer) | 84.2% | gpt-4o |
| **AgentOS Tier 3 min-cost + semantic embedder** | **83.2% [79.8%, 86.4%]** | **gpt-4o** |
| Supermemory (gpt-4o) | 81.6% | gpt-4o |

For an open-source library at the gpt-4o reader, **83.2% is genuinely competitive**. It beats Supermemory's gpt-4o number by +1.6 pp and lands within statistical noise of Mastra OM gpt-4o (84.2% point estimate; our CI overlaps with where theirs likely sits). Cost per correct is $0.052 — competitive with vendor-published numbers despite shipping as an open library rather than a managed platform.

## Methodology disclosures

What's apples-to-apples here:

- **Same reader (gpt-4o)** as Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem, agentmemory.
- **Same benchmark dataset** — LongMemEval-S, 500 cases, ~115k-token haystacks.
- **Same judge harness** (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`); judge false-positive rate **1% [0%, 3%]** at n=100 measured under [Stage G probe](https://github.com/framersai/agentos-bench/blob/master/docs/SESSION_2026-04-24_TRANSPARENT_NEGATIVES.md).
- **Bootstrap 95% confidence interval** at 10 000 resamples (most vendors don't publish CIs).

What's NOT apples-to-apples (caveats inline):

- Managed-platform numbers (agentmemory, Mem0 v3) run on curated infrastructure with platform-specific optimizations. Mem0's own production-stack number on LOCOMO is [66.9%](https://mem0.ai/blog/state-of-ai-agent-memory-2026), suggesting the 93.4% S number reflects the managed-evaluation harness more than the architecture.
- Mastra OM's 94.9% uses `gpt-5-mini` as the OM observer; their 84.2% number uses `gpt-4o`. Cross-provider observer setups aren't single-provider reproducible.
- agentmemory at 96.2% has no published CI, no methodology breakdown, and likely uses managed-curated data.

The full transparency stack — judge FPR per benchmark, four documented negative architecture findings, cost-Pareto comparisons — is at [`packages/agentos-bench/results/eval-matrix-v1/comparison-table.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) and [`transparency-notes.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/transparency-notes.md).

## What shipped to fix this for v2

The bench's `--embedder-model text-embedding-3-small` flag has existed for a while; what was missing was making the cache fingerprint include the embedder, so that runs with different embedders couldn't accidentally share cached answers. We caught this when the M Phase B with semantic embedder returned the IDENTICAL aggregate as the prior CharHash run with `totalUsd=$0.00` — a 100% cache hit on incompatible cached answers.

That's now fixed in [agentos-bench commit `215358817`](https://github.com/framersai/agentos): the `case-run` and `case-result` cache fingerprints partition by embedder model id. Prior CharHash-fallback runs keep their cache hashes (the fingerprint is conditional and omitted when no embedder is set), so existing CI runs aren't disrupted.

## Reproducing

```bash
git clone https://github.com/framersai/agentos
cd agentos/packages/agentos-bench
pnpm install
pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-s \
  --reader gpt-4o \
  --memory full-cognitive \
  --replay ingest \
  --policy-router --policy-router-preset minimize-cost \
  --hybrid-retrieval --rerank cohere \
  --embedder-model text-embedding-3-small \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Run JSON: [`results/runs/2026-04-27T06-27-24-170--longmemeval-s--gpt-4o--full-cognitive--ingest.json`](https://github.com/framersai/agentos-bench/blob/master/results/runs/2026-04-27T06-27-24-170--longmemeval-s--gpt-4o--full-cognitive--ingest.json).

## Next

Two compounding axes pending measurement:

1. **M-tuned flags + semantic embedder on S** — does the wider rerank pool + larger reader window further lift S beyond 83.2%? Untested at full N=500.
2. **Semantic embedder on M Phase B** — the M-tuned 45.4% number was also CharHash. Semantic embedder + M-tuned flags compounded should lift M materially. Currently in flight.

Both will land in v2 alongside the validated S 83.2% headline as the v1 publication anchor.

## Related

- [First Public LongMemEval-M Number (30.6%)](2026-04-26-longmemeval-m-first-published-number.md)
- [LongMemEval-M M-tuned config: 30.6% → 45.4%](2026-04-26-longmemeval-m-30-to-57.md)
- [Memory Benchmark Transparency Audit](2026-04-24-memory-benchmark-transparency-audit.md)
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md)
