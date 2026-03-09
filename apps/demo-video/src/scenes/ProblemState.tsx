import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { inter } from '../theme/fonts';
import { Terminal } from '../components/Terminal';
import { GlassCard } from '../components/GlassCard';
import { FloatingParticles } from '../components/FloatingParticles';
import { ShineText } from '../components/ShineText';
import { C, RichLine } from '../components/TerminalContent';
import type { Line } from '../components/TerminalContent';

// Real competitor CLIs — actual commands, actual errors
const ERROR_LINES: Line[] = [
  // ── OpenClaw ──
  {
    type: 'typed',
    start: 8,
    text: 'npm install -g openclaw@latest',
    dur: 20,
    prefix: [{ t: '$ ', c: C.muted }],
  },
  { type: 'rich', start: 32, segs: [{ t: '  added 247 packages in 38.2s', c: C.muted }] },
  {
    type: 'typed',
    start: 42,
    text: 'openclaw onboard --install-daemon',
    dur: 22,
    prefix: [{ t: '$ ', c: C.muted }],
  },
  { type: 'rich', start: 68, segs: [{ t: '  Step 1/7 — Model/Auth Selection...', c: C.muted }] },
  { type: 'rich', start: 78, segs: [{ t: '  Step 2/7 — Workspace Location...', c: C.muted }] },
  { type: 'rich', start: 88, segs: [{ t: '  Step 3/7 — Gateway Setup...', c: C.muted }] },
  {
    type: 'rich',
    start: 100,
    segs: [
      { t: '  Error: Gateway not configured. Set OPENCLAW_GATEWAY_TYPE=local|remote', c: C.rose },
    ],
  },
  {
    type: 'rich',
    start: 115,
    segs: [{ t: '  Error: pairing required — CLI has insufficient scopes', c: C.rose }],
  },
  { type: 'blank', start: 130 },
  // ── CrewAI ──
  {
    type: 'typed',
    start: 140,
    text: 'pip install crewai && crewai create crew my-agent',
    dur: 28,
    prefix: [{ t: '$ ', c: C.muted }],
  },
  { type: 'rich', start: 172, segs: [{ t: '  Resolving dependencies...', c: C.muted }] },
  {
    type: 'rich',
    start: 185,
    segs: [{ t: '  ERROR: crewai 0.28 requires langchain-core<0.2,>=0.1.0', c: C.rose }],
  },
  {
    type: 'rich',
    start: 200,
    segs: [{ t: '  but you have langchain-core 0.2.5. ResolutionImpossible.', c: C.rose }],
  },
  { type: 'blank', start: 215 },
  // ── AutoGPT ──
  {
    type: 'typed',
    start: 225,
    text: 'git clone AutoGPT && python -m autogpt',
    dur: 24,
    prefix: [{ t: '$ ', c: C.muted }],
  },
  {
    type: 'rich',
    start: 255,
    segs: [{ t: '  WARNING: Agent running for 47 steps. Estimated cost: $14.72', c: C.rose }],
  },
  {
    type: 'rich',
    start: 270,
    segs: [{ t: '  Agent appears stuck in a loop. Consider restarting.', c: C.rose }],
  },
];

const FAILURE_ITEMS = [
  { text: 'OpenClaw — 7-step wizard, gateway config, pairing errors', frame: 120 },
  { text: 'CrewAI — langchain dependency hell', frame: 200 },
  { text: 'AutoGPT — stuck in loops, burns through tokens', frame: 270 },
];

export const ProblemState: React.FC = () => {
  const frame = useCurrentFrame();

  // Terminal auto-scroll — 36px per line (18px font × 2.0 line-height)
  // Start scrolling when CrewAI lines appear (frame ~140), finish at AutoGPT errors (~270)
  const LINE_H = 36;
  const TOTAL_CONTENT_H = ERROR_LINES.length * LINE_H + 32; // +padding
  const scrollOffset = interpolate(
    frame,
    [120, 170, 220, 280],
    [0, 4 * LINE_H, 6 * LINE_H, 9 * LINE_H],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Everything dims before the "better way" reveal
  const contentDim = interpolate(frame, [350, 380], [1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Better way" text — fade in, hold briefly, fade out before scene end
  const betterWayOpacity = interpolate(frame, [370, 395, 450, 480], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={8} color={W.rose} />

      {/* Main content — dims before reveal */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
          zIndex: 1,
          opacity: contentDim,
        }}
      >
        {/* Left: Terminal with errors */}
        <div style={{ width: 700 }}>
          <Terminal
            title="trying-every-framework"
            maxBodyHeight={400}
            scrollOffset={scrollOffset}
            totalContentHeight={TOTAL_CONTENT_H}
          >
            {ERROR_LINES.map((l, i) => (
              <RichLine key={i} line={l} frame={frame} offset={0} />
            ))}
          </Terminal>
        </div>

        {/* Right: Failure points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 380 }}>
          {FAILURE_ITEMS.map((item, i) => {
            const opacity = interpolate(frame, [item.frame, item.frame + 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const y = interpolate(frame, [item.frame, item.frame + 18], [20, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div key={i} style={{ opacity, transform: `translateY(${y}px)` }}>
                <GlassCard glowColor={W.rose} style={{ padding: '16px 24px' }}>
                  <div
                    style={{
                      fontFamily: inter,
                      fontSize: 18,
                      fontWeight: 700,
                      color: W.rose,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.text}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* "There has to be a better way." — centered gold */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          opacity: betterWayOpacity,
        }}
      >
        <ShineText
          startFrame={370}
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 48,
            color: W.accent,
          }}
        >
          There has to be a better way.
        </ShineText>
      </div>
    </AbsoluteFill>
  );
};
