# Rabbit Hole Agent

## Wunderland migration note

This doc covers the **legacy Python** agent (`wunderbot_agent`) inside this repo.

For the **agentic Wunderland / AgentOS** Discord bot (extensions/tools/settings, HITL, pairing), see:

- `../voice-chat-assistant/rabbithole-ai-agent`

The Rabbit Hole agent is a **guild-only**, in-channel Discord bot experience:

- Answers questions with `/ask` using **RAG** (retrieve + rerank + generate)
- Uses a local **Ollama** server for generation + embeddings (no paid APIs)
- Provides interactive buttons (citations, save note, deep dive)
- Includes games like `/trivia`

## DM policy

The agent is **guild-only** and does not respond in DMs by default.

## Commands

### Q&A

- `/ask <question>` — answer with sources + buttons
  - Weather questions like “what is the weather like in las vegas tomorrow” are handled via **Open‑Meteo** (free, no API key) and don’t require KB sources.
- `/paper <arxiv id or url>` — summarize an arXiv paper (stores it in the KB best-effort)
- `/summarize <url>` — summarize a web page (stores it in the KB best-effort)
- `Show citations` button — shows the exact snippets used
- `Explain` button — shows intents / tools / API calls used to generate the answer
- `Save note` button — saves the answer to your personal notes
- `Deep dive` button — longer answer (consumes a separate daily quota). Currently only available for KB-sourced answers.

## Paper feed

Latest AI/LLM papers are auto-posted into the dedicated papers channel (created by `scripts/setup_server.py`)
and are not exposed as a “latest papers” slash command.

Implementation note: the posting loop runs in `wunderbot_news` (so it can write to the read-only feed channel),
while the KB ingestion runs in `wunderbot_agent`. Keep both bots running for continuous paper updates.

### Knowledge base / ingestion

- `/sources` — show curated sources + ingestion status
- `/status` — show Ollama + KB health
- `/ingest_now` — Team-only manual ingestion run
- `/post_queue` — Team-only posting queue health (size, worker status, dedupe pressure)
- `/post_dedupe_clear [prefix] [channel_id]` — Team-only targeted dedupe-key reset for feed posting

### FAQ

- `/faq` — list FAQ entries
- `/faq_set` — Team-only create/update FAQ entries

### Notes (personal)

- `/note_add` — save a note (ephemeral)
- `/note_list` — list notes (ephemeral)
- `/note_delete` — delete a note by id (ephemeral)

### Games

- `/trivia` — start a trivia question with buttons (anyone can answer once)
- `/trivia_leaderboard` — top trivia wins

## The Founders (Gamification)

This repo also includes **The Founders** program (profiles, XP, levels, check-ins, milestones, showcases, directory).

Docs:

- `docs/FOUNDERS.md`

## Daily rate limits (defaults)

These are configurable via environment variables:

- Free (no role): `/ask` 10/day, Deep dives 1/day
- Explorer ($19/mo): `/ask` 30/day, Deep dives 5/day
- Pioneer ($49/mo): `/ask` 100/day, Deep dives 30/day
- Team: unlimited

Tier detection uses Discord role names (defaults): `Explorer`, `Pioneer`, `Team`. An optional legacy `Enterprise` role is treated as `Pioneer`.

## Configuration

See:

- Ollama: `docs/OLLAMA.md`
- Example env: `.env.example`
