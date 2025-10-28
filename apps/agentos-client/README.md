# AgentOS Client Workbench

React + Vite dashboard for inspecting AgentOS sessions locally. The goal is to give builders a zero-config cockpit that mirrors how Frame.dev debugs adaptive agents.

## Highlights

- Sidebar session switcher backed by a lightweight zustand store
- Timeline inspector that renders streaming @agentos/core chunks with colour-coded context
- Request composer for prototyping turns or replaying transcripts (wire it to your backend when ready)
- Dark, neon-drenched UI that matches the Frame.dev production command centre

## Scripts

```bash
pnpm dev       # launch Vite dev server on http://localhost:5175
pnpm build     # production build (emits dist/)
pnpm preview   # preview the built app
pnpm lint      # eslint
pnpm typecheck
```

## Local persistence

- Session state and persona definitions are synchronised to a local SQLite database under `.data/agentos-client.db` (gitignored).
- When you bundle the app with Electron or another host, start the lightweight Node/AgentOS backend alongside the UI so both share the same database file.
- For the web demo (`pnpm dev`), persistence stubs currently fall back to in-memory data; swap in the desktop runtime before you ship to customers.

## Wiring it up

1. Start your backend (or mock) that speaks to AgentOS (or embed the backend locally for desktop builds).
2. Replace the synthetic events in `src/App.tsx` with real streaming responses.
3. Populate `useSessionStore` with data from your orchestrator or captured logs.

The client intentionally mirrors the data contracts emitted by @agentos/core, so you can stream chunks directly over websockets or server-sent events without reshaping payloads.
