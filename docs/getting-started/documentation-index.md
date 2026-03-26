---
title: 'Documentation Index'
sidebar_position: 1
---

---

## Documentation Index

### Getting Started

- [**Getting Started Guide**](./GETTING_STARTED.md) — Install, env setup, and 3 levels (1 line → 3 lines → 5 lines)
- [**README**](/getting-started/documentation-index) — Installation and quick start
- [**High-Level API**](/getting-started/high-level-api) — `generateText()`, `streamText()`, `generateImage()`, and `agent()`
- [**Examples Cookbook**](./EXAMPLES.md) — 8 complete runnable examples (customer service, research team, blog publisher, etc.)
- [**CHANGELOG**](/getting-started/changelog) — Version history and release notes

### Architecture & Core Concepts

- [**Architecture Overview**](/architecture/system-architecture) — Complete system architecture and design principles

### Features & Capabilities

#### Planning & Orchestration

- [**Orchestration Guide**](./ORCHESTRATION.md) — Graphs, workflows, missions, voice nodes, checkpointing, YAML authoring
- [**Unified Orchestration Layer**](./UNIFIED_ORCHESTRATION.md) — One runtime, three authoring APIs (`AgentGraph`, `workflow()`, `mission()`)
- [**AgentGraph**](./AGENT_GRAPH.md) — Full graph builder with typed nodes, conditional edges, and subgraphs
- [**workflow() DSL**](./WORKFLOW_DSL.md) — Deterministic DAG pipelines with branching and parallel joins
- [**mission() API**](./MISSION_API.md) — Goal-first orchestration driven by the PlanningEngine
- [**Checkpointing**](./CHECKPOINTING.md) — Resume, fork, replay, and memory consistency semantics
- [**Planning Engine**](/features/planning-engine) — Multi-step task planning and execution
- [**Human-in-the-Loop**](/features/human-in-the-loop) — Approval workflows and human oversight
- [**Agent Communication**](/features/agent-communication) — Inter-agent messaging and coordination

#### Safety & Security

- [**Guardrails System**](/features/guardrails) — Two-phase guardrail dispatch, built-in packs (PII, ML classifiers, topicality, code safety, grounding), and folder-level filesystem permissions
- [**Safety Primitives**](/features/safety-primitives) — Circuit breakers, cost guards, stuck detection, and tool execution guards

#### Memory & Storage

- [**Cognitive Memory Guide**](./COGNITIVE_MEMORY_GUIDE.md) — Working memory, encoding, retrieval, consolidation, prospective memory
- [**Cognitive Memory System**](/features/cognitive-memory) — Personality-modulated memory with Ebbinghaus decay, Baddeley's working memory, spreading activation, and HEXACO-driven encoding
- [**RAG Memory Configuration**](/features/rag-memory) — Vector storage and retrieval setup
- [**SQL Storage Quickstart**](/features/sql-storage) — Database integration guide
- [**Client-Side Storage**](/features/client-side-storage) — Browser-based persistence
- [**Immutable Agents**](/features/immutable-agents) — Sealing lifecycle, toolset pinning, secret rotation, and soft-forget
- [**Provenance Guide**](./PROVENANCE.md) — HashChain, ChainVerifier, BundleExporter, proof levels, external anchors
- [**Provenance & Immutability**](/features/provenance-immutability) — Sealed storage policy, signed ledger, and anchoring

#### AI & LLM

- [**Structured Output**](/features/structured-output) — JSON schema validation and structured generation
- [**Evaluation Guide**](./EVALUATION.md) — Test cases, graders, LLM-as-judge, A/B testing, experiment tracking
- [**Evaluation Framework**](/features/evaluation-framework) — Testing, scoring, and quality assurance
- [**Image Generation Guide**](./IMAGE_GENERATION.md) — 5 providers (OpenAI, Stability, Replicate, OpenRouter, local SD)
- [**Capability Discovery Guide**](./DISCOVERY.md) — Three-tier semantic discovery, CAPABILITY.yaml, meta-tool
- [**Capability Discovery**](./CAPABILITY_DISCOVERY.md) — Full architecture reference
- [**Cost Optimization**](/features/cost-optimization) — Token usage and API cost management

#### Extensions & Customization

- [**RFC Extension Standards**](/extensions/extension-standards) — Extension development guidelines
- [**Recursive Self-Building Agents**](/features/recursive-self-building) — Advanced agent patterns
- [**Skills (SKILL.md)**](/skills/skill-format) — Prompt modules loaded from directories/registries

#### Channels & Social

- [**Channels Guide**](./CHANNELS.md) — All 37 channels with setup for Discord, Slack, Telegram, Twitter, WhatsApp
- [**Social Posting Guide**](./SOCIAL_POSTING.md) — SocialPostManager, content adaptation, scheduling, analytics

### Platform & Infrastructure

- [**Platform Support**](/architecture/platform-support) — Supported environments and requirements
- [**Observability (OpenTelemetry)**](/architecture/observability) — Tracing, metrics, and log correlation/export (opt-in)
- [**Logging (Pino + OpenTelemetry)**](/architecture/logging) — Structured logs, trace correlation, and OTEL LogRecord export (opt-in)

### Ecosystem

- [**Ecosystem**](/getting-started/ecosystem) — Related packages, extensions, and resources
- [**Releasing**](/getting-started/releasing) — Automated release process

### API Reference

- [**TypeDoc API**](/api/) — Auto-generated API documentation

---

## Quick Links

| Resource    | Link                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| Website     | [agentos.sh](https://agentos.sh)                                       |
| GitHub      | [framersai/agentos](https://github.com/framersai/agentos)              |
| npm         | [@framers/agentos](https://www.npmjs.com/package/@framers/agentos)     |
| Issues      | [GitHub Issues](https://github.com/framersai/agentos/issues)           |
| Discussions | [GitHub Discussions](https://github.com/framersai/agentos/discussions) |

---

## How to Use This Documentation

1. **New to AgentOS?** Start with the [README](/getting-started/documentation-index) for installation and basic usage
2. **Understanding the system?** Read the [Architecture Overview](/architecture/system-architecture)
3. **Building features?** Check the relevant feature guide (Planning, HITL, Guardrails, etc.)
4. **API details?** Browse the [TypeDoc API Reference](/api/)
5. **Troubleshooting?** See [Platform Support](/architecture/platform-support)

---
