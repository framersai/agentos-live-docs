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
  hasChrome?: boolean; // true if screenshot already has window dots/chrome
}[] = [
  {
    file: 'setup-wizard.png',
    title: 'wunderland setup',
    caption: 'Interactive onboarding — QuickStart or Advanced config flow',
    color: W.accent,
    dur: 97,
    hasChrome: true,
  },
  {
    file: 'tui-dashboard.png',
    title: 'wunderland tui',
    caption: 'Terminal dashboard with command palette and keyboard shortcuts',
    color: W.cyan,
    dur: 102,
    hasChrome: true,
  },
  {
    file: 'presets-grid.png',
    title: 'wunderland list-presets',
    caption: '8 agent presets with HEXACO personality traits (H, E, X, A, C, O)',
    color: W.emerald,
    dur: 97,
    hasChrome: true,
  },
  {
    file: 'hitl-dashboard.png',
    title: 'HITL Dashboard',
    caption: 'localhost:3777/hitl — approve or reject tool calls in real-time',
    color: W.cyan,
    dur: 97,
    hasChrome: true,
  },
  {
    file: 'chat-toolcall.png',
    title: 'wunderland chat',
    caption: 'Autonomous tool calling — 23+ tools, web search, GitHub, and more',
    color: W.primaryLight,
    dur: 122,
    hasChrome: true,
  },
  {
    file: 'models-grid.png',
    title: 'wunderland models',
    caption: '13 LLM providers — OpenAI, Anthropic, Ollama, Groq, Gemini + more',
    color: W.primaryLight,
    dur: 117,
    hasChrome: true,
  },
  {
    file: 'skills-grid.png',
    title: 'wunderland skills',
    caption: '18 curated skills — web-search, github, coding-agent, spotify, notion + more',
    color: W.accent,
    dur: 137,
    hasChrome: true,
  },
];

// Slides overlap by OVERLAP frames for true crossfade
const OVERLAP = 8;

// Pre-compute cumulative start frames (with overlap subtracted)
const SLIDE_STARTS = SCREENSHOTS.reduce<number[]>((acc, _, i) => {
  if (i === 0) return [0];
  acc.push(acc[i - 1] + SCREENSHOTS[i - 1].dur - OVERLAP);
  return acc;
}, []);

// Max image height — clips tallest screenshots (skills-grid, setup-wizard) for consistent cards
const IMAGE_MAX_HEIGHT = 580;

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

      {/* Screenshot carousel — crossfade + motion + blur transitions */}
      {SCREENSHOTS.map((shot, i) => {
        const slideStart = SLIDE_STARTS[i];
        const dur = shot.dur;
        const slideEnd = slideStart + dur;
        const localFrame = frame - slideStart;

        if (frame < slideStart - 20 || frame > slideEnd + 20) return null;

        const TRANS = 20;

        // Opacity: fade in over TRANS frames, hold, fade out over TRANS frames
        const opacity = interpolate(localFrame, [-8, TRANS, dur - TRANS, dur + 8], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Ken Burns zoom (slow cinematic push)
        const zoom = interpolate(localFrame, [0, dur], [1.0, 1.08], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Entrance: slide down from above + scale up
        const enterY = interpolate(localFrame, [-8, TRANS], [40, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const enterScale = interpolate(localFrame, [-8, TRANS], [0.95, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Exit: slide up + scale down
        const exitY = interpolate(localFrame, [dur - TRANS, dur + 8], [0, -40], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const exitScale = interpolate(localFrame, [dur - TRANS, dur + 8], [1, 0.96], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Blur: cinematic focus transition
        const blur = interpolate(localFrame, [-8, TRANS, dur - TRANS, dur + 8], [4, 0, 0, 4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Combine transforms
        const translateY = enterY + exitY;
        const scale = zoom * enterScale * exitScale;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 880,
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: 'center center',
              opacity,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
            }}
          >
            <ScreenshotCard shot={shot} frame={frame} hasChrome={shot.hasChrome} />
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
  hasChrome?: boolean;
}> = ({ shot, frame, hasChrome }) => {
  // Rotating angle for holographic border (3 degrees per frame)
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
        {/* Header — traffic light dots + holographic shimmer line (skip if screenshot has its own chrome) */}
        {!hasChrome && (
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
        )}

        {/* Image with inner top highlight — capped height for consistency */}
        <div style={{ position: 'relative', maxHeight: IMAGE_MAX_HEIGHT, overflow: 'hidden' }}>
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
