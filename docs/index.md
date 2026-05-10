---
title: 'AgentOS'
sidebar_position: 0
slug: /documentation
---

# AgentOS

[![npm version](https://img.shields.io/npm/v/@framers/agentos?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/@framers/agentos)
[![CI](https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?branch=master&style=flat-square&logo=github&label=CI)](https://github.com/framersai/agentos/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/tests-3%2C866%2B_passed-2ea043?style=flat-square&logo=vitest&logoColor=white)](https://github.com/framersai/agentos/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/framersai/agentos/graph/badge.svg)](https://codecov.io/gh/framersai/agentos)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

Open-source TypeScript runtime for AI agents that remember, adapt, and write their own tools. Apache-2.0.

```bash
npm install @framers/agentos
```

> "It's a poor sort of memory that only works backwards."
> — Lewis Carroll, *Through the Looking-Glass*, 1871

Most agent memory libraries embed every message, store the vectors, and at retrieval time return whatever is closest in cosine space. This holds up for a few thousand turns. Past that, the agent is doing something a human mind explicitly evolved *not* to do — treating every recorded experience as equally available, equally trustworthy, and equally relevant. Long contexts get worse, not better. Costs climb. The bot starts confidently citing yesterday's small talk.

I built AgentOS to put the parts of a mind that *should* outlive a single chat completion into the runtime itself. Encoding strength is set per-trace, modulated by the agent's HEXACO personality and the emotional intensity of the moment ([Brown & Kulik, 1977](https://psycnet.apa.org/record/1977-29748-001) on flashbulb memories; [Yerkes & Dodson, 1908](https://onlinelibrary.wiley.com/doi/abs/10.1002/cne.920180503) on the inverted-U arousal curve). Strength then decays exponentially with time on Ebbinghaus's 1885 forgetting curve, accelerated by interference from new similar memories and slowed by successful retrieval. Working memory is bounded by [Baddeley's slot model](https://www.sciencedirect.com/science/article/pii/S1364661303002479) of seven-plus-or-minus-two, modulated by traits. Retrieval composites six signals — vector similarity, current strength, recency, emotional congruence with the agent's mood, graph spreading-activation in the [ACT-R](https://act-r.psy.cmu.edu/) tradition, and importance.

When an agent encounters a task no existing tool covers, it generates a TypeScript function with a Zod schema, sends it through a separate LLM judge, and on approval runs it in a hardened `node:vm` sandbox. The forged tool joins the catalog for the rest of the session and can be promoted into a `SKILL.md` skill that the next process picks up at startup. Multi-agent teams that hit a capability gap call `spawn_specialist`; the judge reviews the synthesized agent spec before that specialist joins the live roster.

This is the runtime. The benchmarks below are how that design holds up against everyone else's at the same `gpt-4o` answer model — the comparison the headline percentages alone don't give you.

:::tip Memory benchmarks (full N=500, gpt-4o reader)
**85.6% on LongMemEval-S** at $0.0090 per correct, 0.4 points behind [Emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag)'s **closed-source SaaS** at 86% and +1.4 points above [Mastra](https://mastra.ai) Observational Memory (84.23%) at matched `gpt-4o` reader. AgentOS ships under [Apache-2.0](https://github.com/framersai/agentos/blob/master/LICENSE), free to install, fork, and self-host.

**70.2% on LongMemEval-M** at $0.0078 per correct on the 1.5M-token / 500-session haystack — the only open-source library on the public record above 65% on M with publicly reproducible methodology. Competitive with the strongest published M results in the LongMemEval paper ([Wu et al., ICLR 2025](https://arxiv.org/abs/2410.10813): round Top-5 65.7%, session Top-5 71.4%, round Top-10 72.0%).

**[Benchmarks reference](/benchmarks)** · **[Reproducible run JSONs](https://github.com/framersai/agentos-bench/tree/master/results/runs)** · **[SOTA writeup](https://agentos.sh/en/blog/agentos-memory-sota-longmemeval/)**
:::

## How recall works

Most memory libraries retrieve on every query. AgentOS gates memory through three independent LLM-as-judge classifiers. Trivial queries — greetings, small talk, general knowledge answerable from context — skip retrieval entirely. Queries that need memory get the architecture best-suited to the category. The right reader handles each question type.

![AgentOS classifier-driven memory pipeline: query enters QueryClassifier (T0 short-circuits), MemoryRouter picks retrieval architecture, canonical-hybrid retrieval (BM25 + dense + RRF + Cohere rerank + 6-signal cognitive composite), ReaderRouter picks the reader model, ReadRouter picks the strategy, grounded answer returns. Background consolidation loop on the same brain.](/img/diagrams/memory-system-overview.svg)

| Stage | Primitive | Decision per query |
|---|---|---|
| 1 | `QueryClassifier` | T0/none · T1/simple · T2/moderate · T3/complex |
| 2 | `MemoryRouter` | canonical-hybrid · observational-memory-v10 · v11 |
| 3 | `ReaderRouter` | gpt-4o vs gpt-5-mini per category |

The pipeline costs **one classifier call per query** — Stages 2 and 3 reuse Stage 1's classification. That single call buys 12× lower reader cost on most categories, +10 points on single-session-preference, and a clean abstain path for queries that don't need memory at all. Reproducible run JSONs in [agentos-bench](https://github.com/framersai/agentos-bench).

## Where to start

- [**Cognitive Memory**](/features/cognitive-memory) — why memory should forget. Eight neuroscience-grounded mechanisms, primary-source citations, the consolidation loop. The story is the page.
- [**GMI architecture**](/architecture/gmi) — what an agent actually is between turns. Seven layers around an LLM core.
- [**System Architecture**](/architecture/system-architecture) — how the 26 modules compose into a runtime.
- [**Deep Research**](/features/deep-research) — the 3-phase pipeline behind sourced answers.
- [**Emergent Capabilities**](/features/emergent-capabilities) — runtime tool forging, judge approval, sandboxed execution.
- [**Examples Cookbook**](/getting-started/examples) — 18 runnable examples covering agents, agencies, voice, orchestration.
- [**TypeDoc API**](/api/) — every class, interface, function in the runtime.

## Paracosm — the swarm-simulation companion

[Paracosm](https://paracosm.agentos.sh) is an agent-swarm simulation engine I built on AgentOS. Define a world as JSON, run it with HEXACO-typed leaders directing a swarm of specialists and ~100 personality-typed cells, and watch their decisions diverge into measurably different outcomes from an identical seed. Reproducible, forkable, replayable. The swarm is first-class on the API: `RunArtifact.finalSwarm`, `paracosm/swarm` helpers, `GET /api/v1/runs/:runId/swarm` for HTTP consumers.

The reference scenario ships as Mars Genesis — a 100-colonist Mars settlement running from 2035 to 2083 across six turns. Two leaders, same seed, different HEXACO profiles, different futures. Try it live.

**[Live demo](https://paracosm.agentos.sh/sim)** · **[GitHub](https://github.com/framersai/paracosm)** · **[npm](https://www.npmjs.com/package/paracosm)** · **[API reference](/paracosm)**

---

:::info Talk to us
**[Wilds AI Discord](https://wilds.ai/discord)** for questions, feedback, community. **[Contact AgentOS](https://agentos.sh/en/contact)** for partnerships, security disclosures, enterprise inquiries.
:::
