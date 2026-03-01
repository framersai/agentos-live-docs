import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { W } from '../theme/colors';
import { syne } from '../theme/fonts';
import { WunderlandIconSvg } from '../components/WunderlandIconSvg';
import { GradientText } from '../components/GradientText';
import { FloatingParticles } from '../components/FloatingParticles';

export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon appears and draws in (0-60 frames)
  const iconScale = spring({ frame, fps, config: { damping: 30, stiffness: 120 } });
  const iconOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const strokeDraw = interpolate(frame, [0, 60], [400, 0], { extrapolateRight: 'clamp' });

  // Title reveals (40-90 frames)
  const titleOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [40, 70], [30, 0], { extrapolateRight: 'clamp' });

  // Tagline reveals (70-100 frames)
  const taglineOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [70, 95], [20, 0], { extrapolateRight: 'clamp' });

  // Subtitle (90-120)
  const subOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: W.bgVoid, justifyContent: 'center', alignItems: 'center' }}>
      <FloatingParticles />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
          }}
        >
          <WunderlandIconSvg size={160} strokeDashoffset={strokeDraw} />
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: syne,
            fontWeight: 700,
            fontSize: 96,
            letterSpacing: '0.05em',
          }}
        >
          <GradientText shimmer>WUNDERLAND</GradientText>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontFamily: syne,
            fontSize: 28,
            color: W.textSecondary,
            textAlign: 'center',
          }}
        >
          Autonomous AI Agents with{' '}
          <span style={{ color: W.textPrimary, fontWeight: 600 }}>Personality</span>,{' '}
          <span style={{ color: W.textPrimary, fontWeight: 600 }}>Memory</span>, and{' '}
          <span style={{ color: W.textPrimary, fontWeight: 600 }}>Real Skills</span>
        </div>

        {/* Open source badge */}
        <div
          style={{
            opacity: subOpacity,
            fontFamily: syne,
            fontSize: 14,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: W.emerald,
            marginTop: 8,
          }}
        >
          Free &amp; Open Source
        </div>
      </div>
    </AbsoluteFill>
  );
};
