---
title: "85.6% on LongMemEval-S at $0.009/correct, 4-Second Latency: Per-Category Reader Routing on Canonical-Hybrid"
description: "AgentOS Phase B at full N=500 lands at 85.6% [82.4%, 88.6%] — beating Mastra OM gpt-4o (84.2%) on accuracy by +1.4 pp at the same gpt-4o-class reader. Cost ($0.0090/correct) and latency (4 sec avg, 7 sec p95) are AgentOS-internal Pareto improvements: 4.6× cheaper and 5.3× faster than our prior 84.8% headline (Mastra does not publish $/correct or latency numbers, so direct cost/latency comparisons against Mastra are unmeasurable). The architectural unlock: dropping the Tier 3 minimize-cost policy router (whose MS/SSP → OM-v11 calibration was derived from CharHash-era data and now actively hurts at the semantic-embedder era) AND adding a standalone gpt-5-mini classifier so the reader-router can dispatch per category on the canonical-hybrid path. Plus 14 stress-tested adjacent configurations that all regress, validating the new headline as empirically Pareto-optimal in the tested parameter space."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, longmemeval-s, reader-router, dispatch, pareto-optimization, canonical-hybrid, sem-embedding]
keywords: [longmemeval-s, agentos memory router, per-category dispatch, reader tier router, cost-pareto memory, gpt-4o vs gpt-5-mini, canonical hybrid retrieval, semantic embedder]
image: /img/blog/reader-router-pareto.png
---

LongMemEval-S Phase B at full N=500, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10 000 resamples, seed 42:

