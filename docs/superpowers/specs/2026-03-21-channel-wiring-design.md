# Channel Wiring — WhatsApp + Slack + Signal

**Date:** 2026-03-21
**Status:** Approved

---

## 1. Overview

Wire up three messaging channels for full Wunderbot integration: backend inbound webhooks, `wunderland connect` CLI commands, auto-reply engine support, and documentation.

### Scope

| Channel  | Adapter                          | Backend Webhook | Connect Command   | Auto-Reply | Docs |
| -------- | -------------------------------- | --------------- | ----------------- | ---------- | ---- |
| WhatsApp | EXISTS (Twilio + Meta Cloud API) | NEW             | NEW               | NEW        | NEW  |
| Slack    | EXISTS (@slack/bolt)             | EXISTS          | NEW               | EXISTS     | NEW  |
| Signal   | EXISTS (signal-cli)              | NEW             | NEW (full wizard) | NEW        | NEW  |

### Non-Goals

- No new UI dashboard pages (existing channels page already supports all 37 platforms)
- No new channel adapters (all three already exist)
- No changes to the ChannelRouter or IChannelAdapter interface

---

## 2. WhatsApp

### 2.1 Backend Inbound Webhook

**File:** `backend/src/modules/wunderland/channels/channel-inbound.controller.ts`

New endpoints:

```
GET  /wunderland/channels/inbound/whatsapp/verify
  → Meta webhook verification (hub.mode=subscribe, hub.verify_token, hub.challenge)

POST /wunderland/channels/inbound/whatsapp/:seedId
  → Receives messages from Twilio OR Meta Cloud API
```

**Auto-detection logic:**

- If request body has `entry[].changes[].value.messages` → Meta Cloud API format
- If request body has `Body`, `From`, `To`, `AccountSid` → Twilio format
- Parse accordingly, normalize to `{ sender, text, mediaUrl?, timestamp }`

**Twilio verification:**

- Validate `X-Twilio-Signature` header against request URL + body + auth token
- Reject unsigned requests in production

**Meta webhook verification:**

- `GET` endpoint returns `hub.challenge` when `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN` env var
- `POST` endpoint validates `X-Hub-Signature-256` header

**Message parsing:**

```typescript
// Twilio format
{ From: 'whatsapp:+1234567890', Body: 'Hello', NumMedia: '0' }

// Meta Cloud API format
{ entry: [{ changes: [{ value: { messages: [{ from: '1234567890', text: { body: 'Hello' }, type: 'text' }] } }] }] }
```

**Route to auto-reply:** Call `ChannelAutoReplyService.handleInbound()` with normalized message, same as Telegram/Slack.

### 2.2 CLI Connect Command

**File:** `packages/wunderland/src/cli/commands/connect.ts` (extend existing)

Add `whatsapp` to the service router:

```
wunderland connect whatsapp

  Which WhatsApp provider?
  1. Twilio (paid, business-focused)
  2. Meta Cloud API (free tier, requires Facebook Business)

  [1] Twilio selected:
    Account SID: ___
    Auth Token: ___
    WhatsApp Phone Number: ___
    Verifying credentials... ✓
    Saved to config.

  [2] Meta Cloud API selected:
    Opening browser for Facebook Business authorization...
    [browser opens → Facebook OAuth → callback to localhost]
    Connected: WhatsApp Business (business name)
    Saved to config.
```

**Twilio verification:** `GET https://api.twilio.com/2010-04-01/Accounts/{SID}.json` with auth. If 200, credentials are valid.

**Meta OAuth:** Same PKCE pattern as Gmail connect. Scopes: `whatsapp_business_management`, `whatsapp_business_messaging`. Redirect to localhost callback. Exchange code for token. Save `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ID`, `WHATSAPP_PHONE_NUMBER_ID` to config.

### 2.3 Environment Variables

