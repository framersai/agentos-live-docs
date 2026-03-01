import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { syne } from '../theme/fonts';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { GradientText } from '../components/GradientText';

const STATS = [
  { target: 28, label: 'Messaging\nChannels', color: W.accent, suffix: '' },
  { target: 13, label: 'LLM\nProviders', color: W.emerald, suffix: '' },
  { target: 23, label: 'Built-in\nTools', color: W.primaryLight, suffix: '+' },
  { target: 18, label: 'Curated\nSkills', color: W.cyan, suffix: '' },
  { target: 51, label: 'Total\nExtensions', color: W.rose, suffix: '+' },
];

export const StatsCounter: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: W.bgVoid, justifyContent: 'center', alignItems: 'center' }}>
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

      <div style={{ zIndex: 1, width: 1200 }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: syne,
              fontWeight: 700,
              fontSize: 48,
            }}
          >
            <GradientText from="#c084fc" to="#f0abfc">
              Massive Ecosystem
            </GradientText>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
          {STATS.map((stat, i) => (
            <AnimatedCounter
              key={i}
              target={stat.target}
              suffix={stat.suffix}
              startFrame={20 + i * 12}
              color={stat.color}
              label={stat.label.replace('\n', ' ')}
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
            fontFamily: syne,
            fontSize: 16,
            color: W.textTertiary,
            opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Telegram, WhatsApp, Discord, Slack, Email, SMS, Signal + 21 more channels
        </div>
      </div>
    </AbsoluteFill>
  );
};
