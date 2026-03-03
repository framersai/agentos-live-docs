export interface CaptionEntry {
  text: string;
  from: number; // global frame start (inclusive)
  to: number; // global frame end (exclusive)
}

// ═══════════════════════════════════════════════════════════════════════
// Paraphrased captions synced to voiceover audio durations.
// VO windows (from ffprobe): brand-intro 0–711, install-p1 745–1064,
// install-p2 1225–1562, install-p3 1705–1995, screenshots 2025–2352,
// features 2730–3098, stats 3135–3437, ecosystem 3460–3768, cta 3805–4086
// Durations sized for ~14 chars/sec comfortable reading speed.
// ═══════════════════════════════════════════════════════════════════════

export const CAPTIONS: CaptionEntry[] = [
  // ── Scene 1: Brand Intro — VO: 0–720, Buffer: 720–750 ──
  { text: 'Meet Wunderland — the last AI virtual assistant you will ever need', from: 25, to: 160 },
  { text: 'Built on OpenClaw — HEXACO personality, graph RAG, and more', from: 165, to: 310 },
  { text: '5-tier security, 51+ extensions, 13 LLM providers', from: 315, to: 450 },
  { text: 'Free, open source, and fully self-hostable', from: 455, to: 580 },
  { text: 'Fully offline compatible with Ollama — zero cost', from: 585, to: 720 },

  // ── Scene 2, Phase 1 — VO: 745–1064, Buffer: 1064–1215 ──
  { text: 'One command to install — automated setup', from: 755, to: 855 },
  { text: '8 curated presets — choose your agent personality', from: 855, to: 975 },
  {
    text: '13 LLM providers — OpenAI, Anthropic, Ollama, Groq, and more (Ollama streamlined setup)',
    from: 970,
    to: 1085,
  },
  // gap fill — buffer zone (VO ended)
  { text: '18 skills auto-loaded — web, GitHub, coding, Spotify, and more', from: 1080, to: 1210 },

  // ── Scene 2, Phase 2 — VO: 1225–1562, Buffer: 1562–1695 ──
  { text: 'Start chatting instantly — your agent is ready', from: 1235, to: 1345 },
  { text: '23+ autonomous tools — web search, GitHub, coding, and more', from: 1340, to: 1475 },
  { text: 'Real-time results — agents that think, plan, and act', from: 1470, to: 1590 },

  // ── Scene 2, Phase 3 — VO: 1705–1995, Buffer: 1995–2040 ──
  { text: 'Built-in diagnostics — API keys, LLMs, channels, all verified', from: 1715, to: 1845 },
  { text: '27+ channels, 13 providers — everything checked at a glance', from: 1840, to: 1990 },

  // ── Scene 3: Screenshot Showcase — VO: 2025–2352, Buffer: 2352–2745 ──
  { text: 'Setup wizard → TUI dashboard → full CLI toolkit', from: 2035, to: 2160 },
  { text: '8 agent presets + human-in-the-loop approval panel', from: 2155, to: 2280 },
  { text: 'Real-time tool approval — review and control every action', from: 2275, to: 2400 },
  // gap fill — buffer zone (VO ended)
  { text: '13 providers, 18 skills, 23+ tools (Ollama offline)', from: 2395, to: 2510 },

  // ── Scene 4: Feature Highlights — VO: 2730–3098, Buffer: 3098–3150 ──
  { text: 'HEXACO 6-factor personality — drives mood, style, and decisions', from: 2740, to: 2860 },
  {
    text: '5-tier security — pre-LLM filters, dual audit, HMAC, cost guards',
    from: 2855,
    to: 2975,
  },
  { text: '51+ extensions — channels, tools, voice, browser, and more', from: 2970, to: 3080 },
  {
    text: 'Unlimited graph-based knowledge — semantic memory, dynamic mood decay',
    from: 3075,
    to: 3160,
  },

  // ── Scene 5: Stats Counter — VO: 3135–3594, Buffer: 3594–3635 ──
  { text: 'The numbers speak for themselves — an unmatched agent toolkit', from: 3145, to: 3305 },
  { text: 'Tools, skills, channels, providers — everything built in', from: 3300, to: 3460 },
  { text: 'A massive, growing ecosystem — updated every week', from: 3455, to: 3600 },

  // ── Scene 6: Ecosystem Grid — VO: 3620–3928, Buffer: 3928–3980 ──
  { text: 'OpenAI, Anthropic, Ollama, Groq, Gemini, Mistral, and more', from: 3630, to: 3755 },
  { text: 'Telegram, Discord, Slack, Signal, Matrix, and 20+ more', from: 3750, to: 3865 },
  { text: 'Fully offline with Ollama — your data stays local', from: 3860, to: 3970 },

  // ── Scene 7: Rabbithole CTA — VO: 3965–4246, Buffer: 4246–4295 ──
  { text: 'Start building Wunderbots — free and open source', from: 3975, to: 4090 },
  {
    text: 'Any LLM provider — including uncensored models and Ollama fully offline',
    from: 4085,
    to: 4200,
  },
  { text: 'wunderland.sh \u00B7 rabbithole.inc', from: 4195, to: 4270 },
];
