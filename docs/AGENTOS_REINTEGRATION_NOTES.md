# AgentOS Reintegration Notes

> Living document for understanding the current Voice Chat Assistant architecture, the legacy AgentOS implementation, and the path to reintegrate the richer backend that lives on the `dev` branch.

## Source Material Reviewed

- `README.md` – product overview, stack, and API surface.
- `docs/ARCHITECTURE.md` – client/server breakdown, middleware, data flow.
- `docs/CREATING_NEW_AGENT.md` – frontend agent mini-app architecture, tool-calling expectations.
- `docs/DESIGN_SYSTEM.md` & `docs/REACTIVE-SYSTEM.md` – UI/UX, theme, and reactive state cues that AgentOS integrations must respect.
- `docs/PLANS_AND_BILLING.md`, `docs/SAAS_STARTER_SETUP.md`, `docs/SIGNUP_BILLING_IMPLEMENTATION_PLAN.md`, `docs/SUPABASE_STRIPE_SETUP.md` – auth + billing flows that AgentOS services must interoperate with.
- `docs/TTS_OPTIMIZATION_GUIDE.md` – audio/voice services that can trigger AgentOS tool calls.
- `CONFIGURATION.md`, `LANGUAGE_AND_CONTEXT_DOCUMENTATION.md`, `PRODUCTION_SETUP.md`, `deploy-vercel.md` – operational requirements, env vars, and deployment flows.

## Current Architecture Snapshot (master branch)

- **Frontend**: Vue 3 + Vite + Tailwind with composition state, Pinia stores, Supabase client optionality, and agent “miniapps” orchestrated via `agent.service.ts`.
- **Backend**: Express + TypeScript modularized under `backend/src/features/*`, with `optionalAuth` → `auth` middleware stack, Supabase mirroring, rate limiting, billing, chat, speech, diagram, and TTS services.
- **Memory Strategy**: Dual-layer (global demo memory + per-user memory) governed by configurable context strategies (`LANGUAGE_AND_CONTEXT_DOCUMENTATION.md`) plus plan-based allowances (`shared/planCatalog.ts`).
- **Billing & Auth**: Supabase + Stripe/Lemon Squeezy flows, `app_users` table augmented with `supabase_user_id`, subscription metadata, and checkout session tracking.
- **Realtime Voice**: Browser + Whisper STT, hybrid TTS pipeline (cache, chunker, Opus output) with ambient reactive UI feedback loops.

## AgentOS State on master

- `backend/agentos/api/AgentOS.ts` exposes a placeholder class with manual `initialize`/`processInput` stubs; no wiring into the live Express app beyond basic scaffolding.
- Server folder contains Express-like middleware, routes, and websocket shells, but they are not hooked into the current backend features (auth, memory, billing, or chat) and still assume legacy project structure.
- No awareness of the RAG pipeline, dual memory (global vs user), or modernized persona system; lacks integration with `shared/planCatalog`, Supabase auth, or the Live TTS/stt services.

## AgentOS State on `dev`

- Rich modular layout under `backend/agentos` with dedicated subsystems:
  - **API Facade** (`api/AgentOS.ts`, `AgentOSOrchestrator.ts`, streaming bridge) exposing typed async generators for chat turns, tool results, persona listing, and conversation history.
  - **Cognitive Substrate** (`cognitive_substrate/*`) defining Generalized Mind Instances (GMIs), working memory, persona loaders, and tests.
  - **Core Services** (`core/*`) for agents, orchestration, conversation state, streaming, AI utilities, audio processing (VAD, calibration), multimodal vision, and tool orchestration with permission management.
  - **RAG Stack** (`rag/*`, `memory_lifecycle/*`, `config/*`) covering embedding manager configs, vector store abstraction, retrieval augmentor, and lifecycle managers, complete with unit tests.
  - **Docs** (4k+ line `README`, architecture, prompts, RAG, tools, auth) giving detailed conceptual + operational guidance with JSDoc-heavy code.
- Implementation highlights:
  - `AgentOS` orchestrates via injected dependencies (`GMIManager`, `ConversationManager`, `ToolOrchestrator`, `StreamingManager`, `AIModelProviderManager`, etc.) and enforces structured error handling (`AgentOSServiceError`, `GMIError`).
  - Streaming-first design: every interaction yields `AgentOSResponseChunkType` (progress, deltas, tool calls/results, final markers, UI commands) through async generators tied to `AsyncStreamClientBridge`.
  - Turn handling is persona-aware, multimodal-ready (text/audio/vision), and integrates tool call routing with safeguards (`maxToolCallIterations`, permission manager).
  - RAG + memory configuration is decoupled: `VectorStoreManager`, `MemoryLifecycleManager`, and persona definitions specify what data to hydrate into working memory vs long-term stores.
