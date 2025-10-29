# AgentOS System Guide

This directory contains the TypeScript source for @agentos/core. Use it as the developer-friendly companion to [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md), which documents the runtime at a higher level.

## Directory layout

`
src/
├─ api/                   # Public facade (AgentOS, orchestrator, streaming bridge)
├─ cognitive_substrate/   # Personas, working memory, GMI manager
├─ core/                  # Conversation, tools, LLM providers, streaming, audio utilities
├─ rag/                   # Retrieval augmentation + embedding helpers
├─ memory_lifecycle/      # Policies and manager for long-term memory actions
├─ services/              # Adapter interfaces (auth, subscription, user storage)
├─ stubs/                 # Lightweight replacements for heavy deps (e.g. Prisma)
├─ utils/                 # Error helpers and shared constants
└─ server/                # Minimal sample HTTP server exposing AgentOS endpoints
`

## Runtime lifecycle

1. **Initialise** (AgentOS.initialize)
   - Accepts AgentOSConfig and wires the model provider manager, prompt engine, tool orchestrator, conversation manager, streaming manager, and GMI manager.
   - Creates a default LLMUtilityAI when none is provided.

2. **Handle a turn** (AgentOS.processRequest)
   - Registers an AsyncStreamClientBridge with the streaming manager.
   - Delegates orchestration to AgentOSOrchestrator, which yields AgentOSResponse chunks (progress, deltas, tool calls/results, UI commands, final summary, errors).
   - Host code consumes the async generator and forwards chunks over HTTP/WebSocket.

3. **Tool execution**
   - ToolOrchestrator stores tool definitions and enforces capability rules.
   - ToolExecutor validates arguments via Ajv and returns structured results or errors.

4. **Personas & GMIs**
   - GMIManager loads persona definitions, enforces subscription tiers, and hydrates conversation contexts.
   - ConversationManager tracks metadata such as model overrides, API keys, and persona IDs per session.

## Patterns to know

- **Streaming first** – every orchestration path is expressed as an async generator so the same code powers HTTP streaming and direct library use.
- **Interface driven** – adapters (IAuthService, ISubscriptionService, IToolPermissionManager, etc.) keep the runtime decoupled from any specific backend.
- **Structured errors** – modules throw GMIError/AgentOSServiceError derivatives with machine-readable codes.

## Sample server

packages/agentos/src/server/AgentOSServer.ts demonstrates a dependency-light HTTP server that exposes /health, /api/agentos/personas, and /api/agentos/chat. See [docs/AGENTOS_SERVER_API.md](../../docs/AGENTOS_SERVER_API.md) for endpoint details.

## Working on the source

1. Install dependencies (
pm install or leverage the workspace root with pnpm install).
2. Run 
pm run build (or pnpm --filter @agentos/core build) before consuming the package elsewhere.
3. Update public docs when changing exported types (packages/agentos/README.md, docs/ARCHITECTURE.md).
4. Stick to ASCII in source files unless there is a strong reason not to.

For deeper context, read docs/ARCHITECTURE.md (package internals) and docs/AGENTOS_REINTEGRATION_NOTES.md (integration with the Voice Chat Assistant backend).
