---
title: "Extensions Overview"
sidebar_position: 1
---



# AgentOS Extensions

Extension source code for AgentOS — tools, channel adapters, integrations, and starter templates.

[![CI Status](https://github.com/framersai/agentos-extensions/workflows/CI/badge.svg)](https://github.com/framersai/agentos-extensions/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Docs](https://img.shields.io/badge/docs-TypeDoc-blue)](https://framersai.github.io/agentos-extensions/)
[![npm: registry](https://img.shields.io/npm/v/@framers/agentos-extensions-registry?label=registry)](https://www.npmjs.com/package/@framers/agentos-extensions-registry)
[![npm: catalog](https://img.shields.io/npm/v/@framers/agentos-extensions?label=catalog)](https://www.npmjs.com/package/@framers/agentos-extensions)

## What This Package Is

This package contains the **actual implementation source code** for AgentOS extensions:
the Telegram adapter, web-search tool, voice providers, browser automation, channel adapters
for 37 platforms, and more. It also ships **starter templates** (`templates/`) for creating
new extensions from scratch.

**This is NOT a registry.** It is the source code that registries catalog. The relationship
between the two sibling packages is:

| Package | Role |
|---------|------|
| **`@framers/agentos-extensions`** (this package) | Implementation source code, manifests, and templates |
| **`@framers/agentos-extensions-registry`** | Catalog/SDK that references this package's metadata and exposes `createCuratedManifest()` |

**Dependency direction:** `agentos-extensions-registry` depends on metadata from this package,
not the other way around. Extensions here are self-contained and can be installed individually
without the registry.

## Published Extensions

All extensions are published to npm under the `@framers` scope.

### Extensions

| Package | Description | npm |
|---------|-------------|-----|
| [`@framers/agentos-ext-web-search`](/extensions/built-in/web-search) | Multi-provider web search & fact-checking |  |
| [`@framers/agentos-ext-web-browser`](/extensions/built-in/web-browser) | Browser automation & content extraction |  |
| [`@framers/agentos-ext-web-scraper`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/research/web-scraper) | Progressive scraping with fetch, Playwright, stealth, recipes, and LLM fallback extraction |  |
| [`@framers/agentos-ext-news-search`](/extensions/built-in/news-search) | News article search via NewsAPI |  |
| [`@framers/agentos-ext-giphy`](/extensions/built-in/giphy) | GIF & sticker search via Giphy API |  |
| [`@framers/agentos-ext-image-search`](/extensions/built-in/image-search) | Stock photo search (Pexels, Unsplash, Pixabay) |  |
| [`@framers/agentos-ext-letterboxd`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/media/letterboxd) | Letterboxd movie lookup with review extraction and direct page fallback |  |
| [`@framers/agentos-ext-omdb`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/media/omdb) | Movie and TV metadata with IMDB, Rotten Tomatoes, and Metacritic ratings |  |
| [`@framers/agentos-ext-voice-synthesis`](/extensions/built-in/voice-synthesis) | Text-to-speech via ElevenLabs |  |
| [`@framers/agentos-ext-cli-executor`](/extensions/built-in/cli-executor) | Shell command execution & file management |  |
| [`@framers/agentos-ext-auth`](/extensions/built-in/auth) | JWT authentication & subscription management |  |
| [`@framers/agentos-ext-clearbit`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/integrations/clearbit) | Company and person enrichment via Clearbit |  |
| [`@framers/agentos-ext-telegram`](/extensions/built-in/telegram) | Telegram Bot API integration |  |
| [`@framers/agentos-ext-wunderbot-feeds`](https://www.npmjs.com/package/@framers/agentos-ext-wunderbot-feeds) | Wunderbot feed ingestion + social content pipeline integration |  |
| [`@framers/agentos-ext-telegram-bot`](/extensions/built-in/telegram-bot) | Telegram bot communications handler |  |
| [`@framers/agentos-ext-anchor-providers`](/extensions/built-in/anchor-providers) | Solana on-chain provenance anchoring |  |
| [`@framers/agentos-ext-tip-ingestion`](https://www.npmjs.com/package/@framers/agentos-ext-tip-ingestion) | Tip content processing pipeline |  |
| [`@framers/agentos-ext-browser-automation`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/system/browser-automation) | Full browser automation (Playwright) — 10 tools |  |
| [`@framers/agentos-ext-deep-research`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/research/deep-research) | Multi-source research & investigation — 5 tools |  |
| [`@framers/agentos-ext-content-extraction`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/research/content-extraction) | Content extraction (URLs, YouTube, PDF) — 5 tools |  |
| [`@framers/agentos-ext-credential-vault`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/system/credential-vault) | Encrypted credential management — 5 tools |  |
| [`@framers/agentos-ext-document-export`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/productivity/document-export) | Export reports and decks to PDF, DOCX, PPTX, XLSX, and CSV |  |
| [`@framers/agentos-ext-widget-generator`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/productivity/widget-generator) | Generate self-contained interactive HTML widgets with file management |  |
| [`@framers/agentos-ext-notifications`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/communications/notifications) | Multi-channel notification router — 3 tools |  |

### Channel Adapters

| Package | Description | npm |
|---------|-------------|-----|
| [`@framers/agentos-ext-channel-telegram`](/extensions/built-in/channel-telegram) | Telegram messaging channel (grammY) |  |
| [`@framers/agentos-ext-channel-whatsapp`](/extensions/built-in/channel-whatsapp) | WhatsApp messaging channel (Baileys) |  |
| [`@framers/agentos-ext-channel-discord`](/extensions/built-in/channel-discord) | Discord messaging channel (discord.js) |  |
| [`@framers/agentos-ext-channel-slack`](/extensions/built-in/channel-slack) | Slack messaging channel (Bolt) |  |
| [`@framers/agentos-ext-channel-webchat`](/extensions/built-in/channel-webchat) | Built-in WebChat channel (Socket.IO) |  |
| [`@framers/agentos-ext-channel-twitter`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/twitter) | Twitter/X social channel (twitter-api-v2) |  |
| [`@framers/agentos-ext-channel-instagram`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/instagram) | Instagram social channel (Graph API) |  |
| [`@framers/agentos-ext-channel-reddit`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/reddit) | Reddit social channel (snoowrap) |  |
| [`@framers/agentos-ext-channel-youtube`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/youtube) | YouTube social channel (googleapis) |  |
| [`@framers/agentos-ext-channel-linkedin`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/linkedin) | LinkedIn social channel (Marketing API) |  |
| [`@framers/agentos-ext-channel-facebook`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/facebook) | Facebook social channel (Meta Graph API) |  |
| [`@framers/agentos-ext-channel-threads`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/threads) | Threads social channel (Meta Graph API) |  |
| [`@framers/agentos-ext-channel-bluesky`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/bluesky) | Bluesky social channel (AT Protocol) |  |
| [`@framers/agentos-ext-channel-mastodon`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/mastodon) | Mastodon social channel (federated) |  |
| [`@framers/agentos-ext-channel-farcaster`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/farcaster) | Farcaster social channel (Neynar API) |  |
| [`@framers/agentos-ext-channel-lemmy`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/lemmy) | Lemmy federated social channel |  |
| [`@framers/agentos-ext-channel-google-business`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/google-business) | Google Business Profile channel |  |
| [`@framers/agentos-ext-channel-blog-publisher`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/blog-publisher) | Blog publisher (Dev.to, Hashnode, Medium, WordPress) |  |
| [`@framers/agentos-ext-channel-pinterest`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/pinterest) | Pinterest social channel (API v5) |  |
| [`@framers/agentos-ext-channel-tiktok`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/tiktok) | TikTok social channel (API for Business) |  |
| [`@framers/agentos-ext-channel-email`](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/channels/email) | Email messaging channel (nodemailer/imapflow) |  |

## Two-Tier Extension Pattern

AgentOS extensions are organized into two tiers with different versioning and
release strategies:

### Core Extensions (monorepo root)

Seven foundational packages live at the monorepo root under `packages/agentos-ext-*`.
These are **independently versioned** with semantic-release CI/CD and have their own
GitHub Actions workflows:

| Package | Description |
|---------|-------------|
| `agentos-ext-code-safety` | Static code analysis guardrail (injection, XSS, secrets) |
| `agentos-ext-pii-redaction` | PII detection & redaction pipeline |
| `agentos-ext-grounding-guard` | Claim extraction & source verification |
| `agentos-ext-ml-classifiers` | ML-based content classification (toxicity, jailbreak, injection) |
| `agentos-ext-topicality` | Topic drift detection & off-topic filtering |
| `agentos-ext-http-api` | HTTP API server for AgentOS |
| `agentos-ext-skills` | Skill loading & execution tooling |

Each has its own `.github/` CI workflow, `.releaserc.json`, and publishes to npm
independently. Version bumps here do **not** affect curated extension versions.

### Curated Extensions (this submodule)

~107 packages inside `registry/curated/` use coordinated versioning via
[Changesets](https://github.com/changesets/changesets). These are the full
extension catalog: channel adapters, integrations, research tools, media tools,
and more.

Version bumps here are batched into "Version Packages" PRs and published together.

### Why two tiers?

- **Core extensions** are safety-critical guardrails and foundational infrastructure.
  They need independent semver to signal breaking changes without forcing a catalog-wide
  release. Their CI runs on every PR to the monorepo root.
- **Curated extensions** are the broader catalog. Coordinated changesets keep their
  interdependencies aligned and simplify bulk releases.

### Where do safety guardrails live?

The `registry/curated/safety/` directory contains **stub READMEs** pointing to the
canonical core packages at the monorepo root. The actual source code for code-safety,
pii-redaction, and grounding-guard lives exclusively in `packages/agentos-ext-*` at
the monorepo root. The ml-classifiers and topicality packages still have curated
copies with additional modules (ClassifierOrchestrator, TopicDriftTracker, etc.) that
have not yet been merged upstream to the root packages.

## Repository Structure

```
agentos-extensions/
├── .changeset/            # Changesets for versioning & publishing
├── .github/workflows/     # CI, release, TypeDoc pages
├── logos/                 # Branding assets
├── templates/             # Starter templates for new extensions
│   ├── basic-tool/        # Single tool template
│   ├── multi-tool/        # Multiple tools template
│   ├── guardrail/         # Safety/compliance template
│   └── workflow/          # Multi-step process template
├── registry/
│   ├── curated/           # Official & verified extensions
│   │   ├── auth/          # Authentication & subscriptions
│   │   ├── channels/      # Messaging & social channels (37 platform packs)
│   │   ├── communications/# Telegram bot, notifications
│   │   ├── integrations/  # External services (Telegram API)
│   │   ├── media/         # Giphy, image search, voice synthesis
│   │   ├── provenance/    # On-chain anchoring & tip ingestion
│   │   ├── research/      # Web search, deep research, content extraction
│   │   ├── safety/        # Stub READMEs -> core packages (see above)
│   │   ├── system/        # CLI executor, browser automation, credential vault
│   │   ├── voice/         # Twilio, Telnyx, Plivo voice providers
│   │   └── productivity/  # Google Calendar, Gmail
│   └── community/         # Community-contributed extensions
├── scripts/               # Registry build & scaffolding tools
├── registry.json          # Auto-generated extension manifest
├── pnpm-workspace.yaml    # Workspace packages for publishing
└── typedoc.json           # API docs config
```

## Quick Start

### Install the registry (recommended)

Load all extensions at once via the curated registry:

```bash
npm install @framers/agentos-extensions-registry
```

```typescript
import { AgentOS } from '@framers/agentos';
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

const manifest = await createCuratedManifest({
  tools: 'all',
  channels: 'none',
  secrets: {
    'serper.apiKey': process.env.SERPER_API_KEY!,
    'giphy.apiKey': process.env.GIPHY_API_KEY!,
  },
});

const agentos = new AgentOS();
await agentos.initialize({ extensionManifest: manifest });
```

Only extensions whose npm packages are installed will load — missing packages are skipped silently.

### Install individual extensions

```bash
npm install @framers/agentos-ext-web-search
```

```typescript
import { AgentOS } from '@framers/agentos';
import webSearch from '@framers/agentos-ext-web-search';

const agentos = new AgentOS();
await agentos.initialize({
  extensionManifest: {
    packs: [{
      factory: () => webSearch({ /* config */ })
    }]
  }
});
```

### Registry options

`createCuratedManifest()` accepts:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tools` | `string[] \| 'all' \| 'none'` | `'all'` | Which tool extensions to enable. Pass an array of names (e.g. `['web-search', 'giphy']`) to selectively load. |
| `channels` | `ChannelPlatform[] \| 'all' \| 'none'` | `'all'` | Which messaging channels to enable. |
| `secrets` | `Record<string, string>` | `{}` | API keys and tokens. Falls back to environment variables. |
| `logger` | `RegistryLogger` | `console` | Custom logger (`info`, `warn`, `error`, `debug` methods). |
| `basePriority` | `number` | `0` | Base priority for all extensions. |
| `overrides` | `Record<string, ExtensionOverrideConfig>` | — | Per-extension overrides for `enabled`, `priority`, and `options`. |

#### Secret keys

| Secret ID | Environment Variable | Extension |
|-----------|---------------------|-----------|
| `serper.apiKey` | `SERPER_API_KEY` | web-search |
| `serpapi.apiKey` | `SERPAPI_API_KEY` | web-search |
| `brave.apiKey` | `BRAVE_API_KEY` | web-search |
| `giphy.apiKey` | `GIPHY_API_KEY` | giphy |
| `omdb.apiKey` | `OMDB_API_KEY` | omdb |
| `clearbit.apiKey` | `CLEARBIT_API_KEY` | clearbit |
| `elevenlabs.apiKey` | `ELEVENLABS_API_KEY` | voice-synthesis |
| `pexels.apiKey` | `PEXELS_API_KEY` | image-search |
| `unsplash.apiKey` | `UNSPLASH_ACCESS_KEY` | image-search |
| `pixabay.apiKey` | `PIXABAY_API_KEY` | image-search |
| `newsapi.apiKey` | `NEWSAPI_API_KEY` | news-search |
| `telegram.botToken` | `TELEGRAM_BOT_TOKEN` | channel-telegram |
| `discord.botToken` | `DISCORD_BOT_TOKEN` | channel-discord |
| `slack.botToken` | `SLACK_BOT_TOKEN` | channel-slack |
| `slack.appToken` | `SLACK_APP_TOKEN` | channel-slack |
| `twitter.bearerToken` | `TWITTER_BEARER_TOKEN` | channel-twitter |
| `twitter.apiKey` | `TWITTER_API_KEY` | channel-twitter |
| `twitter.apiSecret` | `TWITTER_API_SECRET` | channel-twitter |
| `twitter.accessToken` | `TWITTER_ACCESS_TOKEN` | channel-twitter |
| `twitter.accessSecret` | `TWITTER_ACCESS_SECRET` | channel-twitter |
| `instagram.accessToken` | `INSTAGRAM_ACCESS_TOKEN` | channel-instagram |
| `linkedin.accessToken` | `LINKEDIN_ACCESS_TOKEN` | channel-linkedin |
| `facebook.accessToken` | `FACEBOOK_ACCESS_TOKEN` | channel-facebook |
| `threads.accessToken` | `THREADS_ACCESS_TOKEN` | channel-threads |
| `bluesky.handle` | `BLUESKY_HANDLE` | channel-bluesky |
| `bluesky.appPassword` | `BLUESKY_APP_PASSWORD` | channel-bluesky |
| `mastodon.accessToken` | `MASTODON_ACCESS_TOKEN` | channel-mastodon |
| `farcaster.neynarApiKey` | `FARCASTER_NEYNAR_API_KEY` | channel-farcaster |
| `farcaster.signerUuid` | `FARCASTER_SIGNER_UUID` | channel-farcaster |
| `lemmy.instanceUrl` | `LEMMY_INSTANCE_URL` | channel-lemmy |
| `lemmy.username` | `LEMMY_USERNAME` | channel-lemmy |
| `lemmy.password` | `LEMMY_PASSWORD` | channel-lemmy |
| `google.accessToken` | `GOOGLE_ACCESS_TOKEN` | channel-google-business |
| `reddit.clientId` | `REDDIT_CLIENT_ID` | channel-reddit |
| `reddit.clientSecret` | `REDDIT_CLIENT_SECRET` | channel-reddit |
| `reddit.username` | `REDDIT_USERNAME` | channel-reddit |
| `reddit.password` | `REDDIT_PASSWORD` | channel-reddit |
| `youtube.apiKey` | `YOUTUBE_API_KEY` | channel-youtube |
| `pinterest.accessToken` | `PINTEREST_ACCESS_TOKEN` | channel-pinterest |
| `tiktok.accessToken` | `TIKTOK_ACCESS_TOKEN` | channel-tiktok |
| `email.smtpHost` | `SMTP_HOST` | channel-email |
| `email.smtpUser` | `SMTP_USER` | channel-email |
| `email.smtpPassword` | `SMTP_PASSWORD` | channel-email |

#### Selective loading examples

```typescript
// Only web search and giphy, no channels
const manifest = await createCuratedManifest({
  tools: ['web-search', 'giphy'],
  channels: 'none',
});

// Only Telegram and Discord channels, all tools
const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord'],
  tools: 'all',
  secrets: {
    'telegram.botToken': process.env.TELEGRAM_BOT_TOKEN!,
    'discord.botToken': process.env.DISCORD_BOT_TOKEN!,
  },
});

// Override specific extension options
const manifest = await createCuratedManifest({
  tools: 'all',
  channels: 'none',
  overrides: {
    'web-search': { priority: 10 },
    'cli-executor': { enabled: false },
  },
});
```

### Create a new extension

```bash
# Use the scaffolding script
pnpm run create-extension

# Or copy a template
cp -r templates/basic-tool registry/curated/category/my-extension
cd registry/curated/category/my-extension
pnpm install
pnpm run dev
```

## Releasing & Publishing

This repo uses [Changesets](https://github.com/changesets/changesets) for multi-package versioning and npm publishing. See [RELEASING.md](/getting-started/releasing) for the full workflow.

### TL;DR

```bash
# 1. Make your changes to one or more extensions

# 2. Add a changeset describing what changed
pnpm changeset

# 3. Commit and push to master
git add . && git commit -m "feat: my changes" && git push

# 4. The GitHub Action opens a "Version Packages" PR
#    → Merge it to publish updated packages to npm
```

Each extension is versioned and published independently. A change to `web-search` does not bump `telegram`.

## Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Extension | `@framers/agentos-ext-{name}` | `@framers/agentos-ext-web-search` |
| Template | `@framers/agentos-template-{type}` | `@framers/agentos-template-basic-tool` |

## CI/CD

All extensions get free CI/CD via GitHub Actions:

- **CI** (`ci.yml`): Lint, test, typecheck on every PR
- **Release** (`release.yml`): Changesets auto-version PRs + npm publish on merge
- **TypeDoc** (`pages-typedoc.yml`): API docs deployed to [framersai.github.io/agentos-extensions](https://framersai.github.io/agentos-extensions/)
- **Extension validation** (`extension-validation.yml`): Manifest & structure checks
- **Dependabot**: Automated dependency updates with auto-merge for patches

## Quality Standards

### All Extensions

- TypeScript with strict mode
- >80% test coverage
- MIT license
- No hardcoded secrets

### Additional for Curated

- Professional code review
- Performance benchmarks
- Integration tests
- Migration guides

## Documentation

- [API Reference (TypeDoc)](https://framersai.github.io/agentos-extensions/)
- [How Extensions Work](/extensions/how-extensions-work)
- [Extension Architecture](/extensions/extension-architecture)
- [Auto-Loading Extensions](/extensions/auto-loading)
- [Agency Collaboration Examples](/features/agency-collaboration)
- [Self-Hosted Registries](/extensions/self-hosted-registries)
- [Migration Guide](/extensions/migration-guide)
- [Releasing & Publishing](/getting-started/releasing)
- [Contributing](/extensions/contributing)

## Contributing

See [CONTRIBUTING.md](/extensions/contributing) for detailed guidelines.

- [Submit New Extension](https://github.com/framersai/agentos-extensions/issues/new?template=new-extension.yml)
- [Report Bug](https://github.com/framersai/agentos-extensions/issues/new?template=bug-report.yml)
- [Request Feature](https://github.com/framersai/agentos-extensions/discussions)

## Links

- **AgentOS**: [agentos.sh](https://agentos.sh)
- **AgentOS GitHub**: [github.com/framersai/agentos](https://github.com/framersai/agentos)
- **Extensions GitHub**: [github.com/framersai/agentos-extensions](https://github.com/framersai/agentos-extensions)
- **Mars Genesis Demo**: [github.com/framersai/mars-genesis-simulation](https://github.com/framersai/mars-genesis-simulation)
- **npm**: [@framers](https://www.npmjs.com/org/framers)
- **API Docs**: [framersai.github.io/agentos-extensions](https://framersai.github.io/agentos-extensions/)
- **Discord**: [wilds.ai/discord](https://wilds.ai/discord)
- **Website**: [frame.dev](https://frame.dev)
- **Contact**: [team@frame.dev](mailto:team@frame.dev)

## License

All extensions in this repository are MIT licensed.

---




