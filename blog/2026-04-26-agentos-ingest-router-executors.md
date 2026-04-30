---
title: "Production Primitives: agentos IngestRouter Executors for Stage L and Stage I"
description: "agentos 0.2.12 + 0.2.13 ship reference executors for the IngestRouter `summarized` and `fact-graph` strategy IDs: Anthropic Contextual Retrieval and Mem0-v3-style entity-linking. Benchmark measurements show both negative on our pipeline; the primitives are still useful for consumers building their own."
authors: [jddunn]
audience: engineer
tags: [agentos, ingest-router, memory-router, anthropic-contextual-retrieval, mem0, primitives]
keywords: [agentos ingest router, agentos memory router, anthropic contextual retrieval typescript, mem0 v3 entity linking typescript, summarizedingestexecutor, entitylinkingingestexecutor, entityretrievalranker, agentos production primitives]
image: /img/blog/agentos-ingest-router-executors.png
---

> "A change in perspective is worth eighty IQ points."
>
> — Alan Kay, *The Power of the Context*, 2004

A negative result on a benchmark does not mean a useless implementation. The two architectures we measured negative on our internal LongMemEval-S pipeline are still production-grade primitives that consumers ship in different pipeline shapes than ours. agentos 0.2.12 and 0.2.13 ship them as `IngestRouter` executors so consumers don't have to reimplement what the literature already specifies. This post is the reference.

The [Cognitive Pipeline](/features/cognitive-pipeline) ships three orchestrator stages: an [`IngestRouter`](/features/ingest-router) (input stage), a [`MemoryRouter`](/features/memory-router) (recall stage), and a [`ReadRouter`](/features/read-router) (read stage). Each is an LLM-as-judge dispatcher: a `gpt-5-mini`-style classifier reads the input, picks a strategy from a calibrated routing table, and hands off to a registered executor. The decomposition follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)) for cognitive architectures.

`IngestRouter` defines six strategy IDs: `raw-chunks`, `summarized`, `observational`, `fact-graph`, `hybrid`, `skip`. Until 0.2.12 / 0.2.13, the `summarized` and `fact-graph` IDs were empty promises: strategy slots in the type system without core executor implementations. Consumers had to author their own. agentos 0.2.12 and 0.2.13 ship the reference executors so the IngestRouter ships with `summarized` and `fact-graph` working out of the box.

This post is the reference for what landed.

<!-- truncate -->

## The IngestRouter dispatcher pattern

A quick recap. `IngestRouter` looks like this in consumer code:

```ts
import {
  LLMIngestClassifier,
  IngestRouter,
  FunctionIngestDispatcher,
} from '@framers/agentos/ingest-router';

const router = new IngestRouter({
  classifier: new LLMIngestClassifier({ llm: openaiAdapter }),
  preset: 'summarized',
  dispatcher: new FunctionIngestDispatcher({
    'raw-chunks': async (content) => ({ writtenTraces: await rawIngest(content) }),
    summarized: async (content) => ({ writtenTraces: await mySummarizedIngest(content) }),
    'fact-graph': async (content) => ({ writtenTraces: await myFactGraphIngest(content) }),
    observational: async (content) => ({ writtenTraces: await myObsIngest(content) }),
    hybrid: async (content) => ({ writtenTraces: await myHybridIngest(content) }),
    skip: async () => ({ writtenTraces: 0 }),
  }),
});

const { decision, outcome } = await router.decideAndDispatch(content);
console.log(decision.classifier.kind);          // 'long-conversation'
console.log(decision.routing.chosenStrategy);   // 'summarized'
console.log(outcome.writtenTraces);             // 47
```

Until 0.2.12, `mySummarizedIngest` and `myFactGraphIngest` were consumer responsibilities. The reference executors below fill those slots.

## Stage L: `SummarizedIngestExecutor` (0.2.12)

Reference implementation of [Anthropic Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) for the `summarized` strategy. Wraps the existing production [`SessionSummarizer`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory/ingest), the same primitive the bench uses, so the IngestRouter dispatcher path produces the exact same summaries. Single source of truth for session-level summarization across the codebase.

Source: [`packages/agentos/src/ingest-router/executors/SummarizedIngestExecutor.ts`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/ingest-router/executors/SummarizedIngestExecutor.ts).

