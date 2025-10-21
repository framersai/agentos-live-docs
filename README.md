# Voice Chat Assistant

<p align="center">
  <img src="./frontend/src/assets/logo.svg" alt="Voice Chat Assistant Logo" width="120" />
</p>

<p align="center">
  A voice-first coding assistant that blends realtime transcription, rich context, and optional subscriptions.
</p>

## Overview

Voice Chat Assistant is a full-stack application that helps you explore ideas, ship code, and stay organised. Speak naturally, mix in text, and let the assistant manage diagrams, code snippets, and follow-up context. The stack pairs a Vue 3 frontend with an Express + TypeScript backend, plus optional integrations for Supabase OAuth and Lemon Squeezy billing.

### Key Features

- Realtime speech recognition via Web Speech API or OpenAI Whisper
- Multilingual responses (15+ languages) with adaptive context memory
- Dedicated conversation modes for coding, system design, and meeting notes
- Mermaid diagram generation for architecture discussions
- Cost tracking, configurable model routing, and granular rate limits
- Two authentication paths: shared global passphrase or personal Supabase accounts
- Optional Lemon Squeezy billing with subscription-aware access control
- Public demo mode with automatic rate-limit banners

## Table of Contents

- [Quick Start](#quick-start)
- [Usage](#usage)
- [Configuration](#configuration)
- [Supabase (Optional)](#supabase-optional)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

Alternatively, run `npm run install-all` from the repository root to install both workspaces.

### 2. Configure Environment Variables

Copy `.env.sample` to `.env` in the repository root. At minimum set:

```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Authentication
AUTH_JWT_SECRET=replace_with_a_long_random_string
GLOBAL_ACCESS_PASSWORD=choose-a-shared-passphrase

# Optional Supabase (see below)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# LLM providers
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=
ANTHROPIC_API_KEY=

# Optional billing (personal subscriptions)
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

Frontend-specific values live in `frontend/.env` or `frontend/.env.local`:

```bash
VITE_LEMONSQUEEZY_PRODUCT_ID=
VITE_LEMONSQUEEZY_VARIANT_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> `GLOBAL_ACCESS_PASSWORD` enables the shared login path immediately. Individual logins require either Supabase (email/password or OAuth) or manual seeding plus an active Lemon Squeezy subscription.

### 3. Run the Development Servers

```bash
# From the repository root
npm run dev
```

The backend boots on `http://localhost:3001` and the frontend on `http://localhost:3000`. Restart the dev servers whenever you change environment variables.

## Usage

1. **Choose a sign-in path**
   - **Global Access**: Enter the shared passphrase for rate-limited unlimited usage.
   - **Supabase Account**: Log in with email/password or OAuth (Google, GitHub, etc.) when Supabase is configured. The backend mirrors Supabase users into the local SQLite auth store.

2. **Watch the demo banner**
   - Anonymous visitors see a rate-limit banner driven by `/api/rate-limit/status` so they know when usage is nearly exhausted.

3. **Pick a mode**
   - Coding Q&A, System Design, Meeting Summary, plus persona-specific agents.

4. **Talk or type**
   - Combine voice transcription, text input, and diagram requests. The assistant keeps track of context and costs.

5. **Manage billing**
   - The Settings > Billing card shows Lemon Squeezy status for authenticated users.

## Configuration

For the full list of environment variables, feature flags, and tuning options, read [`CONFIGURATION.md`](CONFIGURATION.md). The file includes notes on rate limiting, memory limits, model routing, and billing flags.

`.env.sample` is kept in sync with new integrations, including Supabase and Lemon Squeezy reminders.

## Plans & Billing

The shared plan catalog lives in `shared/planCatalog.ts` and drives the About page, login hints, and Settings billing card. See [`docs/PLANS_AND_BILLING.md`](docs/PLANS_AND_BILLING.md) for the calculation breakdown.

For a detailed implementation brief covering the multi-step registration experience, Supabase integration, and Lemon Squeezy checkout, read [`docs/SIGNUP_BILLING_IMPLEMENTATION_PLAN.md`](docs/SIGNUP_BILLING_IMPLEMENTATION_PLAN.md).

- Free � GPT-4o mini, ~1.8K GPT-4o tokens/day.
- Basic ($9/mo) � ~9.5K GPT-4o tokens/day, premium models, no BYO keys.
- Creator ($18/mo) � ~21.8K GPT-4o tokens/day, premium models, optional BYO rollover.
- Organization ($99/mo) � ~135K GPT-4o tokens/day shared pool, seat management, BYO rollover.
- Global Lifetime Access � passphrase login, per-IP allowance for internal cohorts.

Organization admins can manage seat limits, invites, and pending memberships directly from **Settings > Team Management** inside the app.

Stripe support is optional: leave Stripe env vars empty to operate with Lemon Squeezy only.

## Supabase (Optional)

1. Create a Supabase project and enable the providers you want (Google recommended for quick testing).
2. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` to your environment files.
3. Set the auth redirect URL to `http://localhost:3000` in the Supabase dashboard.
4. Restart `npm run dev`. The login screen now shows OAuth buttons and email/password forms that talk to Supabase.
5. The backend validates Supabase JWTs using the service-role key and associates them with local `app_users` rows (stored in SQLite or PostgreSQL depending on your configuration).

If Supabase variables are omitted the app falls back to the global passphrase-only flow. Both paths can coexist.

## Architecture

Voice Chat Assistant follows a modular client/server design:

- **Frontend**: Vue 3 (Composition API), Vite, TailwindCSS, VueUse, and Supabase JS (optional).
- **Backend**: Express, TypeScript, multi-tenant auth middleware, and feature-focused modules under `backend/src/features/*`.
- **External Services**: OpenAI / OpenRouter / Anthropic for LLMs, Supabase for authentication, Lemon Squeezy for billing.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for diagrams, module breakdowns, and data flow details.

## API Reference

Authenticated routes are served from `/api`. Key endpoints:

- `POST /api/auth/global` - Global passphrase login (returns JWT + `tokenProvider: "global"`).
- `POST /api/auth/login` - Email/password login for seeded or subscribed users (returns JWT + `tokenProvider: "standard"`).
- `GET /api/auth` - Returns the current session profile. Accepts global JWTs or Supabase tokens in the `Authorization` header.
- `DELETE /api/auth` - Clears the auth cookie and ends the session.
- `GET /api/rate-limit/status` - Public endpoint used by the demo banner to display remaining anonymous quota.
- `POST /api/chat` / `POST /api/chat/persona` - Conversational endpoints for standard and persona-specific prompts.
- `POST /api/speech` - Whisper transcription.
- `POST /api/diagram` - Mermaid diagram generation.
- `GET /api/tts/voices`, `POST /api/tts` - Text-to-speech helpers.
- `GET /api/cost`, `POST /api/cost` - Authenticated cost tracking (reset + history).
- `POST /api/billing/checkout` - Creates Lemon Squeezy checkout sessions (requires auth).
- `POST /api/billing/webhook` - Webhook receiver that syncs subscription status.

> **Deploy tip:** If CI reports `Missing required environment variable: AUTH_JWT_SECRET`, double-check the secret or `.env` you push to production. The backend expects a line such as `AUTH_JWT_SECRET=super_long_value` with no surrounding quotes—without it the process exits before `/health` is available.

## Social Media & Contact

Connect with us on social media:
- GitHub: [https://github.com/wearetheframers/agentos](https://github.com/wearetheframers/agentos)
- Twitter: [@vca_chat](https://twitter.com/vca_chat)
- LinkedIn: [VCA Chat](https://linkedin.com/company/vca-chat)
- Discord: [Join our community](https://discord.gg/vca-chat)
- Email: [team@vca.chat](mailto:team@vca.chat)

Social links are configured in `frontend/src/utils/socialLinks.ts` for easy management across the application.

## Recent Improvements

### TTS Performance Optimizations (October 2024)
- **80% Latency Reduction**: LRU cache system for repeated phrases with 100MB default capacity
- **40% Smaller Audio Files**: Switched from MP3 to Opus format for faster downloads
- **Intelligent Text Chunking**: Smart sentence/paragraph-aware segmentation for streaming playback
- **Hybrid TTS Strategy**: Automatic provider selection (browser < 150 chars, OpenAI for longer)
- **Optimized Defaults**: Nova voice at 1.15x speed with Opus format for better performance
- See [`docs/TTS_OPTIMIZATION_GUIDE.md`](docs/TTS_OPTIMIZATION_GUIDE.md) for implementation details

### Landing Page Enhancements (October 2024)
- **Enhanced Mission Section**: Redesigned with three pillars - Research & Innovation, Open Source First, and Accessible AI for All
- **Improved Pricing Display**: Responsive grid layout (2-4 columns) with animated entrance effects and price-based sorting
- **Social Media Integration**: Added social icons component with elegant handcrafted SVGs
- **Streamlined Content**: Removed microphone permissions section from landing page for cleaner presentation
- **Visual Enhancements**: Added gradient backgrounds, glowing effects, and smooth animations throughout

### Component Architecture
- `SocialIcons.vue`: Reusable social media icons component with variants (default, footer, hero)
- `AboutMissionSection.vue`: Enhanced mission cards with feature lists and animated entrance
- `AboutPricingSection.vue`: Responsive pricing grid with featured plan highlighting
- `ttsCache.service.ts`: LRU cache for TTS audio with performance metrics
- `textChunker.service.ts`: Intelligent text chunking for streaming TTS
- `ttsHybrid.service.ts`: Hybrid TTS service with automatic provider selection

## Contributing

Pull requests are welcome. Please review [`CONTRIBUTING.md`](CONTRIBUTING.md) and open an issue if you plan large changes so we can coordinate direction.

## License

Voice Chat Assistant is released under the MIT License. See [`LICENSE`](LICENSE).




