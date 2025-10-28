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
| `GET`  | `/agentos/stream` | SSE stream mirroring `/agentos/chat`. Currently sends final chunk only; streaming milestones will expand incremental updates. |

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

## Misc

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/test` | Simple route to verify router wiring; echoes optional auth context. |

### Notes

- All paths listed above are relative to `/api`.
- Optional auth is applied globally before the router; strict auth (`authMiddleware`) is applied per-route as needed.
- When AgentOS is enabled, `/api/chat` currently falls back to the AgentOS adapter, and `/api/agentos/*` surfaces direct access for SSE clients.
