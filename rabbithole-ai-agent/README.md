# Rabbit Hole AI (Discord) — Wunderland Agent

This is the **agentic** Rabbit Hole AI Discord bot powered by **Wunderland + AgentOS extensions** (tools, channels, permissions, HITL, pairing).

If you want to generate `agent.config.json` from the Rabbit Hole dashboard instead of editing by hand, see:

- `../apps/rabbithole/README.md`
- Self-hosted export UI route: `/app/dashboard/:seedId/self-hosted`

## Quickstart

1. From the monorepo root, install deps (if needed):

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
pnpm install
```

2. Configure env:

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant/rabbithole-ai-agent
cp .env.example .env
```

Set at minimum:

- LLM provider keys (or use `--ollama`)
- Discord bot token (if running direct Discord mode)

Note:

- This runtime can run in **two** modes:
  - **Direct Discord mode (recommended for full AgentOS features)**: the runtime connects to Discord via the `channel-discord` extension.
  - **Gateway mode**: run the runtime without Discord and point an external gateway bot at `POST /chat`.

If using Ollama:

- `ollama serve` (default base URL is `http://localhost:11434`)
- Set `llmModel` in `agent.config.json` to a model you have installed, or pass `--model` on startup.

3. Start the Wunderland runtime:

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant/rabbithole-ai-agent
node ../packages/wunderland/bin/wunderland.js start --ollama --model llama3.1:8b
```

Notes:

- The server prints a **HITL Secret**. You’ll need it for approvals (if `executionMode` isn’t autonomous).
- HITL approvals UI: `http://localhost:3777/hitl`
- Pairing UI is only relevant if you enable messaging channels inside this runtime: `http://localhost:3777/pairing`

## Connect the community bot (gateway)

In `../apps/rabbithole/.env` set:

```
WUNDERLAND_RUNTIME_URL=http://localhost:3777
# Optional (recommended if runtime is remote/public):
WUNDERLAND_CHAT_SECRET=...
```

Then start the Rabbit Hole app with `DISCORD_BOT_ENABLED=true` so the discord.js bot forwards requests to this runtime.

## Direct Discord mode (runtime connects to Discord)

This is the “Wunderland bot” mode: the agent runs with AgentOS **extensions + tools + HITL + pairing** and connects to Discord directly.

1. In `agent.config.json`, ensure:

- `channels: ["discord"]`

2. In `.env`, set:

- `DISCORD_BOT_TOKEN=...`
- Optional (recommended for fast slash-command registration): `DISCORD_GUILD_ID=...`

3. Start the runtime:

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant/rabbithole-ai-agent
node ../packages/wunderland/bin/wunderland.js start --ollama --model llama3.1:8b
```

Notes:

- DM policy: by default this agent is intended for **guild channels** (no DMs).
- Quotas: per-user daily limits by Discord role (Starter/Pro; `Enterprise` is treated as Pro; `Team` is unlimited). Run `/quota`.
- Pairing UI (approve allowlist): `http://localhost:3777/pairing`
- HITL approvals UI: `http://localhost:3777/hitl`
- Discord slash commands (in guild channels):
  - `/ask` — ask in-channel (daily quota)
  - `/deepdive` — deeper answer (separate daily quota)
  - `/summarize` — summarize a link (counts as `/ask`)
  - `/paper` — summarize an arXiv paper (counts as `/ask`)
  - `/quota` — view remaining quota (ephemeral)
  - `/status` — bot health + Ollama check (ephemeral)
  - `/faq` — list/view FAQ (ephemeral)
  - `/faq_set` — set FAQ entry (**Team only**, ephemeral)
  - `/note_add`, `/note_list`, `/note_delete` — personal notes (ephemeral)
  - `/trivia` — start trivia in-channel
  - `/trivia_leaderboard` — trivia leaderboard (ephemeral)
  - `/pair` — request pairing/allowlist access (prints a code)
  - `/help` — quick help

## Extensions / tools (full access)

This agent runs with `toolAccessProfile: "unrestricted"`, so it can use:

- `extensions_list` to discover available extension packs
- `extensions_enable` to load new packs at runtime (requires approval unless you run `--yes`)

If you want fully autonomous execution, run with `--yes` (or set `executionMode: "autonomous"` in `agent.config.json`).
