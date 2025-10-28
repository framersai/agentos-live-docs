# Voice Chat Assistant Architecture

This document explains how the Voice Chat Assistant stack is organised, the major subsystems, and how requests flow between them.

## Overview

- **AgentOS surfaces**: Next.js marketing site (`apps/agentos-landing`) and React developer client (`apps/agentos-client`) consume the runtime directly for marketing/debug experiences.

- **Frontend**: Vue 3 + Vite + TailwindCSS with composition-based state management.
- **Backend**: Express + TypeScript with modular feature folders.
- **Datastores**: SQLite (default) or PostgreSQL for persistent auth + billing data.
- **Integrations**: OpenAI / OpenRouter / Anthropic for LLMs, Supabase (optional) for authentication, Lemon Squeezy for subscriptions.

## System Diagram

```
Browser (Vue 3 + Supabase JS) ---> Express API ---> External Services
        |                                 |              |
        |-- Voice/WebRTC --> Whisper      |              |- LLM Providers
        |                                 |              |- Lemon Squeezy
        |-- Supabase OAuth -------------->|              |- Supabase Auth (optional)
```

The frontend talks to the backend through `/api/*` endpoints. Optional Supabase sessions are validated server-side and mirrored into the local `app_users` table.

## Frontend Modules

| Module | Responsibility |
| --- | --- |
| `components/` | Reusable UI primitives (chat windows, voice controls, banners). |
| `views/` | Route-level layouts (PublicHome, Login, Settings, About). |
| `composables/useAuth.ts` | Handles Supabase client initialisation, token storage, demo usage refresh, and global JWT fallbacks. |
| `store/` | Pinia stores for chat, agents, and session state. |
| `i18n/` | Intl bundle with locale files (now including About page content and demo banner strings). |
| `styles/` | SCSS partials for page-level theming (Ephemeral Harmony). |

### Public Demo Flow

1. Visitor lands on `/:locale/` (PublicHome).
2. `useAuth` checks demo usage via `/api/rate-limit/status`.
3. Banner appears when `remaining <= 5` or `remaining === 0`.
4. Chat interactions call `/api/chat` with optional temporary tokens.

### Authenticated Flow

1. User signs in with global passphrase or Supabase OAuth/email.
2. `useAuth` stores either a local JWT or Supabase session.
3. Authenticated requests include `Authorization: Bearer <token>`.
4. Lemon Squeezy metadata informs per-user entitlements (billing card in Settings).

## Backend Modules

| Folder | Highlights |
| --- | --- |
| `config/` | `appConfig` loader (now reading Supabase keys) and router bootstrap. |
| `middleware/optionalAuth.ts` | Accepts global JWTs, Supabase tokens, or allows anonymous access for demos. |
| `middleware/auth.ts` | Strict auth enforcing private routes with global or Supabase tokens. |
| `features/auth/` | Auth services, Supabase verification (`supabaseAuth.service.ts`), and repository helpers for linking Supabase users. |
| `features/billing/` | Lemon Squeezy checkout + webhook handlers referencing Supabase IDs when present. |
| `features/chat/` | Chat + persona endpoints, diagram helpers, and vector retrieval hooks. |
| `features/cost/` | Cost tracking + reset endpoints (auth-protected). |
| `core/database/` | SQLite/PostgreSQL adapters, migrations (including `supabase_user_id`). |
| `packages/agentos/` | Workspace package for the AgentOS runtime. Handles persona gating, subscription tiers, memory lifecycle policies, and exposes the `/api/agentos/*` orchestration layer. |

### Request Lifecycle

1. **Optional Auth**: Every request passes through `optionalAuth`. If a global JWT or Supabase token is supplied it decorates `req.user`; otherwise the request is treated as anonymous.
2. **Rate Limiting**: Public requests are throttled via IP-based quotas. Authenticated users rely on billing tiers.
3. **Route Handling**: Feature routers respond (chat, speech, billing, etc.). Some routes add `authMiddleware` for strict protection.
4. **Responses**: Include `tokenProvider` metadata for clarity in the frontend.

## Data Flow

```
Voice/Text Input -> /api/chat -> AgentOS orchestration -> Model selection -> Response
                                |                                |
                                |--> Knowledge retrieval ---------|
                                |--> Persona & memory management
```

- Mermaid diagrams are rendered client-side via `DiagramViewer` using code returned by `/api/diagram` or chat responses.
- Supabase tokens trigger user mirroring so billing logic can reconcile `supabase_user_id` with Lemon Squeezy customer IDs.
- AgentOS enforces plan access via a single subscription service: the backend supplies `getUserSubscription(userId)` and `listTiers()`, which `GMIManager` uses to evaluate persona/tool availability.

### Memory Lifecycle

The AgentOS memory lifecycle manager runs inside the package (see `packages/agentos/src/memory_lifecycle`). Policies are defined in `MemoryLifecycleManagerConfiguration.ts` and support:

- Trigger conditions (periodic, storage threshold, item age) plus retention windows per RAG category or data source.
- Actions (`delete`, `archive`, `summarize_and_*`, `notify_gmi_owner`) with optional summarisation model overrides (`policy.action.llmModelForSummary`) and a global `defaultSummarizationModelId`.
- Optional GMI negotiation. Negotiations fall back to a configured `LifecycleAction` when the owning agent does not respond in time, ensuring deterministic behaviour.

Policies are enforced against the vector store via the `MemoryLifecycleManager`, which now normalises action metadata and reports structured traces for audit/logging.

## Security Considerations

- Service-role Supabase keys remain on the backend only.
- JWT secrets must be 64+ bytes; rotate regularly in production.
- Rate limiting protects the public demo; billing routes add strict auth.
- `optionalAuth` ensures anonymous access never writes to privileged resources.

## Directory Layout (Backend)

```
backend/
+- config/
   +- router.ts
+- middleware/
   +- optionalAuth.ts
   +- auth.ts
+- src/
   +- config/appConfig.ts
   +- core/database/*
   +- features/
      +- auth/
      +- billing/
      +- chat/
      +- cost/
      +- speech/
+- ...
```

## Directory Layout (Frontend)

```s
frontend/
+- src/
   +- components/
   +- composables/useAuth.ts
   +- i18n/locales/*.ts
   +- router/index.ts
   +- styles/
   +- views/
+- ...
```

For deeper discussions of personas, memory layers, and roadmap plans, explore the About page (now fully localised) or review the prompts stored in `prompts/`.


