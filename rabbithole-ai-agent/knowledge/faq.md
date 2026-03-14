# Rabbit Hole Inc — Knowledge Base

Last updated: 2026-03-14

## General

### What is Rabbit Hole Inc?

Rabbit Hole Inc is a 24/7 AI concierge platform. You get autonomous AI agents that handle customer requests and internal tasks, with NDA-bound human assistants as backup when needed. It includes per-request PII redaction, a self-host option, and fully offline mode. Plans start at $19/mo with a 3-day free trial.

### What is Wunderland?

Wunderland is the open-source agent runtime and CLI that powers Rabbit Hole Inc. Install it with `npm i -g wunderland`. It supports 28 channel integrations, 13 LLM providers, 18 curated skills, and 51+ extensions. You can self-host it for free or use the managed platform at rabbithole.inc.

### What is AgentOS?

AgentOS is the cognitive runtime engine that powers Wunderland agents. It handles LLM orchestration, tool calling, memory management, personality modeling (HEXACO), and multi-channel communication. It's built as a modular TypeScript framework with extension packs.

### What is OpenClaw and how does it relate to Wunderland?

Wunderland is a security-hardened fork of OpenClaw. We audited and forked it, adding AgentOS integration, a 5-tier security pipeline, per-request PII redaction, and graph-based persistent memory. Read the audit at rabbithole.inc/blog/we-audited-and-forked-openclaw.

### How do I get started with Rabbit Hole?

1. Sign up at rabbithole.inc — there's a 3-day free trial. 2) Use the AI Agent Builder to create your first agent with natural language. 3) Connect channels (Discord, Slack, Telegram, etc.) from the dashboard. 4) For self-hosting, run `npm i -g wunderland && wunderland init` to get a Docker Compose setup.

### What is the website URL?

The main website is https://rabbithole.inc — the app dashboard is at https://app.rabbithole.inc.

### Is Rabbit Hole open source?

The Wunderland runtime is open source at https://github.com/jddunn/wunderland. You can self-host it for free. The managed platform (rabbithole.inc) adds hosted runtimes, human help, the dashboard, and premium features.

### Where is the GitHub repository?

The public open-source repository is at https://github.com/jddunn/wunderland. This includes the Wunderland CLI, AgentOS runtime, and extension system.

### Who created Rabbit Hole Inc?

Rabbit Hole Inc was created by Manic Agency. You can find more at rabbithole.inc/about.

### How do I join the Discord server?

Join the Discord at https://discord.gg/KxF9b6HY6h — you'll go through onboarding to pick your interests and get personalized channel suggestions.

### How do I contact support?

Use the /support command in Discord, email support@rabbithole.inc, or create a ticket at rabbithole.inc/app/support. Pioneer subscribers get priority support.

### Does Rabbit Hole have a blog?

Yes! Read our blog at rabbithole.inc/blog. Posts include 'Building Wunderland', 'Inside the OpenClaw Audit', 'Introducing AgentOS', and more.

### Is there a newsletter?

Yes, you can subscribe to our newsletter at the bottom of rabbithole.inc for product updates, feature releases, and AI news.

## Billing

### How much does it cost? What are the pricing plans?

**Starter (Explorer)**: $19/mo — 1 AI agent, dashboard, hosted runtime, BYOK LLM keys, curated extensions, offline mode with Ollama, community support.
**Pro (Pioneer)**: $49/mo — Up to 5 agents, 2 hrs/mo human help, PII redaction, reception desk mode, advanced metrics, 51+ integrations, Docker export, Ollama tunnel, Social Club, priority support.
**Enterprise**: Custom — Unlimited agents, dedicated team, private VPS, SSO/SAML, SLA.
3-day free trial on all paid plans.

### Is there a free trial?

Yes! All paid plans include a 3-day free trial. A card is required but you won't be charged until the trial ends. Cancel anytime during the trial.

### Is there a free plan?

The Wunderland runtime is free and open source — you can self-host it at no cost. For the managed platform features (dashboard, hosted runtimes, human help), plans start at $19/mo with a 3-day free trial.

### How do I cancel my subscription?

Go to rabbithole.inc/app/account/billing or use the 'Manage subscription' button in the dashboard sidebar. This opens the Stripe billing portal where you can cancel anytime. No cancellation fees.

### What payment methods do you accept?

