# AgentOS Marketplace Integration

This document explains how marketplace listings flow from AgentOS personas through the SQL storage layer to the marketing and client surfaces that render marketplace inventory. Use it as a reference when wiring new agents, extending analytics, or exposing marketplace data to additional runtimes.

---

## 1. Data sources

- **Marketplace records** – Seeded and persisted in the shared SQLite/Postgres store via the marketplace service (`backend/src/features/marketplace/marketplace.service.ts`). Each record links to a Generalised Mind Instance (`persona_id`), pricing metadata, and optional metrics (downloads, rating, revenue).
- **AgentOS personas** – Declared under `packages/agentos/src/cognitive_substrate/personas/**` and exposed via the persona registry helper (`backend/src/integrations/agentos/agentos.persona-registry.ts`). The registry must contain every `persona_id` referenced by the marketplace table.
- **Agent runtime** – The AgentOS SQL client (`backend/src/integrations/agentos/agentos.sql-client.ts`) ensures conversation state and persona overlays share the same database. Marketplace write operations should reuse this adapter so tenant data stays in one datastore.

---

## 2. Backend surfaces

1. **Schema bootstrapping** – The marketplace service calls `ensureSchema` on first access. This creates `agentos_marketplace_agents` and relevant indexes. If you change the schema, adjust both the `CREATE TABLE` statement and the `hydrateRecord` transformer so API payloads stay in sync.
2. **Seeding logic** – `seedIfNecessary` bridges persona definitions to marketplace rows during local development. When shipping to production, replace or extend this method with an admin workflow so new agents can be published without shipping code.
3. **API routes** – `backend/src/features/marketplace/marketplace.routes.ts` exposes:
   - `GET /api/marketplace/agents` – returns the full list for marketing pages.
   - `GET /api/marketplace/agents/:id` – resolves single entries by marketplace or persona id.
   Protect write routes with auth and rate limiting once partner submissions are enabled.

---

## 3. Frontend consumers

### 3.1 Marketing site (`apps/agentos-landing`)

- `components/marketplace/marketplace-preview.tsx` fetches API summaries and renders hero CTA, stat chips, and agent tiles. It falls back to `FALLBACK_AGENTS` when the API is offline so the grid never renders empty.
- CSS tokens for chips, CTA buttons, avatars, and skeleton cards live in `app/globals.css`. When introducing new class names, update both the component JSX and the stylesheet to keep hover/focus states aligned.
- The marketing docs page links to TypeDoc/REST outputs under `/docs-generated/**`. Remember to run `pnpm dev:full` (or `pnpm --filter @agentos/core run docs`) so generated assets exist.

### 3.2 Voice client (`frontend/`)

- `src/store/marketplace.store.ts` provides a Pinia store that caches marketplace listings for the in-app agent hub.
- `src/components/agents/AgentHub.vue` and `AgentCard.vue` consume the store, rendering shimmer skeletons until `fetchAgents()` resolves. When extending card metadata (e.g., pricing tiers, session counts) ensure both the store typings and card props update together.

---

## 4. Audio, RAG, and SQL hooks

- **SQL adapter** – `createAgentOSSqlClient()` injects the storage adapter into the AgentOS config so conversation transcripts, tool invocations, and marketplace interactions share retention policy. Any custom audio or RAG state you add should respect the same adapter helper to avoid diverging persistence.
- **Audio pipeline** – Voice capture and playback flows through the Vue front-end (see `frontend/src/components/voice/` and related services) before hitting `/api/chat`. AgentOS responses stream down via SSE/WebSocket chunks; marketplace personas can opt-in to specialised voices by setting `defaultVoicePersona` in the agent registry.
- **RAG stores** – Retrieval helpers (`packages/agentos/src/rag/**`) expect a storage adapter that matches the SQL client semantics. When wiring new knowledge stores for marketplace agents, register them in the AgentOS config and surface the capability in both marketing copy and the agent detail modals.

---

## 5. Operational checklist

1. **Run docs + landing dev** – `pnpm dev:full` keeps Next.js, TypeDoc, and marketplace API responses in sync (see updated `docs:watch` script for automatic copy).
2. **Verify endpoints** – `GET /api/marketplace/agents` should return seeded entries; confirm that `/docs-generated/api/index.html` renders without a 404.
3. **Sync personas** – When adding a new marketplace agent, ensure the corresponding persona exists and exports from `listAgentOSPersonas()`.
4. **Update copy** – Landing CTAs and Vue agent hub labels should mention monetisation tier, signals, and any audio/RAG capabilities introduced in backend adapters.

Document changes alongside code whenever marketplace behaviour shifts (new pricing models, workflow triggers, etc.) so the integration stays discoverable across teams.
