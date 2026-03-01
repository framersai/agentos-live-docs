import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';
import { Terminal } from '../components/Terminal';
import { TypingAnimation } from '../components/TypingAnimation';
import { FloatingParticles } from '../components/FloatingParticles';
import { ShineText } from '../components/ShineText';

// ═══════════════════════════════════════════════════════════════════════
// Accurate recreation of real wunderland CLI output.
// Matches setup-wizard.png, chat-toolcall.png, doctor-grid.png exactly.
// No box-drawing — uses ◆ ✓ ○ ▸ bullets with multi-colored segments.
// Phase duration 480f (16s). Last content ≤ 400f for readable buffer.
// ═══════════════════════════════════════════════════════════════════════

// Colors matching the real CLI screenshots
const C = {
  gold: '#f59e0b',
  cyan: '#06b6d4',
  green: '#10b981',
  purple: '#a78bfa',
  white: '#f0eeff',
  muted: 'rgba(240, 238, 255, 0.50)',
  dimmed: 'rgba(240, 238, 255, 0.35)',
  yellowWarn: '#fbbf24',
} as const;

type Seg = { t: string; c?: string; b?: boolean };

type Line =
  | { type: 'blank'; start: number }
  | { type: 'typed'; start: number; text: string; dur: number; prefix?: Seg[]; color?: string }
  | { type: 'rich'; start: number; segs: Seg[] };

