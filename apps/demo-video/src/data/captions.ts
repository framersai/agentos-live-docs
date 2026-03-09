export interface CaptionEntry {
  text: string;
  from: number; // global frame start (inclusive)
  to: number; // global frame end (exclusive)
}

// ═══════════════════════════════════════════════════════════════════════
// VSL captions synced to voiceover scripts.
// Scene starts (with 15f transition overlaps):
//   painHook=0, problemState=165, brandIntro=650, installSequence=1160,
//   screenshotShowcase=2105, featureHighlights=2840, proofSection=3125,
//   finalState=3650, rabbitholeCTA=4235
// Total: 4505 frames ≈ 150.2s
// NOTE: Fine-tune frame numbers after reviewing with Remotion preview.
// ═══════════════════════════════════════════════════════════════════════

export const CAPTIONS: CaptionEntry[] = [
  // ── Scene 1: Pain Hook (0–180) — no captions (text shown on screen) ──

  // ── Scene 2: Problem State (165–665) ──
  { text: 'Gateway errors. Dependency hell. Runaway API costs.', from: 175, to: 305 },
  { text: 'No personality. No memory. One channel at a time.', from: 365, to: 465 },
  { text: 'There has to be a better way.', from: 485, to: 585 },

  // ── Scene 3: Brand Intro (650–1175) ──
  { text: 'Meet Wunderland', from: 660, to: 720 },
  { text: 'The AI assistant that just works', from: 720, to: 805 },
  {
    text: '27 messaging channels \u00B7 13 LLM providers \u00B7 zero friction',
    from: 805,
    to: 930,
  },
  {
    text: 'Works everywhere. Remembers everything. Stays secure. Free with Ollama.',
    from: 930,
    to: 1100,
  },

  // ── Scene 4: Install Sequence — Phase 1: Setup (1160–1640) ──
  { text: 'One command. Choose a preset. Pick your provider.', from: 1175, to: 1285 },
  { text: 'Skills auto-loaded. Channels configured.', from: 1285, to: 1395 },
  { text: 'Your Wunderbot — initialized and ready.', from: 1395, to: 1515 },

  // ── Scene 4: Install Sequence — Phase 2: Chat (1640–2120) ──
  { text: 'Your Wunderbot thinks, plans, and acts', from: 1655, to: 1755 },
  { text: '23 autonomous tools — web search, GitHub, coding, summarization', from: 1755, to: 1915 },
  { text: 'Full tool orchestration with real-time results', from: 1915, to: 2035 },

  // ── Scene 5: Screenshot Showcase (2105–2855) ──
  { text: 'Interactive setup wizard. Terminal UI dashboard.', from: 2120, to: 2245 },
  { text: 'Agent presets with HEXACO personality traits', from: 2245, to: 2375 },
  { text: 'Human-in-the-loop approval. Autonomous tool calling.', from: 2375, to: 2525 },
  { text: '13 LLM providers. 18 curated skills.', from: 2525, to: 2665 },

  // ── Scene 6: Feature Highlights (2840–3140) ──
  {
    text: 'HEXACO personality. 5-tier security. 51+ extensions. Unlimited memory.',
    from: 2855,
    to: 3065,
  },

  // ── Scene 7: Proof Section (3125–3665) ──
  { text: 'The numbers speak for themselves', from: 3135, to: 3210 },
  {
    text: '27 channels \u00B7 13 providers \u00B7 23 tools \u00B7 18 skills',
    from: 3210,
    to: 3340,
  },
  { text: '51+ extensions. 5 security tiers.', from: 3340, to: 3450 },
  { text: 'An unmatched open-source agent toolkit', from: 3450, to: 3560 },

  // ── Scene 8: Final State (3650–4250) ──
  { text: 'This is what you get', from: 3660, to: 3730 },
  { text: 'A complete command center for your AI agent', from: 3730, to: 3830 },
  { text: 'Real-time dashboard. API keys verified. Channels live.', from: 3830, to: 3950 },
  { text: '12 quick actions at your fingertips', from: 3950, to: 4050 },
  { text: 'Full control. Full autonomy. Your choice.', from: 4050, to: 4190 },

  // ── Scene 9: Rabbithole CTA (4235–4505) ──
  { text: 'Start in 60 seconds \u2014 free, open source, no credit card', from: 4245, to: 4360 },
  { text: 'wunderland.sh \u00B7 rabbithole.inc', from: 4360, to: 4490 },
];
