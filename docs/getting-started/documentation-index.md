---
title: 'Documentation Index'
sidebar_position: 1
---

---

## Documentation Index

### Getting Started

- [**README**](/docs/getting-started/documentation-index) — Installation and quick start
- [**CHANGELOG**](/docs/getting-started/changelog) — Version history and release notes

### Architecture & Core Concepts

- [**Architecture Overview**](/docs/architecture/system-architecture) — Complete system architecture and design principles

### Features & Capabilities

#### Planning & Orchestration

- [**Planning Engine**](/docs/features/planning-engine) — Multi-step task planning and execution
- [**Human-in-the-Loop**](/docs/features/human-in-the-loop) — Approval workflows and human oversight
- [**Agent Communication**](/docs/features/agent-communication) — Inter-agent messaging and coordination

#### Safety & Security

- [**Guardrails System**](/docs/features/guardrails) — Two-phase guardrail dispatch, built-in packs (PII, ML classifiers, topicality, code safety, grounding), and folder-level filesystem permissions
- [**Safety Primitives**](/docs/features/safety-primitives) — Circuit breakers, cost guards, stuck detection, and tool execution guards

#### Memory & Storage

- [**Cognitive Memory System**](/docs/features/cognitive-memory) — Personality-modulated memory with Ebbinghaus decay, Baddeley's working memory, spreading activation, and HEXACO-driven encoding
- [**RAG Memory Configuration**](/docs/features/rag-memory) — Vector storage and retrieval setup
- [**SQL Storage Quickstart**](/docs/features/sql-storage) — Database integration guide
- [**Client-Side Storage**](/docs/features/client-side-storage) — Browser-based persistence
- [**Immutable Agents**](/docs/features/immutable-agents) — Sealing lifecycle, toolset pinning, secret rotation, and soft-forget
- [**Provenance & Immutability**](/docs/features/provenance-immutability) — Sealed storage policy, signed ledger, and anchoring

#### AI & LLM

- [**Structured Output**](/docs/features/structured-output) — JSON schema validation and structured generation
- [**Evaluation Framework**](/docs/features/evaluation-framework) — Testing, scoring, and quality assurance
- [**Cost Optimization**](/docs/features/cost-optimization) — Token usage and API cost management

#### Extensions & Customization

- [**RFC Extension Standards**](/docs/extensions/extension-standards) — Extension development guidelines
- [**Recursive Self-Building Agents**](/docs/features/recursive-self-building) — Advanced agent patterns
- [**Skills (SKILL.md)**](/docs/skills/skill-format) — Prompt modules loaded from directories/registries

### Platform & Infrastructure

- [**Platform Support**](/docs/architecture/platform-support) — Supported environments and requirements
- [**Observability (OpenTelemetry)**](/docs/architecture/observability) — Tracing, metrics, and log correlation/export (opt-in)
- [**Logging (Pino + OpenTelemetry)**](/docs/architecture/logging) — Structured logs, trace correlation, and OTEL LogRecord export (opt-in)

### Ecosystem

- [**Ecosystem**](/docs/getting-started/ecosystem) — Related packages, extensions, and resources
- [**Releasing**](/docs/getting-started/releasing) — Automated release process

### API Reference

- [**TypeDoc API**](/docs/api/) — Auto-generated API documentation

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

1. **New to AgentOS?** Start with the [README](/docs/getting-started/documentation-index) for installation and basic usage
2. **Understanding the system?** Read the [Architecture Overview](/docs/architecture/system-architecture)
3. **Building features?** Check the relevant feature guide (Planning, HITL, Guardrails, etc.)
4. **API details?** Browse the [TypeDoc API Reference](/docs/api/)
5. **Troubleshooting?** See [Platform Support](/docs/architecture/platform-support)

---
