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

Open-source TypeScript runtime for the part of an agent that should outlive a single chat completion. Apache-2.0.

```bash
npm install @framers/agentos
```

Most agent SDKs treat an agent as a function call. You pass a prompt and a tool list, get a string back, close the connection — and the agent doesn't exist anymore. The next call starts a new one that happens to share a name.

AgentOS is what exists between those calls. It owns a persona, a working memory, a cognitive-memory layer that decays the way human memory decays, a sentiment tracker that follows the user's mood across turns, a metaprompt executor that assembles the system prompt fresh each turn from current state, and a reasoning trace that keeps the last several hundred decision steps. When an agent encounters a task no existing tool covers, it generates a TypeScript function with a Zod schema, sends it through an LLM judge, and on approval runs it in a hardened `node:vm` sandbox — and the new tool joins the catalog for the rest of the session. When a multi-agent team hits a capability gap, the manager calls `spawn_specialist` and the LLM judge reviews the synthesized agent spec before that specialist joins the live roster.

:::tip Memory benchmarks (full N=500, gpt-4o reader)
**85.6% on LongMemEval-S** at $0.0090 per correct, 0.4 points behind [Emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag)'s closed-source SaaS at 86% and +1.4 points above [Mastra](https://mastra.ai) Observational Memory (84.23%) at matched `gpt-4o` reader. AgentOS ships under [Apache-2.0](https://github.com/framersai/agentos/blob/master/LICENSE), free to install, fork, and self-host.

**70.2% on LongMemEval-M** at $0.0078 per correct on the 1.5M-token / 500-session haystack — the only open-source library on the public record above 65% on M with publicly reproducible methodology. Competitive with the strongest published M results in the LongMemEval paper ([Wu et al., ICLR 2025](https://arxiv.org/abs/2410.10813): round Top-5 65.7%, session Top-5 71.4%, round Top-10 72.0%).

**[Benchmarks reference](/benchmarks)** · **[Reproducible run JSONs](https://github.com/framersai/agentos-bench/tree/master/results/runs)** · **[SOTA writeup](https://agentos.sh/en/blog/agentos-memory-sota-longmemeval/)**
:::

## How memory actually works

Most memory libraries retrieve on every query. AgentOS gates memory through three independent LLM-as-judge classifiers. Trivial queries — greetings, small talk, general knowledge answerable from context — skip retrieval entirely. Queries that need memory get the architecture best-suited to the category. The right reader handles each question type.

![AgentOS classifier-driven memory pipeline: query enters QueryClassifier (T0 short-circuits), MemoryRouter picks retrieval architecture, canonical-hybrid retrieval (BM25 + dense + RRF + Cohere rerank + 6-signal cognitive composite), ReaderRouter picks the reader model, ReadRouter picks the strategy, grounded answer returns. Background consolidation loop on the same brain.](/img/diagrams/memory-system-overview.svg)

| Stage | Primitive | Decision per query |
|---|---|---|
| 1 | `QueryClassifier` | T0/none · T1/simple · T2/moderate · T3/complex |
| 2 | `MemoryRouter` | canonical-hybrid · observational-memory-v10 · v11 |
| 3 | `ReaderRouter` | gpt-4o vs gpt-5-mini per category |

The pipeline costs **one classifier call per query** — Stages 2 and 3 reuse Stage 1's classification. That single call buys 12× lower reader cost on most categories, +10 points on single-session-preference, and a clean abstain path for queries that don't need memory at all — which most other systems still pay full retrieval cost for. Reproducible run JSONs in [agentos-bench](https://github.com/framersai/agentos-bench).

## Where to start

- [**Cognitive Memory**](/features/cognitive-memory) — why memory should forget. Eight neuroscience-grounded mechanisms. The story is the page.
- [**GMI architecture**](/architecture/gmi) — what an agent actually is between turns. Seven layers, one LLM core.
- [**System Architecture**](/architecture/system-architecture) — how the 26 modules compose into a runtime.
- [**Deep Research**](/features/deep-research) — the 3-phase pipeline behind sourced answers.
- [**Emergent Capabilities**](/features/emergent-capabilities) — runtime tool forging, judge approval, sandboxed execution.
- [**Examples Cookbook**](/getting-started/examples) — 18 runnable examples covering agents, agencies, voice, orchestration.
- [**TypeDoc API**](/api/) — every class, interface, and function in the runtime.

## Paracosm — the swarm-simulation companion

[Paracosm](https://paracosm.agentos.sh) is an agent-swarm simulation engine built on AgentOS. Define a world as JSON, run it with HEXACO-typed leaders directing a swarm of specialists and ~100 personality-typed cells, and watch their decisions diverge into measurably different outcomes from an identical seed. Reproducible, forkable, replayable. The swarm itself is first-class on the API: `RunArtifact.finalSwarm`, `paracosm/swarm` helpers, `GET /api/v1/runs/:runId/swarm` for HTTP consumers.

The reference scenario ships as Mars Genesis — a 100-colonist Mars settlement running from 2035 to 2083 across six turns. Two leaders, same seed, different HEXACO profiles, different futures. Try it live.

**[Live demo](https://paracosm.agentos.sh/sim)** · **[GitHub](https://github.com/framersai/paracosm)** · **[npm](https://www.npmjs.com/package/paracosm)** · **[API reference](/paracosm)**

---

:::info Talk to us
**[Wilds AI Discord](https://wilds.ai/discord)** for questions, feedback, community. **[Contact AgentOS](https://agentos.sh/en/contact)** for partnerships, security disclosures, enterprise inquiries.
:::
