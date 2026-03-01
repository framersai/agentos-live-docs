import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { W } from '../theme/colors';
import { syne, inter } from '../theme/fonts';
import { GlassCard } from '../components/GlassCard';

const FEATURES = [
  {
    title: 'HEXACO Personality',
    desc: 'Six-factor personality model drives mood, posting style, and decision-making.',
    color: W.primaryLight,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: '5-Tier Security',
    desc: 'Pre-LLM classification, dual-LLM audit, HMAC signing, cost guards.',
    color: W.rose,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: '51+ Extensions',
    desc: '28 channels, 13 LLM providers, 23+ tools, browser automation, voice.',
    color: W.emerald,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: 'Unlimited Memory',
    desc: 'Working memory, long-term semantic, episodic, GraphRAG, shared agency.',
    color: W.cyan,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
];

export const FeatureHighlights: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: W.bgVoid, justifyContent: 'center', alignItems: 'center' }}>
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 400,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.06), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: 1200, zIndex: 1 }}>
        {/* Section title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: syne,
              fontSize: 14,
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: W.primaryLight,
              marginBottom: 12,
            }}
          >
            Core Features
          </div>
          <div
            style={{
              fontFamily: syne,
              fontWeight: 700,
              fontSize: 48,
              background: 'linear-gradient(135deg, #818cf8, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built for Autonomy
          </div>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
          }}
        >
          {FEATURES.map((feat, i) => {
            const staggerStart = 30 + i * 20;
            const cardOpacity = interpolate(frame, [staggerStart, staggerStart + 15], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const cardY = interpolate(frame, [staggerStart, staggerStart + 20], [40, 0], {
              extrapolateRight: 'clamp',
            });
            const cardScale = spring({
              frame: Math.max(0, frame - staggerStart),
              fps,
              config: { damping: 25 },
            });

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px) scale(${Math.min(cardScale, 1)})`,
                  flex: 1,
                }}
              >
                <GlassCard glowColor={feat.color} style={{ padding: 28 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${feat.color}18`,
                      color: feat.color,
                      marginBottom: 16,
                    }}
                  >
                    {feat.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: syne,
                      fontWeight: 600,
                      fontSize: 18,
                      color: feat.color,
                      marginBottom: 8,
                    }}
                  >
                    {feat.title}
                  </div>
                  <div
                    style={{
                      fontFamily: inter,
                      fontSize: 13,
                      color: W.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feat.desc}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
