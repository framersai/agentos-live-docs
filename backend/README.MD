# Backend — Voice Chat Assistant API

Node.js + Express + TypeScript server powering chat, STT/TTS, diagrams, rate limiting, billing, and the embedded AgentOS adapter.

**Powered by [`@framers/agentos`](https://github.com/wearetheframers/agentos)** — The orchestration runtime for adaptive AI systems.

---

## Quick Start

```bash
cd backend
npm install             # installs backend deps
pnpm install            # optional, installs every workspace (root command)
npm run dev             # tsx watch server.ts
```

> The backend now depends on `@framers/agentos` (from `packages/agentos`). When building for production (`npm run build`), the root script runs the AgentOS package build first so `dist/server.js` can import it.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts `tsx watch server.ts` with auto-reload. |
| `npm run build` | Runs `npm --prefix packages/agentos run build` then compiles backend TypeScript to `dist/`. |
| `npm start` | Runs `node dist/server.js` (after build). |

---

## Environment

1. Copy `.env.sample` â†’ `.env` in the repo root (or backend directory). Fill in:
   - `PORT`, `FRONTEND_URL`, `APP_URL`, `NODE_ENV`
   - `AUTH_JWT_SECRET`, `GLOBAL_ACCESS_PASSWORD`
   - LLM keys (`OPENAI_API_KEY`, `OPENROUTER_API_KEY`, optional Anthropic/Ollama)
   - Speech defaults (`WHISPER_MODEL_DEFAULT`, `OPENAI_TTS_DEFAULT_MODEL`, etc.)
   - Optional Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and Stripe/Lemon Squeezy values
   - AgentOS flags (`AGENTOS_ENABLED`, `AGENTOS_DEFAULT_PERSONA_ID`, etc.)
2. For frontend-specific values, see `frontend/.env*` and the frontend README.
3. Full variable explanations live in [CONFIGURATION.md](../CONFIGURATION.md).

---

## Architecture

- `config/router.ts` wires all `/api/*` routes (auth, chat, STT/TTS, billing, organizations). When `AGENTOS_ENABLED=true`, it also mounts `/api/agentos/chat` + `/api/agentos/stream` via `getAgentOSRouter()`.
- `middleware/optionalAuth.ts` injects `req.user` for public-or-private routes; `middleware/auth.ts` enforces strict JWT/Supabase validation.
- Feature modules live in `src/features/*` (auth, chat, speech, cost, prompts, billing, organization, system status).
- Core shared services live under `src/core/*` (LLM providers, cost tracking, audio helpers, memory, context aggregation).
- AgentOS adapters (`src/integrations/agentos/*`) translate VCAâ€™s auth/plan/rate logic into the AgentOS package interfaces.
- Legacy `backend/agentos/**` code now lives in `packages/agentos/src/**` (portable package). Backend imports via `@framers/agentos/...`.

For a detailed endpoint table, see [docs/BACKEND_API.md](../docs/BACKEND_API.md). For diagrams and context strategy, review:

- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [LANGUAGE_AND_CONTEXT_DOCUMENTATION.md](../LANGUAGE_AND_CONTEXT_DOCUMENTATION.md)
- [docs/AGENTOS_REINTEGRATION_NOTES.md](../docs/AGENTOS_REINTEGRATION_NOTES.md)

---

## AgentOS Integration

- The backend consumes the workspace package `@framers/agentos` (source in `packages/agentos`).
- `agentos.integration.ts` lazily instantiates the AgentOS orchestrator, wiring our auth + subscription adapters (`agentos.auth-service.ts`, `agentos.subscription-service.ts`) and streaming bridge.
- `/api/chat` currently short-circuits to `processAgentOSChatRequest` when `AGENTOS_ENABLED=true`. The long-term plan (see [docs/AGENTOS_REINTEGRATION_NOTES.md](../docs/AGENTOS_REINTEGRATION_NOTES.md)) is to route all conversations through `agentosService.processThroughAgentOS()` and expose streaming chunks end-to-end.
- Building the backend automatically builds the AgentOS package. When working directly on AgentOS, run `npm --prefix packages/agentos run build && npm --prefix backend run build` to ensure the compiled files land in `packages/agentos/dist` before launching `node dist/server.js`.

---

## Testing & Tooling

- Linting/testing coverage is being extended as part of the AgentOS extraction work. For now, rely on TypeScript, unit tests in `packages/agentos`, and targeted integration tests (e.g., hitting `/api/chat`, `/api/tts`, `/api/rate-limit/status`) via your preferred HTTP client.
- When adding new feature modules, follow the existing pattern: `src/features/{feature}/` contains router + service files, with heavy logic factored into `src/core` when possible.
- To test AgentOS routes manually, set `AGENTOS_ENABLED=true`, restart `npm run dev`, and POST to `http://localhost:3001/api/agentos/chat` with a payload `{ userId, conversationId, mode, messages }`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ERR_MODULE_NOT_FOUND: agentos/api/AgentOS` when running `npm start` | Run `npm run build:backend` from the repo root so the `packages/agentos` build runs first. |
| `/api/tts/voices` or `/api/rate-limit/status` returning 500 during dev | Ensure `npm run dev` is running in the backend terminal (frontend proxies to `localhost:3001`). |
| Supabase login fails | Verify `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and Supabase redirect URLs. |
| SSE/AgentOS requests returning 503 | Check that `AGENTOS_ENABLED=true` and the backend logs show `[AgentOS] Registered AgentOS routes at /api/agentos`. |

---

## References

- [Configuration Guide](../CONFIGURATION.md)
- [Plans & Billing](../docs/PLANS_AND_BILLING.md)
- [AgentOS Integration Notes](../docs/AGENTOS_REINTEGRATION_NOTES.md)
- [AgentOS Public Repo](https://github.com/wearetheframers/agentos)

