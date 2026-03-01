import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W, RH } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';
import { EcosystemIconSvg } from '../components/EcosystemIconSvg';
import { ShineText } from '../components/ShineText';

const ITEMS = [
  { label: 'OpenAI', color: W.emerald, icon: 'openai' },
  { label: 'Anthropic', color: W.primaryLight, icon: 'anthropic' },
  { label: 'Ollama', color: W.accent, icon: 'ollama' },
  { label: 'Groq', color: W.cyan, icon: 'groq' },
  { label: 'Mistral', color: W.rose, icon: 'mistral' },
  { label: 'Google', color: W.emerald, icon: 'google' },
  { label: 'DeepSeek', color: W.primaryLight, icon: 'deepseek' },
  { label: 'Telegram', color: W.cyan, icon: 'telegram' },
  { label: 'Discord', color: '#5865F2', icon: 'discord' },
  { label: 'WhatsApp', color: '#25D366', icon: 'whatsapp' },
  { label: 'Slack', color: '#E01E5A', icon: 'slack' },
  { label: 'Email', color: W.accent, icon: 'email' },
  { label: 'Signal', color: '#3A76F0', icon: 'signal' },
  { label: 'Twitter', color: W.textPrimary, icon: 'twitter' },
  { label: 'Reddit', color: '#FF4500', icon: 'reddit' },
  { label: 'Matrix', color: W.emerald, icon: 'matrix' },
  { label: 'web-scraper', color: W.primaryLight, icon: 'web-scraper' },
  { label: 'deep-research', color: W.cyan, icon: 'deep-research' },
  { label: 'coding-agent', color: W.accent, icon: 'coding-agent' },
  { label: 'summarize', color: W.emerald, icon: 'summarize' },
];

export const EcosystemGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const bgProgress = interpolate(frame, [0, 160], [0, 1], { extrapolateRight: 'clamp' });
  const bg = bgProgress < 0.5 ? W.bgGradient : RH.deepObsidian;

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

      {/* Section title — standardized */}
      <div
        style={{
          position: 'absolute',
          top: 55,
          left: 0,
          right: 0,
          zIndex: 2,
          textAlign: 'center',
          opacity: titleOpacity,
          fontFamily: syne,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: '0.06em',
          color: W.textPrimary,
        }}
      >
        <ShineText startFrame={8}>Providers &middot; Channels &middot; Skills</ShineText>
      </div>

      <div style={{ zIndex: 1, width: 1100, marginTop: 40 }}>
        {/* Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: 14,
            justifyContent: 'center',
          }}
        >
          {ITEMS.map((item, i) => {
            const staggerStart = 15 + i * 4;
            const opacity = interpolate(frame, [staggerStart, staggerStart + 12], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(frame, [staggerStart, staggerStart + 15], [0.5, 1], {
              extrapolateRight: 'clamp',
            });
            const drawProgress = interpolate(frame, [staggerStart, staggerStart + 20], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px 8px 10px',
                  borderRadius: 10,
                  border: `1px solid ${item.color}30`,
                  background: `${item.color}10`,
                }}
              >
                <EcosystemIconSvg
                  type={item.icon}
                  size={26}
                  color={item.color}
                  drawProgress={drawProgress}
                />
                <span
                  style={{
                    fontFamily: jetbrainsMono,
                    fontSize: 13,
                    color: item.color,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tagline */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
            fontFamily: syne,
            fontSize: 14,
            lineHeight: 1.5,
            color: W.textTertiary,
            opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Power your Wunderbots locally with Ollama &mdash; fully offline
        </div>
      </div>
    </AbsoluteFill>
  );
};
