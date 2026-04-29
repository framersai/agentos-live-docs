---
title: "Two Negative Results: When Lightweight Architecture Additions Don't Lift on a Well-Tuned RAG Stack"
description: "Anthropic Contextual Retrieval cost 3.7 pp on LongMemEval-S, with temporal-reasoning collapsing 33 points. Mem0-v3-style entity-linking re-rank cost 4 points on LOCOMO with multi-hop dropping 20. Per-category math, the architectural reason, and the production primitives we shipped anyway."
authors: [jddunn]
tags: [memory, benchmarks, longmemeval, locomo, transparency, anthropic-contextual-retrieval, mem0, ingest-router, memory-router]
keywords: [anthropic contextual retrieval longmemeval, mem0 v3 entity linking locomo, agentos ingest router, agentos memory router, negative result benchmark, memory benchmark transparency, lightweight rag additions]
image: /img/blog/two-negative-results.png
---

:::tip Update 2026-04-28
The shipping pipeline this post measures against (76.6% LongMemEval-S Phase B) has been replaced by **[85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md)** at $0.009/correct, 4-second latency. The two negative findings below (Stage L Anthropic Contextual Retrieval, Stage I Mem0-style entity-linking re-rank) still hold against the new headline. Both architectures duplicate work the rerank stage already does, regardless of which retrieval base config the rerank sits on top of. Eleven additional adjacent stress-tests have since been documented in the [latest LEADERBOARD](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md), all regressing on the 85.6% configuration.
:::

Most memory-library benchmark posts publish the architectures that worked. This post measures two architectures that did not, on top of the AgentOS shipping pipeline. Both are well-known. Both have published wins on adjacent benchmarks. Neither lifted ours. The per-category breakdowns are interesting because they show why these two specific additions are redundant against a hybrid + Cohere rerank stack, not why they are bad in general.

This post documents both negatives in detail, ships both architectures as production primitives in agentos core anyway, and explains what kind of architectural push is left after lightweight signal additions are ruled out.

<!-- truncate -->

## The shipping baseline

The bench's shipping config on LongMemEval-S Phase B at N=500 is **76.6% accuracy at $0.058 per correct answer** ([LEADERBOARD](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md)). Architecture: the [`@framers/agentos/memory-router`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router) primitive with the `minimize-cost` preset. A `gpt-5-mini` classifier reads each query and routes to either `canonical-hybrid` (BM25 + dense + Cohere `rerank-v3.5`) or `observational-memory-v11` based on the predicted question category. The min-cost routing table goes to canonical-hybrid for SSA / SSU / TR / KU, and to OM-v11 only for MS / SSP where the architectural lift earns its 1.7-1.8x cost premium.