We use Stripe for payments, which supports credit/debit cards (Visa, Mastercard, Amex, etc.), Apple Pay, Google Pay, and other region-specific methods.

### Are LLM API costs included in the subscription?

LLM usage is billed separately by your provider. You bring your own API keys (BYOK) for OpenAI, Anthropic, etc. Or use the OpenAI OAuth login if you have an OpenAI Plus/Pro subscription. For free local inference, use Ollama (included with Pioneer's tunnel feature).

### What is the difference between Starter and Pioneer?

**Starter ($19/mo)**: 1 agent, basic dashboard, hosted runtime, community support.
**Pioneer ($49/mo)**: Up to 5 agents, 2 hrs/mo human help, PII redaction, reception desk mode, advanced metrics, Docker Compose export, Ollama tunnel for free local inference, Social Club membership, priority support. Pioneer is our most popular plan.

### What does the Enterprise plan include?

Enterprise includes unlimited agents, scalable human help hours, dedicated support team, private VPS with VPN, custom privacy controls, stronger isolation, on-site/private deployment, dedicated account manager, team pricing, SLA guarantees, and SSO/SAML. Contact sales@rabbithole.inc for pricing.

### Is there an annual or discounted plan?

Yes, annual subscriptions are available at a discount (~$21/mo for Pioneer instead of $49/mo). Social Club lifetime memberships also include perpetual Pioneer access.

## Features

### What is a Pioneer subscriber?

Pioneer is the $49/mo premium subscription tier. It includes up to 5 AI agents, 2 hours/month human help credits, PII redaction, reception desk mode, advanced metrics, 51+ channel integrations, Docker Compose export, Ollama tunnel, Rabbit Hole Social Club membership, and priority support.

### What is an Explorer subscriber?

Explorer (also called Starter) is the $19/mo plan. It includes 1 AI agent, the tiled workspace dashboard, hosted runtime, BYOK LLM keys or OpenAI OAuth, curated extensions & skills, offline-first mode with Ollama, and community support.

### How do I create an AI agent?

Use the AI Agent Builder at rabbithole.inc/app/agent-builder. Describe your agent in natural language — what it should do, its personality, which channels to connect. You can also configure HEXACO personality traits and security tiers. For self-hosting, use `wunderland init` to scaffold an agent config.

### What is HEXACO personality?

HEXACO is a 6-factor personality model used to shape your agent's communication style. The factors are: Honesty-Humility (HH), Emotionality (E), Extraversion (X), Agreeableness (A), Conscientiousness (C), and Openness (O). Each is scored 0-1. You can edit traits in the dashboard with behavioral previews showing how the agent will respond.

### How does human help work?

On the Pioneer plan, you get 2 hours/month of human assistant time. When your AI agent encounters a request it can't handle confidently, it escalates to an NDA-bound human assistant who reviews the context and completes the task. The learning is fed back into the agent's memory for future improvement.

### What is PII redaction?

Per-request PII (Personally Identifiable Information) redaction automatically strips sensitive data like names, emails, phone numbers, and addresses before sending content to LLM providers. Available on Pioneer and Enterprise plans. This means your private data never reaches third-party AI providers.

### What is reception desk mode?

Reception Desk turns your agent into an AI receptionist for your business. It handles incoming inquiries, qualifies leads, schedules meetings, and routes requests. Configure it at rabbithole.inc/app/ai-receptionist. Available on Pioneer and Enterprise plans.

### What is the Ollama tunnel?

The Ollama tunnel (Pioneer plan) lets you run AI inference on your own machine for free using Ollama, securely tunneled via Cloudflare. No API keys leave your machine, no cloud LLM costs. Run `wunderland ollama-setup` to configure. Supports models like Llama 3.1, Qwen, Mistral, etc.

### Can I run agents fully offline?

Yes! With Ollama, you can run 100% offline — zero cloud dependencies. Run `wunderland ollama-setup` to auto-configure local models. Works on macOS (Apple Silicon/Intel) and Linux. The agent, LLM, embeddings, and tools all run locally.

### How do I self-host Wunderland?

1. Install: `npm i -g wunderland`
2. Init: `wunderland init` (creates Docker Compose config)
3. Start: `wunderland start`
   Or export from the dashboard: rabbithole.inc/app/self-hosted generates a Docker Compose file for your agent config. Self-hosting is free — the runtime is open source.

### Can I export my agent as Docker?

Yes (Pioneer plan). Go to rabbithole.inc/app/self-hosted to generate a Docker Compose file with your full agent configuration. This lets you run your agent on your own VPS with no dependency on our managed platform.

### What does the dashboard include?

The Wunderland dashboard at rabbithole.inc/app features: hyprland-style tiling workspaces, AI agent builder, HEXACO personality editor, channel integrations manager, metrics dashboard (LLM usage, tool executions, channel activity), task management, credential vault, and self-hosted export. Pioneer adds advanced metrics, reception desk, and billing management.

### What metrics can I see?

The metrics dashboard shows: LLM usage (tokens, costs, latency, model/provider breakdown), tool executions (success rate, duration, filterable logs), channel activity (messages per platform, response times), and agent behavior (mood history, trust scores, safety events). View in 24h, 7d, or 30d ranges.

### What are the security tiers?

Wunderland has 5 security tiers for agents:

1. **Dangerous** — all tools enabled, no restrictions
2. **Permissive** — most tools, careful output filtering
3. **Balanced** — curated tools, approval queues for risky actions
4. **Strict** — safe tools only, no shell/filesystem
5. **Paranoid** — minimal tools, maximum validation
   Set this in the agent builder or config.

### Do agents have memory?

Yes. Agents use graph-based persistent memory (RAG) with vector search (HNSW) and community clustering (Louvain). Memories persist across sessions indefinitely. The agent builds a knowledge graph from conversations and can recall relevant context automatically.

### What tools can agents use?

Agents can use 51+ extensions including: web search, weather, GitHub, coding, shell, filesystem, Slack, Discord, email, Telegram, Notion, Obsidian, Trello, Apple Notes/Reminders, calendar, health monitoring, and more. Tools are permission-gated by the agent's security tier.

### What are the rate limits for AI commands?

**Free/Member**: `/ask` 30/day, `/deepdive` 5/day
**Pioneer**: `/ask` 100/day, `/deepdive` 30/day
Limits reset daily at midnight UTC.

### How many AI agents can I create?

Starter/Explorer: 1 agent. Pioneer: Up to 5 agents. Enterprise: Unlimited. Each agent gets its own Seed ID, personality, channel bindings, and memory.

### Can I deploy an agent to multiple channels at once?

Yes! A single agent can be connected to multiple platforms simultaneously — Discord, Slack, Telegram, WhatsApp, email, web chat, and more. Manage all channel bindings from rabbithole.inc/app/channels.

### What is the tiling workspace?

The Wunderland dashboard uses Hyprland-inspired tiling workspaces — you can drag, resize, and snap panels to a grid. Customize your layout with agent metrics, task lists, channel feeds, and configuration panels side by side.

### How are my API keys stored?

API keys are stored in an encrypted credential vault using AES-256-GCM encryption. Keys are decrypted only at runtime (in-memory), never persisted to logs or error traces. You can rotate any credential anytime from rabbithole.inc/app/account.

## Technical

### Which LLM providers are supported?

13+ providers: OpenAI (GPT-4, GPT-4o), Anthropic (Claude 3.5 Sonnet, Opus, Haiku), Google (Gemini), Meta (Llama), Ollama (local), AWS Bedrock, OpenRouter, Groq, Cohere, Mistral, Together AI, and more. Use BYOK (Bring Your Own Keys) or OpenAI OAuth.

### What channel integrations are supported?

51+ integrations including: Discord, Slack, Telegram, WhatsApp, Signal, Twilio (SMS/Voice), Matrix, IRC, Gmail, Outlook, Zendesk, Intercom, HubSpot, GitHub, GitLab, Notion, Obsidian, Trello, Asana, Twitter/X, LinkedIn, Mastodon, Bluesky, RSS, WordPress, AWS, GCP, Azure, DigitalOcean, and more.

### What skills are available for agents?

18+ curated skills: Web Search, Weather, Text/URL Summarization, Health Check, GitHub (gh CLI), Coding Agent, Git, Filesystem, Shell, Slack Helper, Discord Helper, Email Helper, Telegram Helper, Notion, Obsidian, Trello, Apple Notes, Apple Reminders, Calendar, and more.

### Can I use my OpenAI subscription instead of API keys?

Yes! If you have an OpenAI Plus or Pro subscription, you can use OAuth device-code flow instead of API keys. Go to rabbithole.inc/app/account and connect your OpenAI account. No separate API billing needed.

### What does BYOK mean?

BYOK = Bring Your Own Keys. You use your own API keys for LLM providers (OpenAI, Anthropic, etc.). Keys are encrypted with AES-256-GCM before storage, decrypted only at runtime (never logged), and you can rotate them anytime.

### What is a Seed ID?

A Seed ID is a unique identifier for your agent. It's used to reference your agent across the platform — in the dashboard, API calls, and channel bindings. Each agent gets a stable seed ID when created.

### How do I install Wunderland?

Install the CLI globally with: `npm i -g wunderland`
Then: `wunderland init` to scaffold an agent config, or `wunderland start` to run. Requires Node.js 18+.

### What are the Wunderland CLI commands?

Key CLI commands: `wunderland init` (scaffold agent), `wunderland start` (run agent), `wunderland ollama-setup` (configure local Ollama), `wunderland deploy` (export Docker Compose). Run `wunderland --help` for the full list.

### How do I configure an agent?

Create an `agent.config.json` with your LLM provider, model, personality traits (HEXACO), security tier, extensions, skills, and channel bindings. Or use the visual Agent Builder at rabbithole.inc/app/agent-builder to generate the config.

### What are extensions?

Extensions are modular packages that add capabilities to agents — channel integrations, tools, skills, and services. 51+ curated extensions available. Extensions use the `createExtensionPack()` factory pattern and can be community-contributed or official.

### How does agent memory and RAG work?

Agents use graph-based persistent memory with vector search (HNSW algorithm) for retrieval-augmented generation (RAG). Memories are clustered using Louvain community detection. You can ingest documents, URLs, and files via the dashboard or `/ingest` API. Memory persists indefinitely across sessions.

### Is there an API?

Yes. The Wunderland API is available at rabbithole.inc/api/ with endpoints for agent management, metrics, tasks, RAG ingestion, channel bindings, and more. Authentication is via JWT Bearer token. API docs are at rabbithole.inc/app/docs.

## Discord

### How do I verify my Discord account?

Run `/verify` in the #verify channel. You'll get a link to log into your RabbitHole account at rabbithole.inc. After logging in and confirming, click the 'I've verified — check now' button in Discord. Your roles will be updated based on your subscription (Member, Explorer, Pioneer, or Enterprise).

### The /verify command isn't working. What do I do?

Make sure you're using `/verify` in the #verify channel. If the verification page crashes, try clearing your browser cache and visiting rabbithole.inc/verify/discord again. If you're still having issues, contact support or ask in #general.

### What are the Discord roles and what do they mean?

Roles are assigned based on your subscription:

- **Member** — free verified account
- **Explorer** — Starter plan ($19/mo)
- **Pioneer** — Pro plan ($49/mo)
- **Enterprise** — Enterprise plan
- **White Rabbit / Mad Hatter / Royal of Hearts** — Social Club lifetime tiers
  You also get interest/profession roles from onboarding (AI & ML, Web3, Cybersecurity, etc.).

### What channels are available on Discord?

**Public**: #general, #introductions, #info, #faq, #feature-requests, #governance, #changelog, #announcements, #hackathons
**The Looking Glass (Pioneer+)**: #tech-news, #finance-news, #science-news, #media-news, #threat-intel, #ai-papers, #jobs-ai-ml, #jobs-web3, #jobs-creative, #jobs-marketing, #udemy-deals, #crypto-trending, #short-squeeze, #uniswap-sniper, #pioneer-chat, #channel-settings
**Founders**: daily-standups, weekly-updates, project-showcase, and more
**Social Club**: exclusive tiered channels

### What is The Looking Glass?

The Looking Glass is a collection of premium AI-curated Discord channels available to Pioneer subscribers and above. It includes automated news feeds (tech, finance, science, media), threat intelligence from 25+ security sources, daily AI paper digests from arXiv, curated job listings, Udemy deals, crypto market data, and more.

### What news channels are available?

Pioneer+ members get access to automated news channels in The Looking Glass: #tech-news, #finance-news, #science-news, #media-news, #us-news, and #world-news. Articles are scraped, summarized by AI, and posted with links. Updates roughly every few hours.

### What is the threat intelligence channel?

#threat-intel aggregates security advisories from 25+ sources including CISA, US-CERT, NIST NVD, Krebs on Security, Schneier, The Hacker News, BleepingComputer, Dark Reading, and more. Feeds update automatically via RSS.

### What is the AI papers channel?

#ai-papers posts daily digests of notable papers from arXiv covering machine learning, AI, NLP, computer vision, and related fields. Papers are summarized and linked for easy browsing.

### What job channels are there?

Pioneer+ members get access to curated job listings in: #jobs-ai-ml (AI/ML roles), #jobs-web3 (blockchain/crypto), #jobs-creative (design/content), and #jobs-marketing. Jobs are scraped from multiple sources and posted with direct application links.

### What are the Udemy deals?

#udemy-deals posts free and deeply discounted Udemy courses. Updated automatically. Great for learning new skills at no cost.

### What crypto channels are available?

Pioneer+ members get: #crypto-trending (trending tokens from CoinMarketCap), #short-squeeze (high short interest stocks from highshortinterest.com), and #uniswap-sniper (monitors Uniswap V2 factory for new token pair deployments). These are informational — not financial advice.

### How do I customize my channel feed?

Pioneer+ subscribers can use #channel-settings to subscribe/unsubscribe from individual Looking Glass channels. Use the channel subscription buttons to toggle which feeds you want to see.

### How do I follow a channel to get updates in my own server?

Some channels like #announcements, #changelog, #hackathons, #us-news, and #world-news are Announcement channels with a Follow button. Click 'Follow' to forward new posts to a channel in your own Discord server.

### What slash commands are available?

Key commands:

- `/verify` — Link Discord to RabbitHole account
- `/ask` — Ask the AI agent a question
- `/deepdive` — Deep research on a topic
- `/faq` — Browse FAQ entries
- `/join_founders` — Join The Founders program
- `/daily` — Daily founder check-in
- `/weekly` — Weekly founder update
- `/profile` — View your founder profile
- `/leaderboard` — XP leaderboard
- `/support` — Create a support ticket

### What is the /ask command? How many times can I use it?

The `/ask` command lets you ask the AI agent questions directly in Discord. Free/Member tier: 30 requests/day. Pioneer: 100 requests/day. Responses are powered by the configured LLM (GPT-4o-mini by default).

### What is the /deepdive command?

The `/deepdive` command performs deep research on a topic — the agent searches the web, synthesizes sources, and returns a detailed analysis. Free/Member: 5 requests/day. Pioneer: 30 requests/day.

### What is the governance channel?

#governance is where community polls and votes happen. Members can view and vote on polls but only admins can create new governance posts. This is where major platform decisions are put to the community.

### How do I request a feature?

Post in #feature-requests! Use the template format: **Feature**: [name], **Problem**: [what you're trying to solve], **Proposed Solution**: [your idea], **Alternatives Considered**: [other approaches]. The team reviews all requests.

### How does Discord onboarding work?

When you join the Discord, you'll pick your interests (AI & ML, Web3, Cybersecurity, Startups, Job Hunting, or Just Exploring) and profession (Engineer, Designer, Founder, Investor, Student, etc.). You'll get a personalized GPT-4o-generated welcome message with tailored channel suggestions posted in #general.

### What are the onboarding roles?

Interest roles: AI & Machine Learning, Web3 & Crypto, Cybersecurity, Building a Startup, Job Hunting, Just Exploring. Profession roles: Engineer/Developer, Designer/Creative, Founder/Entrepreneur, Investor/Analyst, Student/Learner, Other. These help personalize your experience.

### What is pioneer-chat?

#pioneer-chat is a subscriber-only discussion channel for Pioneer members and above. It's a private space for premium subscribers to discuss the platform, share insights, and network.

### How do I get the Pioneer role on Discord?

1. Subscribe to the Pioneer plan ($49/mo) at rabbithole.inc/pricing
2. Run `/verify` in the #verify channel on Discord
3. Log into your RabbitHole account on the verification page
4. Click 'I've verified — check now' in Discord
   Your Pioneer role will be assigned automatically based on your subscription.

### Are there hackathons?

Yes! Hackathon announcements are posted in #hackathons (an Announcement channel you can Follow). Keep an eye on #announcements and #changelog for upcoming events.

### Where can I see product updates?

Follow #changelog on Discord for detailed release notes and feature updates. Major announcements go to #announcements. Both are Followable channels.

## Founders

### What is The Founders program?

The Founders is a build-in-public gamification system on Discord. Join with `/join_founders` to track your startup journey with daily check-ins, weekly updates, XP, levels, streaks, milestones, project showcases, and co-founder matching. It's free for all Discord members.

### How do I join The Founders?

Run `/join_founders` in Discord. You'll start as a 'Curious Alice' (Level 1). Post daily check-ins with `/daily` and weekly updates with `/weekly` to earn XP and level up.

### What are the Founders levels?

5 levels with Wonderland-themed names:

1. **Curious Alice** (0 XP) — white role
2. **Caterpillar** (500 XP) — purple role
3. **Cheshire Cat** (1,500 XP) — pink role
4. **Mock Turtle** (4,000 XP) — red role
5. **Wonderland** (10,000 XP) — gold role

### How do I earn XP in The Founders?

XP sources:

- Daily Check-in (`/daily`): 10 XP + streak bonus (up to +20)
- Weekly Update (`/weekly`): 50 XP + streak bonus (up to +50)
- Feedback Given: 15 XP (max 5/day)
- Showcase Post: 25 XP
- Q&A Answer: 10 XP
- Milestones: 50-300 XP (MVP launch, first user, revenue, funding)

### How do streaks work in The Founders?

Daily and weekly streaks multiply your XP rewards. Daily streaks add 2 XP per consecutive day (capped at +20). Weekly streaks add 10 XP per consecutive week (capped at +50). Missing a day/week resets your streak to 0.

### How does co-founder matching work?

Use `/cofounder_opt_in` to make yourself discoverable. Then `/cofounder_search` to find other founders by skills, interests, or looking-for criteria. Edit your profile with `/profile_edit` to set your skills, bio, and what you're looking for.

### What are all the Founders commands?

`/join_founders` — Enter program
`/daily` — Daily check-in
`/weekly` — Weekly update
`/profile` — View your profile
`/profile_edit` — Edit bio, skills, socials
`/project_add` / `/project_edit` — Manage projects
`/projects` — View your projects
`/founders` — Directory
`/leaderboard` — XP rankings
`/milestone` — Log milestones
`/cofounder_search` — Find co-founders
`/showcase` — Post project showcase

### What are the Founders channels?

Two categories:
**THE FOUNDERS** (public read, founder write): welcome, daily-standups, weekly-updates, project-showcase, build-in-public, feedback-exchange, cofounder-matching, milestones
**FOUNDERS LOUNGE** (founder-only): founders-chat — private discussion space for active founders.

## Socialclub

### What is the Rabbit Hole Social Club?

The Rabbit Hole Social Club is a lifetime membership that includes perpetual Pioneer plan access (normally $49/mo), private Discord channels, a digital card (transferable), premium physical card, founding member status, and exclusive partner deals. Limited to 5,000 members worldwide.

### What are the Social Club membership tiers?

Three tiers:

- **White Rabbit** (2,500 spots) — 10% discount, access to 3 private channels
- **Mad Hatter** (1,500 spots) — 15% discount, access to 6 private channels
- **Royal of Hearts** (1,000 spots) — 20% discount, access to all 8 private channels
  All tiers include lifetime Pioneer access and Social Club perks.

### How do I join the Social Club?

The Social Club is currently opening for waitlist signups. Visit rabbithole.inc/social-club for details and to join the waitlist. Spots are limited to 5,000 members total.

### What is the Social Club card?

Members receive a digital membership card (transferable via email) and a premium metallic-style physical card. The card represents your lifetime membership and Social Club tier.

### What private channels do Social Club members get?

Social Club members get access to the RABBIT HOLE SOCIAL CLUB category on Discord with tiered channels. White Rabbit sees 3 channels, Mad Hatter+ sees 6, Royal of Hearts sees all 8. These include exclusive discussions, deals, and community spaces.

## Security

### How does Rabbit Hole handle privacy?

Privacy controls include: per-request PII redaction (Pioneer+), self-hosting option (your data stays on your VPS), Ollama tunnel for local inference (no data leaves your machine), 100% offline mode, encrypted credential storage (AES-256-GCM), and GDPR compliance. Enterprise adds private VPS with VPN.

### How is my data encrypted?

In transit: TLS 1.2/1.3. At rest: AES-256-GCM for secrets and credentials, encrypted database volumes. Credentials are decrypted only at runtime (in-memory, never persisted to disk or logs). You can rotate credentials anytime.

### Are there NDAs for staff?

Yes. All employees, contractors, and human assistants sign comprehensive NDAs covering all user data, credentials, and configs. The NDA has a 3-year survival period post-employment. Violations trigger immediate termination and legal action. All staff access is audit-logged.

### What security features does the platform have?

TLS enforcement, Cloudflare DDoS/WAF protection, JWT auth with short-lived tokens, bcrypt password hashing, RBAC, per-agent tool allowlists, shell/filesystem disabled by default in managed mode, prompt injection defenses, jailbreak detection, rate limiting, and full audit trails.

### Is Rabbit Hole GDPR compliant?

Yes. We're GDPR compliant with regular security audits, Data Processing Agreements (DPA) available on request, and user data deletion support. Contact privacy@rabbithole.inc for privacy inquiries.

### How do I report a security issue?

Email security@rabbithole.inc. We have a responsible disclosure program — no legal action for good-faith researchers. We acknowledge reports within 24 hours and provide post-incident reports. Contact privacy@rabbithole.inc for privacy inquiries.

### Is there protection against prompt injection?

Yes. The 5-tier security pipeline includes prompt injection defenses and jailbreak detection. In Balanced/Strict/Paranoid security tiers, agents use approval queues for risky tool calls and validate all inputs. Self-hosted agents inherit the same security pipeline.

### Does the platform support 2FA?

Two-factor authentication (2FA) is planned for an upcoming release. Currently, auth uses JWT tokens with short expiry times, secure refresh flows, and session invalidation on inactivity.

### Can human assistants see my private data?

Human assistants only see the context needed to complete escalated tasks, and all assistants sign comprehensive NDAs. With PII redaction enabled (Pioneer+), sensitive data is stripped before humans see it. All access is audit-logged.

## Legal

### Is the crypto/trading data financial advice?

No. All market data, crypto trends, short squeeze alerts, and Uniswap sniper notifications in Discord are purely informational. They are not financial advice. Always do your own research (DYOR) before making any investment decisions.

### Where are the terms of service?

Terms of service: rabbithole.inc/terms
Privacy policy: rabbithole.inc/privacy
Cookie policy: rabbithole.inc/cookies

### Can I delete my data?

Yes. Contact privacy@rabbithole.inc to request data deletion per GDPR. You can also delete your account and associated data from the dashboard settings. Agent memories, credentials, and conversation logs will be permanently removed.

## Troubleshooting

### The bot isn't responding to my commands. What should I do?

1. Make sure you're using the command in the correct channel (some commands are channel-restricted)
2. Check that the bot is online (should show as online in the member list)
3. Try the command again — there may have been a brief outage
4. If it persists, ask in #general or create a support ticket with `/support`

### I verified but didn't get my role. What happened?

After verifying on the website, go back to Discord and click the 'I've verified — check now' button. If you closed the message, run `/verify` again — it will detect you're already verified and sync your roles. If roles still don't appear, contact an admin.

### A slash command doesn't show up when I type it.

Try refreshing Discord (Ctrl+R / Cmd+R). Slash commands update when the bot restarts, which may take a moment to propagate. If the command still doesn't appear after a refresh, the command may be restricted to certain channels or roles.

### I can't see The Looking Glass channels. How do I get access?

The Looking Glass channels require a Pioneer subscription ($49/mo) or Social Club membership. Subscribe at rabbithole.inc/pricing, then run `/verify` in Discord to link your account and get the Pioneer role. Channels will appear once your role is assigned.

### How do I set up Ollama for local inference?

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.1:8b`
3. Run: `wunderland ollama-setup` (configures tunnel and agent)
   Or set `OLLAMA_BASE_URL=http://localhost:11434` in your agent environment. For Pioneer subscribers, the Ollama tunnel routes through Cloudflare securely.

### What are the requirements for self-hosting?

Node.js 18+, Docker (for Docker Compose export), and optionally Ollama for local LLM inference. A VPS with 2+ GB RAM is recommended. The runtime itself is lightweight — resource usage depends on your LLM provider.