- Missing links relative to master:
  - Environment/config wiring assumes standalone server; no hooks yet for current backend’s auth middleware, Supabase tokens, billing entitlements, or shared `planCatalog`.
  - REST/WebSocket routes live in `backend/agentos/server/*` but target an older stack (custom Express instance, Prisma schema) rather than `backend/src`.
  - No direct bridge to master’s chat endpoints, rate-limit middleware, or the new agent miniapp contract on the frontend.

## Integration Goals (high-level)

1. **Bring over the richer AgentOS backend from `dev`** (routes, tool orchestration, websocket handling) while aligning it with today’s backend conventions (Express config, middleware, error handling).
2. **Wire AgentOS into existing services** so `/api/chat`, personas, RAG/vector store access, and memory management run through AgentOS orchestration without regressing the working frontend.
3. **Support both global + user-specific memory** (persisted via the current databases) and ensure rate limits, billing entitlements, and Supabase-linked auth remain intact.
4. **Document the reintegration path** so AgentOS can be carved out into an open-source package later (clear configs, env vars, and module boundaries).

## Open Questions / Considerations

- Exact scope of the “real AgentOS” code on `dev` (APIs, data models, websocket protocols) and how much drift exists relative to master.
- Required adapters for Supabase JWTs, plan enforcement, and cost tracking when AgentOS becomes the orchestrator.
- Where to host reusable AgentOS modules (e.g., `backend/agentos` as a package vs integrated feature directories) to simplify future OSS packaging.
- Sequence for migrating `/api/chat` consumers (frontend agents, prompts, memory services) without breaking current master functionality during the dev-branch work.

## Integration Blueprint (WIP)

### 1. Baseline Alignment
- Merge `master` into `dev` to bring the current backend/frontend tree (features, middleware, docs) while preserving `backend/agentos`.
- Resolve conflicts by preferring `master` for existing services and keeping `dev`’s `backend/agentos` additions.
- Ensure `docs/` + shared configs exist on `dev` so knowledge from master is accessible.

### 2. AgentOS Platform Adapter (backend/src/integrations/agentos)
- Create an integration module that instantiates `AgentOS` once per process with dependencies sourced from the existing backend:
  - Auth bridge: wrap Supabase/global JWT info and plan metadata into `AgentOSInput.userContext`.
  - Memory bridge: adapter that lets `AgentOS` `ConversationManager` use current `sqliteMemoryAdapter` + upcoming Postgres when configured.
  - Cost + credit bridge: hook `CostService` / `creditAllocationService` events into `AgentOS` usage reporting.
  - Config loader: map env vars to `AgentOSConfig` (model routing, vector store provider, tool registry toggles).
- Expose a singleton with lifecycle hooks (`initialize`, `shutdown`, `getInstance`).

### 3. Route + API Wiring
- Replace `backend/src/features/chat/chat.routes.ts` request handling with AgentOS orchestrator calls:
  - Build `AgentOSInput` from current request (messages, persona, metadata, speech settings, BYO keys).
  - Stream responses via HTTP chunked encoding or buffer final response (to keep parity while streaming is finished).
  - Map `AgentOSResponseChunkType` → existing frontend expectations (text, tool call metadata, cost updates).
- Add supporting endpoints under `/api/agentos/*` (or extend chat routes) for:
  - Tool result callbacks (if the frontend must send tool outputs).
  - Persona listings/resolution (wrapping `IPersonaDefinition`).
  - Conversation history queries (mirroring prior `/api/chat/history` semantics).
  - Health/metrics (tying into `/api/system/agentos`).

### 4. Memory + RAG Integration
- Decide on vector store provider baseline (start with the AgentOS in-memory store backed by embeddings; later swap to Supabase/Postgres/pinecone).
- Implement a bridge so AgentOS RetrievalAugmentor pulls from:
  - **Global Memory**: shared knowledge base stored via existing JSON knowledge service + flagged `app_users` zero userId (per instructions for global context).
  - **User Memory**: per-user conversation + doc embeddings referencing `userId`.
- Sync memory lifecycle events with `sqliteMemoryAdapter` transactions to keep compatibility with existing history/performance screens.