// ── Phase 1: wunderland setup (matches setup-wizard.png) ─────────────
const PHASE1: Line[] = [
  {
    type: 'typed',
    start: 5,
    text: 'npm install -g wunderland',
    dur: 20,
    prefix: [{ t: '$ ', c: C.gold }],
  },
  { type: 'rich', start: 32, segs: [{ t: '  added 1 package in 2.4s', c: C.green }] },
  { type: 'blank', start: 48 },
  { type: 'typed', start: 52, text: 'wunderland setup', dur: 16, prefix: [{ t: '$ ', c: C.gold }] },
  { type: 'blank', start: 75 },

  // Choose a preset
  {
    type: 'rich',
    start: 80,
    segs: [
      { t: '  ◆ ', c: C.gold },
      { t: 'Choose a preset', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 95,
    segs: [
      { t: '    ▸ ', c: C.cyan },
      { t: 'Research Assistant', c: C.cyan, b: true },
      { t: ' — Precise, systematic, thorough', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 103,
    segs: [{ t: '      Code Reviewer — Detail-oriented, strict', c: C.dimmed }],
  },
  {
    type: 'rich',
    start: 108,
    segs: [{ t: '      Creative Writer — Imaginative, open', c: C.dimmed }],
  },
  {
    type: 'rich',
    start: 113,
    segs: [{ t: '      Security Auditor — Paranoid, meticulous', c: C.dimmed }],
  },
  { type: 'blank', start: 125 },

  // LLM Provider
  {
    type: 'rich',
    start: 130,
    segs: [
      { t: '  ◆ ', c: C.gold },
      { t: 'LLM Provider', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 145,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'openai', c: C.green, b: true },
      { t: ' (gpt-4o-mini) — configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 158,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'anthropic', c: C.green, b: true },
      { t: ' (claude-sonnet-4-5) — configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 171,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'ollama', c: C.green, b: true },
      { t: ' (llama3) — local, no key', c: C.muted },
    ],
  },
  { type: 'blank', start: 185 },

  // Skills
  {
    type: 'rich',
    start: 190,
    segs: [
      { t: '  ◆ ', c: C.gold },
      { t: 'Skills', c: C.white, b: true },
      { t: ' (auto-loaded from preset)', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 205,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'web-search', c: C.green, b: true },
      { t: ' — Search the web via Serper/Brave/DuckDuckGo', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 218,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'summarize', c: C.green, b: true },
      { t: ' — Summarize documents and web pages', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 231,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'github', c: C.green, b: true },
      { t: ' — Manage repos, PRs, issues via gh CLI', c: C.muted },
    ],
  },
  { type: 'blank', start: 248 },

  // Channel
  {
    type: 'rich',
    start: 255,
    segs: [
      { t: '  ◆ ', c: C.gold },
      { t: 'Channel', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 268,
    segs: [
      { t: '    ▸ ', c: C.cyan },
      { t: 'telegram', c: C.cyan, b: true },
      { t: ' — Bot API via grammY', c: C.muted },
    ],
  },
  { type: 'rich', start: 278, segs: [{ t: '      discord — Bot via discord.js', c: C.dimmed }] },
  {
    type: 'rich',
    start: 286,
    segs: [{ t: '      webchat — Browser-based Socket.IO widget', c: C.dimmed }],
  },
  { type: 'blank', start: 300 },

  // Security Tier
  {
    type: 'rich',
    start: 308,
    segs: [
      { t: '  ◆ ', c: C.gold },
      { t: 'Security Tier', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 322,
    segs: [
      { t: '    ', c: C.muted },
      { t: 'balanced', c: C.green, b: true },
      { t: ' — Pre-LLM classification + dual-LLM audit', c: C.muted },
    ],
  },
  { type: 'blank', start: 340 },

  // Project initialized
  {
    type: 'rich',
    start: 350,
    segs: [
      { t: '  ✓ ', c: C.green },
      { t: 'Wunderbot initialized', c: C.green, b: true },
      { t: ' at ./my-research-agent', c: C.muted },
    ],
  },
  { type: 'blank', start: 370 },
  {
    type: 'rich',
    start: 378,
    segs: [
      { t: '    Next: ', c: C.muted },
      { t: 'cd my-research-agent && wunderland chat', c: C.white },
    ],
  },
];

// ── Phase 2: wunderland chat (matches chat-toolcall.png) ─────────────
const PHASE2: Line[] = [
  { type: 'typed', start: 5, text: 'wunderland chat', dur: 16, prefix: [{ t: '$ ', c: C.gold }] },
  { type: 'blank', start: 28 },

  // Agent info header
  {
    type: 'rich',
    start: 32,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Provider: ', c: C.muted },
      { t: 'openai', c: C.white, b: true },
      { t: '    ', c: C.muted },
      { t: 'Model: ', c: C.muted },
      { t: 'gpt-4o-mini', c: C.white, b: true },
      { t: '    ', c: C.muted },
      { t: 'Tools: ', c: C.muted },
      { t: '6', c: C.white, b: true },
      { t: '    ', c: C.muted },
      { t: 'Skills: ', c: C.muted },
      { t: 'on', c: C.green },
    ],
  },
  {
    type: 'rich',
    start: 52,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'HEXACO: ', c: C.muted },
      { t: 'H:0.9 E:0.3 X:0.4 A:0.7 C:0.95 O:0.85', c: C.purple },
      { t: '    ', c: C.muted },
      { t: 'Mood: ', c: C.muted },
      { t: 'NEUTRAL', c: C.purple, b: true },
    ],
  },
  {
    type: 'rich',
    start: 72,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Authorization: ', c: C.muted },
      { t: 'fully autonomous', c: C.white, b: true },
    ],
  },
  { type: 'blank', start: 88 },

  // User prompt
  {
    type: 'typed',
    start: 95,
    text: 'Search for the latest news about autonomous AI agents',
    dur: 42,
    prefix: [
      { t: 'you', c: C.gold, b: true },
      { t: ' ▸ ', c: C.gold },
    ],
    color: C.white,
  },
  { type: 'blank', start: 148 },

  // Tool calls
  {
    type: 'rich',
    start: 155,
    segs: [
      { t: '  ▸ ', c: C.purple },
      { t: 'news_search', c: C.purple, b: true },
      { t: ' {"query":"autonomous AI agents","pageSize":5}', c: C.dimmed },
    ],
  },
  { type: 'rich', start: 175, segs: [{ t: '    → 5 articles found (1.2s)', c: C.muted }] },
  {
    type: 'rich',
    start: 192,
    segs: [
      { t: '  ▸ ', c: C.purple },
      { t: 'web_search', c: C.purple, b: true },
      { t: ' {"query":"AI agent frameworks 2026","maxResults":3}', c: C.dimmed },
    ],
  },
  { type: 'rich', start: 212, segs: [{ t: '    → 3 results via Serper (0.8s)', c: C.muted }] },
  {
    type: 'rich',
    start: 228,
    segs: [
      { t: '  ▸ ', c: C.purple },
      { t: 'summarize', c: C.purple, b: true },
      { t: ' {"text":"[8 sources merged]","style":"bullet_points"}', c: C.dimmed },
    ],
  },
  { type: 'rich', start: 248, segs: [{ t: '    → Summary generated (2.1s)', c: C.muted }] },
  { type: 'blank', start: 268 },

  // Summary output
  {
    type: 'rich',
    start: 278,
    segs: [{ t: '  Top 3 Autonomous AI Agent News (March 2026):', c: C.white, b: true }],
  },
  { type: 'blank', start: 295 },
  {
    type: 'rich',
    start: 305,
    segs: [
      { t: '  1. ', c: C.cyan },
      { t: 'Claude Agent SDK', c: C.white, b: true },
      { t: ' — Anthropic releases open-source SDK for building', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 310,
    segs: [{ t: '     custom AI agents with tool use and multi-turn orchestration', c: C.muted }],
  },
  { type: 'blank', start: 325 },
  {
    type: 'rich',
    start: 330,
    segs: [
      { t: '  2. ', c: C.cyan },
      { t: 'OpenAI Agents API', c: C.white, b: true },
      { t: ' — New production-ready API for deploying autonomous', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 335,
    segs: [{ t: '     agents with built-in guardrails and function calling', c: C.muted }],
  },
  { type: 'blank', start: 350 },
  {
    type: 'rich',
    start: 355,
    segs: [
      { t: '  3. ', c: C.cyan },
      { t: 'Google DeepMind SIMA', c: C.white, b: true },
      { t: ' — Scalable Instructable Multiworld Agent', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 360,
    segs: [{ t: '     demonstrates cross-game generalization with natural language', c: C.muted }],
  },
  { type: 'blank', start: 380 },

  // Footer
  {
    type: 'rich',
    start: 390,
    segs: [{ t: '  4 tool calls · 3 rounds · 847 tokens · 4.1s', c: C.dimmed }],
  },
];

// ── Phase 3: wunderland doctor (matches doctor-grid.png) ─────────────
// Compressed timing — ~60% faster for snappier pacing
const PHASE3: Line[] = [
  { type: 'typed', start: 5, text: 'wunderland doctor', dur: 14, prefix: [{ t: '$ ', c: C.gold }] },
  { type: 'blank', start: 22 },
  {
    type: 'rich',
    start: 25,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Wunderland Doctor', c: C.white, b: true },
    ],
  },
  { type: 'blank', start: 35 },

  // Configuration
  {
    type: 'rich',
    start: 38,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Configuration', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 48,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Config: ', c: C.white },
      { t: 'config.json', c: C.white, b: true },
      { t: '          ~/.wunderland/agent.config.json', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 56,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Config: ', c: C.white },
      { t: '.env', c: C.white, b: true },
      { t: '                 not in current directory', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 64,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Config: ', c: C.white },
      { t: 'agent.config.json', c: C.white, b: true },
      { t: '  not in current directory', c: C.muted },
    ],
  },
  { type: 'blank', start: 75 },

  // API Keys
  {
    type: 'rich',
    start: 80,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'API Keys', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 90,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Key: ', c: C.white },
      { t: 'OPENAI_API_KEY', c: C.white, b: true },
      { t: '           sk-••••••••', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 100,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Key: ', c: C.white },
      { t: 'ANTHROPIC_API_KEY', c: C.white, b: true },
      { t: '        sk-ant-••••', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 110,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Key: ', c: C.white },
      { t: 'OPENROUTER_API_KEY', c: C.white, b: true },
      { t: '       sk-or-••••••', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 120,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Key: ', c: C.white },
      { t: 'ELEVENLABS_API_KEY', c: C.white, b: true },
      { t: '       not set', c: C.yellowWarn },
    ],
  },
  { type: 'blank', start: 133 },

  // Channels
  {
    type: 'rich',
    start: 138,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Channels', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 148,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Channel: ', c: C.white },
      { t: 'telegram', c: C.green, b: true },
      { t: '        configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 156,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Channel: ', c: C.white },
      { t: 'discord', c: C.green, b: true },
      { t: '         configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 164,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Channel: ', c: C.white },
      { t: 'slack', c: C.yellowWarn, b: true },
      { t: '           partially configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 172,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Channel: ', c: C.white },
      { t: 'whatsapp', c: C.yellowWarn, b: true },
      { t: '        not configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 180,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Channel: ', c: C.white },
      { t: 'signal', c: C.green, b: true },
      { t: '          configured', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 188,
    segs: [
      { t: '    ○ ', c: C.yellowWarn },
      { t: 'Channel: ', c: C.white },
      { t: 'imessage', c: C.yellowWarn, b: true },
      { t: '        not configured', c: C.muted },
    ],
  },
  { type: 'blank', start: 200 },

  // Connectivity
  {
    type: 'rich',
    start: 205,
    segs: [
      { t: '  ◆ ', c: C.cyan },
      { t: 'Connectivity', c: C.white, b: true },
    ],
  },
  {
    type: 'rich',
    start: 215,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Connectivity: ', c: C.white },
      { t: 'OpenAI API', c: C.green, b: true },
      { t: '          142ms', c: C.muted },
    ],
  },
  {
    type: 'rich',
    start: 225,
    segs: [
      { t: '    ✓ ', c: C.green },
      { t: 'Connectivity: ', c: C.white },
      { t: 'https://wunderland.sh', c: C.green, b: true },
      { t: '   67ms', c: C.muted },
    ],
  },
  { type: 'blank', start: 238 },

  // Summary
  {
    type: 'rich',
    start: 245,
    segs: [
      { t: '  ◆ ', c: C.green },
      { t: '10 passed', c: C.green, b: true },
      { t: '  ', c: C.muted },
      { t: '5 skipped', c: C.yellowWarn, b: true },
    ],
  },
];

const PHASE_DURATION = 480;
const PHASE2_START = PHASE_DURATION;
const PHASE3_START = PHASE_DURATION * 2;

// ── Render a single line ─────────────────────────────────────────────
const RichLine: React.FC<{
  line: Line;
  frame: number;
  offset: number;
}> = ({ line, frame, offset }) => {
  const lf = frame - offset;

  if (line.type === 'blank') return <div style={{ height: 6 }} />;
  if (lf < line.start) return null;

  const mono = { fontFamily: jetbrainsMono };

  if (line.type === 'typed') {
    const prefixNode = line.prefix ? (
      <>
        {line.prefix.map((s, i) => (
          <span key={i} style={{ color: s.c, fontWeight: s.b ? 700 : undefined }}>
            {s.t}
          </span>
        ))}
      </>
    ) : undefined;

    return (
      <TypingAnimation
        text={line.text}
        startFrame={offset + line.start}
        typingDuration={line.dur}
        prefix={prefixNode}
        color={line.color}
      />
    );
  }

  // Rich segmented line — fade in
  const opacity = interpolate(lf, [line.start, line.start + 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, ...mono }}>
      {line.segs.map((s, i) => (
        <span key={i} style={{ color: s.c ?? C.white, fontWeight: s.b ? 700 : undefined }}>
          {s.t}
        </span>
      ))}
    </div>
  );
};

// ── Main Scene ───────────────────────────────────────────────────────
export const InstallSequence: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = (lf: number) =>
    interpolate(lf, [0, 8, PHASE_DURATION - 20, PHASE_DURATION], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // Phase 1 zoom
  const p1Zoom = interpolate(
    frame,
    [0, 12, 100, 125, PHASE_DURATION - 25, PHASE_DURATION],
    [0.92, 1.0, 1.0, 1.1, 1.1, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Phase 2 zoom
  const p2L = frame - PHASE2_START;
  const p2Zoom = interpolate(
    p2L,
    [0, 12, 240, 265, PHASE_DURATION - 25, PHASE_DURATION],
    [0.92, 1.0, 1.0, 1.12, 1.12, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Phase 3 zoom
  const p3L = frame - PHASE3_START;
  const p3Zoom = interpolate(
    p3L,
    [0, 12, 140, 165, PHASE_DURATION - 25, PHASE_DURATION],
    [0.92, 1.0, 1.0, 1.08, 1.08, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const headingStyle: React.CSSProperties = {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    zIndex: 10,
    fontFamily: syne,
    fontWeight: 700,
    fontSize: 42,
    color: W.textPrimary,
    textAlign: 'center',
    letterSpacing: '0.06em',
  };

  const wrap = (zoom: number, opacity: number, z: number): React.CSSProperties => ({
    position: 'absolute',
    width: 1000,
    zIndex: z,
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
    opacity,
    marginTop: 30,
  });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={15} />

      {/* ── Fixed-position heading — always at same height ── */}
      {frame < PHASE2_START + 15 && (
        <div style={{ ...headingStyle, opacity: fade(frame) }}>
          <ShineText startFrame={5}>Build a Wunderbot in 60 Seconds</ShineText>
        </div>
      )}
      {frame >= PHASE2_START - 15 && frame < PHASE3_START + 15 && (
        <div style={{ ...headingStyle, opacity: fade(p2L) }}>
          <ShineText startFrame={PHASE2_START + 5}>Your Wunderbot in Action</ShineText>
        </div>
      )}
      {frame >= PHASE3_START - 15 && (
        <div style={{ ...headingStyle, opacity: fade(p3L) }}>
          <ShineText startFrame={PHASE3_START + 5}>System Health Check</ShineText>
        </div>
      )}

      {/* ── Terminal panels ── */}
      {frame < PHASE2_START + 15 && (
        <div style={wrap(p1Zoom, fade(frame), 1)}>
          <Terminal title="wunderland setup">
            {PHASE1.map((l, i) => (
              <RichLine key={`p1-${i}`} line={l} frame={frame} offset={0} />
            ))}
          </Terminal>
        </div>
      )}

      {frame >= PHASE2_START - 15 && frame < PHASE3_START + 15 && (
        <div style={wrap(p2Zoom, fade(p2L), 2)}>
          <Terminal title="wunderland chat — Research Assistant">
            {PHASE2.map((l, i) => (
              <RichLine key={`p2-${i}`} line={l} frame={frame} offset={PHASE2_START} />
            ))}
          </Terminal>
        </div>
      )}

      {frame >= PHASE3_START - 15 && (
        <div style={wrap(p3Zoom, fade(p3L), 3)}>
          <Terminal title="wunderland doctor">
            {PHASE3.map((l, i) => (
              <RichLine key={`p3-${i}`} line={l} frame={frame} offset={PHASE3_START} />
            ))}
          </Terminal>
        </div>
      )}
    </AbsoluteFill>
  );
};
