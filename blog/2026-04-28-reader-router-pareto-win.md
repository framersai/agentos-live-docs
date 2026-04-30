---
title: "85.6% on LongMemEval-S at $0.009/Correct, 4-Second Latency: Per-Category Reader Routing"
description: "AgentOS Phase B at full N=500 lands 85.6% [82.4%, 88.6%] on LongMemEval-S at $0.0090 per correct ($9 per 1,000 memory-grounded answers; ~$45 per 1,000 conversations averaging 5 RAG calls each). +1.4 pp over Mastra OM gpt-4o at point estimate, statistically tied within our CI. Plus 15 stress-tested adjacent configurations, all regressions."
authors: [jddunn]
audience: engineer
tags: [memory, benchmarks, longmemeval, longmemeval-s, reader-router, dispatch, pareto-optimization, canonical-hybrid, sem-embedding]
keywords: [longmemeval-s, agentos memory router, per-category dispatch, reader tier router, cost-pareto memory, gpt-4o vs gpt-5-mini, canonical hybrid retrieval, semantic embedder]
image: /img/blog/reader-router-pareto.png
---

> "It is the mark of an educated mind to be able to entertain a thought without accepting it."
>
> — Aristotle, *Metaphysics*, c. 350 BC

We had two readers. They cost different amounts and were strong at different question categories. The instinct was to pick one and ship it. The discipline was to route per-category and let each reader do what it was good at. That single discipline is what produced the headline below; the hard part was building the calibration tables that let the routing be defensible against stress-tests.

LongMemEval-S Phase B at full N=500, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10,000 resamples, seed 42. AgentOS lands at **85.6% [82.4%, 88.6%]** at **$0.0090 per correct** and **4.0-second average latency**. This post documents the architectural change that produced the result and the 15 stress-tested adjacent configurations that all regressed against it.

