# The Founders (Discord Gamification)

The Founders is a gamified “build in public” program inside the Rabbit Hole Discord:

- Join → create a Founder profile + project
- Earn XP from check-ins, feedback, milestones, and showcases
- Level up → Discord role swaps (Caterpillar → Cheshire Cat → …)
- Browse the directory + leaderboard
- Cofounder matching opt-in

This system is implemented in this repo (Python `discord.py`) and stores data in the same SQLite DB as the agent (`./data/rabbithole.db` by default).

---

## Levels

XP thresholds are defined in `core/founders/xp.py`.

- L1 **Curious Alice** — 0 XP
- L2 **Caterpillar** — 500 XP
- L3 **Cheshire Cat** — 1,500 XP
- L4 **Mock Turtle** — 4,000 XP
- L5 **Wonderland** — 10,000 XP

On level-up, the bot swaps the level role and posts an announcement in `#founder-chat`.

---

## Commands

Onboarding & profile:

- `/join_founders` — join via modal (also available via the Join button)
- `/profile [user]` — view a profile card
- `/profile_edit` — edit tagline, bio, skills, and links

Projects:

- `/project_add` — add a project (supports optional industry/website/repo/looking-for)
- `/project_edit <project>` — edit a project (supports optional industry/website/repo/looking-for)
- `/project_primary <project>` — pin a primary project (unlocks at Level 2)
- `/projects [user]` — list projects

XP / participation:

- `/daily` — daily standup check-in (XP + streak)
- `/weekly` — weekly update (XP + streak)
- `/feedback @user` — give feedback (+15 XP, capped per day)
- `/milestone` — record milestone (+50–300 XP depending on type)
- `/showcase` — monthly showcase (+25 XP, requires Level 3)

Directory:

- `/leaderboard` — paginated XP leaderboard
- `/founders [skill]` — paginated directory
- `/cofounder_opt_in` / `/cofounder_opt_out` — matching toggle
- `/cofounder_search [skill]` — search only opted-in founders

---

## Channels & Roles

The recommended server layout is created by `scripts/setup_server.py`:

**Roles**

- Base role: `Founder`
- Level roles: `Founder - Curious Alice`, `Founder - Caterpillar`, `Founder - Cheshire Cat`, `Founder - Mock Turtle`, `Founder - Wonderland`

**Categories**

- `THE FOUNDERS` (everyone can read; only Pro+ can post)

**Key channels**

- `#founders-welcome` — onboarding message + Join button (bot auto-posts and pins)
- `#daily-standups` — `/daily` posts
- `#weekly-updates` — `/weekly` posts
- `#feedback-exchange` — `/feedback` posts
- `#milestones` — `/milestone` announcements
- `#project-showcase` — `/showcase` posts
- `#build-in-public` (forum) — project threads

---

## Setup (Local)

1. Install deps (see `README.md` quickstart)
2. Create `.env` from `.env.example` and set:
   - `WUNDERBOT_AGENT_TOKEN` (agent bot)
   - `WUNDERBOT_NEWS_TOKEN` (news bot)

Tip: set **both** tokens before running server setup so `scripts/setup_server.py` can grant permission overwrites to both bots. 3) Create/update the server structure + auto-write channel IDs into `config.json`:

```bash
python scripts/setup_server.py
```

Note: if you created the categories/channels before Feb 2026, re-running the setup script is recommended so the bot gets explicit permission overwrites for Founder-gated channels (for posting embeds + onboarding buttons).

4. Run the bots:

```bash
python main.py
```

On startup, the agent bot registers the Founders slash commands and ensures the `#founders-welcome` message is posted (with the Join button) and pinned.
