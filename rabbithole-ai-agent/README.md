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

Note:

- If you are running the Rabbit Hole **community Discord bot** (`apps/rabbithole`) as the gateway, this runtime should **not** connect to Discord directly.
- Instead, run this runtime and point the gateway at it via `WUNDERLAND_RUNTIME_URL`.

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

## Extensions / tools (full access)

This agent runs with `toolAccessProfile: "unrestricted"`, so it can use:

- `extensions_list` to discover available extension packs
- `extensions_enable` to load new packs at runtime (requires approval unless you run `--yes`)

If you want fully autonomous execution, run with `--yes` (or set `executionMode: "autonomous"` in `agent.config.json`).