```ts
import {
  IngestRouter,
  LLMIngestClassifier,
  FunctionIngestDispatcher,
  SummarizedIngestExecutor,
} from '@framers/agentos/ingest-router';
import { SessionSummarizer } from '@framers/agentos/memory';

const summarizer = new SessionSummarizer({
  llmInvoker: gpt5MiniInvoker,    // any provider-agnostic adapter
  cacheDir: './.session-summary-cache',
});

const summarizedExecutor = new SummarizedIngestExecutor({ summarizer });

const router = new IngestRouter({
  classifier: new LLMIngestClassifier({ llm: openaiAdapter }),
  preset: 'summarized',
  dispatcher: new FunctionIngestDispatcher({
    'raw-chunks': async (content) => ({ writtenTraces: await rawIngest(content) }),
    summarized: async (content, payload) =>
      summarizedExecutor.ingest(content, payload as { sessionId: string; chunks?: string[] }),
    'fact-graph': async (content) => ({ writtenTraces: 0 }),
    observational: async (content) => ({ writtenTraces: 0 }),
    hybrid: async (content) => ({ writtenTraces: 0 }),
    skip: async () => ({ writtenTraces: 0 }),
  }),
});
```

Cost: ~$0.003 per session at `gpt-5-mini`. SessionSummarizer's SHA-256 content-addressed disk cache means repeat runs against the same content are $0.

The outcome shape carries the summary alongside the chunk count + token usage:

```ts
interface IngestOutcome {
  writtenTraces: number;
  summary: string;
  embedTexts: string[];     // chunks with summary prepended, ready to embed
  tokensIn: number;
  tokensOut: number;
}
```

## Stage I: `EntityExtractor` + `EntityLinkingIngestExecutor` + `EntityRetrievalRanker` (0.2.13)

