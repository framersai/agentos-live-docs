import { CaptionEntry } from './captions';
import { WB_SCENE, TRANSITION } from '../theme/wb-timing';

// Pre-compute cumulative start frames (same logic as WorkbenchDemo.tsx)
const S = WB_SCENE;
const T = TRANSITION;
const starts = {
  intro: 0,
  streaming: S.intro - T,
  agency: S.intro + S.streaming - 2 * T,
  personas: S.intro + S.streaming + S.agency - 3 * T,
  planning: S.intro + S.streaming + S.agency + S.personas - 4 * T,
  evaluation: S.intro + S.streaming + S.agency + S.personas + S.planning - 5 * T,
  themes: S.intro + S.streaming + S.agency + S.personas + S.planning + S.evaluation - 6 * T,
  closingCTA:
    S.intro + S.streaming + S.agency + S.personas + S.planning + S.evaluation + S.themes - 7 * T,
};

export const WB_CAPTIONS: CaptionEntry[] = [
  // ── Scene 1: Intro (no captions — text on screen) ──

  // ── Scene 2: Streaming Inspector ──
  {
    text: 'Send a prompt — watch every token stream in real-time',
    from: starts.streaming + 30,
    to: starts.streaming + 170,
  },
  {
    text: 'Color-coded by type: text, tool calls, metadata',
    from: starts.streaming + 190,
    to: starts.streaming + 370,
  },
  {
    text: 'Full telemetry tracked in the bottom bar',
    from: starts.streaming + 400,
    to: starts.streaming + 510,
  },

  // ── Scene 3: Agency Mode ──
  {
    text: 'Multi-agent teams with role-based delegation',
    from: starts.agency + 30,
    to: starts.agency + 140,
  },
  {
    text: 'Researcher, Analyst, Creator — working in parallel',
    from: starts.agency + 180,
    to: starts.agency + 370,
  },
  {
    text: 'Aggregated results from all agents',
    from: starts.agency + 420,
    to: starts.agency + 520,
  },

  // ── Scene 4: Personas ──
  {
    text: 'Browse personas or build your own with the wizard',
    from: starts.personas + 30,
    to: starts.personas + 160,
  },
  {
    text: 'Configure name, traits, guardrails, and capabilities',
    from: starts.personas + 180,
    to: starts.personas + 330,
  },

  // ── Scene 5: Planning ──
  {
    text: 'Multi-step task decomposition with confidence scores',
    from: starts.planning + 30,
    to: starts.planning + 170,
  },
  {
    text: 'Pause, resume, advance — full execution control',
    from: starts.planning + 190,
    to: starts.planning + 330,
  },

  // ── Scene 6: Evaluation ──
  {
    text: 'Run evaluation suites — track quality over time',
    from: starts.evaluation + 30,
    to: starts.evaluation + 160,
  },
  {
    text: 'Pass/fail per test case with detailed metrics',
    from: starts.evaluation + 170,
    to: starts.evaluation + 275,
  },

  // ── Scene 7: Themes ──
  {
    text: '9 palettes, 3 densities, light and dark mode',
    from: starts.themes + 30,
    to: starts.themes + 210,
  },

  // ── Scene 8: Closing CTA ──
  {
    text: 'Open source. Free to use. Start now at agentos.sh',
    from: starts.closingCTA + 30,
    to: starts.closingCTA + 180,
  },
];
