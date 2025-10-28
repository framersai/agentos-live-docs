# AgentOS Extraction & Integration Plan

This document captures the roadmap for turning the current in-repo AgentOS reintegration into a fully standalone, open-source Typescript package while keeping the Voice Chat Assistant (VCA) product fully functional throughout.

The work is split into three phases. Each phase builds on the previous and can ship independently.

---

## Phase 0     Stabilize AgentOS Inside This Repo

**Goal:** Make AgentOS usable by the existing VCA backend/frontend without leaving the monorepo. This gives us breathing room to redesign the package API while validating the runtime in production.

### Tasks

1. **Build the AgentOS source tree.**
   - Create a dedicated `tsconfig.agentos.json`.
   - Add `npm run build:agentos` that compiles `packages/agentos/src/**` into `packages/agentos/dist`.
   - Update `npm run build:backend` to invoke the AgentOS build before the main backend build, ensuring `dist/agentos/api/AgentOS.js` exists when `node dist/server.js` starts (copied or referenced via the workspace package).

2. **Mount AgentOS routes.**
   - Update `backend/config/router.ts` (or equivalent) to register `getAgentOSRouter()` and the SSE router whenever `AGENTOS_ENABLED=true`.
   - Ensure the routers reuse the existing auth/rate-limiter middleware stack.

3. **Replace the shim.**
   - Migrate `/api/chat` to call `agentosService.processThroughAgentOS()` instead of `processAgentOSChatRequest`.
   - Remove the fake final-response adapter once streaming is live, ensuring the frontend sees real `AgentOSResponseChunkType` events.

4. **Frontend readiness.**
   - Handle empty/error states for `/api/rate-limit/status`, `/api/tts/voices`, `/prompts/*.md`, etc., so the UI doesn   t flood the console when backend routes aren   t available yet.
   - Finalize the `chatAPI` adapters so `VITE_AGENTOS_CLIENT_MODE=direct` flips all agents to `/api/agentos/*`.

### Deliverables

| Deliverable | Description |
|-------------|-------------|
| `backend/dist/agentos/**` | AgentOS runtime available in production builds. |
| `/api/agentos/chat` & `/api/agentos/stream` | Routed through Express when enabled. |
| `/api/chat` | Runs through AgentOS by default (no synthetic shim). |
| Frontend flag | `VITE_AGENTOS_CLIENT_MODE` confirmed working end-to-end. |

---

## Phase 1     Introduce Workspaces & Modularize

**Goal:** Treat AgentOS as a workspace package while it still lives in this repo. This lets VCA depend on the package locally, makes unit testing easier, and shortens the future extraction work.

### Tasks

1. **Turn the repo into a workspace (pnpm or npm).**
   - Create `pnpm-workspace.yaml`.
   - Move the VCA backend/frontend into `apps/voice-chat-assistant` (or similar) and AgentOS into `packages/agentos` (completed in the current iteration).

2. **Rehome AgentOS code.**
   - Move `backend/agentos/**`     `packages/agentos/src`.
   - Write a new `packages/agentos/package.json` with build scripts, lint/test, entry points (ESM/CJS), and TypeDoc generation.
   - Configure separate tsconfigs for library vs. application targets.

3. **Update imports.**
   - Replace relative paths (`../../agentos/...`) with package imports (e.g., `import { AgentOS } from '@agentos/core'`).
   - Ensure tree-shaking works: export only the public surface from `packages/agentos`.

4. **Add tests & docs.**
   - Create unit tests (Vitest/Jest) for orchestrator, tool perms, memory, etc.
   - Generate API docs (TypeDoc). Consider automated doc site (Docusaurus, VitePress).

5. **CI integration.**
   - Update root CI config (GitHub Actions, etc.) to run workspace builds/tests for both apps.

### Deliverables

| Deliverable | Description |
|-------------|-------------|
| Workspace structure | `packages/agentos`, `apps/voice-chat-assistant`, shared ESLint/TS configs. |
| `@agentos/core` package | Builds to `dist/` with ESM/CJS, has tests/docs. |
| VCA backend | Depends on `@agentos/core` via workspace version (no more relative imports). |
| CI coverage | Lint/test/build workflows for both package and app. |

---

## Phase 2     Split AgentOS into a Public Repo

**Goal:** Make AgentOS an independent, open-source project with its own release cycle, while VCA depends on tagged releases.

### Tasks

1. **Repo extraction.**
   - Use `git subtree split` or `git filter-repo` to export `packages/agentos` history into a new GitHub repository (`agentos/agentos`).
   - Set up the new repo with MIT license, contribution guide, issue templates, etc.

2. **Standalone CI/CD.**
   - Configure workflows for lint, tests, docs, and publishing to npm.
   - Add semantic release tooling (Changesets, release-please, etc.) to manage versioning.

3. **Documentation site.**
   - Publish docs to GitHub Pages or Vercel (e.g., Docusaurus). Include architecture diagrams, integration guides, and API references.

4. **VCA dependency update.**
   - Replace the workspace dependency with the external package (npm semver).
   - For local development, allow `pnpm link` or `npm link` for rapid iteration when needed.

5. **Release process.**
   - Document how to cut a release (version bump, changelog, npm publish).
   - Ensure security disclosures and contribution guidelines are in place.

### Deliverables

| Deliverable | Description |
|-------------|-------------|
| Public repo | `github.com/<org>/agentos` with MIT license and documentation. |
| npm package | `@agentos/core` published with semantic versions. |
| Docs site | Public documentation covering concepts, API, and examples. |
| VCA upgrade path | Application consumes the published package; upgrading is a dependency bump. |

---

## Open Questions & Follow-ups

- **Streaming model support:** Do we wait for streaming LLM support before removing the adapter? (Recommended     real streaming is the differentiator.)
- **Tool integration surface:** Decide which parts of VCA   s tool registry become part of the public API vs. remain private adapters.
- **Auth/plan adapters:** Keep the Supabase + plan catalog adapters in VCA, but consider providing interfaces or optional packages for common auth providers.
- **Testing strategy:** Identify critical scenarios (tool call loops, memory persistence, SSE fan-out) and cover them in both package and app tests.
- **Release cadence:** Determine how often we publish the open-source package relative to VCA releases (e.g., weekly snapshots vs. tagged milestones).

---

### Summary Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Fix build/runtime inside monorepo | Pending |
| 1 | Workspace/module reorg | Pending |
| 2 | Public repo & npm package | Pending |

Once Phase 0 is complete, frontend can safely develop against AgentOS. Phase 1 makes the codebase modular. Phase 2 lets the world adopt AgentOS independently while VCA upgrades at its own pace.