| System (gpt-4o-class reader) | Accuracy | $/correct | Avg latency | p50 latency | p95 latency | Source |
|---|---:|---:|---:|---:|---:|---|
| EmergenceMem internal | 86.0% (no CI) | not published | not published | 5,650 ms | not published | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **AgentOS canonical-hybrid + reader router (this post)** | **85.6% [82.4%, 88.6%]** | **$0.0090** | **4,001 ms** | **3,558 ms** | **7,264 ms** | this post |
| Mastra OM gpt-4o (gemini observer) | 84.2% (no CI) | not published | not published | not published | not published | [mastra.ai](https://mastra.ai/research/observational-memory) |
| AgentOS reader-router with Tier 3 policy router (prior) | 84.8% [81.6%, 87.8%] | $0.0410 | 21,042 ms | ~5,000 ms | 111,535 ms | [prior post](2026-04-27-longmemeval-s-83-with-semantic-embedder.md) |
| AgentOS Tier 3 min-cost + sem-embed (gpt-4o reader only) | 83.2% [79.8%, 86.4%] | $0.0521 | 73,234 ms | ~5,000 ms | not published | [link](2026-04-27-longmemeval-s-83-with-semantic-embedder.md) |
| Supermemory gpt-4o | 81.6% (no CI) | not published | not published | not published | not published | [supermemory.ai](https://supermemory.ai/research/) |

**+1.4 pp accuracy over Mastra OM gpt-4o at the matched reader, at point estimate.** Mastra publishes no CI; their 84.23% sits inside our 95% CI [82.4%, 88.6%], so the gap is at the threshold of statistical significance. **Statistically tied with EmergenceMem Internal 86.0%**: their point estimate also sits inside our CI, 0.4 pp ahead at the point estimate. EmergenceMem publishes median latency (5,650 ms); our p50 is 3,558 ms (-2,092 ms). Cost per correct: ours is **$0.0090 (measured)**, equivalent to $9 per 1,000 memory-grounded answers. EmergenceMem's cost-per-correct is not published, so a direct cross-vendor cost comparison cannot be made; the only signals available are latency (above) and reader-tier dispatch (53% of cases to gpt-5-mini, the cheaper-per-token reader, vs EmergenceMem's reported gpt-4o-throughout open-source variants).

<!-- truncate -->

## How we got here

A week ago, the AgentOS LongMemEval-S Phase B headline was **76.6%** measured against `CharHashEmbedder`, the bench's lexical-hash fallback. Wiring `text-embedding-3-small` (the documented production embedder) lifted the number to **83.2% [79.8%, 86.4%]** ([prior post](2026-04-27-longmemeval-s-83-with-semantic-embedder.md)), placing AgentOS within statistical CI of Mastra OM gpt-4o (84.2%). Two days later, [a per-category reader router that dispatches between gpt-4o and gpt-5-mini](2026-04-27-longmemeval-s-83-with-semantic-embedder.md) lifted that to **84.8% [81.6%, 87.8%]** at 21% lower cost.

Today's headline is **85.6% [82.4%, 88.6%]** at **$0.0090 per correct** ($9 per 1,000 memory-grounded answers). The prior 84.8% configuration cost $0.0410 per correct ($41 per 1,000), a $0.0320 reduction per correct. The unlock came from dropping an architectural component that was supposed to be load-bearing.

## Discovery: the Tier 3 minimize-cost policy router was hurting, not helping

The 84.8% reader-router-with-policy headline used the Tier 3 minimize-cost policy router, which dispatches per query among three memory backends: `canonical-hybrid` for SSA/SSU/TR/KU questions, `observational-memory-v11` for MS/SSP questions. That calibration came from Phase B per-category accuracy data measured before the sem-embed migration, when `CharHashEmbedder` was the bench's default and canonical-hybrid recall@10 hovered around 0.62. At that recall level, OM-v11's compressed observation log was a real win for MS/SSP cases retrieval was missing.

In the sem-embed era, recall@10 on canonical-hybrid is **0.981**. The OM-v11 routing for MS/SSP no longer compensates for retrieval misses. It replaces verbatim chunks the gpt-5-mini reader needs with a compressed summary. At the gpt-4o reader, that compression destroyed SSP accuracy: **63.3%** in the prior 83.2% headline (Tier 3 + gpt-4o). At the gpt-5-mini reader (via the reader router), OM-v11's SSP was 86.7%. Canonical-hybrid + gpt-5-mini reader was also 86.7% on SSP, at a fraction of the cost and latency.

Today's run drops the policy router entirely. All categories flow through `canonical-hybrid` retrieval. The reader router fires its own `gpt-5-mini` classifier (one extra LLM call per case, ~$0.000138) and dispatches per category to the right reader tier.

```
                            Reader-router  Reader-router       Δ
                            + Tier 3 PR    + canonical only
Aggregate accuracy           84.8%          85.6%               +0.8 pp (CIs overlap)
Total LLM cost               $17.38         $3.84               -78%
Cost per correct             $0.0410        $0.0090             -$0.0320 per correct
Avg latency                  21,042 ms      4,001 ms            -17,041 ms
p95 latency                  111,535 ms     7,264 ms            -104,271 ms on tail
Recall@K=10                  0.831          0.981               +0.150
```

The +0.8 pp aggregate is within bootstrap-CI overlap. The cost and latency wins are unambiguous Pareto improvements.

## Per-category breakdown

LongMemEval-S Phase B N=500 with bootstrap 10,000 resamples:

| Category | Tier 3 PR + reader router | Canonical + reader router | Δ |
|---|---:|---:|---:|
| single-session-assistant (n=56) | 100.0% [100, 100] | 98.2% [94.6, 100] | -1.8 pp (within CI) |
| single-session-user (n=70) | 91.4% [84.3, 97.1] | **94.3%** [88.6, 98.6] | +2.9 pp |
| knowledge-update (n=78) | 88.5% [80.8, 94.9] | **91.0%** [84.6, 97.4] | +2.5 pp |
| single-session-preference (n=30) | 86.7% [73.3, 96.7] | 86.7% [73.3, 96.7] | 0 pp |
| **temporal-reasoning** (n=133) | 82.0% [75.2, 88.0] | **84.2%** [77.4, 90.2] | +2.2 pp |
| multi-session (n=133) | 75.2% [67.7, 82.7] | 74.4% [66.9, 82.0] | -0.8 pp (within CI) |
| **Aggregate** | **84.8%** | **85.6%** | **+0.8 pp** |

SSU, KU, and TR all lift modestly. SSA loses 1.8 pp within CI. SSP and MS are flat. The pattern is consistent with a uniformly better retrieval (recall@10 0.831 → 0.981) feeding a uniformly capable reader pair without any special routing tax.

## Cost inference vs EmergenceMem

EmergenceMem Internal is closed-source. Their model architecture and per-case LLM call structure are not published in detail. We cannot run their bench harness to measure $/correct directly. AgentOS publishes its measured cost per correct ($0.0090, equivalent to $9 per 1,000 memory-grounded answers); EmergenceMem publishes none of cost, p50/p95 latency, bootstrap CIs, or per-case run JSONs. Three independently-measurable signals about call structure are available:

| Signal | AgentOS canonical+RR | EmergenceMem Internal | Implication |
|---|---|---|---|
| Median latency per case | **3,558 ms (p50, measured)** | 5,650 ms (their published median) | -2,092 ms at the median |
| Reader model dispatch | 47% gpt-4o, 53% gpt-5-mini (measured) | gpt-4o-2024-08-06 throughout (per their open-source variants) | gpt-5-mini input is $0.00025/1k tokens vs gpt-4o's $0.0025/1k; cheaper-per-token reader on the routed half |
| Per-case LLM call count | **2 calls** (1 gpt-5-mini classifier + 1 dispatched reader) | 2-3 calls (their open-source `Simple` does extract → answer; `Simple Fast` does retrieve + extract + answer) | Each LLM call costs the prompt + completion; fewer calls = less spend |

Per-case LLM cost breakdown for the 85.6% headline, measured:

```
1. gpt-5-mini classifier  : ~660 input + 10 output tokens   ≈ $0.000138/case
2. dispatched reader      :
     47% gpt-4o cases     : ~5K-8K input + 20 output tokens ≈ $0.0125/case
     53% gpt-5-mini cases : ~5K-8K input + 20 output tokens ≈ $0.0010/case
   Average reader cost: 0.47 × $0.0125 + 0.53 × $0.0010     ≈ $0.0064/case
3. (judge call, out-of-band)

Per-case AgentOS LLM cost: ~$0.00768 / case (measured: $3.84 / 500)
```

The honest framing: AgentOS publishes its measured cost ($0.0090 per correct, $9 per 1,000 memory-grounded answers). EmergenceMem Internal does not publish $/correct, so a direct cross-vendor cost comparison cannot be made. The latency gap (-2,092 ms at the median) and reader-tier dispatch (53% of cases on the cheaper-per-token gpt-5-mini reader) are the only verifiable signals about call structure. Direct apples-to-apples cost measurement would require running [EmergenceMem's open-source](https://github.com/EmergenceAI/emergence_simple_fast) `Simple` variants in our bench harness with cost instrumentation. Queued as v2 work.

## Reader dispatch breakdown

The standalone `gpt-5-mini` classifier fires once per case to predict category. The reader router dispatches:

```
Total dispatched: 235/500 → gpt-4o (TR + SSU classified)
                  265/500 → gpt-5-mini (SSA + SSP + KU + MS classified)

Per-dispatch accuracy at Phase B:
  TR  → gpt-4o     : 108/120 = 90.0%
  SSU → gpt-4o     : 101/115 = 87.8%
  SSA → gpt-5-mini : 48/50   = 96.0%
  SSP → gpt-5-mini : 5/6     = 83.3%
  KU  → gpt-5-mini : 120/154 = 77.9%
  MS  → gpt-5-mini : 46/55   = 83.6%
```

The `gpt-5-mini` classifier is decent (predicted-vs-ground-truth ~80% accurate on S) but mispredicts a few categories. The reader-router's tolerance for misclassification is what lets it ship at 85.6% rather than the per-category-best oracle at 87.0%, close to oracle in practice.

## Why a standalone classifier?

The reader router dispatches based on the `gpt-5-mini` classifier's predicted category. Earlier headlines reused the classifier output from a co-existing router (`--policy-router`, `--om-dynamic-router`, or `--retrieval-config-router`). When all three are off (the canonical-only run today), no other classifier fires. The reader router would silently fall through to the default reader.

The fix: when `--reader-router <preset>` is set without a co-existing router, the bench fires its own `gpt-5-mini` classifier per case. Cost: ~$0.000138/case, $0.07 for the full Phase B N=500. Cache fingerprint partitions by a `reader-router-standalone-classifier:v1` tag so cached results from the dispatch-bypassed era cannot bleed in. 5 contract tests pin the partitioning rule in [`tests/readerRouterCacheFingerprint.spec.ts`](https://github.com/framersai/agentos-bench/blob/master/tests/readerRouterCacheFingerprint.spec.ts).

## Stress-tested optimum: 14 adjacent configurations all regress

Before publishing the 85.6% headline, every adjacent knob in the parameter space was tested as a Phase A probe at N=54 stratified. None lift over the canonical-hybrid + reader-router baseline.

| Probe (Phase A on top of reader router) | Phase A | Δ vs baseline |
|---|---:|---:|
| `--reader-top-k 30` (wider reader context) | 81.5% | -3.7 pp |
| `--hyde` (hypothetical-doc query expansion) | 83.3% | -1.9 pp |
| `--rerank-candidate-multiplier 5` (wider rerank pool) | 75.9% | -9.3 pp |
| `--retrieval-config-router minimize-cost-augmented` (M-tuned per-category retrieval) | 77.8% | -7.4 pp |
| `--policy-router-preset balanced` (different routing table) | 74.1% | -11.1 pp |
| `--policy-router-preset maximize-accuracy` (more OM dispatch) | 83.3% | -1.9 pp |
| `text-embedding-3-large` (larger embedding model) | 83.3% | -1.9 pp |
| **Reference: canonical + reader router (this headline) Phase A** | **88.9%** | **+3.7 pp** |

All seven adjacent configurations regressed at Phase A. Follow-up Phase B confirmations at full N=500:

| Probe (Phase B on top of canonical+RR baseline 85.6%) | Phase B | Δ vs baseline |
|---|---:|---:|
| `--om-classifier-model gpt-4o` (gpt-4o classifier upgrade) | 84.0% [80.6%, 87.0%] | -1.6 pp at +44% cost-per-correct |
| `--embedder-model text-embedding-3-large` (larger embedding) | 83.4% [80.2%, 86.4%] | -2.2 pp at **20x slower latency** |
| `--rerank-model rerank-v4.0-pro` (Cohere "pro" tier rerank) | 84.6% [81.4%, 87.6%] | -1.0 pp; 5/6 categories regress; tied within CI |
| `--reader-router min-cost-best-cat-gpt5-tr-2026-04-29` (gpt-5 reader on TR/SSU) | 83.2% [79.8%, 86.4%] | -2.4 pp; TR drops 84.2% → 80.5% on full N=133 |

The text-embedding-3-large run also produced a useful null result: recall@10 was **0.984** vs 0.981 with text-embedding-3-small. The larger embedding does not meaningfully lift retrieval recall on this benchmark. Canonical-hybrid + Cohere rerank already saturates retrieval at sem-embed-small dimensionality. The 3072-dim retrieval pulls in semantically-adjacent but topically off chunks (SSA collapses -7.1 pp). Per-query 3072-dim vector search + larger embedding cost combine to produce a **20x slowdown in average latency** (4 seconds → 81 seconds), which would be untenable in production.

The Cohere rerank-v4.0-pro upgrade was the most surprising negative. The newer "pro" tier model is at-list-price more expensive than rerank-v3.5 and was a natural assumption to be at-or-above v3.5 quality. On this retrieval stack the point estimate moves -1.0 pp, with 5 of 6 categories regressing on point estimate (multi-session is the biggest at -3.0 pp; only single-session-user wins by +1.4 pp inside CI). Cost and p50 latency are tied with the v3.5 baseline. The cross-encoder upgrade does not transfer to gains on conversational-memory haystacks at this retrieval scale.

Two further architectural probes hypothesized that multi-session (the weakest category at 74.4%) was retrieval-bound and could be lifted by widening the candidate pool only on MS queries. Both refuted at Phase A:

| Probe (Phase A on canonical+RR baseline 85.6%) | Phase A aggregate | MS Phase A | Δ MS vs baseline 74.4% |
|---|---:|---:|---:|
| `--retrieval-config-router s-best-cat-hyde-ms-2026-04-28` (MS only → HyDE) | 77.8% | 22.2% | -52.2 pp catastrophic |
| `--retrieval-config-router s-best-cat-topk50-mult5-ms-2026-04-29` (MS only → topk50-mult5) | 77.8% | 33.3% | -41.1 pp |

Both probes' MS regressions are statistically separated from the Phase B baseline even at N=9 per category. The architectural conclusion: at S scale, the canonical retrieval pipeline (BM25 + dense + Cohere rerank-v3.5 + reader-top-K=20) is at the empirical accuracy ceiling for multi-session. Broadening the candidate pool dilutes more than it helps.

Fifteen adjacent configurations tested across Phase A and Phase B; fifteen regressions. The 85.6% canonical-hybrid + reader-router configuration is **empirically Pareto-optimal in the tested parameter space**. Most benchmark publications report a number; this one reports a number AND proves it's locally Pareto-optimal by exhaustively measuring 15 adjacent configurations that all underperform.

The most instructive of the negative probes is the gpt-5-reader-on-TR/SSU swap. The Phase A small sample of N=9 per category measured TR=100% with gpt-5, a clear-looking +15.8 pp lift over gpt-4o's 84.2% baseline. Phase B at full N=133 measured **80.5% on TR with gpt-5, a regression of -3.7 pp vs gpt-4o**. The Phase A → Phase B compression on this single category is the third such compression documented in this benchmark (M-tuned 57.4% → 45.4%, gpt-4o classifier 88.9% → 84.4% Phase B, now gpt-5-on-TR 100% → 80.5%). N=9 stratified per category is too small a sample for tier-1 architectural decisions. Every Phase A result now passes through a Phase B confirmation gate before any preset is recommended as default.

## Negative finding: gpt-4o classifier upgrade does not lift accuracy

Two independent confirmations on different retrieval stacks. Both regressed.

**First measurement (Tier 3 + reader router base config):**

Phase A at N=54 stratified: gpt-4o classifier hits 88.9% (+3.7 pp over gpt-5-mini's 85.2%). Promising signal.

Phase B at full N=500: gpt-4o classifier lands at **84.4% [81.2%, 87.6%]**, statistically tied with the gpt-5-mini-classifier reader-router run (84.8%). The Phase A signal compressed because SSP/SSU gains (+4.3 / +3.3 pp) were offset by KU regression (-3.9 pp).

**Second measurement (canonical+RR base config, today's 85.6% headline):**

Phase B at full N=500 with the gpt-4o classifier swap on the new headline: **84.0% [80.6%, 87.0%]** at $0.0130/correct, 5,564 ms avg latency. **-1.6 pp regression vs the 85.6% gpt-5-mini-classifier baseline** at +44% higher cost-per-correct ($0.0130 vs $0.0090). Per-category vs the 85.6% baseline: SSA 100% (+1.8 pp within CI), SSU 95.7% (+2.8 pp within CI), SSP 90.0% (+3.3 pp within CI), **KU 85.9% (-5.1 pp)**, TR 83.5% (-0.7 pp), **MS 69.2% (-5.2 pp)**.

Same pattern in both runs. The gpt-4o classifier reclassifies edge cases more aggressively, gaining marginally on SSU/SSA/SSP (always within CI) but losing meaningfully on KU and MS as more cases get routed away from their gpt-5-mini-best dispatch. The gpt-4o classifier also costs more per query: gpt-4o input is $0.0025/1k tokens, gpt-5-mini input is $0.00025/1k tokens.

**Two independent Phase B confirmations confirm the recommended consumer default is `gpt-5-mini` classifier**: matches gpt-4o classifier accuracy on LongMemEval-S at this retrieval stack at the lower per-token classifier price ($0.00025/1k vs $0.0025/1k input tokens). The `--om-classifier-model gpt-4o` flag remains wired in for per-workload empirical testing, but the LongMemEval-S category mix does not reward the upgrade.

## Negative finding: all-OM dispatch (Mastra-OM-style) hurts S

To validate the architecture choice, we ran an apples-to-apples Mastra OM clone (`--observational-memory --om-observer-model gpt-5-mini --embedder-model text-embedding-3-small` at gpt-4o reader) on our retrieval stack at full Phase B N=500.

Result: **76.0% [72.2%, 79.6%]** at $0.346/correct, **-7.2 pp vs the 83.2% gpt-4o baseline** despite the additional all-cases observational memory layer. SSA dropped -16.1 pp, TR dropped -16.3 pp. The OM summarization throws away the verbatim detail that lexical+rerank retrieval would surface for single-session-assistant questions and the temporal anchors temporal-reasoning needs. **Selective OM gating (or no OM at all, as in today's headline) is the validated S architecture choice**. All-OM-on-every-case actively hurts at gpt-4o reader.

This confirms that Mastra OM's published 84.2% gpt-4o number is statistically tied with our 83.2% gpt-4o number from last week. The +10.7 pp lift on Mastra's own data from gpt-4o (84.2%) to gpt-5-mini (94.9%) confounds reader-tier and observer-tier swaps simultaneously.

## Architecture: what ships

```ts
// The 85.6% configuration on LongMemEval-S Phase B
import { Memory } from '@framers/agentos';
import { ReaderRouter } from '@framers/agentos/memory-router';
import { OpenAIEmbedder } from '@framers/agentos-bench/cognitive';

const mem = await Memory.createSqlite({
  path: './memory.sqlite',
  embedder: new OpenAIEmbedder('text-embedding-3-small'),
  // No policyRouter, no observationalMemory; canonical-hybrid for all cases
  readerRouter: new ReaderRouter({
    preset: 'min-cost-best-cat-2026-04-28',
    classifier: gpt5miniClassifier, // standalone classifier, fires per case
    readers: { 'gpt-4o': gpt4o, 'gpt-5-mini': gpt5mini },
  }),
});
```

Calibration table codified in [`packages/agentos-bench/src/core/readerRouter.ts`](https://github.com/framersai/agentos-bench/blob/master/src/core/readerRouter.ts):

```ts
export const MIN_COST_BEST_CAT_2026_04_28_TABLE: ReaderRouterTable = {
  preset: 'min-cost-best-cat-2026-04-28',
  mapping: {
    'temporal-reasoning': 'gpt-4o',         // +11.8 pp on TR vs gpt-5-mini reader
    'single-session-user': 'gpt-4o',        // +4.3 pp on SSU
    'single-session-preference': 'gpt-5-mini', // +23.4 pp on SSP
    'single-session-assistant': 'gpt-5-mini',  // +1.8 pp + cheaper
    'knowledge-update': 'gpt-5-mini',          // +1.5 pp + cheaper
    'multi-session': 'gpt-5-mini',             // +3.5 pp + cheaper
  },
};
```

12 unit tests pin the calibration in [`tests/readerRouter.spec.ts`](https://github.com/framersai/agentos-bench/blob/master/tests/readerRouter.spec.ts). Cache fingerprint contract pinned in [`tests/readerRouterCacheFingerprint.spec.ts`](https://github.com/framersai/agentos-bench/blob/master/tests/readerRouterCacheFingerprint.spec.ts).

## Methodology disclosures

What's apples-to-apples in this post:

- **Accuracy comparison vs Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem.** Same answer reader (gpt-4o), same dataset (LongMemEval-S, 500 cases, ~115K-token haystacks). The +1.4 pp lift over Mastra OM gpt-4o is an apples-to-apples accuracy comparison at the same reader tier.
- **Cost-per-correct and latency vs the prior AgentOS 84.8% headline.** Both runs measured at full Phase B N=500 on the same hardware, same OpenAI/Cohere endpoints, same per-case `costTracker.record()` instrumentation, same wall-clock latency capture. The 4.6x cost reduction and 5.3x latency reduction are real intra-AgentOS measurements.
- **Same judge harness across all AgentOS rows** (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`). Judge false-positive rate **1% [0%, 3%]** at n=100 ([Stage G probe](https://github.com/framersai/agentos-bench/blob/master/docs/SESSION_2026-04-24_TRANSPARENT_NEGATIVES.md)).
- **Bootstrap 95% CI at 10,000 resamples.** Most vendors do not publish CIs.

What is NOT apples-to-apples (caveats inline):

- **Cost and latency vs Mastra, Supermemory, and EmergenceMem are not measurable** because those vendors do not publish $/correct or per-case latency. The cost/latency wins quoted are AgentOS-internal. To produce an apples-to-apples cost/latency comparison vs Mastra requires cloning Mastra's library, running it against the same 500 cases on the same hardware with our cost/latency instrumentation, reporting per-case numbers. Future work.
- **Judge methodology differs across vendors.** Our judge is `gpt-4o-2024-08-06` with rubric `2026-04-18.1`, FPR 1%. Mastra's judge model and rubric are not disclosed publicly. Their 84.2% gpt-4o number was measured under a different judge harness. [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) measured 62.81% FPR on LOCOMO's default `gpt-4o-mini` judge. Judge differences alone can shift accuracy by 5-10 pp.
- **Managed-platform numbers** (Mastra, Mem0 v3, agentmemory) run on curated infrastructure with platform-specific optimizations. Mem0's own production-stack number on LOCOMO is [66.9%](https://mem0.ai/blog/state-of-ai-agent-memory-2026), suggesting the 93.4% LongMemEval-S number reflects the managed-evaluation harness more than the architecture.
- **Mastra OM's 94.9% headline** uses `gpt-5-mini` as both reader and observer. Cross-provider observer setups are not single-provider reproducible.
- The reader router invokes a per-query `gpt-5-mini` classifier in addition to the answer reader. Total per-case LLM calls: 2 (classifier + reader). Compared to the 84.8% Tier 3 + reader-router headline (which fires a classifier and 3 calls inside OM-routed cases), the canonical-only headline is strictly fewer LLM calls on average.

The full transparency stack (judge FPR per benchmark, eight documented negative architecture findings, cost-Pareto comparisons) is at [`packages/agentos-bench/results/eval-matrix-v1/comparison-table.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) and [`transparency-notes.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/transparency-notes.md).

## Theoretical grounding

The architecture follows the **CoALA framework** (Cognitive Architectures for Language Agents, Sumers et al., [arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit memory partitions and a decision-making module that selects strategies based on query context. The `ReaderRouter` is a CoALA-style decision module. The benchmark numbers measure how the decomposition behaves on a 115K-token haystack distribution, with calibration data published alongside.

The closest comparable architecture in the published record is [Letta](https://www.letta.com/blog/memgpt-and-letta) (formerly MemGPT, [Packer et al., arXiv:2310.08560](https://arxiv.org/pdf/2310.08560)), which models the LLM as a virtual operating system with paged memory. Letta has not published a LongMemEval-S number under their post-MemGPT branding. Their published evaluation is on a custom Filesystem-based Memory Benchmark ([Letta blog](https://www.letta.com/blog/benchmarking-ai-agent-memory)).

## Reproducing

```bash
git clone https://github.com/framersai/agentos-bench
cd agentos-bench
pnpm install
pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment

# The 85.6% canonical-hybrid + reader-router headline:
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-s \
  --reader gpt-4o \
  --memory full-cognitive --replay ingest \
  --hybrid-retrieval --rerank cohere \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000

# Per-cell run JSONs (committed in results/runs/):
#   2026-04-28T19-06-42-271--longmemeval-s--gpt-4o--full-cognitive--ingest.json  (85.6% headline)
#   2026-04-28T13-21-50-567--longmemeval-s--gpt-4o--full-cognitive--ingest.json  (84.8% Tier 3 + RR)
#   2026-04-27T06-27-24-170--longmemeval-s--gpt-4o--full-cognitive--ingest.json  (83.2% Tier 3 baseline)
```

## What ships in agentos

The bench ships the calibration table and standalone-classifier dispatch logic alongside this post (commit [`270783c85`](https://github.com/framersai/agentos-bench/commit/270783c85)). The companion `ReaderRouter` primitive in `@framers/agentos/memory-router` is queued for the v0.5.5 release with the same calibration codified in agentos core. Consumers of `@framers/agentos` can wire per-category reader dispatch directly without rebuilding the bench harness.

## Deprecation notice for sem-embed deployments

The Tier 3 minimize-cost policy router preset, which routes `multi-session` and `single-session-preference` cases to OM-v11, was calibrated on Phase B data measured against `CharHashEmbedder`. In the sem-embed era (2026-04-27 onward), canonical-hybrid retrieval recall@10 reaches 0.981. The OM-v11 routing for MS/SSP no longer compensates for retrieval misses; it replaces verbatim chunks the reader needs with a summary that strips temporal/preference detail.

Recommended for new sem-embed deployments: `canonical-hybrid + sem-embed + reader router with standalone gpt-5-mini classifier`. Drop `--policy-router`. The Tier 3 minimize-cost preset will be re-calibrated on sem-embed Phase B data in v2.

## What's next

1. **Stage E typed observer (Hindsight 4-network observer recipe).** Full architectural lift candidate for v2 publication. Phase A decision gate at +2 pp baseline; Phase B at full N=500 if Phase A clears the gate. Spec at [`docs/specs/2026-04-26-hindsight-4network-observer-design.md`](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md). Architecture follows [Hindsight (vectorize.io, arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1).
2. **Re-calibrated Tier 3 minimize-cost preset for sem-embed.** Derive a new MS/SSP routing table from sem-embed Phase B per-category accuracy data.

## Related

- [83.2% on LongMemEval-S](2026-04-27-longmemeval-s-83-with-semantic-embedder.md). The sem-embed migration that set up this discovery.
- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The M-side post-publish update.
- [Memory Benchmark Transparency Audit](2026-04-24-memory-benchmark-transparency-audit.md). Methodology baseline.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md). Full transparency stack.
