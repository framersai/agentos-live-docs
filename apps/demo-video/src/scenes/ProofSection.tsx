import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { syne, inter } from '../theme/fonts';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ShineText } from '../components/ShineText';

const STATS = [
  { target: 27, label: 'Messaging Channels', color: W.accent, suffix: '+' },
  { target: 13, label: 'LLM Providers', color: W.emerald, suffix: '+' },
  { target: 23, label: 'Built-in Tools', color: W.primaryLight, suffix: '+' },
  { target: 18, label: 'Curated Skills', color: W.cyan, suffix: '+' },
  { target: 51, label: 'Total Extensions', color: W.rose, suffix: '+' },
];

export const ProofSection: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 400,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.05), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section title */}
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
        <ShineText startFrame={8}>The Numbers Speak</ShineText>
      </div>

      <div style={{ zIndex: 1, width: 1200, marginTop: 60 }}>
        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
          {STATS.map((stat, i) => (
            <AnimatedCounter
              key={i}
              target={stat.target}
              suffix={stat.suffix}
              startFrame={20 + i * 12}
              color={stat.color}
              label={stat.label}
            />
          ))}
        </div>

        {/* Divider line */}
        <div
          style={{
            marginTop: 50,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${W.accent}40, transparent)`,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            paddingBottom: 20,
            fontFamily: inter,
            fontSize: 20,
            lineHeight: 1.8,
            color: W.textTertiary,
            overflow: 'visible',
            opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          An unmatched open-source agent toolkit
        </div>
      </div>
    </AbsoluteFill>
  );
};