```
# Twilio
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER        # e.g., +14155238886

# Meta Cloud API
WHATSAPP_ACCESS_TOKEN
WHATSAPP_BUSINESS_ID
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_VERIFY_TOKEN         # For webhook verification
WHATSAPP_APP_SECRET           # For signature verification

# Meta OAuth (for CLI connect)
WHATSAPP_APP_ID               # Facebook App ID
WHATSAPP_APP_SECRET           # Facebook App Secret
```

---

## 3. Slack

### 3.1 Backend

**No new backend work.** Existing endpoints:

- `POST /wunderland/channels/inbound/slack` — global Slack Events API
- `POST /wunderland/channels/inbound/slack/:seedId` — per-seed Slack Events API
- OAuth: `GET /wunderland/channels/oauth/slack/initiate` + `POST .../callback`
- Auto-reply: already wired in `ChannelAutoReplyService`

### 3.2 CLI Connect Command

**File:** `packages/wunderland/src/cli/commands/connect.ts` (extend existing)

```
wunderland connect slack

  Opening browser to connect your Slack workspace...
  [browser opens → https://rabbithole.inc/api/channels/oauth/slack/initiate?seedId=X&cli=true]

  Waiting for authorization... (polling)
  ✓ Slack connected: #general in "My Workspace"
```

**Implementation:**

