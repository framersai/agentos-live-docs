---
title: 'AgentOS Documentation'
sidebar_position: 0
slug: /documentation
---

# AgentOS Documentation

[![npm version](https://img.shields.io/npm/v/@framers/agentos?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/@framers/agentos)
[![CI](https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?branch=master&style=flat-square&logo=github&label=CI)](https://github.com/framersai/agentos/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/tests-3%2C866%2B_passed-2ea043?style=flat-square&logo=vitest&logoColor=white)](https://github.com/framersai/agentos/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/framersai/agentos/graph/badge.svg)](https://codecov.io/gh/framersai/agentos)

Modular orchestration runtime for AI agent systems.

```bash
npm install @framers/agentos
```

## Quick Navigation

### Start Here

- [High-Level API](/getting-started/high-level-api) — `generateText()`, `streamText()`, `generateImage()`, and `agent()`
- [Documentation Index](/getting-started/documentation-index) — Installation, architecture, and core guides
- [TypeDoc API](/api/) — Generated API reference for the full runtime

### Getting Started

- [Documentation Index](/getting-started/documentation-index) — Installation and quick start
- [High-Level API](/getting-started/high-level-api) — `generateText()`, `streamText()`, `generateImage()`, and `agent()`
- [Ecosystem](/getting-started/ecosystem) — Related packages and resources
- [Releasing](/getting-started/releasing) — Version history and release process

### Architecture & Core

- [System Architecture](/architecture/system-architecture) — System design and core internals
- [Platform Support](/architecture/platform-support) — Supported environments
- [Tool Calling & Lazy Loading](/architecture/tool-calling-and-loading) — Extension loading, schema-on-demand, and descriptor IDs
- [Observability (OpenTelemetry)](/architecture/observability) — Traces, metrics, and OTEL-compatible logging (opt-in)
- [Logging (Pino + OpenTelemetry)](/architecture/logging) — Structured logs, trace correlation, and OTEL LogRecord export (opt-in)

### Planning & Orchestration

- [Unified Orchestration Layer](/features/unified-orchestration) — One runtime, three authoring APIs
- [AgentGraph](/features/agent-graph) — Explicit graph builder with node/edge control
- [workflow() DSL](/features/workflow-dsl) — Deterministic DAG pipelines
- [mission() API](/features/mission-api) — Goal-first orchestration
- [Checkpointing](/features/checkpointing) — Resume, replay, and forking
- [Planning Engine](/features/planning-engine) — Multi-step task planning
- [Human-in-the-Loop](/features/human-in-the-loop) — Approval workflows
- [Agent Communication](/features/agent-communication) — Inter-agent messaging
- [Multi-Agent Agency API](/features/agency-api) — agency(), strategies (sequential, parallel, graph, hierarchical), dependsOn

### Safety & Security

- [Guardrails](/features/guardrails) — Content filtering, PII redaction, and folder-level filesystem permissions
- [Creating Custom Guardrails](/features/creating-guardrails) — Building and composing guardrail pipelines
- [Safety Primitives](/features/safety-primitives) — Circuit breakers, cost guards, stuck detection, and tool execution guards
- [Provenance & Immutability](/features/provenance-immutability) — Signed event ledger, soft-delete tombstones, revision history, and autonomy guard
- [Immutable Agents](/features/immutable-agents) — Toolset pinning, secret rotation, and soft-forget memory patterns

### Memory & Storage

- [Cognitive Memory](/features/cognitive-memory) — Personality-modulated memory, retrieval, and consolidation
- [Working Memory](/features/working-memory) — Markdown notes and Baddeley slot-model working memory
- [RAG Memory](/features/rag-memory) — Vector storage and retrieval
- [Multimodal RAG](/features/multimodal-rag) — Image and audio embeddings
- [SQL Storage](/features/sql-storage) — Database adapters
- [Client-Side Storage](/features/client-side-storage) — Browser and local persistence

### Capabilities & AI

- [Capability Discovery](/features/capability-discovery) — Tiered semantic discovery (~90% token reduction)
- [Emergent Capabilities](/features/emergent-capabilities) — Runtime tool creation, sandboxed execution, and LLM-as-judge verification
- [Deep Research](/features/deep-research) — Multi-source research pipeline with query classification
- [Structured Output](/features/structured-output) — JSON schema validation
- [Evaluation Framework](/features/evaluation-framework) — Testing and benchmarks
- [Cost Optimization](/features/cost-optimization) — Token usage and caching

### Advanced

- [Recursive Self-Building](/features/recursive-self-building) — Self-modifying agent patterns
- [Agency Collaboration](/features/agency-collaboration) — Multi-agent coordination

### Voice & IVR

- [Voice Pipeline](/features/voice-pipeline) — End-to-end voice conversation architecture, VAD, barge-in, and turn detection
- [Speech Providers](/features/speech-providers) — Full catalog of STT, TTS, VAD, and wake-word providers
- [Telephony Providers](/features/telephony-providers) — Twilio, Telnyx, Plivo webhook setup and call management

### Skills

- [Skills Overview](/skills/overview) — SKILL.md format, loading, and semantic discovery integration
- [Skills Format](/skills/skill-format) — Authoring SKILL.md files
- [Skills Extension](/skills/skills-extension) — Installing and managing skill packs
- [Skills Registry](/skills/agentos-skills-registry) — Browsing and installing curated skills

### Extensions

- [Extensions Overview](/extensions/overview) — Available extensions catalog
- [How Extensions Work](/extensions/how-extensions-work) — Loading and lifecycle
- [Extension Architecture](/extensions/extension-architecture) — Building custom extensions
- [Auto-Loading](/extensions/auto-loading) — Automatic extension discovery
- [Extension Standards (RFC)](/extensions/extension-standards) — Interface contracts and versioning
- **Safety**: [PII Redaction](/extensions/built-in/pii-redaction), [Code Safety](/extensions/built-in/code-safety), [Grounding Guard](/extensions/built-in/grounding-guard), [ML Classifiers](/extensions/built-in/ml-classifiers), [Topicality](/extensions/built-in/topicality)
- **Research**: [Web Search](/extensions/built-in/web-search), [Web Browser](/extensions/built-in/web-browser), [News Search](/extensions/built-in/news-search)
- **Media**: [Voice Synthesis](/extensions/built-in/voice-synthesis), [Image Search](/extensions/built-in/image-search), [Giphy](/extensions/built-in/giphy)
- **Integrations**: [Auth](/extensions/built-in/auth), [Telegram](/extensions/built-in/telegram), [CLI Executor](/extensions/built-in/cli-executor)

### API Reference

- [TypeDoc API](/api/) — Auto-generated API documentation
