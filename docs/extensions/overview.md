---
title: 'Extensions Overview'
sidebar_position: 1
---

# AgentOS Extensions

Official extension registry for the AgentOS ecosystem.

[![CI Status](https://github.com/framersai/agentos-extensions/workflows/CI/badge.svg)](https://github.com/framersai/agentos-extensions/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Docs](https://img.shields.io/badge/docs-TypeDoc-blue)](https://framersai.github.io/agentos-extensions/)
[![npm: registry](https://img.shields.io/npm/v/@framers/agentos-extensions-registry?label=registry)](https://www.npmjs.com/package/@framers/agentos-extensions-registry)
[![npm: catalog](https://img.shields.io/npm/v/@framers/agentos-extensions?label=catalog)](https://www.npmjs.com/package/@framers/agentos-extensions)

## Published Extensions

All extensions are published to npm under the `@framers` scope.

### Registry Packages

| Package                                                                                                      | Description                                                            | npm |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | --- |
| [`@framers/agentos-extensions-registry`](https://www.npmjs.com/package/@framers/agentos-extensions-registry) | Curated registry bundle — single import with `createCuratedManifest()` |     |
| [`@framers/agentos-extensions`](https://www.npmjs.com/package/@framers/agentos-extensions)                   | Static catalog (`registry.json`) of all extensions                     |     |

### Extensions

| Package                                                                                     | Description                                       | npm |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------- | --- |
| [`@framers/agentos-ext-web-search`](/docs/extensions/built-in/web-search)                   | Multi-provider web search & fact-checking         |     |
| [`@framers/agentos-ext-web-browser`](/docs/extensions/built-in/web-browser)                 | Browser automation & content extraction           |     |
| [`@framers/agentos-ext-news-search`](/docs/extensions/built-in/news-search)                 | News article search via NewsAPI                   |     |
| [`@framers/agentos-ext-giphy`](/docs/extensions/built-in/giphy)                             | GIF & sticker search via Giphy API                |     |
| [`@framers/agentos-ext-image-search`](/docs/extensions/built-in/image-search)               | Stock photo search (Pexels, Unsplash, Pixabay)    |     |
| [`@framers/agentos-ext-voice-synthesis`](/docs/extensions/built-in/voice-synthesis)         | Text-to-speech via ElevenLabs                     |     |
| [`@framers/agentos-ext-cli-executor`](/docs/extensions/built-in/cli-executor)               | Shell command execution & file management         |     |
| [`@framers/agentos-ext-auth`](/docs/extensions/built-in/auth)                               | JWT authentication & subscription management      |     |
| [`@framers/agentos-ext-telegram`](/docs/extensions/built-in/telegram)                       | Telegram Bot API integration                      |     |
| [`@framers/agentos-ext-telegram-bot`](/docs/extensions/built-in/telegram-bot)               | Telegram bot communications handler               |     |
| [`@framers/agentos-ext-anchor-providers`](/docs/extensions/built-in/anchor-providers)       | Solana on-chain provenance anchoring              |     |
| [`@framers/agentos-ext-tip-ingestion`](/docs/extensions/built-in/tip-ingestion)             | Tip content processing pipeline                   |     |
| [`@framers/agentos-ext-browser-automation`](./registry/curated/system/browser-automation)   | Full browser automation (Playwright) — 10 tools   |     |
| [`@framers/agentos-ext-deep-research`](./registry/curated/research/deep-research)           | Multi-source research & investigation — 5 tools   |     |
| [`@framers/agentos-ext-content-extraction`](./registry/curated/research/content-extraction) | Content extraction (URLs, YouTube, PDF) — 5 tools |     |
| [`@framers/agentos-ext-credential-vault`](./registry/curated/system/credential-vault)       | Encrypted credential management — 5 tools         |     |
| [`@framers/agentos-ext-notifications`](./registry/curated/communications/notifications)     | Multi-channel notification router — 3 tools       |     |

### Channel Adapters

| Package                                                                               | Description                                   | npm |
| ------------------------------------------------------------------------------------- | --------------------------------------------- | --- |
| [`@framers/agentos-ext-channel-telegram`](/docs/extensions/built-in/channel-telegram) | Telegram messaging channel (grammY)           |     |
| [`@framers/agentos-ext-channel-whatsapp`](/docs/extensions/built-in/channel-whatsapp) | WhatsApp messaging channel (Baileys)          |     |
| [`@framers/agentos-ext-channel-discord`](/docs/extensions/built-in/channel-discord)   | Discord messaging channel (discord.js)        |     |
| [`@framers/agentos-ext-channel-slack`](/docs/extensions/built-in/channel-slack)       | Slack messaging channel (Bolt)                |     |
| [`@framers/agentos-ext-channel-webchat`](/docs/extensions/built-in/channel-webchat)   | Built-in WebChat channel (Socket.IO)          |     |
| [`@framers/agentos-ext-channel-twitter`](./registry/curated/channels/twitter)         | Twitter/X social channel (twitter-api-v2)     |     |
| [`@framers/agentos-ext-channel-instagram`](./registry/curated/channels/instagram)     | Instagram social channel (Graph API)          |     |
| [`@framers/agentos-ext-channel-reddit`](./registry/curated/channels/reddit)           | Reddit social channel (snoowrap)              |     |
| [`@framers/agentos-ext-channel-youtube`](./registry/curated/channels/youtube)         | YouTube social channel (googleapis)           |     |
| [`@framers/agentos-ext-channel-pinterest`](./registry/curated/channels/pinterest)     | Pinterest social channel (API v5)             |     |
| [`@framers/agentos-ext-channel-tiktok`](./registry/curated/channels/tiktok)           | TikTok social channel (API for Business)      |     |
| [`@framers/agentos-ext-channel-email`](./registry/curated/channels/email)             | Email messaging channel (nodemailer/imapflow) |     |

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
│   │   ├── channels/      # Messaging & social channels (28 platforms)
│   │   ├── communications/# Telegram bot, notifications
│   │   ├── integrations/  # External services (Telegram API)
│   │   ├── media/         # Giphy, image search, voice synthesis
│   │   ├── provenance/    # On-chain anchoring & tip ingestion
│   │   ├── research/      # Web search, deep research, content extraction
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
    packs: [
      {
        factory: () =>
          webSearch({
            /* config */
          }),
      },
    ],
  },
});
```

### Registry options

`createCuratedManifest()` accepts:

| Option         | Type                                      | Default   | Description                                                                                                   |
| -------------- | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `tools`        | `string[] \| 'all' \| 'none'`             | `'all'`   | Which tool extensions to enable. Pass an array of names (e.g. `['web-search', 'giphy']`) to selectively load. |
| `channels`     | `ChannelPlatform[] \| 'all' \| 'none'`    | `'all'`   | Which messaging channels to enable.                                                                           |
| `secrets`      | `Record<string, string>`                  | `{}`      | API keys and tokens. Falls back to environment variables.                                                     |
| `logger`       | `RegistryLogger`                          | `console` | Custom logger (`info`, `warn`, `error`, `debug` methods).                                                     |
| `basePriority` | `number`                                  | `0`       | Base priority for all extensions.                                                                             |
| `overrides`    | `Record<string, ExtensionOverrideConfig>` | —         | Per-extension overrides for `enabled`, `priority`, and `options`.                                             |

#### Secret keys

| Secret ID               | Environment Variable     | Extension         |
| ----------------------- | ------------------------ | ----------------- |
| `serper.apiKey`         | `SERPER_API_KEY`         | web-search        |
| `serpapi.apiKey`        | `SERPAPI_API_KEY`        | web-search        |
| `brave.apiKey`          | `BRAVE_API_KEY`          | web-search        |
| `giphy.apiKey`          | `GIPHY_API_KEY`          | giphy             |
| `elevenlabs.apiKey`     | `ELEVENLABS_API_KEY`     | voice-synthesis   |
| `pexels.apiKey`         | `PEXELS_API_KEY`         | image-search      |
| `unsplash.apiKey`       | `UNSPLASH_ACCESS_KEY`    | image-search      |
| `pixabay.apiKey`        | `PIXABAY_API_KEY`        | image-search      |
| `newsapi.apiKey`        | `NEWSAPI_API_KEY`        | news-search       |
| `telegram.botToken`     | `TELEGRAM_BOT_TOKEN`     | channel-telegram  |
| `discord.botToken`      | `DISCORD_BOT_TOKEN`      | channel-discord   |
| `slack.botToken`        | `SLACK_BOT_TOKEN`        | channel-slack     |
| `slack.appToken`        | `SLACK_APP_TOKEN`        | channel-slack     |
| `twitter.bearerToken`   | `TWITTER_BEARER_TOKEN`   | channel-twitter   |
| `twitter.apiKey`        | `TWITTER_API_KEY`        | channel-twitter   |
| `twitter.apiSecret`     | `TWITTER_API_SECRET`     | channel-twitter   |
| `twitter.accessToken`   | `TWITTER_ACCESS_TOKEN`   | channel-twitter   |
| `twitter.accessSecret`  | `TWITTER_ACCESS_SECRET`  | channel-twitter   |
| `instagram.accessToken` | `INSTAGRAM_ACCESS_TOKEN` | channel-instagram |
| `reddit.clientId`       | `REDDIT_CLIENT_ID`       | channel-reddit    |
| `reddit.clientSecret`   | `REDDIT_CLIENT_SECRET`   | channel-reddit    |
| `reddit.username`       | `REDDIT_USERNAME`        | channel-reddit    |
| `reddit.password`       | `REDDIT_PASSWORD`        | channel-reddit    |
| `youtube.apiKey`        | `YOUTUBE_API_KEY`        | channel-youtube   |
| `pinterest.accessToken` | `PINTEREST_ACCESS_TOKEN` | channel-pinterest |
| `tiktok.accessToken`    | `TIKTOK_ACCESS_TOKEN`    | channel-tiktok    |
| `email.smtpHost`        | `SMTP_HOST`              | channel-email     |
| `email.smtpUser`        | `SMTP_USER`              | channel-email     |
| `email.smtpPassword`    | `SMTP_PASSWORD`          | channel-email     |

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

This repo uses [Changesets](https://github.com/changesets/changesets) for multi-package versioning and npm publishing. See [RELEASING.md](/docs/getting-started/releasing) for the full workflow.

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

| Type      | Pattern                            | Example                                |
| --------- | ---------------------------------- | -------------------------------------- |
| Extension | `@framers/agentos-ext-{name}`      | `@framers/agentos-ext-web-search`      |
| Template  | `@framers/agentos-template-{type}` | `@framers/agentos-template-basic-tool` |

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
- > 80% test coverage
- MIT license
- No hardcoded secrets

### Additional for Curated

- Professional code review
- Performance benchmarks
- Integration tests
- Migration guides

## Documentation

- [API Reference (TypeDoc)](https://framersai.github.io/agentos-extensions/)
- [How Extensions Work](/docs/extensions/how-extensions-work)
- [Extension Architecture](/docs/extensions/extension-architecture)
- [Auto-Loading Extensions](/docs/extensions/auto-loading)
- [Agency Collaboration Examples](/docs/features/agency-collaboration)
- [Self-Hosted Registries](/docs/extensions/self-hosted-registries)
- [Migration Guide](/docs/extensions/migration-guide)
- [Releasing & Publishing](/docs/getting-started/releasing)
- [Contributing](/docs/extensions/contributing)

## Contributing

See [CONTRIBUTING.md](/docs/extensions/contributing) for detailed guidelines.

- [Submit New Extension](https://github.com/framersai/agentos-extensions/issues/new?template=new-extension.yml)
- [Report Bug](https://github.com/framersai/agentos-extensions/issues/new?template=bug-report.yml)
- [Request Feature](https://github.com/framersai/agentos-extensions/discussions)

## Links

- **Website**: [frame.dev](https://frame.dev)
- **AgentOS**: [agentos.sh](https://agentos.sh)
- **Marketplace**: [vca.chat](https://vca.chat)
- **npm**: [@framers](https://www.npmjs.com/org/framers)
- **API Docs**: [framersai.github.io/agentos-extensions](https://framersai.github.io/agentos-extensions/)
- **Contact**: team@frame.dev

## License

All extensions in this repository are MIT licensed.
