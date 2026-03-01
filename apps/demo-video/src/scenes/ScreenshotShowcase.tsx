import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { W } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';
import { ShineText } from '../components/ShineText';

// Ordered to match voiceover: "From setup wizard to TUI dashboard,
// from agent presets to the human-in-the-loop approval panel…"
const SCREENSHOTS: {
  file: string;
  title: string;
  caption: string;
  color: string;
  dur: number; // frames this slide is visible
}[] = [
  {
    file: 'setup-wizard.png',
    title: 'wunderland setup',
    caption: 'Interactive onboarding — QuickStart or Advanced config flow',
    color: W.accent,
    dur: 80,
  },
  {
    file: 'tui-dashboard.png',
    title: 'wunderland tui',
    caption: 'Terminal dashboard with command palette and keyboard shortcuts',
    color: W.cyan,
    dur: 100,
  },
  {
    file: 'presets-grid.png',
    title: 'wunderland list-presets',
    caption: '8 agent presets with HEXACO personality traits (H, E, X, A, C, O)',
    color: W.emerald,
    dur: 80,
  },
  {
    file: 'hitl-dashboard.png',
    title: 'HITL Dashboard',
    caption: 'localhost:3777/hitl — approve or reject tool calls in real-time',
    color: W.cyan,
    dur: 90,
  },
  {
    file: 'chat-toolcall.png',
    title: 'wunderland chat',
    caption: 'Autonomous tool calling — 23+ tools, web search, GitHub, and more',
    color: W.primaryLight,
    dur: 75,
  },
  {
    file: 'models-grid.png',
    title: 'wunderland models',
    caption: '13 LLM providers — OpenAI, Anthropic, Ollama, Groq, Gemini + more',
    color: W.primaryLight,
    dur: 65,
  },
  {
    file: 'skills-grid.png',
    title: 'wunderland skills',
    caption: '18 curated skills — web-search, github, coding-agent, spotify, notion + more',
    color: W.accent,
    dur: 50,
  },
];

// Pre-compute cumulative start frames for each slide
const SLIDE_STARTS = SCREENSHOTS.reduce<number[]>((acc, _, i) => {
  if (i === 0) return [0];
  acc.push(acc[i - 1] + SCREENSHOTS[i - 1].dur);
  return acc;
}, []);

// Holographic gradient colors for the animated border
const HOLO_GRADIENT =
  'conic-gradient(from var(--angle), #6366f1, #06b6d4, #10b981, #f59e0b, #f43f5e, #a78bfa, #6366f1)';

export const ScreenshotShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Section title — ShineText with 3D depth */}
      <div
        style={{
          position: 'absolute',
          top: 55,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <ShineText
          startFrame={8}
          style={{
            fontFamily: syne,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '0.06em',
            color: W.textPrimary,
          }}
        >
          Your Wunderbot, Up Close
        </ShineText>
      </div>

      {/* Screenshot carousel — all slides same size, fade + gentle zoom */}
      {SCREENSHOTS.map((shot, i) => {
        const slideStart = SLIDE_STARTS[i];
        const dur = shot.dur;
        const slideEnd = slideStart + dur;
        const localFrame = frame - slideStart;

        if (frame < slideStart - 15 || frame > slideEnd + 15) return null;

        const TRANS = 12;

        const opacity = interpolate(localFrame, [-5, TRANS, dur - TRANS, dur + 5], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Slow zoom from 1.0 → 1.08 for a subtle cinematic feel
        const zoom = interpolate(localFrame, [0, dur], [1.0, 1.08], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const enterY = interpolate(localFrame, [-5, TRANS], [30, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 880,
              transform: `translateY(${enterY}px) scale(${zoom})`,
              transformOrigin: 'center center',
              opacity,
            }}
          >
            <ScreenshotCard shot={shot} frame={frame} />
          </div>
        );
      })}

      {/* Slide indicator dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          display: 'flex',
          gap: 8,
        }}
      >
        {SCREENSHOTS.map((_, i) => {
          const slideStart = SLIDE_STARTS[i];
          const dur = SCREENSHOTS[i].dur;
          const isActive = frame >= slideStart && frame < slideStart + dur;
          return (
            <div
              key={i}
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: isActive ? W.primaryLight : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Holographic neumorphic card component
const ScreenshotCard: React.FC<{
  shot: { file: string; title: string; caption: string; color: string };
  frame: number;
}> = ({ shot, frame }) => {
  // Rotating angle for holographic border (2 degrees per frame = ~24°/s)
  const angle = frame * 3;

  return (
    // Outer wrapper — holographic border via padding trick
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        padding: 2,
        background: `conic-gradient(from ${angle}deg, #6366f1, #06b6d4, #10b981, #f59e0b, #f43f5e, #a78bfa, #6366f1)`,
        boxShadow: [
          `8px 8px 24px rgba(0,0,0,0.55)`,
          `-3px -3px 14px rgba(99,102,241,0.07)`,
          `0 0 50px ${shot.color}18`,
          `0 0 100px rgba(99,102,241,0.06)`,
        ].join(', '),
      }}
    >
      {/* Inner card */}
      <div
        style={{
          background: '#0c0a20',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Header — traffic light dots + holographic shimmer line */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: 'rgba(99, 102, 241, 0.06)',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
          {/* Holographic shimmer line at bottom of header */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${W.primaryLight}40, ${W.cyan}50, ${W.emerald}40, ${W.accent}50, ${W.rose}40, transparent)`,
              backgroundSize: '200% 100%',
              backgroundPosition: `${(frame * 2) % 200}% 0`,
            }}
          />
        </div>

        {/* Image with inner top highlight */}
        <div style={{ position: 'relative' }}>
          <Img src={staticFile(shot.file)} style={{ width: '100%', display: 'block' }} />
          {/* Neumorphic inner top highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(255,255,255,0.04)',
            }}
          />
        </div>

        {/* Caption */}
        <div
          style={{
            padding: '10px 14px',
            fontFamily: jetbrainsMono,
            fontSize: 13,
            lineHeight: 1.5,
            color: W.textTertiary,
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
          }}
        >
          <span style={{ color: shot.color, fontWeight: 700 }}>{shot.title}</span>
          <span style={{ color: 'rgba(240,238,255,0.25)', margin: '0 8px' }}>|</span>
          {shot.caption}
        </div>
      </div>
    </div>
  );
};
