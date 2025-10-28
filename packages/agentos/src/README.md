# AgentOS System Guide

This directory contains the TypeScript source for `@agentos/core`. The goal is to keep a single, implementation-focused reference that explains how the major subsystems fit together without the 4k-line wall of text that previously lived here.

## Top-Level Layout

```
src/
+-- api/                  # Public facade (`AgentOS`, orchestrator, streaming bridge)
+-- cognitive_substrate/  # Generalised Mind Instances (personas, memory, reasoning)
+-- core/                 # Shared services (conversation, tools, LLM providers, streaming)
+-- rag/                  # Retrieval augmentation + embedding helpers
+-- services/             # Adapter interfaces for auth, subscriptions, etc.
+-- stubs/                # Lightweight shims for prisma + other heavy deps during local dev
+-- utils/                # Error helpers and shared constants
```

## Lifecycle Overview

1. **Initialisation** (`AgentOS.initialize`)
   - Loads config (`AgentOSConfig`).
   - Builds the model provider manager.
   - Creates a default `LLMUtilityAI` when a custom utility service is not provided.
   - Bootstraps the prompt engine, tool permission manager, tool executor, tool orchestrator, conversation manager, streaming manager, and GMI manager.
   - Wires the `AgentOSOrchestrator` with the managers above.

2. **Processing a turn** (`AgentOS.processRequest`)
   - Normalises persona IDs and registers a temporary `AsyncStreamClientBridge` with the streaming manager.
   - Delegates turn orchestration to `AgentOSOrchestrator`, which streams `AgentOSResponseChunk` objects (text deltas, tool calls/results, UI commands, errors, final summary) via the streaming manager.
   - Converts the push-based stream back into an async generator so HTTP handlers can `for await` chunks.

3. **Tool orchestration**
   - `ToolOrchestrator` manages the in-memory registry, permission checks, and execution routing.
   - `ToolExecutor` validates arguments with Ajv, executes tool implementations, and reports structured results/errors back to the orchestrator.

4. **GMI management**
   - `GMIManager` loads persona definitions, enforces subscription tiers, hydrates conversation contexts, and lazily creates/reuses GMI instances per session.
   - Conversation metadata (model overrides, API keys, persona IDs) is tracked inside `ConversationContext` objects via `ConversationManager`.

## Notable Patterns

- **Streaming-first**: Every orchestration path is expressed as an async generator so the same code path powers HTTP streaming routes and direct library consumption.
- **Interface-driven**: Adapters (`IAuthService`, `ISubscriptionService`, `IToolPermissionManager`, etc.) keep the runtime decoupled from the Voice Chat Assistant backend. Stubs are provided under `src/services/**` for local development.
- **Type-safe errors**: All modules throw `GMIError` subclasses with machine-readable codes, making it easier to surface structured errors in UI clients.

## Runtime Contracts`n`n- **Sample server:** packages/agentos/src/server/AgentOSServer.ts shows a dependency-free HTTP server with /health, /api/agentos/personas, and /api/agentos/chat endpoints. See docs/AGENTOS_SERVER_API.md for details.`n`n

- **Subscription enforcement**: `GMIManager` now relies on `ISubscriptionService.getUserSubscription(userId)` plus `listTiers()` to resolve persona/tool access. Implementations must return the user's tier (or `null`) and enumerate tier metadata so the manager can compare `level` thresholds.
- **Memory lifecycle**: `MemoryLifecycleManagerConfiguration` supports optional `action.llmModelForSummary` overrides and a global `defaultSummarizationModelId`. The manager records every action/negotiation in its enforcement report to make downstream auditing easier.
- **RAG ingestion**: `IRetrievalAugmentor` implementations should populate `effectiveDataSourceIds` in their ingestion results so downstream tooling knows which stores were touched. The default augmentor already does this; custom drivers should follow the same shape.

## Working on the Source

1. Install dependencies inside the package directory (`npm install`).
2. Run `npm run build` (or `npm --prefix packages/agentos run build` from the workspace root) before consuming the package elsewhere.
3. When touching public APIs, update `packages/agentos/README.md` and the relevant docs under `docs/`.
4. Keep new modules ASCII-only unless there is a strong reason to do otherwise.

For a more detailed migration roadmap, see `docs/AGENTOS_EXTRACTION_PLAN.md` and `docs/AGENTOS_REINTEGRATION_NOTES.md`.

