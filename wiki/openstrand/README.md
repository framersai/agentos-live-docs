<div align="center">
  <img src="../../logos/openstrand-logo.svg" alt="OpenStrand" width="150">

# OpenStrand

**AI-native personal knowledge management system**

[Website](https://openstrand.ai) • [GitHub](https://github.com/framersai/openstrand) • [Documentation](#documentation)

</div>

---

## 🧠 What is OpenStrand?

OpenStrand is a revolutionary personal knowledge management system (PKMS) that seamlessly integrates AI capabilities with local-first architecture. Built on top of Frame Codex, it provides an intuitive interface for capturing, connecting, and discovering knowledge.

### Core Philosophy

- **🏠 Local-First**: Your data stays on your device by default
- **🤖 AI-Native**: Built from the ground up with AI integration
- **🔗 Connected**: Knowledge graph visualization and semantic linking
- **🚀 Fast**: Instant search and retrieval with vector embeddings
- **🔒 Private**: End-to-end encryption for cloud sync

## ✨ Key Features

### Knowledge Management

- **Universal Import**: Support for 20+ formats including Markdown, Notion, Obsidian, Roam, and more
- **Smart Organization**: AI-powered categorization and tagging
- **Visual Knowledge Graph**: Interactive 3D visualization of connections
- **Block References**: Transclusion and block-level linking
- **Version History**: Git-like branching and merging for notes

### AI Integration

- **Semantic Search**: Find information by meaning, not just keywords
- **AI Assistant**: Context-aware chat that understands your knowledge base
- **Smart Suggestions**: AI-powered link and tag recommendations
- **Content Generation**: AI-assisted writing with your knowledge as context
- **Knowledge Synthesis**: Discover insights across your notes

### Technical Features

- **TypeScript Monorepo**: Modern, type-safe architecture
- **Database Abstraction**: PostgreSQL in cloud, PGlite locally
- **Real-time Sync**: Conflict-free replicated data types (CRDTs)
- **Plugin System**: Extensible architecture for custom workflows
- **API-First**: REST and GraphQL APIs for integration

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenStrand Client                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Next.js   │  │    Editor     │  │  Knowledge Graph │  │
│  │   Web App   │  │  Components   │  │   Visualization  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    OpenStrand SDK                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Core API   │  │     Sync      │  │       AI         │  │
│  │   Methods    │  │    Engine     │  │   Integration    │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                   OpenStrand Server                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Fastify    │  │  PostgreSQL   │  │     Vector      │  │
│  │     API      │  │   Database    │  │      Store      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      Frame Codex                             │
│                  (Knowledge Repository)                      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/framersai/openstrand.git
cd openstrand

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Quick Start

1. **Create your first vault**
   ```typescript
   import { OpenStrand } from '@openstrand/sdk';
   
   const os = new OpenStrand();
   const vault = await os.createVault('My Knowledge');
   ```

2. **Import existing notes**
   ```typescript
   await vault.import({
     source: './obsidian-vault',
     format: 'obsidian'
   });
   ```

3. **Search your knowledge**
   ```typescript
   const results = await vault.search('machine learning concepts');
   ```

## 📚 Core Concepts

### Strands, Looms, and Weaves

OpenStrand adopts Frame Codex's organizational model:

- **Strand**: Atomic unit of knowledge (note, document, image, etc.)
- **Loom**: Collection of related strands (project, topic, course)
- **Weave**: Complete knowledge universe (personal vault, team workspace)

### Local-First Architecture

```typescript
// Data stays local by default
const strand = await vault.createStrand({
  title: 'My Private Thoughts',
  content: 'This stays on my device...',
  syncEnabled: false  // No cloud sync
});

// Selective sync when needed
await strand.enableSync({
  encrypted: true,
  shareWith: ['team@example.com']
});
```

### AI-Powered Features

```typescript
// Semantic search
const similar = await vault.findSimilar(strand, {
  threshold: 0.8,
  limit: 10
});

// AI chat with context
const response = await vault.chat('Summarize my notes on quantum computing', {
  context: ['physics-loom', 'research-papers']
});

// Smart suggestions
const suggestions = await strand.getSuggestions({
  links: true,
  tags: true,
  relatedContent: true
});
```

## 🛠️ Development

### Project Structure

```
openstrand/
├── apps/
│   ├── web/          # Next.js web application
│   └── desktop/      # Electron desktop app (planned)
├── packages/
│   ├── core/         # Core business logic
│   ├── sdk/          # TypeScript SDK
│   ├── ui/           # Shared UI components
│   └── sync/         # Sync engine
├── server/           # Fastify API server
└── docs/            # Documentation
```

### Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Fastify, PostgreSQL, Redis
- **AI/ML**: OpenAI, Anthropic, local models via Ollama
- **Search**: pgvector for embeddings, MeiliSearch for full-text
- **Visualization**: D3.js, Three.js for 3D graphs

## 🔌 Integrations

### Import Sources

- Markdown files (.md)
- Notion export
- Obsidian vault
- Roam Research
- Evernote
- OneNote
- Apple Notes
- Google Docs
- PDFs
- Web pages
- YouTube transcripts
- And more...

### Export Formats

- Markdown
- HTML
- PDF
- OPML
- JSON
- Frame Codex format

### Third-Party Services

- **AI Providers**: OpenAI, Anthropic, Cohere, local models
- **Storage**: Local filesystem, S3-compatible, IPFS
- **Sync**: WebDAV, Git, proprietary sync
- **Publishing**: Static sites, blogs, wikis

## 🔐 Security & Privacy

### Data Protection

- **Encryption**: AES-256 for data at rest
- **Transport**: TLS 1.3 for all communications
- **Zero-Knowledge**: Optional E2E encryption for cloud sync
- **Local Storage**: SQLite/PGlite with encryption

### Privacy Features

- **No Telemetry**: No usage tracking by default
- **Local AI**: Option to use local models
- **Data Ownership**: Export everything, anytime
- **Right to Delete**: Complete data removal

## 📖 Documentation

- [Architecture](./architecture.md) - Technical deep dive
- [Features](./features.md) - Detailed feature documentation
- [API Reference](./api.md) - SDK and API documentation
- [Plugins](./plugins.md) - Plugin development guide

## 🗺️ Roadmap

### Current Focus (v0.3.0)
- [ ] Mobile apps (iOS/Android)
- [ ] Collaborative features
- [ ] Plugin marketplace
- [ ] Advanced AI features

### Future Plans
- Real-time collaboration
- Voice notes with transcription
- AR/VR knowledge exploration
- Federated knowledge networks

## 🤝 Community

- **GitHub**: [github.com/framersai/openstrand](https://github.com/framersai/openstrand)
- **Discord**: [discord.gg/openstrand](https://discord.gg/openstrand)
- **Twitter**: [@openstrand](https://twitter.com/openstrand)
- **Forum**: [community.openstrand.ai](https://community.openstrand.ai)

## 📄 License

OpenStrand is available under dual licensing:
- **Community Edition**: MIT License
- **Enterprise Edition**: Commercial license with support

See [LICENSE](https://github.com/framersai/openstrand/LICENSE) for details.

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
  <sub>Your second brain, powered by AI</sub>
</div>
