---
title: 'Announcing AgentOS: An Adaptive AI Agent Runtime in TypeScript'
authors: [agentos-team]
audience: engineer
date: 2025-11-10
description: 'AgentOS is an open-source TypeScript runtime for building adaptive multi-agent systems. Generalized Mind Instances, cognitive memory grounded in published neuroscience, and provider-agnostic LLM dispatch.'
tags: [announcements, agentos, open-source, typescript, ai-agents]
keywords: [agentos, ai agent framework, typescript ai agents, generalized mind instance, GMI, cognitive memory, multi-agent collaboration]
---

> *Editorial note:* This is the technical announcement on the docs site. The brand announcement (with measured benchmark provenance and FAQ) lives at [Announcing AgentOS](https://agentos.sh/blog/announcing-agentos) on agentos.sh. They are different posts for different audiences and intentionally do not overlap.

AgentOS is an open-source TypeScript framework for building adaptive multi-agent systems. The runtime ships [Generalized Mind Instances](https://docs.agentos.sh/architecture/gmi) (GMIs) as the core abstraction: agents with working memory, episodic / semantic / procedural memory partitions, personality traits, and a provider-agnostic LLM adapter. The architecture follows the [CoALA framework](https://arxiv.org/abs/2309.02427) (Sumers et al., 2023) for cognitive architectures.

<!-- truncate -->

## Why AgentOS

Existing agent frameworks treat agents as stateless function calls with chat history appended to the next prompt. That model breaks down for agents running across days, weeks, or months. AgentOS introduces three architectural commitments that diverge from that pattern:

- **Generalized Mind Instances.** Each agent is a cognitive entity with explicit memory partitions. Working memory ([Baddeley](https://doi.org/10.1016/S0079-7421(08)60452-1)), episodic memory with [Ebbinghaus decay](https://doi.org/10.1037/h0069023), semantic memory, procedural memory, and prospective memory. Eight cognitive mechanisms modulate retrieval (reconsolidation, retrieval-induced forgetting, schema encoding, source confidence decay, emotion regulation, involuntary recall, metacognitive feeling-of-knowing, temporal gist extraction). Each mechanism has a primary-source citation in the [Cognitive Memory Beyond RAG](2026-03-31-cognitive-memory-beyond-rag.md) post.

- **Provider-agnostic LLM dispatch.** 16 LLM providers wired through a common adapter interface. Swap OpenAI for Anthropic, Anthropic for local Llama, or any combination by changing one config line. No vendor lock-in.

- **Smart orchestration over hard-coded chains.** Three LLM-as-judge router primitives ([IngestRouter](https://docs.agentos.sh/features/ingest-router), [MemoryRouter](https://docs.agentos.sh/features/memory-router), [ReadRouter](https://docs.agentos.sh/features/read-router)) classify each piece of work and dispatch to a calibrated strategy. The same primitive that powers the bench's [85.6% LongMemEval-S](2026-04-28-reader-router-pareto-win.md) and [70.2% LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md) numbers ships as production code.

## Key features

- **Multi-agent collaboration.** Six built-in strategies (sequential, parallel, debate, review-loop, hierarchical, graph) with shared memory, inter-agent messaging, and HITL approval gates.
- **Cognitive memory with persistence.** SqliteBrain backs every agent's memory with cross-platform storage (Node.js better-sqlite3, browser IndexedDB/sql.js, mobile Capacitor SQLite, cloud PostgreSQL). Soul exports bundle the entire brain.
- **Voice and channels.** Full voice pipeline (STT + TTS + VAD + telephony) and 37 channel adapters (Telegram, WhatsApp, Discord, Slack, SMS, more).
- **Guardrails.** PII redaction, prompt injection defense, content policy, code safety, grounding verification, cost caps. Five security tiers (`dangerous` → `paranoid`).

## Getting started

```bash
npm install @framers/agentos
```

```typescript
import { agent } from '@framers/agentos';

const assistant = agent({
  provider: 'anthropic',
  instructions: 'You are a research assistant.',
  memory: { enabled: true, cognitive: true },
});

const answer = await assistant.text('Explain quantum entanglement.');
```

[Documentation](https://docs.agentos.sh). [GitHub](https://github.com/framersai/agentos). [npm](https://www.npmjs.com/package/@framers/agentos). [Discord](https://discord.gg/usEkfCeQxs).

---

*AgentOS is open source under Apache 2.0 and built by [Manic Agency](https://manic.agency) / [Frame.dev](https://frame.dev). See the [framework comparison](2026-02-20-agentos-vs-langgraph-vs-crewai.md) for how it stacks against LangGraph, CrewAI, and Mastra.*
