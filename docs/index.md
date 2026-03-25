---
title: 'AgentOS Documentation'
sidebar_position: 0
slug: /
---

# AgentOS Documentation

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

### Safety & Security

- [Guardrails](/features/guardrails) — Content filtering, PII redaction, and folder-level filesystem permissions
- [Safety Primitives](/features/safety-primitives) — Circuit breakers, cost guards, stuck detection, and tool execution guards

### Memory & Storage

- [Cognitive Memory](/features/cognitive-memory) — Personality-modulated memory, retrieval, and consolidation
- [RAG Memory](/features/rag-memory) — Vector storage and retrieval
- [SQL Storage](/features/sql-storage) — Database adapters
- [Client-Side Storage](/features/client-side-storage) — Browser and local persistence

### AI & LLM

- [Speech Runtime](/features/speech-runtime) — Unified STT, TTS, VAD, and provider abstraction
- [Structured Output](/features/structured-output) — JSON schema validation
- [Evaluation Framework](/features/evaluation-framework) — Testing and benchmarks
- [Cost Optimization](/features/cost-optimization) — Token usage and caching

### Advanced

- [Recursive Self-Building](/features/recursive-self-building) — Self-modifying agent patterns
- [Agency Collaboration](/features/agency-collaboration) — Multi-agent coordination

### Voice & IVR

- [Voice Pipeline](/features/voice-pipeline) — End-to-end voice conversation architecture
- [Speech Providers](/features/speech-providers) — STT and TTS provider catalog and configuration
- [Telephony Providers](/features/telephony-providers) — Twilio, Telnyx, Plivo, and SIP integration

### Skills & Capability Discovery

- [Skills Overview](/skills/overview) — SKILL.md format, loading, and semantic discovery integration

### Extensions

- [Extensions Overview](/extensions/overview) — Available extensions catalog
- [How Extensions Work](/extensions/how-extensions-work) — Loading and configuration
- [Extension Architecture](/extensions/extension-architecture) — Building custom extensions
- [Auto-Loading](/extensions/auto-loading) — Automatic extension discovery
- **Official**: [Web Search](/extensions/built-in/web-search), [Telegram](/extensions/built-in/telegram), [Speech Runtime](/extensions/built-in/speech-runtime), [Voice Synthesis](/extensions/built-in/voice-synthesis), [CLI Executor](/extensions/built-in/cli-executor), [Image Search](/extensions/built-in/image-search), [News Search](/extensions/built-in/news-search), [Giphy](/extensions/built-in/giphy), [Web Browser](/extensions/built-in/web-browser), [Auth](/extensions/built-in/auth)

### API Reference

- [TypeDoc API](/api/) — Auto-generated API documentation