Reference implementation of [Mem0 v3](https://docs.mem0.ai/migration/oss-v2-to-v3)'s entity-linking primitive. v3 dropped the v2 graph store (Neo4j / Memgraph) in favor of single-pass ADD-only fact extraction plus multi-signal hybrid search. The hybrid search blends semantic, BM25, and entity matching. agentos 0.2.13 ships the entity primitives at zero LLM cost (regex-based extraction).

Source: [`packages/agentos/src/ingest-router/executors/EntityExtractor.ts`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/ingest-router/executors/EntityExtractor.ts), [`EntityLinkingIngestExecutor.ts`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/ingest-router/executors/EntityLinkingIngestExecutor.ts), [`packages/agentos/src/memory-router/backends/EntityRetrievalRanker.ts`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router/backends).

### Ingest side

```ts
import {
  IngestRouter,
  LLMIngestClassifier,
  FunctionIngestDispatcher,
  EntityExtractor,
  EntityLinkingIngestExecutor,
} from '@framers/agentos/ingest-router';

const entityExtractor = new EntityExtractor({
  // Defaults follow Mem0 v3's pattern: proper nouns, quoted text, compound noun phrases
  // All knobs configurable; see EntityLinkingOptions
});
const entityIngest = new EntityLinkingIngestExecutor({ extractor: entityExtractor });

const router = new IngestRouter({
  classifier: new LLMIngestClassifier({ llm: openaiAdapter }),
  preset: 'observational',
  dispatcher: new FunctionIngestDispatcher({
    'raw-chunks': async (content) => ({ writtenTraces: await rawIngest(content) }),
    summarized: async (content) => ({ writtenTraces: 0 }),
    'fact-graph': async (content, payload) =>
      entityIngest.ingest(content, payload as { sessionId: string; chunks?: string[] }),
    observational: async (content) => ({ writtenTraces: 0 }),
    hybrid: async (content) => ({ writtenTraces: 0 }),
    skip: async () => ({ writtenTraces: 0 }),
  }),
});
```

Outcome shape carries the deduplicated entities + per-chunk entities for downstream indexing:

```ts
interface EntityLinkingOutcome {
  writtenTraces: number;
  summary: string;
  embedTexts: string[];
  entities: string[];           // deduplicated across all chunks
  entitiesPerChunk: string[][]; // entities per chunk, in chunk order
  tokensIn: number;
  tokensOut: number;            // 0 because regex-based, no LLM
}
```

### Recall side

```ts
import {
  MemoryRouter,
  LLMMemoryClassifier,
  FunctionMemoryDispatcher,
  EntityRetrievalRanker,
} from '@framers/agentos/memory-router';

const ranker = new EntityRetrievalRanker({
  weight: 0.5,                 // semantic 0.5, entityOverlap 0.5
  // weight is a constructor-time blend in [0, 1]:
  //   combinedScore = (1 - w) * semanticScore + w * entityOverlapRatio
});

const router = new MemoryRouter({
  classifier: new LLMMemoryClassifier({ llm: openaiAdapter }),
  preset: 'minimize-cost',
  dispatcher: new FunctionMemoryDispatcher({
    'canonical-hybrid': async (q, p) => {
      const traces = await myHybridRecall(q, p);
      return ranker.rerank(q, traces, p.queryEntities ?? []);
    },
    'observational-memory-v10': async (q, p) => myOmV10Recall(q, p),
    'observational-memory-v11': async (q, p) => myOmV11Recall(q, p),
  }),
});
```

The recall-time entity-overlap ranker is opt-in per-backend. The bench wires it via `--entity-linking <weight>`; the consumer pattern above uses the same primitive directly.

## When to use which

| Architecture | Primitive | Best fit | Avoid when |
|---|---|---|---|
| Anthropic Contextual Retrieval | `SummarizedIngestExecutor` | Document-mode retrieval (codebases, ArXiv papers, fiction). Long heterogeneous content within sessions. | Conversational memory benchmarks where Cohere rerank already covers semantic match. |
| Mem0-v3-style entity-linking | `EntityExtractor` + `EntityLinkingIngestExecutor` + `EntityRetrievalRanker` | Multi-tenant memory where entity scoping is load-bearing. Document collections with strong proper-noun signal. | Cohere rerank is already in the pipeline; the cross-encoder subsumes entity overlap. Multi-hop questions where partial-match candidates matter. |
| Reference passthrough | `RawChunksIngestExecutor`, `SkipIngestExecutor` | Cost-sensitive workloads. Content that does not justify LLM-mediated processing. | When richer ingest semantics actually lift accuracy in the pipeline. |

A note on what the negative findings ([Stage L](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_L_PHASE_A_FINDINGS_2026-04-25.md), [Stage I](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_I_PHASE_A_FINDINGS_2026-04-25.md)) tell us: both architectures did not lift on top of our specific bench pipeline (hybrid + Cohere rerank + reader-top-k 20) on conversational benchmarks. They are not bad architectures in general; they are redundant on top of a cross-encoder-rerank stack on conversational data. Anthropic's measurement ([35% retrieval-failure reduction with embeddings alone](https://www.anthropic.com/news/contextual-retrieval), validated independently in [arXiv:2604.01733](https://arxiv.org/pdf/2604.01733)) was on documents. Mem0's [66.9% LOCOMO production-stack](https://mem0.ai/blog/state-of-ai-agent-memory-2026) number is closer to what we measure than the 91.6% managed-platform claim. The agentos primitives reproduce the architectures faithfully; the benchmark says "redundant on this baseline," which is a reproducibility datapoint, not a critique of the source architectures.

## Why these primitives belong in core

`agentos-bench` is benchmarks-only by [explicit policy](https://github.com/framersai/agentos-bench/blob/master): all memory and RAG architectural primitives go in agentos core, not in the bench. That policy means consumers can `pnpm add @framers/agentos` and get the primitives directly without depending on the bench. The bench measures architectures that ship as installable code, not bench-only mocks. Every leaderboard cell is reproducible by importing the same modules.

```ts
import { Memory, IngestRouter, MemoryRouter } from '@framers/agentos';
import {
  SummarizedIngestExecutor,
  EntityExtractor,
  EntityLinkingIngestExecutor,
} from '@framers/agentos/ingest-router';
import { EntityRetrievalRanker } from '@framers/agentos/memory-router';

// All publicly exported. Not bench-internal.
```

The IngestRouter strategy IDs (`summarized`, `fact-graph`, etc.) are no longer empty promises; they ship with reference executors. Consumers picking architecture-by-strategy-ID get a working implementation without authoring their own. That is the production-primitive integrity story alongside the leaderboard.

## What's next

Stage E (Hindsight 4-network typed observer) is the v2 architectural push, drafted at [packages/agentos-bench/docs/specs/2026-04-26-hindsight-4network-observer-design.md](https://github.com/framersai/agentos-bench/blob/master/docs/specs/2026-04-26-hindsight-4network-observer-design.md). Different mechanism (typed graph traversal, not signal stacking), different hypothesis (precision-bound benchmarks at scale, not semantic-match-ceiling-bound). Architecture follows [Hindsight (vectorize.io, arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1). Spec is decision-gated at +2 pp baseline before any Phase B spend.

If Stage E ships, the agentos `MemoryRouter` will gain a fourth backend ID (`hindsight-typed-network`). Consumers will get the typed-network primitive in core, alongside `canonical-hybrid`, `observational-memory-v10`, and `observational-memory-v11`. Same dispatcher pattern, same import surface, same production-primitive integrity discipline.

## Related

- [Two Negative Results: Stage L + Stage I](2026-04-26-two-negative-results-stage-l-stage-i.md). Bench measurements that drove the negative-finding documentation.
- [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md). The current M headline.
- [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md). The current S headline.
- [First Public LongMemEval-M Number](2026-04-26-longmemeval-m-first-published-number.md). Bench coverage on the harder 500-session-per-haystack variant.
- [Why Memory-Library Benchmarks Don't Mean What You Think](2026-04-24-memory-benchmark-transparency-audit.md). Earlier transparency audit.
- [Cognitive Pipeline](/features/cognitive-pipeline). Composition primitive that ties IngestRouter + MemoryRouter + ReadRouter.
- [Ingest Router](/features/ingest-router). The dispatcher pattern these executors plug into.
- [Memory Router](/features/memory-router). Recall-stage sibling.
