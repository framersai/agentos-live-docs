# @framers/codex-viewer

> Embeddable GitHub-based knowledge viewer with analog paper styling, semantic search, and wiki features.

[![npm version](https://img.shields.io/npm/v/@framers/codex-viewer)](https://www.npmjs.com/package/@framers/codex-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- 📚 **GitHub-native**: Read markdown files directly from any public GitHub repo
- 🔍 **Smart Search**: BM25 + semantic re-ranking with client-side embeddings
- 🎨 **Analog Aesthetic**: Paper texture, inner shadows, book-like navigation
- 🌓 **Dark Mode**: Automatic theme detection with manual override
- 📱 **Responsive**: Mobile-first design with touch gestures
- 🔗 **Wiki Links**: Internal cross-references, backlinks, metadata panel
- ⚡ **Fast**: SQL-cached indexing, incremental updates
- 🎯 **Zero Config**: Works out-of-the-box with sensible defaults

## Installation

```bash
npm install @framers/codex-viewer
# or
pnpm add @framers/codex-viewer
# or
yarn add @framers/codex-viewer
```

## Quick Start

```tsx
import { CodexViewer } from '@framers/codex-viewer'
import '@framers/codex-viewer/styles.css'

export default function App() {
  return (
    <CodexViewer
      owner="framersai"
      repo="codex"
      branch="main"
    />
  )
}
```

> Want a complete site scaffold? Fork [`framersai/codex-template`](https://github.com/framersai/codex-template) (source mirrored in `examples/codex-template/`). It includes hero copy, environment setup, and two sample weaves.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `owner` | `string` | **required** | GitHub repository owner |
| `repo` | `string` | **required** | GitHub repository name |
| `branch` | `string` | `'main'` | Git branch to read from |
| `basePath` | `string` | `'weaves'` | Root directory for content |
| `defaultPath` | `string` | `''` | Initial path to load |
| `className` | `string` | `''` | Additional CSS classes |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `enableSearch` | `boolean` | `true` | Enable semantic search |
| `enableMetadata` | `boolean` | `true` | Show metadata panel |

## Styling

The viewer uses Tailwind CSS with custom analog-inspired design tokens. You can override styles via CSS variables:

```css
:root {
  --codex-bg-paper: #fafaf9;
  --codex-text-primary: #0a0a0a;
  --codex-accent: #0891b2; /* cyan-600 */
  --codex-border: #d4d4d8;
}

[data-theme="dark"] {
  --codex-bg-paper: #0a0a0a;
  --codex-text-primary: #fafafa;
  --codex-accent: #22d3ee;
  --codex-border: #27272a;
}
```

## Content Structure

The viewer expects a GitHub repo that follows the Frame Codex hierarchy — a **Fabric** (the whole repo) composed of
multiple **Weaves**, each containing **Looms** and **Strands**:

```
weaves/
  frame/
    weave.yaml          # Metadata (title, description, etc.)
    overview.md         # Top-level strand
    architecture/       # Loom (folder)
      systems.md        # Nested strand
  wiki/
    weave.yaml
    guides/
      getting-started.md
```

### Weave (Root Collection)
Top-level folder under `weaves/`. Each weave is self-contained.

### Loom (Folder)
Any folder inside a weave. Can be nested arbitrarily deep.

### Strand (Markdown File)
Individual `.md` files. Can include YAML frontmatter:

```yaml
---
title: "Getting Started"
tags: [guide, tutorial]
version: "1.0"
---
# Content here...
```

## PWA Support

To make your Codex viewer installable as a desktop/mobile app, add a manifest:

```json
{
  "name": "My Knowledge Base",
  "short_name": "Codex",
  "description": "Personal knowledge repository",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fafaf9",
  "theme_color": "#0891b2",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Advanced Usage

### Custom Search

```tsx
import { CodexViewer, useCodexSearch } from '@framers/codex-viewer'

function MyApp() {
  const { results, search, isLoading } = useCodexSearch({
    owner: 'framersai',
    repo: 'codex',
  })

  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      {results.map(r => <div key={r.path}>{r.title}</div>)}
    </div>
  )
}
```

### Programmatic Navigation

```tsx
import { CodexViewer, useCodexNavigation } from '@framers/codex-viewer'

function MyApp() {
  const { navigate, currentPath } = useCodexNavigation()

  return (
    <CodexViewer
      owner="framersai"
      repo="codex"
      onNavigate={(path) => {
        console.log('Navigated to:', path)
        // Track analytics, update URL, etc.
      }}
    />
  )
}
```

## Development

```bash
# Clone the repo
git clone https://github.com/manicinc/voice-chat-assistant
cd voice-chat-assistant/packages/codex-viewer

# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode (for development)
pnpm dev
```

## Contributing

Contributions welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) first.

## License

MIT © [Framers AI](https://frame.dev)

## Links

- [Documentation](https://frame.dev/codex)
- [Starter Template](https://github.com/framersai/codex-template)
- [GitHub](https://github.com/manicinc/voice-chat-assistant/tree/master/packages/codex-viewer)
- [NPM](https://www.npmjs.com/package/@framers/codex-viewer)
- [Issues](https://github.com/manicinc/voice-chat-assistant/issues)

