---
title: "AgentOS vs LangGraph vs CrewAI vs Mastra: AI Agent Frameworks Compared (2026)"
description: "Honest comparison of four production-ready AI agent frameworks: architecture, memory, multi-agent support, code examples, benchmarks, and when to use each. Built by the AgentOS team with caveats called out where alternatives win."
authors: [agentos-team]
audience: engineer
tags: [comparison, frameworks, multi-agent, architecture]
keywords: [ai agent framework comparison, langgraph alternative, crewai alternative, mastra vs agentos, typescript ai agent framework, best ai agent framework 2026, multi-agent orchestration, cognitive memory ai, letta memgpt]
image: /img/blog/framework-comparison.png
---

Building AI agents in 2026 means choosing between a growing number of frameworks. This comparison covers four production-ready options: [AgentOS](https://agentos.sh), [LangGraph](https://www.langchain.com/langgraph), [CrewAI](https://crewai.com), and [Mastra](https://mastra.ai). Each targets different use cases and team profiles. We built AgentOS, so we will be upfront about where it excels and where alternatives might be a better fit. The numbers in this post are sourced from each project's primary documentation, GitHub stars/issues, and the [Speakeasy 2026 framework comparison](https://www.speakeasy.com/blog/ai-agent-framework-comparison) (Q1 2026 benchmarks).

> *Editorial note (canonical):* This is the engineering deep-dive version of the comparison; it's the canonical entry for the topic. The shorter consumer-facing version on agentos.sh ([AgentOS vs LangGraph vs CrewAI vs Mastra vs VoltAgent](https://agentos.sh/blog/agentos-vs-langgraph-vs-crewai)) shares the same conclusions and provenance but reads as a higher-level summary. If you want the full per-knob comparison and the reader-matched cost claims, this is the post.

Every numeric comparison below either matches reader model and configuration between systems or is flagged as a pricing observation rather than a quality claim. The methodology follows agentos-bench's matched-reader rule: comparing accuracy or cost across systems is meaningful only when the reader model and reader configuration are held constant. Where a competitor publishes only a number without specifying the reader, that number stays in its original form and is annotated as such.

<!-- truncate -->

## Quick comparison

| Feature | AgentOS | LangGraph | CrewAI | Mastra |
|---------|---------|-----------|--------|--------|
| **Language** | TypeScript | Python + JS | Python | TypeScript |
| **GitHub Stars** | ~90 | [24,800+](https://github.com/langchain-ai/langgraph) | [45,900+](https://github.com/crewAIInc/crewAI) | [22,300+](https://github.com/mastra-ai/mastra) |
| **npm/PyPI Downloads** | Growing | [34.5M/mo](https://www.npmjs.com/package/@langchain/langgraph) | [5.2M/mo](https://pypi.org/project/crewai/) | [1.77M/mo](https://www.npmjs.com/package/@mastra/core) |
| **Architecture** | GMI (cognitive entities) | State graphs | Role-based crews | Agents + workflows |
| **Memory** | Cognitive (8 mechanisms, Ebbinghaus decay) | Conversation + checkpoints | Short/long-term + entity (ChromaDB/SQLite) | Conversation + semantic + observational |
| **LLM Providers** | 16 built-in | Model-agnostic via LangChain | Model-agnostic | 94 providers via AI SDK |
| **Guardrails** | 6 packs (PII, injection, code safety, grounding, content policy, topicality) | Content moderation middleware | Basic output validation | None built-in |
| **Multi-Agent** | 6 strategies + emergent teams | State graph orchestration | Role-based crews + flows | Agent networks + workflows |
| **Channels** | 37 (Telegram, WhatsApp, Discord, Slack, etc.) | None built-in | None built-in | None built-in |
| **Voice Pipeline** | Full (STT + TTS + VAD + telephony) | None built-in | None built-in | None built-in |
| **Personality** | HEXACO 6-trait system | None | Role descriptions | None |
| **Structured Output** | Zod-validated with retry | Via LangChain | Basic | Via AI SDK |
| **Deployment** | npm install (self-hosted) | LangGraph Cloud ($0.001/node) | AMP Cloud/Factory (from $25/mo) | Serverless-first (Vercel, Cloudflare) |
| **License** | Apache 2.0 | MIT | MIT | Apache 2.0 |

## Code comparison: same task, four frameworks

A research agent that searches the web and answers a question.

### AgentOS (TypeScript)

```typescript
import { agent } from '@framers/agentos';

const researcher = agent({
  provider: 'anthropic',
  instructions: 'You are a research assistant. Search the web and cite sources.',
  tools: ['web_search', 'deep_research'],
  personality: { openness: 0.9, conscientiousness: 0.8 },
  memory: { enabled: true, cognitive: true },
  guardrails: { output: ['grounding-guard'] },
});

const answer = await researcher.text('What caused the 2008 financial crisis?');
```

10 lines. Personality, cognitive memory, web search, citation verification, and grounding guardrails are configured declaratively.

### LangGraph (Python)

```python
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain_community.tools import TavilySearchResults

model = ChatAnthropic(model="claude-sonnet-4-20250514")
tools = [TavilySearchResults(max_results=3)]

agent = create_react_agent(model, tools)
result = agent.invoke({
    "messages": [{"role": "user", "content": "What caused the 2008 financial crisis?"}]
})
```

Straightforward. LangGraph inherits access to the LangChain tool ecosystem. No built-in personality, memory decay, or guardrails; those require additional middleware.

### CrewAI (Python)

```python
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

researcher = Agent(
    role="Research Analyst",
    goal="Find comprehensive, well-sourced information",
    backstory="You are a thorough research analyst with 10 years of experience.",
    tools=[SerperDevTool()],
)

task = Task(
    description="What caused the 2008 financial crisis?",
    agent=researcher,
    expected_output="A detailed analysis with sources"
)

crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

The role/goal/backstory metaphor maps naturally to how humans think about team composition. CrewAI has the fastest path from zero to a working multi-agent prototype.

### Mastra (TypeScript)

```typescript
import { Agent } from '@mastra/core';
import { anthropic } from '@ai-sdk/anthropic';

const researcher = new Agent({
  name: 'researcher',
  model: anthropic('claude-sonnet-4-20250514'),
  instructions: 'You are a research assistant.',
  tools: { webSearch: mySearchTool },
});

const result = await researcher.generate('What caused the 2008 financial crisis?');
```

Clean TypeScript API. Mastra connects to [94 providers via the AI SDK](https://mastra.ai/docs) and supports MCP servers for tool integration.

## Architecture deep dive

### AgentOS: Generalized Mind Instances

AgentOS models each agent as a **Generalized Mind Instance** (GMI): a cognitive entity with working memory, personality traits, episodic/semantic/procedural memory stores, and a behavioral adaptation loop. Different from treating agents as stateless function calls with chat history appended.

The GMI manages:

- **Working memory** (7 ± 2 slots, based on [Baddeley's model](https://doi.org/10.1016/S0079-7421(08)60452-1))
- **Episodic memory.** Autobiographical events that decay via [Ebbinghaus forgetting curves](https://doi.org/10.1037/h0069023). Modern replication: [Murre & Dros (2015) PLOS ONE](https://doi.org/10.1371/journal.pone.0120644).
- **Semantic memory.** Durable facts extracted from conversations.
- **Procedural memory.** Learned patterns and preferences.
- **Prospective memory.** Future intentions and commitments.

Eight cognitive mechanisms modulate memory behavior, each backed by published cognitive science:

| Mechanism | Effect | Source |
|-----------|--------|--------|
| Reconsolidation | Retrieved memories drift toward current mood | [Nader, Schiller & LeDoux (2000)](https://doi.org/10.1038/35021052) |
| Retrieval-Induced Forgetting | Retrieving one memory suppresses similar competitors | [Anderson, Bjork & Bjork (1994)](https://doi.org/10.1037/0278-7393.20.5.1063) |
| Involuntary Recall | Random surfacing of old high-vividness memories | [Berntsen (1996)](https://doi.org/10.1002/(SICI)1099-0720(199610)10:5%3C435::AID-ACP395%3E3.0.CO;2-8) |
| Metacognitive FOK | Feeling-of-knowing scoring for tip-of-tongue states | [Hart (1965)](https://doi.org/10.1037/h0022263) |
| Temporal Gist Extraction | Old memories compressed to core assertions | [Reyna & Brainerd (1995)](https://doi.org/10.1006/drev.1995.1002) |
| Schema Encoding | Novel input boosted, familiar patterns encoded efficiently | [Bartlett (1932)](https://doi.org/10.1017/CBO9780511759185) |
| Source Confidence Decay | Agent inferences decay faster than direct observations | [Johnson, Hashtroudi & Lindsay (1993)](https://doi.org/10.1037/0033-2909.114.1.3) |
| Emotion Regulation | Reappraisal + suppression during consolidation | [Gross (1998)](https://doi.org/10.1037/1089-2680.2.3.271) |

The architecture follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)) for cognitive architectures. No other framework implements these mechanisms. LangGraph, CrewAI, and Mastra store chat history. AgentOS agents *remember*. Benchmark numbers backing this claim: [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md) and [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md).

### LangGraph: typed state graphs

LangGraph models agent logic as a [directed graph](https://langchain-ai.github.io/langgraph/) where nodes are computation steps and edges are transitions with conditional routing. State is typed and flows between nodes explicitly.

Key architectural strengths:

- **Checkpointing.** Built-in persistence via MemorySaver, PostgresSaver, or RedisSaver. Enables [time-travel debugging](https://langchain-ai.github.io/langgraph/concepts/persistence/): replay any past state.
- **Cycles.** Unlike pure DAG frameworks, LangGraph supports loops (agent retries, iterative refinement).
- **Sub-graphs.** Compose large systems from smaller graphs. Each sub-graph has its own state schema.
- **Human-in-the-loop.** Built-in interrupt points for human approval before continuing execution.

The tradeoff is verbosity. A simple "search and answer" agent in LangGraph requires defining a state schema, creating nodes, wiring edges, and compiling the graph. For complex multi-step workflows with deterministic branching, the explicitness pays off. For simpler use cases, it is overhead.

### CrewAI: role-based teams

CrewAI uses a [role-playing metaphor](https://docs.crewai.com/) where each agent has a role, goal, and backstory. Tasks are assigned to specific agents. A Crew coordinates execution using one of three process types: sequential, hierarchical, or consensual.

In 2026, CrewAI added [Flows](https://docs.crewai.com/concepts/flows): event-driven workflows using `@start`, `@listen`, and `@router` decorators. Two complementary modes: autonomous crews for open-ended collaboration, and structured flows for deterministic pipelines.

Memory uses ChromaDB for short-term vector storage and SQLite3 for long-term persistence. Entity memory extracts and tracks key entities across conversations. The memory system is simpler than AgentOS (no decay, no reconsolidation, no personality modulation) but sufficient for many production use cases.

### Mastra: TypeScript workflows + AI SDK

Mastra is built on the [Vercel AI SDK](https://sdk.vercel.ai/docs) for model routing and adds a graph-based workflow engine with `.then()`, `.branch()`, and `.parallel()` primitives. [Agent Networks](https://mastra.ai/docs/agents/agent-networks) enable LLM-powered routing between specialized agents.

Mastra's memory system has four tiers:

1. **Message history.** Standard conversation context.
2. **Working memory.** Zod-validated structured state persisted between turns.
3. **Semantic recall.** RAG over past conversations.
4. **Observational Memory.** Automatic summarization at 30,000 tokens (5-40x compression, using background Gemini 2.5 Flash calls). Their [observational-memory research](https://mastra.ai/research/observational-memory) reports 84.23% on LongMemEval-S at gpt-4o reader.

[Mastra Studio](https://mastra.ai/docs/local-dev/mastra-studio) provides a local web-based IDE for testing agents interactively: a developer experience feature no other framework matches.

### Letta (formerly MemGPT): paged memory

[Letta](https://www.letta.com/blog/memgpt-and-letta) is the production successor to [MemGPT](https://arxiv.org/abs/2310.08560) (Packer et al., 2023). The architecture models the LLM as a virtual operating system with paged memory: the LLM explicitly pages context in and out of working memory via tool calls. Letta came out of stealth in [September 2024](https://techcrunch.com/2024/09/23/letta-one-of-uc-berkeleys-most-anticipated-ai-startups-has-just-come-out-of-stealth/). Their published memory benchmark is a custom [Filesystem-based Memory Benchmark](https://www.letta.com/blog/benchmarking-ai-agent-memory) rather than LongMemEval; cross-comparison is therefore approximate.

## Multi-agent comparison

| Capability | AgentOS | LangGraph | CrewAI | Mastra |
|------------|---------|-----------|--------|--------|
| **Sequential execution** | `strategy: 'sequential'` | Explicit edges | `process: 'sequential'` | `.then()` chains |
| **Parallel execution** | `strategy: 'parallel'` | Parallel branches | Via Flows | `.parallel()` |
| **Debate/adversarial** | `strategy: 'debate'` | Custom nodes | Not built-in | Not built-in |
| **Review loops** | `strategy: 'review-loop'` | Cyclic graphs | Via Flows | `.branch()` loops |
| **Hierarchical** | `strategy: 'hierarchical'` | Sub-graphs | `process: 'hierarchical'` | Agent Networks |
| **DAG/graph** | `strategy: 'graph'` with `dependsOn` | Native state graphs | Via Flows | Native graph engine |
| **Shared memory** | `memory: { shared: true }` | Shared state object | Shared crew memory | Working memory |
| **Inter-agent messaging** | AgentCommunicationBus | Via shared state | Task delegation | Network routing |
| **Human-in-the-loop** | HITL approval gates | Built-in interrupts | Not built-in | `suspend()`/`resume()` |

AgentOS provides 6 built-in strategies that cover the most common multi-agent patterns. LangGraph gives the most low-level control but requires you to implement each pattern from scratch. CrewAI's role-based metaphor is the most intuitive for non-technical stakeholders. Mastra's graph engine is clean and composable.

## Safety and guardrails

Where the frameworks diverge most dramatically.

| Safety Feature | AgentOS | LangGraph | CrewAI | Mastra |
|---------------|---------|-----------|--------|--------|
| **PII redaction** | 4-tier (regex + NLP + NER + LLM) | Third-party | Not built-in | Not built-in |
| **Prompt injection defense** | ONNX BERT classifiers | Third-party | Not built-in | Not built-in |
| **Content policy** | 8 categories, LLM rewrite/block | Third-party | Not built-in | Not built-in |
| **Code safety** | 25 OWASP regex rules | Not built-in | Not built-in | Not built-in |
| **Grounding guard** | NLI-based claim verification | Not built-in | Not built-in | Not built-in |
| **Cost caps** | CostGuard with hard limits | Not built-in | Not built-in | Not built-in |
| **Security tiers** | 5 levels (dangerous → paranoid) | Not built-in | Not built-in | Not built-in |

AgentOS ships 6 guardrail packs covering PII redaction, ML-based classifiers (toxicity, injection, jailbreak), topicality enforcement, code safety scanning, grounding verification, and content policy rewriting. Five security tiers (`dangerous` > `permissive` > `balanced` > `strict` > `paranoid`) control which tools and guardrails are active.

CrewAI has [documented cost control issues](https://www.speakeasy.com/blog/ai-agent-framework-comparison): a single Gemini run reportedly cost $414, and a stop-sequence bug caused 10x cost overruns ($1.00 per call vs $0.10 expected). Neither CrewAI nor Mastra have built-in token budget caps.

LangGraph defers safety to middleware and the LangChain ecosystem. Guardrails exist as third-party integrations, not first-class features.

## Deployment and operations

| | AgentOS | LangGraph | CrewAI | Mastra |
|---|---------|-----------|--------|--------|
| **Install** | `npm install @framers/agentos` | `pip install langgraph` | `pip install crewai` | `npm install @mastra/core` |
| **Hosting** | Self-hosted | LangGraph Cloud ($0.001/node) | AMP Cloud (from $25/mo) | Mastra Cloud (beta) / serverless |
| **Serverless** | Yes | [No (not Vercel/CF compatible)](https://www.speakeasy.com/blog/ai-agent-framework-comparison) | AWS Lambda patterns | Yes (Vercel, Cloudflare, Netlify) |
| **Observability** | OpenTelemetry native | LangSmith | AMP tracing | Langfuse, LangSmith, Sentry, OTel |
| **Key rotation** | Built-in (comma-separated env vars) | Not built-in | Not built-in | Not built-in |

Mastra has the strongest serverless story with first-class deployers for Vercel, Cloudflare Workers, and Netlify. AgentOS is self-hosted but runs anywhere Node.js runs. LangGraph requires its own cloud platform for hosted execution; it is [not compatible with serverless platforms like Vercel or Cloudflare](https://www.speakeasy.com/blog/ai-agent-framework-comparison).

## Unique features per framework

### Only in AgentOS

- **HEXACO personality traits** that modulate memory, retrieval, and response style ([hexaco.org](https://hexaco.org/hexaco-online))
- **8 cognitive memory mechanisms** with published neuroscience citations ([CoALA framework](https://arxiv.org/abs/2309.02427))
- **37 channel adapters** (Telegram, WhatsApp, Discord, Slack, SMS, and more)
- **Full voice pipeline** (STT, TTS, VAD) with telephony (Twilio, Telnyx, Plivo)
- **Runtime tool forging.** Agents create new tools at runtime and promote them.
- **88 curated skill definitions** for agent capabilities
- **API key rotation** with automatic quota detection and failover

### Only in LangGraph

- **Time-travel debugging.** Replay any past checkpoint state.
- **LangSmith integration.** Production tracing and evaluation.
- **LangGraph Cloud.** Managed execution platform.
- **Sub-graph composition.** Hierarchical graph nesting.

### Only in CrewAI

- **Role/goal/backstory metaphor.** Most intuitive agent definition.
- **Flows.** Event-driven workflow engine alongside autonomous crews.
- **100,000+ certified developers** through learn.crewai.com
- **Enterprise AMP Suite** with on-prem deployment option

### Only in Mastra

- **Mastra Studio.** Local web IDE for interactive agent testing.
- **Observational Memory.** Automatic 5-40x context compression ([84.23% LongMemEval-S](https://mastra.ai/research/observational-memory)).
- **94 LLM providers** through AI SDK integration
- **MCP client and server.** Both sides of the Model Context Protocol.
- **Server adapters** for Express, Hono, Fastify, Koa, Next.js, Astro

## Decision framework

**Choose AgentOS if:**

- Your agent needs consistent personality across thousands of conversations
- Memory behavior matters; agents should remember, forget, and reconsolidate
- You deploy to messaging channels (Telegram, WhatsApp, Discord, Slack)
- Safety is non-negotiable: PII redaction, injection defense, content policy enforcement
- Voice is part of the product
- You build in TypeScript and want a cognitive runtime, not just an orchestration layer

**Choose LangGraph if:**

- You need complex workflows with explicit state management and conditional branching
- Your team writes Python and uses the LangChain ecosystem
- Time-travel debugging and checkpoint replay are important for your workflow
- You want a managed cloud platform (LangGraph Cloud) for hosted execution

**Choose CrewAI if:**

- You want the fastest path to a working multi-agent prototype
- The role-based team metaphor matches how your organization thinks
- Your team writes Python
- You need enterprise support with SLAs (AMP Suite)
- Community size matters; CrewAI has the largest tutorial ecosystem

**Choose Mastra if:**

- You are a TypeScript team deploying to serverless platforms (Vercel, Cloudflare)
- You need maximum LLM provider flexibility (94 providers via AI SDK)
- Mastra Studio's interactive testing experience appeals to your workflow
- You want MCP integration for connecting agents to external tools
- Next.js or React integration is a priority

## When NOT to use AgentOS

- **You need the largest ecosystem.** LangGraph/LangChain and CrewAI have 10-100x more community content, tutorials, and Stack Overflow answers. If you need to Google your way through problems, choose a framework with more documentation surface area.
- **You are a Python shop.** AgentOS is TypeScript-first. Use LangGraph or CrewAI.
- **You need enterprise support today.** CrewAI and LangChain offer enterprise tiers with SLAs. AgentOS is open-source with community support.
- **You need serverless-first deployment.** Mastra has purpose-built deployers for Vercel and Cloudflare. AgentOS runs on any Node.js host but does not have managed serverless deployment.

## Getting started with AgentOS

```bash
npm install @framers/agentos
```

```typescript
import { generateText } from '@framers/agentos';

const { text } = await generateText({
  provider: 'openai',
  prompt: 'Explain quantum entanglement.',
});

console.log(text);
```

- [Documentation](https://docs.agentos.sh): getting started, API reference, architecture guides
- [GitHub](https://github.com/framersai/agentos): source code, issues, contributing
- [Discord](https://discord.gg/usEkfCeQxs): community chat and support
- [npm](https://www.npmjs.com/package/@framers/agentos): package registry

---

## Sources

- [Speakeasy: Agent Framework Comparison (2026)](https://www.speakeasy.com/blog/ai-agent-framework-comparison). Benchmark data, DX scores, cost analysis.
- [Firecrawl: Best Open Source Agent Frameworks (2026)](https://www.firecrawl.dev/blog/best-open-source-agent-frameworks). GitHub stars, download metrics, deployment data.
- [GuruSup: Best Multi-Agent Frameworks in 2026](https://gurusup.com/blog/best-multi-agent-frameworks-2026). Architecture comparison, decision framework.
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/). State graphs, checkpointing, sub-graphs.
- [CrewAI Documentation](https://docs.crewai.com/). Crews, flows, memory, enterprise.
- [Mastra Documentation](https://mastra.ai/docs). Agents, workflows, studio, MCP.
- [AgentOS Documentation](https://docs.agentos.sh). GMI architecture, cognitive memory, guardrails.
- [Sumers et al. (2023). Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427).
- [Packer et al. (2023). MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560).

*Framework features and star counts change. Check each project's documentation for the latest information.*

**AgentOS** is built by [Manic Agency LLC](https://manic.agency) / [Frame.dev](https://frame.dev). See [Wilds.ai](https://wilds.ai) for AI game worlds powered by AgentOS.
