---
title: "Why Memory-Library Benchmarks Don't Mean What You Think"
description: "A transparent audit of how Mem0, Mastra, Supermemory, Zep, EmergenceMem, and MemPalace publish their LongMemEval and LOCOMO numbers. The benchmarks are broken. The gaming is documented. Here's what we did at AgentOS instead, and what we're still guilty of."
authors: [agentos-team]
tags: [memory, benchmarks, longmemeval, locomo, transparency, rag, policy-router]
keywords: [memory benchmark transparency, longmemeval gaming, locomo audit, agentos policy router, pareto-optimal routing, memory library benchmark reproducibility, mem0 vs zep, mastra observational memory, supermemory memorybench, benchmark reproducibility]
image: /img/blog/memory-benchmarks.png
---

In April 2026, Penfield Labs ran a systematic audit of [LOCOMO](https://aclanthology.org/2024.acl-long.747.pdf), the long-term-memory benchmark that every major memory-library vendor cites as their SOTA proving ground. Their [audit](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) found 99 errors in 1,540 answer-key entries. That's a 6.4% ground-truth error rate. They then tested the LLM judge the benchmark relies on. It accepted **62.81% of intentionally wrong answers** when the wrong answer was topically adjacent to the correct one.

Those two numbers put a hard floor on any LOCOMO score comparison. A 6.4% error rate in the gold answers means any system scoring above 93.6% is benefiting from benchmark errors. A judge that accepts almost two-thirds of wrong-but-topical answers means any score gap below roughly 6pp is inside the judge's noise. Mem0's 91.6% LOCOMO claim, Hydra DB's 90.79%, Zep's self-reported 71.2%, Emergence AI's 86%: all are measured against a benchmark whose ceiling is 93.6% and whose grader tolerates the exact failure mode (vague, topically-adjacent answers) that weak memory systems produce.

<!-- truncate -->

And LOCOMO is only one of the two benchmarks the industry converges on. The other is LongMemEval-S, whose 115K-token corpus fits inside every current-generation LLM's context window. Mastra's own published results demonstrate the consequence: their full-context baseline at `gpt-4o` scored 60.20%, and their Observational Memory system scored 84.23% on the same model. The 24-point lift measures how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory across conversations.

This post is an audit. It cites primary sources. It includes our own company's numbers and calls out where our methodology is open to the same critique.

## The benchmarks everyone cites are broken

LongMemEval (Wang et al., [ICLR 2025](https://arxiv.org/abs/2410.10813)) and LOCOMO (Maharana et al., [ACL 2024](https://aclanthology.org/2024.acl-long.747.pdf)) are the two benchmarks every memory-library vendor quotes. Both have structural problems documented by third-party audits.

**LOCOMO's answer key is wrong 6.4% of the time.** In April 2026, Penfield Labs published a [systematic audit](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) of LOCOMO's ground truth. They found 99 score-corrupting errors in 1,540 questions, categorized as hallucinated facts, incorrect temporal reasoning, and speaker attribution errors. The theoretical maximum score for a perfect system sits at about 93.6%. A score of 95% on LOCOMO is mathematically impossible without benefiting from the errors.

The Penfield team then tested the LLM judge. LOCOMO uses `gpt-4o-mini` to grade answers against the gold reference. Penfield synthesized intentionally wrong-but-topically-adjacent answers for all 1,540 questions. The judge accepted **62.81%** of them. Per the audit: "Vague answers that identified the correct topic while missing every specific detail passed nearly two-thirds of the time. This is precisely the failure mode of weak retrieval, locating the right conversation but extracting nothing specific, and the benchmark rewards it."

That means any score difference below roughly ±6pp on LOCOMO is inside the judge's noise floor. By comparison, [Northcutt et al. (NeurIPS 2021)](https://arxiv.org/abs/2103.14749) found that a 3.3% label-error rate is already sufficient to destabilize model rankings across major ML benchmarks. LOCOMO's 6.4% is nearly double that.

**LongMemEval-S is a context-window test, not a memory test.** LongMemEval-S uses about 115K tokens of conversation context per question. GPT-4o, Claude 3.5, Gemini 1.5 Pro, and GPT-5 all have context windows from 200K to 1M tokens. The entire test corpus fits in a single prompt for every current-generation model.

Penfield points out that Mastra's own published results demonstrate this. Mastra's full-context baseline at `gpt-4o` scored 60.20% on LongMemEval-S. Their Observational Memory system scored 84.23%. The 24-point lift is largely a measurement of how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory. As context windows continue to grow, the benchmark's ability to discriminate shrinks.

These are the conditions under which every memory vendor in the space has been racing to post higher numbers.

## Two documented cases of benchmark gaming between actual memory vendors

### Case one: Mem0 publishes Zep at 65.99%, Zep publishes Zep at 75.14%

In May 2025, Mem0 published a research paper positioning their product as state-of-the-art on LOCOMO. The paper included a comparison table. Zep's score in that table was 65.99%.

Zep responded with a blog post titled ["Lies, Damn Lies, & Statistics"](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/). They reran the same LOCOMO evaluation with a correctly-configured Zep implementation. Zep scored **75.14% ±0.17**, beating Mem0's best configuration by about 10% relative.

The root cause, per Zep: Mem0 ran Zep with sequential search instead of concurrent search. Zep's search latency as reported by Mem0 was 0.778s (with their sequential implementation). Zep's correctly-configured search latency is 0.632s p95. The published comparison table was technically a real measurement, but it was measuring a Zep that Zep doesn't ship.

This is the cross-vendor-comparison problem. When vendors re-implement each other's systems to generate comparison tables, the re-implementation is almost always suboptimal for the competitor. Published tables look like apples-to-apples; they usually aren't.

### Case two: Zep's own self-reported number doesn't reproduce

Zep's primary LongMemEval number is 71.2% at `gpt-4o`, cited from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arxiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at **63.8%** on the same benchmark. That's a 7.4pp gap, about the magnitude of the LOCOMO judge's false-positive floor.

There's also a separate [GitHub issue (#5 in zep-papers)](https://github.com/getzep/zep-papers/issues/5) titled "Revisiting Zep's 84% LoCoMo Claim: Corrected Evaluation & 58.44%." The filer claims Zep's self-reported LOCOMO result doesn't survive a corrected evaluation, landing at 58.44% instead of 84%. Zep has engaged publicly with the Mem0 critique but hasn't (as of April 2026) published a response to the independent LongMemEval reproduction.

Zep is one of the more transparent vendors in this space. They ship open-source code ([Graphiti](https://github.com/getzep/graphiti)), they publish a peer-reviewed paper ([arxiv:2501.13956](https://arxiv.org/html/2501.13956v1)), and they corrected their own number when they found an error in the Mem0 replication. And their number still doesn't reproduce cleanly. That tells you something about the space, not specifically about Zep.

### Other patterns in the published record

[EmergenceMem's "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast) hardcodes `top_k=42` for retrieval. It is a literal magic number with a comment referencing Douglas Adams. [Calvin Ku reproduced their work with GPT-4o-mini](https://medium.com/asymptotic-spaghetti-integration/emergence-ai-broke-the-agent-memory-benchmark-i-tried-to-break-their-code-23b9751ded97) and found the fixed-k approach works on LongMemEval but falls apart on LOCOMO and MSC. Emergence's framing, to their credit, is honest: their blog post explicitly says the fact that RAG-like methods near-saturate LongMemEval indicates the benchmark "still isn't capturing important aspects of memory."

[Mastra's research page](https://mastra.ai/research/observational-memory) publishes 84.23% at `gpt-4o` on LongMemEval. The primary source discloses, explicitly and in the results block, that the ingest-time Observer and Reflector are `gemini-2.5-flash`. Only the Actor (the model generating the final answer) is `gpt-4o`. This is disclosed. It's easy to miss when the headline number gets re-cited on LinkedIn or in competitor comparison tables. When AgentOS evaluates against a pure-OpenAI stack with `gpt-5-mini` as observer and `gpt-4o` as reader, we are not comparing like to like against Mastra's number.

[Mem0's research page](https://mem0.ai/research) claims 92.0% on LongMemEval. Their [research-2 page](https://mem0.ai/research-2) claims 93.4% on the same benchmark. These two numbers come from the same company. They don't reconcile. Neither page lists the reader model, the judge model, the seed, the bootstrap CI, or the per-category breakdown. A third-party attempt to reproduce Mem0's LongMemEval result is filed as [mem0/#3944](https://github.com/mem0ai/mem0/issues/3944), cited by Penfield Labs as one of multiple documented reproduction failures.

(The most-publicized 2026 benchmark implosion, the actress Milla Jovovich's MemPalace launch claiming 100% on LongMemEval and LOCOMO, was a celebrity-driven stunt rather than a serious competitor. The project's "100% LongMemEval" was retrieval recall@5 rather than end-to-end QA, the "100% LoCoMo" was obtained by setting `top_k=50` to dump every session into Claude Sonnet, and the advertised "contradiction detection" feature was absent from the code. [HackerNoon's post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks) and [GitHub Issue #29](https://github.com/milla-jovovich/mempalace/issues/29) cover the anatomy in full. We mention it only because the three patterns (wrong-metric-claimed-as-SOTA, bypass-retrieval-to-inflate, advertised-feature-absent-from-code) recur in less-flagrant forms across the real vendors surveyed above.)

## What competitors actually publish on 10 transparency axes

Across Mem0, Mastra, Supermemory, Zep, EmergenceMem, Letta, and MemPalace, no single vendor ships every transparency axis that makes a memory benchmark meaningful. The matrix below is built from each vendor's primary research page and open-source bench repo.

| Transparency axis | Mem0 | Mastra | Supermemory | Zep | Emergence | Letta | MemPalace | AgentOS |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Aggregate accuracy | ✅ | ✅ | ✅ | ✅ | ✅ | partial | ✅ | ✅ |
| 95% bootstrap CI on headline | ❌ | ❌ | ❌ | partial (±0.17 SD only) | ❌ | ❌ | ❌ | ✅ |
| Per-category 95% CI | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Reader model disclosed on research page | ❌ | ✅ | partial | ✅ | ✅ | ❌ | ❌ | ✅ |
| Observer / ingest model disclosed | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| USD cost per correct | ❌ | ❌ | ❌ | ❌ | partial (latency only) | ❌ | ❌ | ✅ |
| Latency avg / p50 / p95 | ❌ | ❌ | ❌ | partial (p95 search) | median only | ❌ | ❌ | ✅ |
| Per-category breakdown | ❌ | ✅ | ✅ | ✅ | ✅ | partial | ❌ | ✅ |
| Open-source benchmark runner | ✅ | partial (workshop) | ✅ | partial | ✅ | ❌ | partial | ✅ |
| Per-case run JSONs at seed | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Judge-adversarial probe | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Matched-reader cross-vendor table | ❌ | ❌ | partial | partial | ✅ | ❌ | ❌ | ✅ |

**Honest finding about bench tooling.** We initially wanted to write this post claiming AgentOS is the only vendor publishing a full benchmark suite. That claim is false. [Supermemory's memorybench](https://github.com/supermemoryai/memorybench) is a genuinely comparable framework. It's TypeScript, multi-provider (Supermemory, Mem0, Zep), multi-benchmark (LoCoMo, LongMemEval, ConvoMem), multi-judge (GPT-4o, Claude, Gemini), has a checkpointed pipeline (ingest → index → search → answer → evaluate → report), a web UI, and a MemScore triple (accuracy / latency / tokens). It doesn't ship bootstrap CIs, judge-adversarial probes, or kill-ladder methodology, but it's the real second open bench suite in the space.

Two vendors ship real bench suites. Everyone else ships a runner for their own system (Mem0's [memory-benchmarks](https://github.com/mem0ai/memory-benchmarks) runs Mem0 Cloud and OSS, not other vendors) or a workshop (Mastra's [workshop-longmemeval](https://github.com/mastra-ai/workshop-longmemeval) is examples from a July 2025 workshop, not a bench framework). Five don't ship anything beyond their memory system itself.

Supermemory goes wide. We go deep. Neither is strictly better, and no single vendor covers the full transparency surface.

## Where AgentOS actually lands

Our current Phase B N=500 numbers on LongMemEval-S at `gpt-4o` reader. Primary source: run JSONs under `packages/agentos-bench/results/runs/` in the [AgentOS monorepo](https://github.com/framersai/agentos).

| Tier | Accuracy | 95% CI | $/correct | Avg latency | Notes |
|---|---:|---|---:|---:|---|
| Tier 1 canonical | 73.2% | [69.2, 77.0] | $0.0213 | 98s | BM25 + dense RRF + Cohere rerank |
| Tier 2a v10 router | 74.6% | [70.8, 78.4] | $0.3265 | 12s | gpt-5-mini classifier routes KU/MS to OM |
| Tier 2b v11 verbatim | 75.4% | [71.6, 79.0] | $0.4362 | 14s | v10 + conditional verbatim on KU/SSU |
| Tier 3 max-acc v2 | 75.6% | [71.8, 79.2] | $0.2434 | 66s | Per-query policy router, max-acc table |
| **Tier 3 min-cost** | **76.6%** | **[72.8, 80.2]** | **$0.0580** | **16s** | **Pareto-dominates all three flat tiers** |

76.6% at $0.058 per correct answer. Sixteen seconds average latency, 3.3s median. Bootstrap confidence interval of 72.8% to 80.2%. Backend mix: 85.8% Tier 1 + 14.2% Tier 2b.

Tier 3 is the policy-router tier. Instead of shipping a single memory architecture, the router picks a backend per query based on the `gpt-5-mini` classifier's predicted question category. The `minimize-cost` preset routes SSA / SSU / TR / KU to Tier 1 (where those categories Pareto-dominate at baseline) and only pays the Tier 2b OM premium on MS and SSP (where the architectural lift earns it).

Compared to the three flat tiers we shipped previously:
- +1.2pp accuracy over Tier 2b v11 at 7.5× lower $/correct
- +2.0pp accuracy over Tier 2a v10 at 5.6× lower $/correct
- +3.4pp accuracy over Tier 1 canonical at 2.7× higher $/correct, 6× lower latency

Compared to the published frontier, 76.6% sits above Zep's self-reported 71.2% (and well above Zep's independently-audited 63.8%) but below Mastra's 84.23%, Supermemory's 81.6%, EmergenceMem's 86%, and Mem0's 92-93.4%. We are not the frontier. The cost and latency profile at 76.6% is probably the cheapest path to that accuracy that's been published.

Primary source for our runs: [`packages/agentos-bench/results/LEADERBOARD.md`](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/results/LEADERBOARD.md). Reproducibility via `pnpm exec agentos-bench run longmemeval-s --policy-router --policy-router-preset minimize-cost --bootstrap-resamples 10000 --seed 42`.

## What we're still guilty of

A fair read of our own work finds one structural problem. The Tier 3 routing tables (maximize-accuracy, balanced, minimize-cost) were constructed by reading Phase B N=500 per-category cost-accuracy data from our three previously-shipped tiers. We then ran Phase B N=500 on the resulting tier 3 configurations and reported the accuracy delta.

That is in-distribution test-set optimization. It's not equivalent to MemPalace's hand-coded boosts. We don't modify the dataset, the answers, or the judge. The tables are a deterministic function of the measured per-category cost-accuracy curves from the prior tiers. But the distribution we designed the tables against is the same distribution we measured them on.

Our oracle counterfactual estimate gives the tell. Using ground-truth category routing on our own tables, the Phase B aggregate is 76.2%. Using the realistic `gpt-5-mini` classifier predictions, the Phase B aggregate is 76.6%. Realistic exceeds oracle by 0.4pp. That's sampling noise going the right way for us, but it also indicates the tables are already near-optimal for this specific 500-case sample. A different 500-case sample, a longer haystack (LongMemEval-M), or a different benchmark (BEAM 10M) would produce different numbers.

We have not validated Tier 3 out-of-distribution. We have not run LongMemEval-M, LongMemEval-L, or BEAM. The claim "Pareto-dominates all three flat tiers" is literally true on Phase B of LongMemEval-S. It is not a claim about real-world workload performance.

The honest version of our Tier 3 pitch: routing per-query against measured per-category cost-accuracy curves produces strictly better cost-accuracy points than committing to a single architecture, when the category distribution of the target workload is close to the distribution we calibrated against. For the LongMemEval-S distribution, the tables deliver 76.6% at $0.058/correct. For any other distribution, you should expect less. Running your own calibration against your own workload is the use case Tier 3 is actually designed for.

This is a weaker claim than "we beat everyone." It's the claim the data supports.

## What a good memory benchmark publication would include

Penfield Labs' audit lists six requirements for meaningful long-term memory evaluation. They're worth quoting directly:

1. **Corpus size must exceed context windows.** "If the full test corpus fits in context, retrieval is optional and the benchmark cannot distinguish memory systems from context window management."
2. **Evaluation must use current-generation models.** "gpt-4o-mini as a judge introduces a ceiling on scoring precision."
3. **Judge reliability must be validated adversarially.** "When a judge accepts 63% of intentionally wrong answers, score differences below that threshold are not interpretable."
4. **Ingestion should reflect realistic use.** Conversations built through turns and corrections, not single-pass static-text ingestion.
5. **Evaluation pipelines must be standardized or fully disclosed.** "At minimum: ingestion method (and prompt if applicable), embedding model, answer generation prompt, judge model, judge prompt, number of runs, and standard deviation."
6. **Ground truth must be verified.** "A 6.4% error rate in the answer key creates a noise floor that makes small score differences uninterpretable."

Three additions from our own experience building `agentos-bench`:

7. **Bootstrap percentile confidence intervals on every headline.** Ten thousand resamples with a seeded PRNG. Report CI low and CI high alongside the point estimate. Score differences smaller than the CI gap are not signal.
8. **Per-case run artifacts at a seed.** A run JSON with `caseId`, predicted category (when routing), chosen backend, estimated cost, actual cost, actual reader output, judge score, and per-stage retention data. Third parties should be able to rerun a specific case from a specific tier and get the same outcome deterministically.
9. **Cache fingerprinting that invalidates on config change.** When a routing table changes or a prompt hash bumps, the cache invalidates. We discovered during our Tier 3 rollout that hashing only the preset name (not the routing table content) allowed stale cached results to satisfy edited-table queries. A one-line edit to the TR routing entry returned $0 "re-run" results that were actually the pre-edit data. We fixed it by hashing the sorted table serialization. Publicly-shipping bench runners should make this kind of cache-invalidation bug impossible, not only debuggable.

If a memory-library benchmark publication satisfies all nine, you can trust the number. If it satisfies fewer than five, treat the number as marketing.

## What to do with this

For developers evaluating memory libraries for their own stack, the takeaway is not "pick the vendor with the highest number." The takeaway is: ignore the headline number, read the methodology, and run the benchmark yourself.

Three open-source bench frameworks exist to do that without writing your own harness:

- [**AgentOS agentos-bench**](https://github.com/framersai/agentos/tree/master/packages/agentos-bench) covers LongMemEval-S, LOCOMO, BEAM, and eight cognitive-mechanism micro-benchmarks. Bootstrap CIs, judge-adversarial probes, per-stage retention metric, kill-ladder methodology, per-case run JSONs at `--seed 42`. Depth over breadth.
- [**Supermemory memorybench**](https://github.com/supermemoryai/memorybench) covers LoCoMo, LongMemEval, and ConvoMem across Supermemory, Mem0, and Zep with any of GPT-4o, Claude, or Gemini as judge. Checkpointed pipeline, web UI, MemScore triple. Breadth over depth.
- [**Mem0 memory-benchmarks**](https://github.com/mem0ai/memory-benchmarks) covers LOCOMO and LongMemEval against Mem0 Cloud and OSS. Mem0-specific but fully open.

For vendors publishing benchmark numbers: use one of these harnesses and publish the seed, the config, and the per-case run JSONs alongside your headline. Anything less makes your number a claim, not a measurement. The community will find the gap between the claim and the reproduction. The reproduction will be louder than the launch.

We're not at the frontier of accuracy on LongMemEval-S. We're at 76.6%. The frontier self-reports sit above us, and three of them (Zep's 71.2%, Mem0's 92.0/93.4%, MemPalace's 100%) have been independently disputed, unreproducible, or outright false. Our own 76.6% sits on top of a Tier 3 implementation that was calibrated against the same Phase B distribution it reports results on. We're not the frontier, and we're still guilty of a mild form of benchmark overfitting.

What we are is the only vendor in the surveyed set that publishes bootstrap CIs, judge-adversarial probes, per-stage retention metrics, full cost-per-correct accounting, latency distributions, per-case run JSONs, and matched-reader cross-vendor comparison tables at a seeded reproducible configuration. For the reader trying to decide which memory library to use, those are the things that matter. The headline number is a lottery ticket. The methodology is the infrastructure.

---

*All claims in this post are sourced from primary URLs visited April 24, 2026. The full audit with per-vendor transparency report cards is at [`packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md`](https://github.com/framersai/agentos/blob/master/packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md). The AgentOS bench implementation is open source at [`packages/agentos-bench`](https://github.com/framersai/agentos/tree/master/packages/agentos-bench).*