### 5. Tooling & Personas
- Map existing agent personas/prompts (stored in `/prompts` + `frontend/src/services/agent.service.ts`) to AgentOS persona definitions:
  - Provide conversion utilities so `IAgentDefinition` → `IPersonaDefinition`.
  - Preserve tool availability (e.g., diagram, quiz, diary) by registering them with the new ToolOrchestrator and reusing existing backend tool handlers (`backend/src/tools/*.ts`).
- Ensure `frontend` agents keep the same IDs; chat responses should include the persona/agent info for compatibility.

### 6. Observability & Safety
- Hook AgentOS structured logs into the backend logger so PM2/Cloud logs capture turn lifecycle, tool execution, and errors.
- Emit health metrics for `/api/system/llm-status` or new `/api/system/agentos`.
- Add guardrails for plan entitlements (Basic vs Creator vs Org) by reading `creditAllocationService` statuses before running `AgentOS.processRequest`.

### 7. Documentation & Config Surface
- Extend `.env.sample`, `CONFIGURATION.md`, and new `docs/AGENTOS_REINTEGRATION_NOTES.md` with:
  - `AGENTOS_ENABLED`, `AGENTOS_MODEL_ROUTING`, `AGENTOS_VECTOR_PROVIDER`, `AGENTOS_PERSONA_PATH`, etc.
- Add high-level `docs/agentos-integration.md` describing runtime toggles so AgentOS can later ship as an open-source package.

### Delivery Strategy
1. Merge codebases (master → dev) and ensure dev builds.
2. Land the AgentOS integration module + config scaffolding (feature-flagged).
3. Flip chat routes to use AgentOS, keeping a fallback path for debugging.
4. Flesh out supporting endpoints + memory bridges.
5. Polish docs/JSDoc and provide validation steps (dev server boot, sample chat, persona listing).

These steps keep AgentOS encapsulated but wired through the modern backend, preparing it for eventual extraction as a standalone library/package.

## Current Integration Status

- ✅ Dev branch now mirrors the latest production architecture (docs, frontend, backend features) while preserving the rich `backend/agentos` tree.
- ✅ Embedded AgentOS service (`backend/src/integrations/agentos/agentos.integration.ts`) spins up the orchestrator with safe defaults (no Prisma migrations required) and exposes a route factory.
- ✅ `/api/agentos/*` routes are mounted automatically when `AGENTOS_ENABLED=true`, reusing the existing JWT middleware so the frontend can begin experimenting without leaving the main Express app.
- 🔜 Next milestones: swap `/api/chat` over to AgentOS streaming, bridge Supabase plan metadata into the stubbed subscription service, and map existing Vue agents to the new persona loader.

## End-to-End Readiness Checklist (WIP)

| # | Milestone | Description | Status |
|---|-----------|-------------|--------|
| 1 | **Voice Input Pipeline → AgentOS** | Make sure mic capture/transcription flows still store transcripts/persona metadata before AgentOS handles the turn so the UI log stays in sync. | ✅ (this change) |
| 2 | **Tool + Persona Registry** | Map existing frontend agents + prompts onto AgentOS personas, register diagram/quiz/diary tools with ToolOrchestrator. | ✅ (persona + tool metadata registry added in `backend/src/integrations/agentos/agentos.persona-registry.ts`) |
| 3 | **Memory + RAG Bridge** | Back AgentOS `ConversationManager` + vector store with the same SQLite/Pinecone adapters used today so global + per-user memory work identically. | ⏳ |
| 4 | **Auth & Plan Enforcement** | Replace the stubbed auth/subscription services with adapters that read Supabase/global JWTs and `shared/planCatalog` to respect tiers, BYO limits, etc. | ⏳ |
| 5 | **Streaming & Observability** | Surface AgentOS SSE endpoints in the frontend, wire structured logs/metrics into the existing `/api/system` health checks. | ⏳ |

Each milestone builds on the previous one; we’ll mark them complete here as work lands.

- **Persona Registry Snapshot** (Step 2): `backend/src/integrations/agentos/agentos.persona-registry.ts` now mirrors the Vue agent catalog, reads the existing prompt Markdown files, and links each agent to its toolsets (`coding_core`, `tutor_learning`, `diary_reflection`, etc.). The adapter uses this metadata to stamp every AgentOS request with the correct persona + tool hints so future orchestrators can execute the right functions without re-discovering agent state.
