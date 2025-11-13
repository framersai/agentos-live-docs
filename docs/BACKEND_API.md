# Backend API Reference

All backend routes are prefixed with `/api`. Optional authentication (JWT or Supabase) is provided by `optionalAuthMiddleware`; strict routes use `authMiddleware`.

## Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/global` | Global passphrase login. Body: `{ password, rememberMe? }`. Returns JWT session token. |
| `POST` | `/auth/login` | Email/password login (local or Supabase-seeded users). Body: `{ email, password, rememberMe? }`. |
| `POST` | `/auth/register` | Registers a new local account (when Supabase is not primary). |
| `GET`  | `/auth` | Returns session info. Requires auth middleware. |
| `DELETE` | `/auth` | Logs out the current session. |

## Chat & Persona

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/chat` | Main chat endpoint. Body includes `messages`, `mode`, `conversationId`, etc. When `AGENTOS_ENABLED=true`, the request is short-circuited to the AgentOS adapter. |
| `POST` | `/chat/persona` | Saves persona override metadata for a specific conversation. |
| `POST` | `/chat/detect-language` | Detects conversation language from the last few turns. |
| `POST` | `/diagram` | Generates Mermaid diagrams from prompt text. Shares logic with `/chat`. |
| `GET`  | `/prompts/:filename` | Returns raw Markdown prompt snippets. |

## AgentOS (optional)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/agentos/chat` | AgentOS-direct chat endpoint (expects `{ userId, conversationId, mode, messages }`). Enabled when `AGENTOS_ENABLED=true`. |
| `GET`  | `/agentos/stream` | SSE stream mirroring `/agentos/chat`. Streams incremental updates (AGENCY_UPDATE, WORKFLOW_UPDATE, deltas). |
| `GET`  | `/agentos/personas` | Lists available personas. Supports `capability`, `tier`, and `search` query filters. |
| `GET`  | `/agentos/extensions` | Lists available extensions from the local registry (`packages/agentos-extensions/registry.json`). |
| `GET`  | `/agentos/extensions/tools` | Lists tools derived from extensions (schemas may be omitted). |
| `GET`  | `/agentos/extensions/search?q=<text>` | Searches the extension registry by name/package/description substring. |
| `POST` | `/agentos/extensions/install` | Schedules installation of an extension package (placeholder; invalidates cache). |
| `POST` | `/agentos/extensions/reload` | Invalidates the extensions registry cache. |
| `POST` | `/agentos/tools/execute` | Executes a tool (placeholder echo implementation until full runtime bridge is enabled). |
| `GET`  | `/agentos/guardrails` | Lists curated/community guardrails from local registry (`packages/agentos-guardrails/registry.json`). |
| `POST` | `/agentos/guardrails/reload` | Invalidates the guardrails registry cache. |

- `/agentos/personas` supports optional query parameters:
  - `capability`: repeatable (or comma-separated) capability requirements; the persona must include all requested capabilities.
  - `tier`: repeatable subscription tier hints (matches metadata tiers such as `pro`, `enterprise`).
  - `search`: case-insensitive substring match across persona name, description, tags, traits, and activation keywords.

## Speech & Audio

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/stt` | Speech-to-text (Whisper/API). |
| `GET`  | `/stt/stats` | Returns STT usage stats (public but rate-limited). |
| `POST` | `/tts` | Text-to-speech synthesis (OpenAI voice). |
| `GET`  | `/tts/voices` | Lists available voice models. |

## Billing & Cost

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/cost` | Returns authenticated user’s session cost snapshot. Requires `authMiddleware`. |
| `POST` | `/cost` | Resets/updates cost session metadata. Requires `authMiddleware`. |
| `POST` | `/billing/checkout` | Creates Stripe checkout session. Requires authentication. |
| `GET`  | `/billing/status/:checkoutId` | Fetches latest checkout status after redirect. |
| `POST` | `/billing/webhook` | Stripe webhook receiver (no auth). |

## Organizations

Routes require authentication.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/organizations` | List organizations for the authenticated user. |
| `POST` | `/organizations` | Create a new organization workspace. |
| `PATCH` | `/organizations/:organizationId` | Update organization name/seat limits. |
| `POST` | `/organizations/:organizationId/invites` | Send membership invites. |
| `DELETE` | `/organizations/:organizationId/invites/:inviteId` | Revoke an invite. |
| `PATCH` | `/organizations/:organizationId/members/:memberId` | Update member roles/seat units. |
| `DELETE` | `/organizations/:organizationId/members/:memberId` | Remove a member. |
| `POST` | `/organizations/invites/:token/accept` | Accept an invite token. |

## System & Rate Limit

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/rate-limit/status` | Public endpoint summarizing remaining unauthenticated quota (based on IP). |
| `GET` | `/system/llm-status` | Health check for configured LLM providers. |
| `GET` | `/system/storage-status` | Returns active storage adapter kind and capability flags (used for feature gating). |

## Misc

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/test` | Simple route to verify router wiring; echoes optional auth context. |

### Notes

- All paths listed above are relative to `/api`.
- Optional auth is applied globally before the router; strict auth (`authMiddleware`) is applied per-route as needed.
- When AgentOS is enabled, `/api/chat` currently falls back to the AgentOS adapter, and `/api/agentos/*` surfaces direct access for SSE clients.

## Marketplace

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/marketplace/agents` | List marketplace agents. Supports optional `visibility`, `status`, `ownerId`, `organizationId`, `includeDrafts` query params. |
| `GET` | `/marketplace/agents/:id` | Get a marketplace agent by ID. |
| `POST` | `/marketplace/agents` | Create a marketplace agent listing. Requires authentication. If `organizationId` is set, user must be an active member. Publishing (`status=published`) or `visibility=public` requires org `admin` role. |
| `PATCH` | `/marketplace/agents/:id` | Update a listing. Owner (user-owned) or org member (org-owned). Publishing or `public` visibility requires org `admin`. |

RBAC notes:
- Org-owned listings enforce membership checks; publishing and public visibility require `admin`.
- See `backend/src/features/marketplace/marketplace.routes.ts` for enforcement details.

## User Agents

Routes require authentication.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/agents` | List user-owned agents. |
| `GET` | `/agents/plan/snapshot` | Get the user’s agent plan snapshot (limits and current usage). |
| `GET` | `/agents/:agentId` | Get a user agent by ID. |
| `POST` | `/agents` | Create a new user agent (subject to plan limits). |
| `PATCH` | `/agents/:agentId` | Update agent attributes (label, slug, status, config, archive). |
| `DELETE` | `/agents/:agentId` | Delete a user agent. |
