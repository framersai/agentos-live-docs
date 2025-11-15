<div align="center">
  <img src="logos/frame-logo-green-no-tagline.svg" alt="Frame.dev" width="200">

# Frame.dev Ecosystem

**AI Infrastructure for Knowledge**

*The OS for humans, the codex of humanity.*

[Frame.dev](https://frame.dev) • [OpenStrand](https://openstrand.ai) • [Documentation](./wiki/README.md)

</div>

---

This repository contains the Frame.dev ecosystem projects, including [Frame.dev](https://frame.dev), [Frame Codex](https://frame.dev/codex), and [OpenStrand](https://openstrand.ai).

> **Internal / Proprietary**
> This workspace is for Frame.dev only. Do not redistribute snippets, assets, or binaries outside the organisation without approval.

The repository is organised as a pnpm workspace so the production apps, the AgentOS runtime, and the new AgentOS-facing experiences can evolve together or ship independently.

## 🌟 Projects

### Core Projects

| Project | Description | Documentation |
|---------|-------------|---------------|
| **[Frame.dev](https://frame.dev)** | AI infrastructure company homepage | [Wiki](./wiki/frame/README.md) |
| **[Frame Codex](https://github.com/framersai/codex)** | Open-source knowledge repository for LLMs | [Wiki](./wiki/codex/README.md) |
| **[OpenStrand](https://openstrand.ai)** | AI-native personal knowledge management | [Wiki](./wiki/openstrand/README.md) |

### Monorepo Structure

| Path | Purpose |
|------|---------|
| `apps/frame.dev/` | Frame.dev marketing site (Next.js + Tailwind) |
| `apps/codex/` | Frame Codex data repository (git submodule) |
| `wiki/` | Comprehensive documentation for all projects |
| `frontend/` | Vue 3 + Vite SPA for voice assistant |
| `backend/` | Express + TypeScript API server |
| `packages/agentos/` | TypeScript runtime (`@framers/agentos`) |
| `apps/agentos.sh/` | AgentOS marketing site |
| `apps/agentos-workbench/` | Developer workbench for AgentOS |
| `docs/` | Technical documentation and migration guides |
| `shared/` | Shared utilities and constants |

## Architecture Highlights

- **Frontend** - Vue 3 + Vite + Tailwind with composition-based state and Supabase-friendly auth (see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).
- **Backend** - Modular Express feature folders, optional Supabase + Lemon Squeezy integration, rate-limited public demo routes.
- **AgentOS runtime** - Session-aware personas, tool permissioning, guardrail policy hooks, retrieval/memory lifecycle policies, async streaming bridges.
- **AgentOS surfaces** - `apps/agentos.sh` (marketing) and `apps/agentos-workbench` (developer cockpit) consume the runtime without touching the proprietary voice UI.
- **Data flow** - Voice/Text -> `/api/chat` -> AgentOS -> LLM providers with knowledge retrieval and billing-tier enforcement.

## 🚀 Quick Links

- **📚 [Full Documentation](./wiki/README.md)** - Comprehensive guides for all projects
- **🔧 [API Reference](./wiki/api/README.md)** - Integration documentation
- **🌐 [Frame.dev](https://frame.dev)** - AI infrastructure platform
- **📖 [Frame Codex](https://frame.dev/codex)** - Browse the knowledge repository
- **🧠 [OpenStrand](https://openstrand.ai)** - Personal knowledge management

## Getting Started

### Frame.dev Development

```bash
# Clone with submodules (includes Frame Codex)
git clone --recursive https://github.com/manicinc/voice-chat-assistant.git
cd voice-chat-assistant

# Install dependencies
pnpm install

# Start Frame.dev site
cd apps/frame.dev
npm run dev
# Visit http://localhost:3000
```

### General Development

1. **Install dependencies**
   ```bash
   pnpm install            # installs the full workspace (preferred)
   # or npm run install-all  # convenience script that shells into each package
   ```
2. **Configure environment variables**
   - Copy `.env.sample` -> `.env` (backend).
   - Copy `frontend/.env.supabase-stripe.example` -> `frontend/.env.local`.
   - Optional: copy `apps/agentos-workbench/.env.example` -> `apps/agentos-workbench/.env.local` if you need to override the AgentOS proxy paths.
   - Populate values listed in [`CONFIGURATION.md`](CONFIGURATION.md) (ports, JWT secrets, LLM keys, Supabase, Lemon Squeezy, AgentOS flags, etc.).
3. **Run development servers**
   ```bash
   pnpm run dev:workbench    # backend + AgentOS workbench
   ```
   - Backend API: <http://localhost:3001>
   - AgentOS workbench: <http://localhost:5175>
   - Voice UI + backend: `pnpm run dev:vca`
   - Marketing site + backend: `pnpm run dev:landing`
   - Solo marketing site preview: `pnpm run dev:landing:solo`
4. **Build for production**
   ```bash
   npm run build   # builds frontend, backend, and @framers/agentos
   npm run start   # starts the compiled backend + preview frontend
   # Optional: pnpm run build:landing && pnpm run build:agentos-workbench
   ```
5. **Scoped workflows**
   ```bash
   pnpm --filter @framers/agentos test       # run AgentOS test suite
   pnpm --filter @framers/agentos build      # emit dist/ bundles for publishing
   pnpm --filter @framers/agentos run docs   # generate TypeDoc output
   pnpm --filter @framersai/agentos.sh dev    # work on agentos.sh
   pnpm --filter @framersai/agentos-workbench dev     # iterate on the cockpit
   ```

## AgentOS Package Readiness

- `packages/agentos` builds to pure ESM output with declaration maps so it can be published directly.
- The runtime ships with default `LLMUtilityAI` wiring, explicit tool permission/execution plumbing, and async streaming bridges.
- Guardrail subsystem now ships end-to-end: `IGuardrailService` contract, dispatcher helpers, `AgentOS.processRequest` integration, and a Vitest harness so hosts can allow/flag/sanitize/block requests via `AgentOSConfig.guardrailService`.
- Conversation/persona safeguards are aligned with subscription tiers and metadata hooks exposed by the backend.
- **Documentation** - `pnpm --filter @framers/agentos run docs` generates TypeDoc output under `packages/agentos/docs/api` (configuration lives in `packages/agentos/typedoc.json`).
- See `packages/agentos/README.md` for package scripts, exports, and the release checklist.

## AgentOS Surfaces

- **agentos.sh landing** - Next.js marketing site with dual-mode theming, motion, roadmap cards, and launch CTAs.
- **AgentOS client workbench** - React cockpit for replaying sessions, inspecting streaming telemetry, and iterating on personas/tools without running the full voice UI.
- Both apps consume the workspace version of `@framers/agentos` and can be hosted independently when we cut the repositories under `framersai`.
- Workbench persona catalog now hydrates from `/api/agentos/personas` (filters: `capability`, `tier`, `search`) and caches responses via React Query for faster iteration.

### Workflow artifacts & media outputs

- Tool responses and workflow steps can emit rich artifacts (JSON, CSV, PDF, audio, images, etc.) by returning `{ data, mimeType, filename }` payloads in tool results.
- Streaming clients receive these inside `AgentOSResponse` chunks; the workbench renders them via `ArtifactViewer` with copy/download affordances.
- For non-binary outputs, include direct URLs or structured content—the viewer auto-detects HTTP links, multiline text, and nested arrays/objects.

## Automation & Releases

- Release workflow details live in [docs/RELEASE_AUTOMATION.md](docs/RELEASE_AUTOMATION.md).
- Tags named `vX.Y.Z` on `master` trigger publishes, mirrors, and deploys unless the release PR carries the `skip-release` label.

## Documentation & References

- Architecture deep-dive - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Configuration catalogue - [`CONFIGURATION.md`](CONFIGURATION.md)
- Backend API reference - [`docs/BACKEND_API.md`](docs/BACKEND_API.md)
- Marketplace integration guide - [`docs/marketplace.md`](docs/marketplace.md)
- AgentOS migration notes - [`docs/AGENTOS_*`](docs)
- Workflow & automation guide - [`docs/WORKFLOWS.md`](docs/WORKFLOWS.md)
- Generated API docs - `pnpm --filter @framers/agentos run docs` -> `packages/agentos/docs/api`

### Provider API Migration (generateCompletion*)

The AgentOS core provider contract was modernized to unify legacy `generate` / `generateStream` calls under
`generateCompletion` and `generateCompletionStream` with a richer, streaming-friendly response shape.

Key Changes:
1. Unified Response Type: `ModelCompletionResponse` now represents both full non-streaming replies and individual streaming chunks.
2. Delta Semantics: Streaming chunks carry incremental `responseTextDelta` values (append-only) and `toolCallsDeltas[]` for gradual function argument assembly. Concatenate all deltas per choice to reconstruct final content.
3. Terminal Chunk: Exactly one streamed chunk sets `isFinal: true` (success or error). Token usage (`usage.totalTokens`) and any error envelope appear here.
4. Error Handling: Errors during streaming emit a final chunk with `error` populated rather than throwing mid-generator, ensuring predictable teardown.
5. Tool Calls: OpenAI-style tool/function calls surface as incremental JSON argument fragments via `arguments_delta`. Accumulate, then parse into a full JSON object upon finalization.
6. Embeddings: Embedding generation unaffected aside from optional cost metadata field (`costUSD`).

Refactor Checklist for Host Code:
- Replace old `provider.generate(...)` with `provider.generateCompletion(modelId, messages, options)`.
- Replace old streaming usage with `for await (const chunk of provider.generateCompletionStream(...)) { ... }`.
- Maintain a per-request accumulator: `fullText += chunk.responseTextDelta ?? ''`.
- Reconstruct tool calls: group deltas by `index` (and later stable `id`) accumulating `arguments_delta` strings.
- Use `chunk.isFinal` gate to perform commit operations (persist transcript, bill usage, update UI status indicators).
- Prefer `chunk.usage?.totalTokens` only after `isFinal` to avoid partial token confusion.

Example Streaming Loop:
```ts
let fullText = '';
const toolBuffers: Record<number, string> = {};
for await (const chunk of provider.generateCompletionStream(modelId, messages, opts)) {
   if (chunk.responseTextDelta) fullText += chunk.responseTextDelta;
   if (chunk.toolCallsDeltas) {
      for (const d of chunk.toolCallsDeltas) {
         toolBuffers[d.index] = (toolBuffers[d.index] || '') + (d.function?.arguments_delta || '');
      }
   }
   if (chunk.isFinal) {
      const parsedTools = Object.entries(toolBuffers).map(([idx, acc]) => ({ index: Number(idx), arguments: safeJson(acc) }));
      console.log('Final text:', fullText);
      console.log('Parsed tools:', parsedTools);
   }
}
function safeJson(raw: string) { try { return JSON.parse(raw); } catch { return raw; } }
```

See enhanced TSDoc in `packages/agentos/src/core/llm/providers/IProvider.ts` for invariants and error semantics.

## Contributing

1. Create a branch (`git checkout -b feature/amazing`).
2. Update the relevant package README/docs alongside code changes.
3. Run the scoped lint/test commands (`npm run lint`, `pnpm --filter @framers/agentos test`, etc.).
4. Submit a PR with context. Include screenshots/recordings for UI updates.

## License

The repository remains private. Individual packages may be published under MIT when we cut public releases—refer to [LICENSE](LICENSE) for the current terms.

---

<div align="center">
  <br/>
  <p>
    <a href="https://frame.dev">Frame.dev</a> •
    <a href="https://frame.dev/codex">Frame Codex</a> •
    <a href="https://openstrand.ai">OpenStrand</a>
  </p>
  <p>
    <a href="https://github.com/framersai">GitHub</a> •
    <a href="https://twitter.com/framersai">Twitter</a>
  </p>
  <br/>
  <sub>Built with ❤️ by the Frame.dev team</sub>
</div>
