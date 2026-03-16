# Wunderland Package + Backend Cleanup & Integration Convergence

## Goal

Split oversized files in `packages/wunderland/src/`, wire backend memory APIs to persistent storage, add content moderation endpoints, converge backend LLM calls to agentos providers, and upgrade search from SQL LIKE to semantic RAG.

## Scope

- **In scope**: Wunderland package large-file decomposition, backend memory persistence, moderation controller, LLM convergence, search->RAG
- **Out of scope**: WunderlandGateway (disabled by design), physical folder moves in wunderland (already domain-organized), rabbithole extensions dashboard (separate spec)

## Architecture Assessment

### What's Already Good (no changes needed)

- 36 domain directories in `packages/wunderland/src/` -- already well-organized
- 33 barrel exports -- 26 of 36 top-level folders have `index.ts`
- Security framework -- 5-tier pipeline fully implemented
- Discovery engine -- tiered semantic search properly integrated
- Skills system -- 40 curated skills, PresetSkillResolver working
- Extensions registry -- 37 channels, `createCuratedManifest()` working
- Channel bridge -- `ChannelBridgeService` properly bridges NestJS <-> AgentOS
- Token refresh -- real cron + provider-specific handlers running
- Agent settings APIs -- extensions, skills, providers, HyDE config all exist
- Frontend status APIs -- `tools/status` and `discovery/status` routes exist in rabbithole

### What Needs Work (6 workstreams)

## Workstream 1: Wunderland Package Large-File Splits

77K LOC across 410 files. 7 files exceed 1000 LOC.

| File                                | LOC  | Split Target                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------------ |
| `social/WonderlandNetwork.ts`       | 2851 | Extract mood engine, post decision, browsing engine into delegates |
| `api/server.ts`                     | 2196 | Extract route handlers, middleware setup, error handling           |
| `cli/commands/chat.ts`              | 1975 | Extract message processing, tool handling, UI rendering            |
| `social/NewsroomAgency.ts`          | 1588 | Extract article generation, source management, scheduling          |
| `runtime/tool-calling.ts`           | 1491 | Extract tool execution loop, result processing, retry logic        |
| `cli/commands/start/http-server.ts` | 1452 | Extract server setup, route mounting, graceful shutdown            |
| `public/index.ts`                   | 1155 | Extract WunderlandSession, WunderlandApp, config builder           |

Pattern: Same delegate extraction approach used for agentos AgentOSOrchestrator (-38%).

## Workstream 2: Backend Memory Persistence

Problem: Memory admin APIs in `memory.controller.ts` are partially backed by in-memory stores. Data doesn't survive restarts.

Fix: Wire memory controller endpoints to `WunderlandVectorMemoryService` (HNSW persistence) and `SqlStorageAdapter` for metadata.

Affected endpoints: memory trace CRUD, per-agent config, health diagnostics, prospective memory triggers.

## Workstream 3: Content Moderation Controller

Problem: `safety-persistence.service.ts` has content flag persistence but no REST API. Tables `wunderland_content_flags`, `wunderland_content_votes`, `wunderland_emoji_reactions`, `wunderland_engagement_actions` exist without controllers.

Fix: Create `ModerationModule` with 7 endpoints for flagging, voting, reactions, review queue, and resolution.

## Workstream 4: Backend LLM Convergence

Problem: `orchestration.service.ts` and `channel-auto-reply.service.ts` use legacy `backend/src/core/llm/*` instead of agentos `AIModelProviderManager`. Two parallel LLM calling codepaths.

Fix: Migrate consumers to `AIModelProviderManager`, remove legacy LLM services.

Risk: High -- touches LLM calling everywhere.

## Workstream 5: Search -> RAG Convergence

Problem: `search.service.ts` uses plain SQL LIKE. No semantic search despite agentos RAG existing.

Fix: Add hybrid search mode (semantic + keyword). Use `EmbeddingManager` for query embedding, merge vector results with SQL. Keep SQL as fallback.

## Workstream 6: Frontend/Backend Contract Cleanup

Problem: Some stale assumptions in rabbithole about APIs. Some duplicated client-side logic.

Fix: Audit and normalize.

## Implementation Sequence

| Order | Workstream               | Effort | Risk   |
| ----- | ------------------------ | ------ | ------ |
| 1     | Memory Persistence (WS2) | Medium | Low    |
| 2     | Content Moderation (WS3) | Medium | Low    |
| 3     | Large-File Splits (WS1)  | Large  | Low    |
| 4     | LLM Convergence (WS4)    | Medium | High   |
| 5     | Search -> RAG (WS5)      | Medium | Medium |
| 6     | Contract Cleanup (WS6)   | Small  | Low    |

## Testing Strategy

- Each workstream verified with agentos build + backend typecheck
- New tests for: moderation controller, search semantic mode, memory persistence
- Existing 1769 agentos + 48 backend tests must stay green
- Wunderland 37 existing test files -- verify no regressions
