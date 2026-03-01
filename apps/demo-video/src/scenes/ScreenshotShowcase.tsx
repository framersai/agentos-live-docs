import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { W } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';

const SCREENSHOTS = [
  {
    file: 'setup-wizard.png',
    title: 'Setup Wizard',
    caption: 'wunderland setup — presets, providers, skills, channels',
    color: W.accent,
  },
  {
    file: 'chat-toolcall.png',
    title: 'Chat + Tool Calling',
    caption: 'Autonomous tool calling with news_search, web_search, summarize',
    color: W.primaryLight,
  },
  {
    file: 'tui-dashboard.png',
    title: 'TUI Dashboard',
    caption: 'wunderland tui — command palette with keyboard shortcuts',
    color: W.cyan,
  },
  {
    file: 'hitl-dashboard.png',
    title: 'HITL Dashboard',
    caption: 'localhost:3777/hitl — approve or reject tool calls in real-time',
    color: W.rose,
  },
  {
    file: 'presets-grid.png',
    title: 'Agent Presets',
    caption: '8 archetypes with HEXACO personality traits',
    color: W.emerald,
  },
];

const DURATION_PER_SLIDE = 60; // 2 seconds each

export const ScreenshotShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionTitle = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: W.bgVoid, justifyContent: 'center', alignItems: 'center' }}>
      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: sectionTitle,
          fontFamily: syne,
          fontSize: 18,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: W.textTertiary,
        }}
      >
        See it in action
      </div>

      {/* Screenshot carousel */}
      {SCREENSHOTS.map((shot, i) => {
        const slideStart = i * DURATION_PER_SLIDE;
        const slideEnd = slideStart + DURATION_PER_SLIDE;
        const localFrame = frame - slideStart;

        if (frame < slideStart - 15 || frame > slideEnd + 15) return null;

        // Enter from right
        const enterX = interpolate(localFrame, [-5, 15], [300, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Exit to left
        const exitX = interpolate(
          localFrame,
          [DURATION_PER_SLIDE - 10, DURATION_PER_SLIDE + 5],
          [0, -300],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const translateX = localFrame < DURATION_PER_SLIDE / 2 ? enterX : exitX;

        const scaleVal = spring({
          frame: Math.max(0, localFrame),
          fps,
          config: { damping: 25, stiffness: 120 },
        });
        const opacity = interpolate(
          localFrame,
          [-5, 5, DURATION_PER_SLIDE - 5, DURATION_PER_SLIDE + 5],
          [0, 1, 1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 800,
              transform: `translateX(${translateX}px) scale(${Math.min(scaleVal, 1)})`,
              opacity,
            }}
          >
            {/* Terminal-style screenshot card */}
            <div
              style={{
                background: '#0c0a20',
                border: `1px solid ${W.borderGlow}`,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: `0 0 40px ${shot.color}20, 0 0 80px rgba(99, 102, 241, 0.08)`,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
                }}
              >
                <div
                  style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }}
                />
                <div
                  style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }}
                />
                <div
                  style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}
                />
                <span
                  style={{
                    color: W.textTertiary,
                    fontSize: 11,
                    marginLeft: 8,
                    fontFamily: jetbrainsMono,
                  }}
                >
                  {shot.title}
                </span>
              </div>

              {/* Image */}
              <Img src={staticFile(shot.file)} style={{ width: '100%', display: 'block' }} />

              {/* Caption */}
              <div
                style={{
                  padding: '8px 14px',
                  fontFamily: jetbrainsMono,
                  fontSize: 12,
                  color: W.textTertiary,
                  borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                <span style={{ color: shot.color }}>$</span> {shot.caption}
              </div>
            </div>
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
          const isActive = frame >= i * DURATION_PER_SLIDE && frame < (i + 1) * DURATION_PER_SLIDE;
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
