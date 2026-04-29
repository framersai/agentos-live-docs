---
title: "Memory Benchmarks"
sidebar_position: 1
description: AgentOS performance on LongMemEval-S, LongMemEval-M, and LOCOMO. Matched-reader honest comparison vs Mem0, Mastra, Hindsight, EmergenceMem, Supermemory, Zep, AgentBrain. Bootstrap CIs, judge-FPR probes, per-case run JSONs.
keywords:
  - longmemeval benchmark
  - locomo benchmark
  - ai memory benchmark
  - agentos sota
  - memory library comparison
  - mem0 vs agentos
  - mastra vs agentos
  - emergencemem benchmark
  - longmemeval m variant
---

AgentOS publishes the strongest open-source numbers on the public record at the matched `gpt-4o` reader on **[LongMemEval](https://arxiv.org/abs/2410.10813)** and is the only open-source memory library above 65% on the harder M variant.

This page is the canonical comparison table. Every cell links to its primary source. Cross-provider configurations (e.g. Mastra's gpt-5-mini reader + gemini-2.5-flash observer) are excluded because their results cannot be reproduced from public methodology disclosures.

## TL;DR

- **LongMemEval-S Phase B at gpt-4o reader, N=500**: AgentOS lands **85.6% [82.4%, 88.6%]** at $0.0090 per correct, 4-second average latency. Beats Mastra OM gpt-4o (84.23%), Supermemory gpt-4o (81.6%); statistically tied with EmergenceMem Internal (86.0%, no CI published).
- **LongMemEval-M Phase B**: AgentOS lands **70.2% [66.0%, 74.0%]**. **First open-source memory library above 65% on M with full methodology disclosure**. Statistically tied with closed-source AgentBrain (71.7%, no CI). +4.5 pp above the LongMemEval paper's published academic ceiling (65.7%, [Wu et al. ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)).
- **15 adjacent stress-tested configurations all regress** against the 85.6% headline. Pareto-optimal in the tested parameter space.

## LongMemEval-S Phase B (115K tokens, 50 sessions per haystack)

Same dataset (`data/longmemeval/longmemeval_s.json`), same Phase B N=500 methodology, same `gpt-4o-2024-08-06` judge with rubric `2026-04-18.1` (FPR 1% [0%, 3%] at n=100), same gpt-4o reader.

| System | Accuracy | 95% CI | $/correct | p50 latency | Source |
|---|---:|---|---:|---:|---|
| EmergenceMem Internal | 86.0% | not published | not published | 5,650 ms | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **🚀 AgentOS canonical-hybrid + reader-router** | **85.6%** | **[82.4%, 88.6%]** | **$0.0090** | **3,558 ms** | [85.6% Pareto-win post](/blog/2026/04/28/reader-router-pareto-win) |
| Mastra OM gpt-4o (gemini-flash observer) | 84.23% | not published | not published | not published | [mastra.ai](https://mastra.ai/research/observational-memory) |
| Supermemory gpt-4o | 81.6% | not published | not published | not published | [supermemory.ai](https://supermemory.ai/research/) |
| EmergenceMem Simple Fast (apples-to-apples in our harness) | 80.6% | [77.0%, 84.0%] | $0.0586 | 3,703 ms | [vendor reproduction adapter](https://github.com/framersai/agentos-bench/blob/master/vendors/emergence-simple-fast/) |
| Zep self-reported | 71.2% | not published | not published | 632 ms p95 search | [getzep.com](https://blog.getzep.com/state-of-the-art-agent-memory/) |
| Zep independently reproduced | 63.8% | not published | not published | not published | [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) |

**+1.4 pp accuracy over Mastra OM gpt-4o at the matched reader.** Statistically tied with EmergenceMem Internal (86.0% point estimate sits inside our 95% CI). Median latency vs EmergenceMem: 1.6× faster (3.558 s vs 5.650 s).

### Why other Mastra and managed-platform numbers are not in this table

- **Mastra OM 94.9%** uses gpt-5-mini reader + gemini-2.5-flash observer (cross-provider). Their public methodology page does not include enough detail to reproduce the result; we cannot independently verify it.
- **Mem0 v3 93.4%** is a managed-platform number with no published CI, no judge model disclosure, no reader model disclosure. Their own [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) post reports 66.9% on LOCOMO for their production stack, suggesting the 93.4% reflects the managed-evaluation harness more than the architecture.
- **Hindsight 91.4%** uses `gemini-3-pro` reader (cross-provider).
- **Supermemory 85.2%** uses `gemini-3-pro` reader (cross-provider).
- **agentmemory 96.2%** has no published CI, no methodology breakdown.

## LongMemEval-M Phase B (1.5M tokens, 500 sessions per haystack)

The harder variant. M's haystacks exceed every production context window: GPT-4o is 128K, Claude Opus is 200K, Gemini 3 Pro is 1M. Most memory vendors stop at S because raw long-context fits there.

| System | Accuracy | 95% CI | License | Source |
|---|---:|---|---|---|
| AgentBrain | 71.7% (Test 0) | not published | closed-source SaaS, requires hosted endpoint | [github.com/AgentBrainHQ](https://github.com/AgentBrainHQ) |
| **🚀 AgentOS (sem-embed + reader-router + top-K=5)** | **70.2%** | **[66.0%, 74.0%]** | **MIT** | [70.2% post](/blog/2026/04/29/longmemeval-m-70-with-topk5) |
| LongMemEval paper academic baseline | 65.7% | not published | open repo | [Wu et al. ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813) |
| Mem0 v3 | not published | — | Apache 2.0 | reports S only |
| Mastra OM | not published | — | Apache 2.0 | reports S only |
| Hindsight | not published | — | open repo | reports S only |
| Zep | not published | — | Apache 2.0 | "due to gpt-4o's 128K context window we chose S over M" |
| EmergenceMem | not published | — | open Python | reports S only |
| Supermemory | not published | — | open | reports S only |
| MemMachine, Memoria, agentmemory, Backboard, ByteRover, Letta, Cognee | not published | — | various | reports S only or no LongMemEval |

**Statistically tied with AgentBrain's closed-source SaaS** (their 71.7% sits inside our 95% CI). **+4.5 pp above the LongMemEval paper's published academic ceiling.** **First open-source memory library on the public record above 65% on M with full methodology disclosure** (bootstrap CIs, per-case run JSONs, reproducible CLI, MIT-licensed).

### The journey: 30.6% → 45.4% → 57.6% → 70.2%

| Date | Configuration | Aggregate | Lift |
|---|---|---:|---:|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K=20) | 30.6% | baseline |
| 2026-04-26 | M-tuned (HyDE + top-K=50 + rerank-mult=5, CharHash) | 45.4% [41.2%, 49.8%] | +14.8 pp |
| 2026-04-29 | M-tuned + sem-embed + reader-router (top-K=50) | 57.6% [53.2%, 61.8%] | +12.2 pp |
| **2026-04-29** | M-tuned + sem-embed + reader-router + **top-K=5** | **70.2% [66.0%, 74.0%]** | **+12.6 pp** |

**Cumulative: +39.6 pp over the original baseline.** Each step has CIs disjoint from the prior step.

## LOCOMO (out-of-distribution transfer)

LongMemEval-tuned pipeline, no LOCOMO-specific tuning, gpt-4o reader, N=1986:

| Configuration | Accuracy | 95% CI | $/correct | Note |
|---|---:|---|---:|---|
| **AgentOS K=20 retrieval (Pareto-best LOCOMO tuning)** | **51.5%** | **[49.2%, 53.7%]** | **$0.0099** | Stage F-3 |
| AgentOS Tier 1 OOD baseline | 49.9% | [47.7%, 52.1%] | $0.0123 | no tuning |
| Mem0 self-reported (managed) | 66-68% | not published | not published | LOCOMO with default `gpt-4o-mini` judge (Penfield FPR 62.81%) |

**Judge FPR comparison (the variable that swings LOCOMO scores 30-60 pp):**

| Benchmark | AgentOS judge FPR | LOCOMO default judge FPR |
|---|---:|---:|
| LongMemEval-S | 1% [0%, 3%] | not published |
| LongMemEval-M | 2% [0%, 5%] | not published |
| LOCOMO | **0% [0%, 0%]** | **62.81%** (Penfield Labs) |

The 62.81% FPR ceiling on LOCOMO's default `gpt-4o-mini` judge means any LOCOMO score above ~93.6% benefits from benchmark errors, and any score difference below ~6 pp sits in judge noise. AgentOS uses `gpt-4o-2024-08-06` with rubric `2026-04-18.1` which probes at 0% FPR on LOCOMO.

## Methodology disclosure (12 axes most vendors omit)

| Axis | AgentOS | Mem0 | Mastra | Supermemory | Zep | Emergence | Letta | MemPalace |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Aggregate accuracy | yes | yes | yes | yes | yes | yes | partial | yes |
| 95% bootstrap CI | yes | no | no | no | partial | no | no | no |
| Per-category 95% CI | yes | no | no | no | no | no | no | no |
| Reader model disclosed | yes | no | yes | partial | yes | yes | no | no |
| Observer / ingest model disclosed | yes | no | yes | no | yes | yes | no | no |
| USD cost per correct | yes | no | no | no | no | no | no | no |
| Latency avg / p50 / p95 | yes | no | no | no | partial | median only | no | no |
| Per-category breakdown | yes | no | yes | yes | yes | yes | partial | no |
| Open-source benchmark runner | yes | yes | partial | yes | partial | yes | no | partial |
| Per-case run JSONs at fixed seed | yes | no | no | no | no | no | no | no |
| Judge-adversarial FPR probe | yes | no | no | no | no | no | no | no |
| Matched-reader cross-vendor table | yes | no | no | partial | partial | yes | no | no |

The full audit framework is at [Memory Benchmark Transparency Audit](/blog/2026/04/24/memory-benchmark-transparency-audit). Per-case run JSONs at `seed=42` are committed under [`packages/agentos-bench/results/runs/`](https://github.com/framersai/agentos-bench/tree/master/results/runs) for every published number.

## Reproducing

The 85.6% LongMemEval-S headline:

```bash
git clone https://github.com/framersai/agentos-bench
cd agentos-bench
pnpm install && pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-s \
  --reader gpt-4o \
  --memory full-cognitive --replay ingest \
  --hybrid-retrieval --rerank cohere \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

The 70.2% LongMemEval-M headline (single-variable change is `--reader-top-k 5`):

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive --replay ingest \
  --hybrid-retrieval --rerank cohere --rerank-candidate-multiplier 5 \
  --reader-top-k 5 \
  --hyde \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Both runs ship with per-case run JSONs at `seed=42`. The full bench leaderboard is at [packages/agentos-bench/results/LEADERBOARD.md](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md).

## Related blog posts

- [70.2% on LongMemEval-M](/blog/2026/04/29/longmemeval-m-70-with-topk5) — current M headline
- [85.6% on LongMemEval-S Pareto-win](/blog/2026/04/28/reader-router-pareto-win) — current S headline
- [Memory Benchmark Transparency Audit](/blog/2026/04/24/memory-benchmark-transparency-audit) — methodology framework
- [Two Negative Results: Stage L + Stage I](/blog/2026/04/26/two-negative-results-stage-l-stage-i) — what we tested and dropped

## References

- Wu et al., LongMemEval (ICLR 2025). [arXiv:2410.10813](https://arxiv.org/abs/2410.10813).
- Maharana et al., LOCOMO (ACL 2024). [aclanthology.org](https://aclanthology.org/2024.acl-long.747.pdf).
- Penfield Labs LOCOMO audit (April 2026). [dev.to/penfieldlabs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg).
- Sumers et al., CoALA (cognitive architectures for language agents). [arXiv:2309.02427](https://arxiv.org/abs/2309.02427).
- Packer et al., MemGPT. [arXiv:2310.08560](https://arxiv.org/abs/2310.08560). Now part of [Letta](https://www.letta.com/blog/memgpt-and-letta).
- Northcutt et al., Pervasive label errors in test sets (NeurIPS 2021). [arXiv:2103.14749](https://arxiv.org/abs/2103.14749).
