# Configuration Guide

This guide summarises all environment variables and runtime options available in Voice Chat Assistant. Use it alongside `.env.sample`, which lists every variable with defaults and inline comments.

## 1. Core Settings

| Variable | Description |
| --- | --- |
| `PORT` | Backend server port (default `3001`). |
| `NODE_ENV` | Environment mode (`development` or `production`). |
| `FRONTEND_URL` | Base URL for the frontend, used in CORS and cookies. |
| `APP_URL` | Public URL for backend if different from origin (used in emails/webhooks). |
| `LOG_LEVEL` | `debug`, `info`, `warn`, or `error`. |

## 2. Authentication

| Variable | Description |
| --- | --- |
| `AUTH_JWT_SECRET` | 64+ byte secret for issuing global JWTs. |
| `GLOBAL_ACCESS_PASSWORD` | Shared passphrase for unlimited global access. Optional but recommended even when Supabase is enabled. |
| `GLOBAL_LOGIN_RATE_WINDOW_MINUTES` | Sliding window for rate limiting global passphrase attempts. |
| `GLOBAL_LOGIN_RATE_MAX_ATTEMPTS` | Maximum attempts per window for the shared passphrase. |
| `PASSWORD` | Legacy fallback for `GLOBAL_ACCESS_PASSWORD`. |

### Supabase (Optional)

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL used by the backend. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key for verifying Supabase JWTs. **Never expose to the frontend.** |
| `SUPABASE_ANON_KEY` | Optional. Only required when you need the backend to perform Supabase client operations. |
| `VITE_SUPABASE_URL` | Supabase project URL for the frontend. |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for the frontend Supabase client. |

When Supabase values are supplied, the backend will:

1. Validate Supabase JWTs in `Authorization: Bearer <token>` headers.
2. Mirror Supabase profiles into the `app_users` table (`supabase_user_id` column).
3. Return `tokenProvider: "supabase"` in `/api/auth` responses.

If Supabase values are omitted, the system falls back to the global passphrase and standard email/password logins.

## 3. Billing (Optional)

```bash
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_SUCCESS_URL=
LEMONSQUEEZY_CANCEL_URL=

# Plan identifiers
LEMONSQUEEZY_BASIC_PRODUCT_ID=
LEMONSQUEEZY_BASIC_VARIANT_ID=
LEMONSQUEEZY_CREATOR_PRODUCT_ID=
LEMONSQUEEZY_CREATOR_VARIANT_ID=
LEMONSQUEEZY_ORG_PRODUCT_ID=
LEMONSQUEEZY_ORG_VARIANT_ID=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BASIC_PRODUCT_ID=
STRIPE_BASIC_PRICE_ID=
STRIPE_CREATOR_PRODUCT_ID=
STRIPE_CREATOR_PRICE_ID=
STRIPE_ORG_PRODUCT_ID=
STRIPE_ORG_PRICE_ID=
```

Frontend builds need the matching IDs (prefixed with `VITE_...`) in `frontend/.env` or `frontend/.env.local` so buttons render accurate CTAs. See [.env.sample](.env.sample) for the full list.

When billing is configured, webhooks update `app_users` with subscription state. Creator and Organization plans roll into BYO keys once the daily platform allowance is consumed; the rollover rules live in `shared/planCatalog.ts`. Full rationale lives in [`docs/PLANS_AND_BILLING.md`](docs/PLANS_AND_BILLING.md).
## 4. Language & Context Controls

| Variable | Description |
| --- | --- |
| `DEFAULT_RESPONSE_LANGUAGE_MODE` | `auto`, `fixed`, or `follow-stt`. |
| `ENABLE_LANGUAGE_DETECTION` | Enable automatic language detection for responses. |
| `DEFAULT_FIXED_RESPONSE_LANGUAGE` | Language code when using `fixed` mode. |
| `MAX_CONTEXT_MESSAGES` | Maximum chat turns kept in context. |
| `CONVERSATION_CONTEXT_STRATEGY` | `minimal`, `smart`, or `full`. |
| `PREVENT_REPETITIVE_RESPONSES` | Toggle repetition avoidance. |
| `DISABLE_COST_LIMITS` | Set to `true` to bypass cost thresholds during development. |

## 5. LLM Providers

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Required for GPT and Whisper features. |
| `OPENROUTER_API_KEY` | Optional additional model access. |
| `ANTHROPIC_API_KEY` | Optional Claude support. |
| `MODEL_PREF_*` | Default model routing per feature (see `.env.sample`). |

## 6. Storage & Database

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (production). |
| `DB_CLIENT` | `postgresql` or `sqlite`. |
| `ENABLE_SQLITE_MEMORY` | Set to `true` to run SQLite in memory for ephemeral sessions. |

`app_users` now includes a `supabase_user_id` column. Run the provided migration or ensure the column exists before enabling Supabase in production.

## 7. Frontend Environment

Create `frontend/.env` or `frontend/.env.local` for Vite-specific settings:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_LEMONSQUEEZY_BASIC_PRODUCT_ID=
VITE_LEMONSQUEEZY_BASIC_VARIANT_ID=
VITE_LEMONSQUEEZY_CREATOR_PRODUCT_ID=
VITE_LEMONSQUEEZY_CREATOR_VARIANT_ID=
VITE_LEMONSQUEEZY_ORG_PRODUCT_ID=
VITE_LEMONSQUEEZY_ORG_VARIANT_ID=
VITE_STRIPE_BASIC_PRICE_ID=
VITE_STRIPE_CREATOR_PRICE_ID=
VITE_STRIPE_ORG_PRICE_ID=
```

Restart `npm run dev` after editing Vite environment files.

## 8. Rate Limiting & Demo Mode

- Anonymous users hit `/api/rate-limit/status` to display remaining credits.
- Authenticated users bypass the demo limits and may receive per-plan limits from Lemon Squeezy metadata.

The backend honours:

| Variable | Description |
| --- | --- |
| `RATE_LIMIT_PUBLIC_DAILY` | Daily requests per IP for the public demo. |
| `GLOBAL_COST_THRESHOLD_USD_PER_MONTH` | Safety valve for total spend. |

## 9. Voice, Audio & Speech

See `.env.sample` for toggles such as `DEFAULT_SPEECH_PREFERENCE_STT`, `DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER`, and advanced audio processing flags. All defaults are tuned for local development.

## 10. Troubleshooting Checklist

- **Auth errors**: Confirm `GLOBAL_ACCESS_PASSWORD` or Supabase credentials and ensure clocks are in sync when using Supabase JWTs.
- **Billing webhooks**: Use the Lemon Squeezy dashboard to resend events if subscriptions are not updating. Verify the webhook secret and public URL.
- **Demo banner missing**: The frontend requires the backend `/api/rate-limit/status` endpoint and `optionalAuth` middleware to be running.
- **Supabase OAuth redirect loops**: Confirm the redirect URL matches your frontend origin including protocol and port.

For more operational notes and deployment tips, review [`PRODUCTION_SETUP.md`](PRODUCTION_SETUP.md) and the architecture document.
