export interface CaptionEntry {
  text: string;
  from: number; // global frame start (inclusive)
  to: number; // global frame end (exclusive)
}

// ═══════════════════════════════════════════════════════════════════════
// Paraphrased captions synced to voiceover audio durations.
// VO windows (from ffprobe): brand-intro 0–501, install-p1 535–854,
// install-p2 1015–1352, install-p3 1495–1785, screenshots 1890–2217,
// features 2415–2783, stats 2820–3122, ecosystem 3145–3453, cta 3490–3771
// Gap-fill captions placed in buffer zones AFTER voiceover ends.
// ═══════════════════════════════════════════════════════════════════════

export const CAPTIONS: CaptionEntry[] = [
  // ── Scene 1: Brand Intro — VO: 0–501, Buffer: 501–540 ──
  { text: 'Meet Wunderland — your open-source AI agent framework', from: 25, to: 115 },
  { text: 'Built on OpenClaw — HEXACO personality, graph RAG, and more', from: 135, to: 235 },
  { text: '5-tier security, 51+ extensions, 13 LLM providers', from: 260, to: 370 },
  { text: 'Free, open source, and self-hostable on AgentOS', from: 390, to: 490 },
  // gap fill — buffer zone (VO ended)
  { text: 'Runs fully offline with Ollama — zero cost', from: 495, to: 538 },

  // ── Scene 2, Phase 1 — VO: 535–854, Buffer: 854–1005 ──
  { text: 'One command to install — automated setup', from: 545, to: 625 },
  { text: '8 curated presets — choose your agent personality', from: 645, to: 740 },
  { text: '13 LLM providers — OpenAI, Anthropic, Ollama, Groq, and more', from: 760, to: 850 },
  // gap fills — buffer zone (VO ended)
  { text: '18 skills auto-loaded — web, GitHub, coding, Spotify, and more', from: 870, to: 960 },
  { text: 'Works fully offline with Ollama — no API keys needed', from: 965, to: 1000 },

  // ── Scene 2, Phase 2 — VO: 1015–1352, Buffer: 1352–1485 ──
  { text: 'Start chatting instantly — your agent is ready', from: 1025, to: 1110 },
  { text: '23+ autonomous tools — web search, GitHub, coding, and more', from: 1130, to: 1240 },
  { text: 'Real-time results — agents that think, plan, and act', from: 1260, to: 1350 },

  // ── Scene 2, Phase 3 — VO: 1495–1785, Buffer: 1785–1905 ──
  { text: 'Built-in diagnostics — API keys, LLMs, channels, all verified', from: 1505, to: 1610 },
  { text: '27+ channels, 13 providers — everything checked at a glance', from: 1630, to: 1780 },

  // ── Scene 3: Screenshot Showcase — VO: 1890–2217, Buffer: 2217–2430 ──
  { text: 'Setup wizard → TUI dashboard → full CLI toolkit', from: 1900, to: 2000 },
  { text: '8 agent presets + human-in-the-loop approval panel', from: 2020, to: 2120 },
  { text: 'Real-time tool approval — review and control every action', from: 2140, to: 2215 },
  // gap fill — buffer zone (VO ended)
  { text: '13 providers, 18 skills, 23+ tools (Ollama offline)', from: 2240, to: 2340 },

  // ── Scene 4: Feature Highlights — VO: 2415–2783, Buffer: 2783–2835 ──
  { text: 'HEXACO 6-factor personality — drives mood, style, and decisions', from: 2425, to: 2525 },
  {
    text: '5-tier security — pre-LLM filters, dual audit, HMAC, cost guards',
    from: 2540,
    to: 2640,
  },
  { text: '51+ extensions — channels, tools, voice, browser, and more', from: 2655, to: 2745 },
  { text: 'Unlimited graph-based knowledge — semantic + episodic memory', from: 2755, to: 2780 },

  // ── Scene 5: Stats Counter — VO: 2820–3122, Buffer: 3122–3160 ──
  { text: '27+ channels, 13 LLM providers — and counting', from: 2830, to: 2930 },
  { text: '23+ tools, 18 skills, 51+ extensions — and counting', from: 2950, to: 3050 },
  { text: 'A massive, growing open-source ecosystem', from: 3065, to: 3120 },

  // ── Scene 6: Ecosystem Grid — VO: 3145–3453, Buffer: 3453–3505 ──
  { text: 'OpenAI, Anthropic, Ollama, Groq, Gemini, Mistral, and more', from: 3155, to: 3260 },
  { text: 'Telegram, Discord, Slack, Signal, Matrix, and 20+ more', from: 3275, to: 3370 },
  { text: 'Fully offline with Ollama — your data stays local', from: 3385, to: 3450 },

  // ── Scene 7: Rabbithole CTA — VO: 3490–3771, Buffer: 3771–3820 ──
  { text: 'Start building Wunderbots — free and open source', from: 3500, to: 3590 },
  { text: 'Self-host free or deploy on Rabbithole cloud', from: 3610, to: 3700 },
  { text: 'wunderland.sh \u00B7 rabbithole.inc', from: 3720, to: 3770 },
];
