# Codex Viewer Starter Example

This tiny repo demonstrates how to embed **@framers/codex-viewer** in a fresh Vite + React project and load a miniature knowledge-base that follows the *weave → loom → strand* content model.

---

## 1 · Quick Start

```bash
# Clone just the example (shallow-clone paths supported by git ≥2.25)
 git clone --depth=1 --filter=blob:none \
   https://github.com/framersai/voice-chat-assistant.git \
   --sparse codex-viewer-starter
 cd codex-viewer-starter
 git sparse-checkout set examples/codex-viewer-starter

pnpm install
pnpm dev
```
Open http://localhost:5173 and explore the embedded viewer.

## 2 · Project Layout

```text
examples/codex-viewer-starter
├─ src/
│  ├─ App.tsx          – mounts <CodexViewer />
│  └─ main.tsx         – Vite entry
├─ weaves/             – your content lives here
│  ├─ tech/            – first weave
│  │  ├─ loom.yaml
│  │  └─ introduction.md
│  └─ philosophy/      – second weave
│      ├─ loom.yaml
│      └─ stoicism.md
└─ codex.config.json   – minimal config consumed by the viewer
```

### weave/loom/strand conventions

• **weave** = top-level folder inside `weaves/` (e.g. `tech`).
• **loom**  = subfolder or markdown file group (metadata in `loom.yaml`).
• **strand** = individual markdown files.

The viewer auto-discovers this hierarchy—no special build step required.

## 3 · Adding Your Own Content

1. Duplicate a weave folder and rename it.
2. Edit or add `loom.yaml` (front-matter-like metadata).
3. Drop markdown files anywhere inside that weave.
4. Run `pnpm dev` again; hot-reload will pick up the new strands.

## 4 · Embedding in Another App

```tsx
import { CodexViewer } from '@framers/codex-viewer';

function Documentation() {
  return (
    <CodexViewer
      gitRepoUrl="https://github.com/you/your-docs"
      basePath="weaves"
      accentColor="#059669" // optional – Tailwind emerald-600
    />
  );
}
```

Props are documented in the main `@framers/codex-viewer` README.

## 5 · Schema Cheatsheet

```yaml
# loom.yaml
id: tech-intro
title: Technology Overview
summary: High-level tour of our stack.
tags: [architecture, overview]
```

(You can also put YAML front-matter at the top of any `.md` strand.)

---

MIT © Frame.dev