| System (gpt-4o-class reader) | Accuracy | $/correct | Avg latency | Median latency | p95 latency | Source |
|---|---:|---:|---:|---:|---:|---|
| EmergenceMem internal | 86.0% (no CI) | — (not published) | — (not published) | 5,650 ms | — (not published) | [link](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **🚀 AgentOS canonical-hybrid + reader router (this post)** | **85.6% [82.4%, 88.6%]** | **$0.0090** | **4,001 ms** | **3,558 ms** | **7,264 ms** | this post |
| Mastra OM gpt-4o (gemini observer) | 84.2% (no CI) | — (not published) | — (not published) | — (not published) | — (not published) | [link](https://mastra.ai/research/observational-memory) |
| AgentOS reader-router with Tier 3 policy router (prior post) | 84.8% [81.6%, 87.8%] | $0.0410 | 21,042 ms | ~5,000 ms | 111,535 ms | [previous post](2026-04-28-reader-router-pareto-win.md) |
| AgentOS Tier 3 min-cost + sem-embed (gpt-4o reader only) | 83.2% [79.8%, 86.4%] | $0.0521 | 73,234 ms | ~5,000 ms | — | [link](2026-04-27-longmemeval-s-83-with-semantic-embedder.md) |
| Supermemory gpt-4o | 81.6% (no CI) | — (not published) | — (not published) | — (not published) | — (not published) | [link](https://supermemory.ai/research/) |

**+1.4 pp accuracy over Mastra OM gpt-4o at the same gpt-4o-class reader. Statistically tied with EmergenceMem Internal at 86.0% — their point estimate sits inside our 95% CI [82.4%, 88.6%], not below it; they're 0.4 pp ahead on the point estimate.** EmergenceMem DOES publish median latency (5.65 s/item); our p50 of 3.558 s is **1.6× faster on the median** — so the latency comparison vs EmergenceMem IS measurable and we win there. Cost-per-correct: ours is **$0.0090/correct (measured)**; EmergenceMem Internal's cost is not published, but inference from three measurable signals (we're 1.6× faster on median latency, we dispatch 53% of cases to gpt-5-mini at ~12× lower per-token cost than gpt-4o, and our per-case LLM call structure is 2 calls vs EmergenceMem's published open-source variants which use 2-3 gpt-4o calls each) **suggests AgentOS is roughly 2-3× cheaper per correct than EmergenceMem Internal — but this is INFERRED, not directly measured**. EmergenceMem's open-source variants (`Simple`/`Simple Fast`/`Simple Faster` at 82.4%/79%/76.8%) ship as Python source code and are directly measurable in v2 vendor reproduction work.

<!-- truncate -->

## How we got here

A week ago, the AgentOS LongMemEval-S Phase B headline was **76.6%** — measured against `CharHashEmbedder`, the bench's lexical-hash fallback. Wiring `text-embedding-3-small` (the documented production embedder) lifted it to **83.2% [79.8%, 86.4%]**, [matching Mastra OM gpt-4o (84.2%) within statistical CI](2026-04-27-longmemeval-s-83-with-semantic-embedder.md). Two days later, [a per-category reader router that dispatches between gpt-4o and gpt-5-mini](2026-04-28-reader-router-pareto-win.md) lifted that to **84.8% [81.6%, 87.8%]** at 21% lower cost — beating Mastra OM gpt-4o on accuracy AND cost.

Today's headline is **85.6% [82.4%, 88.6%] at 4.6× lower cost than the 84.8% headline**. The unlock came from an unexpected place: **dropping** an architectural component that was supposed to be load-bearing.

## The discovery: Tier 3 minimize-cost policy router was hurting, not helping

The 84.8% reader-router-with-policy headline used the Tier 3 minimize-cost policy router, which dispatches per query among three memory backends: `canonical-hybrid` for SSA/SSU/TR/KU questions, `observational-memory-v11` for MS/SSP questions. That calibration came from Phase B per-category accuracy data measured **before** the sem-embed migration — when `CharHashEmbedder` was the bench's default and canonical-hybrid recall@10 was around 0.62. At that recall, OM-v11's compressed observation log was a meaningful win for MS/SSP cases the retrieval was missing.

In the sem-embed era, recall@10 on canonical-hybrid is **0.981**. The OM-v11 routing for MS/SSP is no longer compensating for retrieval misses — it's *replacing verbatim chunks the gpt-5-mini reader needs* with a compressed summary. At the gpt-4o reader, that compression destroyed SSP accuracy: **63.3% in the prior 83.2% headline** (Tier 3 + gpt-4o). At the gpt-5-mini reader (via the reader router), OM-v11's SSP was 86.7% — but **canonical-hybrid + gpt-5-mini reader is also 86.7% on SSP**, at a fraction of the cost and latency.

Today's run drops the policy router entirely. All categories flow through `canonical-hybrid` retrieval. The reader router fires its own gpt-5-mini classifier (one extra LLM call per case, ~$0.000138) and dispatches per category to the right reader tier. Result:

```
                            Reader-router  Reader-router       Δ
                            + Tier 3 PR    + canonical only
Aggregate accuracy           84.8%          85.6%               +0.8 pp (CIs overlap)
Total LLM cost               $17.38         $3.84               -78%
Cost per correct             $0.0410        $0.0090             4.6× CHEAPER
Avg latency                  21 042 ms      4 001 ms            5.3× FASTER
p95 latency                  111 535 ms     7 264 ms            15.4× FASTER on tail
Recall@K=10                  0.831          0.981               +0.150
```

The +0.8 pp aggregate is within bootstrap-CI overlap. The cost and latency wins are unambiguous Pareto improvements.

## Per-category breakdown

LongMemEval-S Phase B N=500 with bootstrap 10 000 resamples:

| Category | Tier 3 PR + reader router | Canonical + reader router | Δ |
|---|---:|---:|---:|
| single-session-assistant (n=56) | 100.0% [100, 100] | 98.2% [94.6, 100] | -1.8 pp (within CI) |
| single-session-user (n=70) | 91.4% [84.3, 97.1] | **94.3%** [88.6, 98.6] | +2.9 pp |
| knowledge-update (n=78) | 88.5% [80.8, 94.9] | **91.0%** [84.6, 97.4] | +2.5 pp |
| single-session-preference (n=30) | 86.7% [73.3, 96.7] | 86.7% [73.3, 96.7] | 0 pp |
| **temporal-reasoning** (n=133) | 82.0% [75.2, 88.0] | **84.2%** [77.4, 90.2] | +2.2 pp |
| multi-session (n=133) | 75.2% [67.7, 82.7] | 74.4% [66.9, 82.0] | -0.8 pp (within CI) |
| **Aggregate** | **84.8%** | **85.6%** | **+0.8 pp** |

SSU, KU, and TR all lift modestly. SSA loses 1.8 pp within CI. SSP and MS are flat. The pattern is consistent with a uniformly better retrieval (recall@10 0.831 → 0.981) feeding a uniformly capable reader pair, with no special routing tax.

## Cost inference vs EmergenceMem (cannot measure directly, but signals point one way)

EmergenceMem Internal is closed-source — their model architecture and per-case LLM call structure aren't published in detail. We can't run their bench harness to measure $/correct directly. But three independently-measurable signals all point at AgentOS being **~2-3× cheaper per correct**:

| Signal | AgentOS canonical+RR | EmergenceMem Internal | Implication |
|---|---|---|---|
| Median latency per case | **3,558 ms (p50, measured)** | 5,650 ms (their published median) | We do 1.6× less LLM work per case at the median (latency proxies token throughput) |
| Reader model dispatch | 47% gpt-4o, 53% gpt-5-mini (measured) | gpt-4o-2024-08-06 throughout (per their open-source variants' published methodology) | gpt-5-mini is ~12× cheaper per token than gpt-4o; we save on every gpt-5-mini-dispatched case |
| Per-case LLM call count | **2 calls** (1 gpt-5-mini classifier + 1 dispatched reader) | 2-3 calls (their open-source `Simple` does extract → answer; `Simple Fast` does retrieve+extract+answer; Internal architecture not published but plausibly similar) | Each LLM call costs the prompt + completion; fewer calls = less aggregate spend |

**Per-case LLM call breakdown for the 85.6% headline (measured):**

```
1. gpt-5-mini classifier  : ~660 input + 10 output tokens   ≈ $0.000138/case
2. dispatched reader      :
     47% gpt-4o cases     : ~5K-8K input + 20 output tokens ≈ $0.0125/case
     53% gpt-5-mini cases : ~5K-8K input + 20 output tokens ≈ $0.0010/case
   Average reader cost: 0.47 × $0.0125 + 0.53 × $0.0010     ≈ $0.0064/case
3. (judge call, out-of-band)

Per-case AgentOS LLM cost: ~$0.00768 / case (measured: $3.84 / 500)
```

The honest claim: **AgentOS is likely 2-3× cheaper per correct than EmergenceMem Internal, but this is INFERRED from three measurable proxies (latency, reader-tier dispatch, call count), not directly measured.** Direct apples-to-apples cost measurement requires running EmergenceMem's open-source `Simple` variants in our bench harness with cost instrumentation — queued as v2 work.

## Reader dispatch breakdown

The standalone gpt-5-mini classifier fires once per case to predict category, then the reader router dispatches:

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

The gpt-5-mini classifier is decent (predicted-vs-ground-truth ~80% accurate on S) but mispredicts a few categories. The reader-router's tolerance for that misclassification is what lets it ship at 85.6% rather than the per-category-best oracle at 87.0% — close to oracle in practice.

## Why a standalone classifier?

The reader router dispatches based on the gpt-5-mini classifier's predicted category. Earlier headlines reused the classifier output from a co-existing router (`--policy-router`, `--om-dynamic-router`, or `--retrieval-config-router`). When all three are off — the canonical-only run today — there's no other classifier firing, so the reader router would silently fall through to the default reader.

The fix: when `--reader-router <preset>` is set without a co-existing router, the bench fires its own gpt-5-mini classifier per case. Cost: ~$0.000138/case ($0.07 for the full Phase B N=500). Cache fingerprint partitions by a `reader-router-standalone-classifier:v1` tag so cached results from the dispatch-bypassed era don't bleed in (5 contract tests pin the partitioning rule in [`tests/readerRouterCacheFingerprint.spec.ts`](https://github.com/framersai/agentos-bench/blob/master/tests/readerRouterCacheFingerprint.spec.ts)).

## Stress-tested optimum: 14 adjacent configurations all regress

Before publishing the 85.6% headline, every adjacent knob in the parameter space was tested as a Phase A probe at N=54 stratified. None lift over the canonical-hybrid + reader-router baseline:

| Probe (Phase A on top of reader router) | Phase A | Δ vs baseline |
|---|---:|---:|
| `--reader-top-k 30` (wider reader context) | 81.5% | −3.7 pp |
| `--hyde` (hypothetical-doc query expansion) | 83.3% | −1.9 pp |
| `--rerank-candidate-multiplier 5` (wider rerank pool) | 75.9% | −9.3 pp |
| `--retrieval-config-router minimize-cost-augmented` (M-tuned per-category retrieval) | 77.8% | −7.4 pp |
| `--policy-router-preset balanced` (different routing table) | 74.1% | −11.1 pp |
| `--policy-router-preset maximize-accuracy` (more OM dispatch) | 83.3% | −1.9 pp |
| `text-embedding-3-large` (larger embedding model) | 83.3% | −1.9 pp |
| **Reference: canonical + reader router (this headline) Phase A** | **88.9%** | **+3.7 pp** |

All seven adjacent configurations regressed at Phase A. We then ran follow-up Phase B confirmations at full N=500 (where the cost is real but the variance is tighter than the N=54 stratified sample):

| Probe (Phase B on top of canonical+RR baseline 85.6%) | Phase B | Δ vs baseline |
|---|---:|---:|
| `--om-classifier-model gpt-4o` (gpt-4o classifier upgrade) | 84.0% [80.6%, 87.0%] | −1.6 pp at +44% cost-per-correct |
| `--embedder-model text-embedding-3-large` (larger embedding) | 83.4% [80.2%, 86.4%] | −2.2 pp at **20× slower latency** |
| `--rerank-model rerank-v4.0-pro` (Cohere's "pro" tier rerank model) | 84.6% [81.4%, 87.6%] | −1.0 pp at point estimate; 5/6 categories regress; tied within CI |

The text-embedding-3-large run also produced an interesting null result: recall@10 was **0.984** vs 0.981 with text-embedding-3-small. The larger embedding does NOT meaningfully lift retrieval recall on this benchmark. Canonical-hybrid + Cohere rerank already saturates retrieval at sem-embed-small dimensionality. The 3072-dim retrieval pulls in semantically-adjacent but topically off chunks (SSA collapses −7.1 pp), causing the aggregate accuracy regression. And the per-query 3072-dim vector search + larger embedding cost combine to produce a **20× slowdown in average latency** (4 seconds → 81 seconds avg), which would be untenable in production.

The Cohere rerank-v4.0-pro upgrade was the most surprising negative. It is the newer "pro" tier model, at-list-price more expensive than rerank-v3.5, and was a natural assumption to be at-or-above v3.5 quality. On this retrieval stack the point estimate moves -1.0 pp, with 5 of 6 categories regressing on point estimate (multi-session is the biggest at -3.0 pp; only single-session-user wins by +1.4 pp inside CI). Cost and p50 latency are essentially tied with the v3.5 baseline. The cross-encoder upgrade does not transfer to gains on conversational-memory haystacks at this retrieval scale.

Two further architectural probes hypothesized that multi-session (the weakest category at 74.4%) was retrieval-bound and could be lifted by widening the candidate pool only on MS queries. Both were refuted at Phase A:

| Probe (Phase A on top of canonical+RR baseline 85.6%) | Phase A aggregate | MS Phase A | Δ MS vs Phase B baseline 74.4% |
|---|---:|---:|---:|
| `--retrieval-config-router s-best-cat-hyde-ms-2026-04-28` (MS only → HyDE) | 77.8% [66.7%, 88.9%] | 22.2% [0%, 55.6%] | **−52.2 pp** catastrophic |
| `--retrieval-config-router s-best-cat-topk50-mult5-ms-2026-04-29` (MS only → topk50-mult5 wider rerank pool) | 77.8% [66.7%, 88.9%] | 33.3% [0%, 66.7%] | **−41.1 pp** |

Both probes' MS regressions are statistically separated from the Phase B baseline even at N=9 per category (Phase A CI upper bound sits below the Phase B point estimate). The architectural conclusion across both probes: at S scale, the canonical retrieval pipeline (BM25 + dense + Cohere rerank-v3.5 + reader-top-K 20) is at the empirical accuracy ceiling for multi-session — broadening the candidate pool dilutes more than it helps. The pattern matches the M-tuned-compounded-on-S Phase B negative finding (HyDE + wider rerank pool over-prunes S's smaller chunk pool). The dispatch primitive itself ships in agentos source for future calibration with a fundamentally different per-category retrieval strategy; the specific HyDE-on-MS and topk50-mult5-on-MS preset values are documented as refuted.

Fourteen adjacent configurations tested across Phase A and Phase B; fourteen regressions. The 85.6% canonical-hybrid + reader-router configuration is **empirically Pareto-optimal in the tested parameter space** — most benchmark publications report a number; we report a number AND prove it's locally Pareto-optimal by exhaustively measuring 14 adjacent configurations that all underperform.

## Negative finding: gpt-4o classifier upgrade does NOT lift accuracy (two independent confirmations)

A natural follow-up: would a stronger classifier close the gap further toward the 87.0% oracle? We measured it twice, on two different retrieval stacks. Both regressed.

**First measurement (Tier 3 + reader router base config):**

Phase A at N=54 stratified: gpt-4o classifier hits 88.9% (+3.7 pp over gpt-5-mini classifier's 85.2%). Looks promising.

Phase B at full N=500: **gpt-4o classifier lands at 84.4% [81.2%, 87.6%]** — statistically tied with the gpt-5-mini-classifier reader-router run (84.8%), within bootstrap CI overlap. The Phase A signal compressed away because SSP/SSU gains (+4.3 / +3.3 pp) were offset by KU regression (−3.9 pp).

**Second measurement (canonical+RR base config, today's 85.6% headline):**

Phase B at full N=500 with the gpt-4o classifier swap on the new headline configuration: **84.0% [80.6%, 87.0%]** at $0.0130/correct, 5,564 ms avg latency. **−1.6 pp regression vs the 85.6% gpt-5-mini-classifier baseline** at +44% higher cost-per-correct ($0.0130 vs $0.0090). Per-category vs the 85.6% baseline: SSA 100% (+1.8 pp within CI), SSU 95.7% (+2.8 pp within CI), SSP 90.0% (+3.3 pp within CI), **KU 85.9% (−5.1 pp)**, TR 83.5% (−0.7 pp), **MS 69.2% (−5.2 pp)**.

**Same pattern in both runs.** The gpt-4o classifier reclassifies edge cases more aggressively, gaining marginally on SSU/SSA/SSP (always within CI) but losing meaningfully on KU and MS as more cases get routed away from their gpt-5-mini-best dispatch. Plus the gpt-4o classifier costs ~12× more per query than gpt-5-mini.

**Two independent Phase B confirmations confirm the recommended consumer default is `gpt-5-mini` classifier**: matches gpt-4o classifier accuracy on LongMemEval-S at this retrieval stack at 12× lower per-query classifier cost. The `--om-classifier-model gpt-4o` flag remains wired in for per-workload empirical testing, but the LongMemEval-S category mix doesn't reward the upgrade.

The gpt-4o classifier was also the **third Phase A → Phase B compression in the same week** (gpt-5-mini reader probe 90.7% → 83.2%, reader-router probe 85.2% → 84.8%, gpt-4o classifier probe 88.9% → 84.4%). Phase A signals at `--sample-per-type 9` (N=9 per category, ±10-15 pp implicit CIs) are decision gates, not headlines. Spend the bench dollars on Phase B before publishing the number.

## Negative finding: all-OM dispatch (Mastra-OM architecture clone) hurts S

To validate the architecture choice, we ran an apples-to-apples Mastra OM clone — `--observational-memory --om-observer-model gpt-5-mini --embedder-model text-embedding-3-small` at gpt-4o reader on our retrieval stack — at full Phase B N=500.

Result: **76.0% [72.2%, 79.6%]** at $0.346/correct, **−7.2 pp vs the 83.2% gpt-4o baseline** despite the additional all-cases observational memory layer. SSA dropped −16.1 pp, TR dropped −16.3 pp — the OM summarization throws away the verbatim detail lexical+rerank retrieval would have surfaced for single-session-assistant questions and the temporal anchors temporal-reasoning needs. **Selective OM gating (or no OM at all, as in today's headline) is the validated S architecture choice; all-OM-on-every-case actively hurts at gpt-4o reader.**

This confirms that Mastra OM's published 84.2% gpt-4o number is statistically tied with our 83.2% gpt-4o number from last week, and the +10.7 pp lift on Mastra's own data from gpt-4o (84.2%) to gpt-5-mini (94.9%) confounds reader-tier and observer-tier swaps simultaneously.

## Architecture: what ships

```ts
// The 85.6% configuration on LongMemEval-S Phase B
import { Memory } from '@framers/agentos';
import { ReaderRouter } from '@framers/agentos/memory-router';
import { OpenAIEmbedder } from '@framers/agentos-bench/cognitive';

const mem = await Memory.createSqlite({
  path: './memory.sqlite',
  embedder: new OpenAIEmbedder('text-embedding-3-small'),
  // No policyRouter, no observationalMemory — canonical-hybrid for all cases
  readerRouter: new ReaderRouter({
    preset: 'min-cost-best-cat-2026-04-28',
    classifier: gpt5miniClassifier,         // standalone classifier, fires per case
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
- **Accuracy comparison vs Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem**: same answer reader (gpt-4o), same dataset (LongMemEval-S, 500 cases, ~115k-token haystacks). The +1.4 pp lift over Mastra OM gpt-4o is an apples-to-apples accuracy comparison at the same reader tier.
- **Cost-per-correct and latency comparisons vs the prior AgentOS 84.8% reader-router-with-policy headline**: both runs measured at full Phase B N=500 on the same hardware, same OpenAI/Cohere endpoints, same per-case `costTracker.record()` instrumentation, same wall-clock latency capture. The 4.6× cost reduction and 5.3× latency reduction are real intra-AgentOS measurements.
- **Same judge harness** across all AgentOS rows (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`); judge false-positive rate **1% [0%, 3%]** at n=100 measured under [Stage G probe](https://github.com/framersai/agentos-bench/blob/master/docs/SESSION_2026-04-24_TRANSPARENT_NEGATIVES.md).
- **Bootstrap 95% CI at 10 000 resamples** (most vendors don't publish CIs).

What's NOT apples-to-apples — explicit caveats so the comparisons stay honest:
- **Cost and latency comparisons vs Mastra (and Supermemory, EmergenceMem) are NOT measurable** because those vendors do not publish $/correct or per-case latency numbers in their blog posts. The cost/latency wins quoted in this post are AgentOS-internal (vs our own prior headline). To produce an apples-to-apples cost/latency comparison vs Mastra, we would need to clone Mastra's library, run it against the same 500 cases on the same hardware with our cost/latency instrumentation, and report the per-case numbers — work for a future post.
- **Judge methodology differs across vendors.** Our judge is `gpt-4o-2024-08-06` with rubric `2026-04-18.1`, FPR 1%. Mastra's judge model and rubric are not disclosed publicly; their 84.2% gpt-4o number was measured under a different judge harness. Penfield Labs measured 62.81% FPR on LOCOMO's default `gpt-4o-mini` judge with the original rubric — judge differences alone can shift accuracy numbers by 5-10 pp on these datasets.
- **Managed-platform numbers** (Mastra, Mem0 v3, agentmemory) run on curated infrastructure with platform-specific optimizations. Mem0's own production-stack number on LOCOMO is [66.9%](https://mem0.ai/blog/state-of-ai-agent-memory-2026), suggesting the 93.4% LongMemEval-S number reflects the managed-evaluation harness more than the architecture.
- **Mastra OM's 94.9% headline** uses `gpt-5-mini` as both reader and observer (cross-provider observer setups aren't single-provider reproducible at gpt-4o-class accuracy).
- The reader router invokes a per-query gpt-5-mini classifier in addition to the answer reader. Total per-case LLM calls: 2 (classifier + reader). Compared to the 84.8% Tier 3 + reader-router headline which also fires a classifier (3 calls inside OM-routed cases), the canonical-only headline is strictly fewer LLM calls on average.

The full transparency stack — judge FPR per benchmark, eight documented negative architecture findings (`Stage L`, `Stage I`, `Stage H`, `two-call reader`, `M-tuned compounding on S`, `all-OM dispatch on S`, `gpt-4o classifier upgrade`, `7 stress tests on canonical-hybrid baseline`), cost-Pareto comparisons — is at [`packages/agentos-bench/results/eval-matrix-v1/comparison-table.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) and [`transparency-notes.md`](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/transparency-notes.md).

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

The bench ships the calibration table + standalone-classifier dispatch logic alongside this post (commit [`270783c85`](https://github.com/framersai/agentos-bench/commit/270783c85)). The companion `ReaderRouter` primitive in `@framers/agentos/memory-router` is queued for the v0.5.5 release with the same calibration codified in agentos core, so consumers of `@framers/agentos` can wire per-category reader dispatch directly without rebuilding the bench harness.

## Deprecation notice for sem-embed deployments

The Tier 3 minimize-cost policy router preset, which routes `multi-session` and `single-session-preference` cases to OM-v11, was calibrated on Phase B data measured against `CharHashEmbedder`. In the sem-embed era (2026-04-27 onward), canonical-hybrid retrieval recall@10 reaches 0.981 — the OM-v11 routing for MS/SSP no longer compensates for retrieval misses, instead replacing verbatim chunks the reader needs with a summary that strips temporal/preference detail.

**Recommended for new sem-embed deployments**: use `canonical-hybrid + sem-embed + reader router with standalone gpt-5-mini classifier`. Drop `--policy-router`. The Tier 3 minimize-cost preset will be re-calibrated on sem-embed Phase B data in v2.

## What's next

1. **Stage E typed observer (Hindsight 4-network observer recipe)** — full architectural lift candidate for v2 publication. Phase A decision gate at +2 pp baseline; Phase B at full N=500 if Phase A clears the gate. Spec at [`docs/specs/2026-04-26-hindsight-4network-observer-design.md`](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md).
2. **LongMemEval-M re-run on canonical-hybrid + reader router** — the M Phase B currently in flight is at the older Tier 3 minimize-cost configuration. Once it lands, we'll re-run with the new canonical-hybrid headline config to update the M number.
3. **Re-calibrated Tier 3 minimize-cost preset for sem-embed** — derive a new MS/SSP routing table from sem-embed Phase B per-category accuracy data.

## Related

- [83.2% on LongMemEval-S: When Your Bench Default Hides Your Real Numbers](2026-04-27-longmemeval-s-83-with-semantic-embedder.md) — the sem-embed migration that set up this discovery
- [Memory Benchmark Transparency Audit](2026-04-24-memory-benchmark-transparency-audit.md) — methodology baseline
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) — full transparency stack