1. Generate a one-time connection token
2. Open browser to `https://rabbithole.inc/api/channels/oauth/slack/initiate?seedId={seedId}&returnToken={token}`
3. Rabbithole handles full Slack OAuth (Slack requires HTTPS redirect, can't use localhost)
4. After OAuth completes, Rabbithole stores the binding and marks the token as fulfilled
5. CLI polls `GET https://rabbithole.inc/api/channels/status?token={token}` every 2 seconds
6. When token is fulfilled, CLI receives the binding details
7. Save workspace info to local config

**Rabbithole endpoint needed:** `GET /api/channels/oauth/slack/cli-poll?token=X` — returns `{ status: 'pending' }` or `{ status: 'connected', workspace: '...', channel: '...' }`

### 3.3 Environment Variables

Already defined in `.env.example`:

```
SLACK_OAUTH_CLIENT_ID
SLACK_OAUTH_CLIENT_SECRET
```

---

## 4. Signal

### 4.1 Backend Inbound Webhook

**File:** `backend/src/modules/wunderland/channels/channel-inbound.controller.ts`

New endpoint:

```
POST /wunderland/channels/inbound/signal/:seedId
  → Receives messages from signal-cli JSON-RPC daemon
```

**signal-cli JSON-RPC message format:**

```json
{
  "method": "receive",
  "params": {
    "envelope": {
      "source": "+1234567890",
      "sourceDevice": 1,
      "timestamp": 1234567890000,
      "dataMessage": {
        "message": "Hello",
        "timestamp": 1234567890000,
        "attachments": []
      }
    }
  }
}
```

**Route to auto-reply:** Normalize to `{ sender: source, text: dataMessage.message }`, pass to `ChannelAutoReplyService`.

**Security:** Signal messages come from a local signal-cli process, not the internet. Validate that requests come from localhost or a configured trusted source via `X-Signal-Secret` header or IP allowlist.

### 4.2 CLI Connect Command — Full Setup Wizard

**File:** `packages/wunderland/src/cli/commands/connect.ts` (extend existing)

```
wunderland connect signal

  Signal Setup Wizard
  ───────────────────

  Step 1: Checking signal-cli installation...
    ✓ signal-cli found at /usr/local/bin/signal-cli (v0.13.2)

    — OR —

    ✗ signal-cli not found.

    Install it:
      macOS:   brew install signal-cli
      Linux:   Download from https://github.com/AsamK/signal-cli/releases
      Docker:  docker pull registry.gitlab.com/packaging/signal-cli/signal-cli-native

    After installing, run 'wunderland connect signal' again.

  Step 2: Phone number registration
    Enter phone number (with country code): +1___

    Sending verification SMS...
    ✓ Verification code sent to +1234567890

  Step 3: Verify
    Enter the 6-digit code: ______
    ✓ Phone number verified!

  Step 4: Starting signal-cli daemon
    Starting JSON-RPC daemon on port 7583...
    ✓ signal-cli daemon running

  Step 5: Saving configuration
    ✓ Signal connected on +1234567890

    Your Wunderbot will now receive and reply to Signal messages.
    To manage: wunderland channels list
```

**Implementation details:**

- `which signal-cli` or `command -v signal-cli` to detect installation
- `signal-cli -a {number} register` to start registration
- `signal-cli -a {number} verify {code}` to verify
- `signal-cli -a {number} daemon --json-rpc --json-rpc-port 7583` to start daemon
- Save phone number and daemon port to `~/.wunderland/config.json`
- Optionally spawn daemon as a background process

### 4.3 Environment Variables

```
SIGNAL_PHONE_NUMBER           # Registered phone number
SIGNAL_CLI_PATH               # Path to signal-cli binary (default: auto-detect)
SIGNAL_DAEMON_PORT            # JSON-RPC port (default: 7583)
SIGNAL_WEBHOOK_SECRET         # For inbound webhook verification
```

---

## 5. Auto-Reply Wiring

**File:** `backend/src/modules/wunderland/channels/channel-auto-reply.service.ts`

Currently supports: Telegram, Slack.
Add support for: WhatsApp, Signal.

**Changes:**

- Add `whatsapp` and `signal` to the platform switch in `handleInbound()`
- Add outbound message formatting per platform:
  - WhatsApp (Twilio): `POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json` with `To=whatsapp:+NUMBER`
  - WhatsApp (Meta): `POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages` with bearer token
  - Signal: `POST http://localhost:{DAEMON_PORT}/api/v1/send` (signal-cli JSON-RPC)
- Same modes (off/dm/mentions/all), same LLM pipeline, same cooldown

---

## 6. Documentation

### 6.1 CLI Help Topics

Add to `packages/wunderland/src/cli/help/topics.ts`:

- `wunderland help whatsapp` — setup guide for both Twilio and Meta paths
- `wunderland help slack` — connect via CLI, configure auto-reply
- `wunderland help signal` — full signal-cli setup guide

### 6.2 Doctor Checks

Add to `packages/wunderland/src/cli/commands/doctor.ts`:

- WhatsApp: check for Twilio or Meta credentials in config/env
- Slack: check for OAuth token or binding
- Signal: check for signal-cli binary and phone number

### 6.3 Docs

- `packages/wunderland/docs/CHANNEL_INTEGRATIONS.md` — comprehensive guide for all channels
- `apps/wunderland-live-docs/docs/guides/channel-integrations.md` — docs site page

---

## 7. Files Changed Summary

### New Files

| File                                       | Purpose |
| ------------------------------------------ | ------- |
| (none — all changes extend existing files) |         |

### Modified Files

| File                                                                    | Changes                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------- |
| `backend/src/modules/wunderland/channels/channel-inbound.controller.ts` | Add WhatsApp + Signal webhook endpoints        |
| `backend/src/modules/wunderland/channels/channel-auto-reply.service.ts` | Add WhatsApp + Signal outbound support         |
| `packages/wunderland/src/cli/commands/connect.ts`                       | Add whatsapp, slack, signal to connect command |
| `packages/wunderland/src/cli/help/topics.ts`                            | Add whatsapp, slack, signal help topics        |
| `packages/wunderland/src/cli/commands/doctor.ts`                        | Add WhatsApp, Slack, Signal health checks      |
| `packages/wunderland/src/cli/types.ts`                                  | Add whatsapp, slack, signal config fields      |
| `packages/wunderland/docs/CHANNEL_INTEGRATIONS.md`                      | New comprehensive guide                        |
| `apps/wunderland-live-docs/docs/guides/channel-integrations.md`         | Docs site page                                 |
| `apps/wunderland-live-docs/sidebars.js`                                 | Add channel integrations to sidebar            |

### Rabbithole (for Slack CLI flow)

| File                                                                 | Changes                       |
| -------------------------------------------------------------------- | ----------------------------- |
| `apps/rabbithole/src/app/api/channels/oauth/slack/cli-poll/route.ts` | New API route for CLI polling |
