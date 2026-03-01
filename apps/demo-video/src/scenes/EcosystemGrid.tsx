import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W, RH } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';

const ITEMS = [
  { label: 'OpenAI', color: W.emerald },
  { label: 'Anthropic', color: W.primaryLight },
  { label: 'Ollama', color: W.accent },
  { label: 'Groq', color: W.cyan },
  { label: 'Mistral', color: W.rose },
  { label: 'Google', color: W.emerald },
  { label: 'DeepSeek', color: W.primaryLight },
  { label: 'Telegram', color: W.cyan },
  { label: 'Discord', color: '#5865F2' },
  { label: 'WhatsApp', color: '#25D366' },
  { label: 'Slack', color: '#E01E5A' },
  { label: 'Email', color: W.accent },
  { label: 'Signal', color: '#3A76F0' },
  { label: 'Twitter', color: W.textPrimary },
  { label: 'Reddit', color: '#FF4500' },
  { label: 'Matrix', color: W.emerald },
  { label: 'web-scraper', color: W.primaryLight },
  { label: 'deep-research', color: W.cyan },
  { label: 'coding-agent', color: W.accent },
  { label: 'summarize', color: W.emerald },
];

export const EcosystemGrid: React.FC = () => {
  const frame = useCurrentFrame();

  // Background transitions from wunderland to rabbithole
  const bgProgress = interpolate(frame, [0, 120], [0, 1], { extrapolateRight: 'clamp' });
  const bg = bgProgress < 0.5 ? W.bgVoid : RH.deepObsidian;

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: bg,
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background 2s',
      }}
    >
      {/* Holographic glow overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse, ${RH.holoCyan}08, transparent 70%)`,
          opacity: bgProgress,
          pointerEvents: 'none',
        }}
      />

      <div style={{ zIndex: 1, width: 1100 }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: titleOpacity,
            fontFamily: syne,
            fontWeight: 700,
            fontSize: 36,
            color: W.textPrimary,
          }}
        >
          Providers &middot; Channels &middot; Skills
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: 12,
            justifyContent: 'center',
          }}
        >
          {ITEMS.map((item, i) => {
            const staggerStart = 15 + i * 3;
            const opacity = interpolate(frame, [staggerStart, staggerStart + 10], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(frame, [staggerStart, staggerStart + 12], [0.6, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: `1px solid ${item.color}30`,
                  background: `${item.color}10`,
                  fontFamily: jetbrainsMono,
                  fontSize: 13,
                  color: item.color,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Connection lines hint */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
            fontFamily: syne,
            fontSize: 14,
            color: W.textTertiary,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Self-host locally with Ollama — fully offline
        </div>
      </div>
    </AbsoluteFill>
  );
};
