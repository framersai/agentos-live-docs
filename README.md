# Voice Chat Assistant

Voice-first coding assistant built by [Frame.dev / wearetheframers](https://github.com/wearetheframers).

> **Internal / Proprietary**
> This workspace is for Frame.dev only. Do not redistribute snippets, assets, or binaries outside the organisation without approval.

The repository is organised as a pnpm workspace so the production apps, the AgentOS runtime, and the new AgentOS-facing experiences can evolve together or ship independently.

## Monorepo at a Glance

| Path | Purpose |
|------|---------|
| `frontend/` | Vue 3 + Vite SPA that handles voice capture, chat UI, localisation, and Supabase auth. |
| `backend/` | Express + TypeScript API (auth, billing, orchestration endpoints). |
| `packages/agentos/` | Publishable TypeScript runtime (`@agentos/core`) powering orchestration, streaming, memory, and tool routing. |
| `apps/agentos-landing/` | Next.js + Tailwind marketing site for agentos.sh (light/dark, motion, roadmap, launch CTAs). |
| `apps/agentos-client/` | React + Vite workbench to inspect AgentOS sessions, tool calls, and transcripts. |
| `docs/` | Architecture notes, configuration, API reference, migration plans. |
| `shared/` | Cross-cutting helpers/constants shared by backend + frontend. |

## Architecture Highlights

- **Frontend** - Vue 3 + Vite + Tailwind with composition-based state and Supabase-friendly auth (see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).
- **Backend** - Modular Express feature folders, optional Supabase + Lemon Squeezy integration, rate-limited public demo routes.
- **AgentOS runtime** - Session-aware personas, tool permissioning, retrieval/memory lifecycle policies, async streaming bridges.
- **AgentOS surfaces** - `apps/agentos-landing` (marketing) and `apps/agentos-client` (developer cockpit) consume the runtime without touching the proprietary voice UI.
- **Data flow** - Voice/Text -> `/api/chat` -> AgentOS -> LLM providers with knowledge retrieval and billing-tier enforcement.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install            # installs the full workspace (preferred)
   # or npm run install-all  # convenience script that shells into each package
   ```
2. **Configure environment variables**
   - Copy `.env.sample` -> `.env` (backend).
   - Copy `frontend/.env.supabase-stripe.example` -> `frontend/.env.local`.
   - Populate values listed in [`CONFIGURATION.md`](CONFIGURATION.md) (ports, JWT secrets, LLM keys, Supabase, Lemon Squeezy, AgentOS flags, etc.).
3. **Run development servers**
   ```bash
   npm run dev
   ```
   - Backend API: <http://localhost:3001>
   - Frontend UI: <http://localhost:3000>
   - Optional: `pnpm run dev:landing` and `pnpm run dev:agentos-client` launch the new AgentOS surfaces.
4. **Build for production**
   ```bash
   npm run build   # builds frontend, backend, and @agentos/core
   npm run start   # starts the compiled backend + preview frontend
   # Optional: pnpm run build:landing && pnpm run build:agentos-client
   ```
5. **Scoped workflows**
   ```bash
   pnpm --filter @agentos/core test       # run AgentOS test suite
   pnpm --filter @agentos/core build      # emit dist/ bundles for publishing
   pnpm --filter @agentos/core run docs   # generate TypeDoc output
   pnpm --filter @wearetheframers/agentos-landing dev    # work on agentos.sh
   pnpm --filter @wearetheframers/agentos-client dev     # iterate on the cockpit
   ```

## AgentOS Package Readiness

- `packages/agentos` builds to pure ESM output with declaration maps so it can be published directly.
- The runtime ships with default `LLMUtilityAI` wiring, explicit tool permission/execution plumbing, and async streaming bridges.
- Conversation/persona safeguards are aligned with subscription tiers and metadata hooks exposed by the backend.
- **Documentation** - `pnpm --filter @agentos/core run docs` generates TypeDoc output under `packages/agentos/docs/api` (configuration lives in `packages/agentos/typedoc.json`).
- See `packages/agentos/README.md` for package scripts, exports, and the release checklist.

## AgentOS Surfaces

- **agentos.sh landing** - Next.js marketing site with dual-mode theming, motion, roadmap cards, and launch CTAs.
- **AgentOS client workbench** - React cockpit for replaying sessions, inspecting streaming telemetry, and iterating on personas/tools without running the full voice UI.
- Both apps consume the workspace version of `@agentos/core` and can be hosted independently when we cut the repositories under `wearetheframers`.

## Automation & Releases

- Release workflow details live in [docs/RELEASE_AUTOMATION.md](docs/RELEASE_AUTOMATION.md).
- Tags named `vX.Y.Z` on `master` trigger publishes, mirrors, and deploys unless the release PR carries the `skip-release` label.

## Documentation & References

- Architecture deep-dive - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Configuration catalogue - [`CONFIGURATION.md`](CONFIGURATION.md)
- Backend API reference - [`docs/BACKEND_API.md`](docs/BACKEND_API.md)
- AgentOS migration notes - [`docs/AGENTOS_*`](docs)
- Generated API docs - `pnpm --filter @agentos/core run docs` -> `packages/agentos/docs/api`

## Contributing

1. Create a branch (`git checkout -b feature/amazing`).
2. Update the relevant package README/docs alongside code changes.
3. Run the scoped lint/test commands (`npm run lint`, `pnpm --filter @agentos/core test`, etc.).
4. Submit a PR with context. Include screenshots/recordings for UI updates.

## License

The repository remains private. Individual packages may be published under MIT when we cut public releases—refer to [LICENSE](LICENSE) for the current terms.