On LOCOMO at N=1986, the same canonical-hybrid + Cohere rerank pipeline at `--reader-top-k 20` measures **51.5% [49.2%, 53.7%]** ([STAGE_F2_CORRECTION_2026-04-24.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_F2_CORRECTION_2026-04-24.md)). The bench-grade judge FPR is 0% [0%, 0%] at n=100 on LOCOMO. [Penfield Labs' 62.81%](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) on the original `gpt-4o-mini` judge does not transfer to our `gpt-4o-2024-08-06` judge + `rubric 2026-04-18.1`.

Both numbers publish with bootstrap 95% CIs, per-case run JSONs at seed=42, and a probed judge FPR per benchmark. The ceiling we are trying to push past is well-measured.

## Stage L: Anthropic Contextual Retrieval, on conversational memory

[Anthropic's contextual retrieval recipe](https://www.anthropic.com/news/contextual-retrieval) prepends a per-document summary to every chunk before embedding. Their published measurement: 35% retrieval-failure reduction with embeddings alone, 49% with embeddings + BM25, 67% with reranking. Independent benchmark replication: [arXiv:2604.01733](https://arxiv.org/pdf/2604.01733) "From BM25 to Corrective RAG: Benchmarking Retrieval Strategies".

We implemented the recipe verbatim as `SummarizedIngestExecutor` in agentos 0.2.12 ([source](https://github.com/framersai/agentos/tree/master/packages/agentos/src/ingest-router/executors)), wrapping the existing production [`SessionSummarizer`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory/ingest) so the IngestRouter dispatcher path produces the exact same summaries as the bench. The executor uses `gpt-5-mini` for summarization (no Claude dependency for the shipping path). Each session summary costs about $0.003 with the on-disk content-addressed cache.

Phase A measurement: paired baseline with OpenAI semantic embedder at N=54 stratified gives **74.1%**. Same pipeline plus `--context-summary gpt-5-mini` gives **70.4%**. **-3.7 percentage points aggregate.** Per-category breakdown ([STAGE_L_PHASE_A_FINDINGS_2026-04-25.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_L_PHASE_A_FINDINGS_2026-04-25.md)):

| Category | Baseline | Treatment | Δ |
|---|---:|---:|---:|
| single-session-assistant | 100.0% | 100.0% | 0 pp |
| single-session-user | 88.9% | 100.0% | +11.1 pp (1-case shift, within noise) |
| knowledge-update | 88.9% | 88.9% | 0 pp |
| **temporal-reasoning** | 100.0% | 66.7% | **-33.3 pp** |
| multi-session | 33.3% | 33.3% | 0 pp |
| single-session-preference | 33.3% | 33.3% | 0 pp |

Multi-session is the category Anthropic's measurement most directly predicts a lift on, given the recipe's design. We measure zero lift there. Temporal-reasoning collapses 33 points, exactly opposite the direction the prepended summary should help.

### Why it didn't translate

Anthropic measured on documents: codebases, fiction, ArXiv papers. Document chunks within a chapter are heterogeneous: a code file covers multiple functions, an ArXiv paper covers multiple sub-topics. Adding a chapter-level or document-level summary to every chunk adds discriminating context.

Conversational sessions are topically homogeneous. Every turn in a session is about the same thing. Adding the session summary to every chunk does not add discriminating context; it adds shared noise that reduces per-chunk uniqueness during embedding similarity. Cohere `rerank-v3.5` on the merged BM25 + dense pool is a cross-encoder; it operates on raw text, not embeddings, so the dense-recall lift the contextual prepend would provide is non-load-bearing on top of rerank. Per-turn timestamps embedded in chunk content carry the temporal signal; a 50-token summary prefix obscures these anchors during embedding similarity. That last effect explains why temporal-reasoning specifically collapsed.

Stage L is real on documents. It does not generalize to conversational memory under our pipeline. Mid-2026 production agent memory is past the point where document-domain heuristics extend cleanly.

## Stage I: Mem0-v3-style entity-linking re-rank, on LOCOMO

[Mem0 v3](https://docs.mem0.ai/migration/oss-v2-to-v3) replaced its v2 graph store with single-pass ADD-only fact extraction plus multi-signal hybrid search. The hybrid search blends semantic similarity, BM25, and **entity matching**. Mem0's published LongMemEval lift across v2 → v3 is +25.6 pp aggregate (46.4% → 100.0% on single-session-assistant; 51.1% → 93.2% on temporal-reasoning). That is the managed-platform number; their own [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) blog reports **66.9% on LOCOMO** for the production stack, not the 91.6% managed-platform claim.

The entity-linking primitive shipped as `EntityExtractor` + `EntityLinkingIngestExecutor` (ingest side) and `EntityRetrievalRanker` (recall side) in agentos 0.2.13 ([source](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router/backends)). The ranker takes `combinedScore = (1 - w) * semanticScore + w * entityOverlapRatio`, with `w = 0.5` per the bench-default `--entity-linking 0.5` flag.

Phase A measurement on LOCOMO at N=25 stratified ([STAGE_I_PHASE_A_FINDINGS_2026-04-25.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_I_PHASE_A_FINDINGS_2026-04-25.md)):

| Config | Accuracy | $/correct |
|---|---:|---:|
| Baseline (no entity-linking) | 64.0% (16/25) | $0.0000 (cached) |
| Treatment (`--entity-linking 0.5`) | 60.0% (15/25) | $0.0089 |
| **Δ** | **-4.0 pp** | reference |

Per-category:

| Category | Baseline | Treatment | Δ |
|---|---:|---:|---:|
| adversarial | 100.0% | 100.0% | 0 pp |
| **multi-hop** | 80.0% | 60.0% | **-20.0 pp** |
| open-domain | 60.0% | 60.0% | 0 pp |
| single-hop | 40.0% | 40.0% | 0 pp |
| temporal | 40.0% | 40.0% | 0 pp |

The entire delta is one case shifting on multi-hop (4/5 → 3/5). At N=25 the bootstrap CI is wide; this measurement alone is consistent with noise. The interpretation strengthens when paired with Stage L's negative finding: two consecutive lightweight signal additions, both negative on a well-tuned baseline, point at a structural pattern.

### Why it didn't lift

Cohere `rerank-v3.5` is already doing the work. The cross-encoder at the rerank stage performs full semantic matching over the merged BM25 + dense pool. Entity overlap is a lexical subset of that signal; adding it as a second-stage re-rank introduces redundancy, not new information.

Multi-hop suffers most for a specific reason. Multi-hop questions span sessions where the relevant entities do not all appear in any single session. A regex-based entity extractor cannot bridge "the dog" and "Maxwell" within the same haystack; it sees them as different entities. Re-ranking by per-candidate entity overlap penalizes the partial-match candidates that multi-hop reasoning actually needs.

## The pattern

Two negative results on lightweight signal additions:

| Stage | Architecture | Δ vs baseline |
|---|---|---:|
| L | Anthropic Contextual Retrieval (per-session summary prepended to chunks) | -3.7 pp on LongMemEval-S |
| I | Mem0-v3-style entity-linking re-rank | -4.0 pp on LOCOMO |

The shipping config (hybrid + Cohere rerank + `reader-top-k 20`) is well-tuned for both LongMemEval-S and LOCOMO. Lightweight pre-processing (Stage L) duplicates work the rerank stage already does. Lightweight post-processing (Stage I) introduces signals the cross-encoder already considers. To push aggregate accuracy further, the next architectural push needs to be substantial: a different mechanism, a different hypothesis. Stage E (Hindsight 4-network typed observer with typed graph traversal across long histories, [arXiv:2512.12818](https://arxiv.org/html/2512.12818v1)) is the v2 candidate. The spec is [drafted](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md) at $500-800 budget, 2-3 weeks, with an explicit Phase A → Phase B decision gate at +2 pp baseline.

## What still ships

Even though both architectures measured negative on this specific bench config, the agentos-side primitives shipped real value. Consumers building different pipelines (document-mode RAG, Mem0-v3-replication, custom retrieval) get the reference executors out of the box:

```ts
import {
  IngestRouter,
  LLMIngestClassifier,
  FunctionIngestDispatcher,
  SummarizedIngestExecutor,        // Stage L primitive (0.2.12)
  EntityExtractor,                 // Stage I primitive (0.2.13)
  EntityLinkingIngestExecutor,     // Stage I primitive (0.2.13)
} from '@framers/agentos/ingest-router';
import {
  EntityRetrievalRanker,           // Stage I primitive (0.2.13)
} from '@framers/agentos/memory-router';

const summarizer = new SummarizedIngestExecutor({ /* SessionSummarizer config */ });
const entityExtractor = new EntityExtractor();
const entityIngest = new EntityLinkingIngestExecutor({ extractor: entityExtractor });

const router = new IngestRouter({
  classifier: new LLMIngestClassifier({ llm: openaiAdapter }),
  preset: 'summarized',
  dispatcher: new FunctionIngestDispatcher({
    'raw-chunks': async (content) => ({ writtenTraces: await rawIngest(content) }),
    summarized: async (content) => summarizer.execute(content),
    'fact-graph': async (content) => entityIngest.execute(content),
  }),
});
```

Both architectures are real in the source: 56 contract tests for the IngestRouter executors, 20 contract tests for the entity-linking primitives, 163/163 ingest-router + memory-router tests passing on agentos 0.2.13.

## What this means

Vendors who only publish wins miss this kind of finding. We document it because the IngestRouter strategy IDs (`summarized`, `fact-graph`) are real surface area; consumers who import them deserve to know what these architectures look like under stress on conversational benchmarks. The negatives published here are not arguments against Anthropic's recipe or Mem0 v3 broadly. They are calibration data for builders deciding whether a lightweight architectural addition will earn its complexity on top of a hybrid + Cohere rerank stack tuned for memory benchmarks.

The architectural decomposition follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit boundaries between memory access and decision logic let architectural alternatives plug in cleanly without reshaping the rest of the pipeline. Stage L slots into the encoding module; Stage I slots into the retrieval module. Both ship, both fail to lift on conversational benchmarks, both stay available as primitives.

The next push is Stage E. The bench is ready, the methodology is in place, and the decision gate is published in advance.

## Related

- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The current M headline.
- [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md). The current S headline.
- [First Public LongMemEval-M Number](2026-04-26-longmemeval-m-first-published-number.md). Bench-coverage measurement on the harder 500-session-per-haystack variant.
- [agentos IngestRouter Executors](2026-04-26-agentos-ingest-router-executors.md). Production primitives for Stage L and Stage I in agentos core.
- [Why Memory-Library Benchmarks Don't Mean What You Think](2026-04-24-memory-benchmark-transparency-audit.md). Earlier transparency audit (Mem0 / Mastra / Supermemory / Zep / Emergence / MemPalace).
- [v1 Comprehensive Evaluation Matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md). The full transparency-grade matrix this post sits inside.
