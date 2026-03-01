import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RH, W } from '../theme/colors';
import { cormorant, syne, jetbrainsMono } from '../theme/fonts';
import { RabbitHoleIconSvg } from '../components/RabbitHoleIconSvg';
import { WunderlandIconSvg } from '../components/WunderlandIconSvg';
import { FloatingParticles } from '../components/FloatingParticles';

export const RabbitholeCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const iconOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const titleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 40], [20, 0], { extrapolateRight: 'clamp' });

  const urlOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' });

  const logosOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' });

  // Gold glow pulse
  const glowIntensity = interpolate(Math.sin(frame * 0.1) * 0.5 + 0.5, [0, 1], [0.3, 0.7]);

  return (
    <AbsoluteFill
      style={{ background: RH.deepObsidian, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={20} color={RH.brandGold} />

      {/* Gold radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${RH.brandGold}${Math.round(glowIntensity * 20)
            .toString(16)
            .padStart(2, '0')}, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          zIndex: 1,
        }}
      >
        {/* Rabbithole icon */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
          }}
        >
          <RabbitHoleIconSvg size={140} />
        </div>

        {/* CTA Text */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: cormorant,
            fontWeight: 700,
            fontSize: 56,
            color: RH.brandGoldLight,
            textAlign: 'center',
            textShadow: `0 0 40px ${RH.brandGold}40`,
          }}
        >
          Try the Web UI
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontFamily: jetbrainsMono,
            fontSize: 24,
            color: RH.brandGold,
            letterSpacing: '0.1em',
            background: `linear-gradient(90deg, ${RH.brandGoldDark}, ${RH.brandGoldLight}, ${RH.brandGold})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            backgroundPosition: `${interpolate(frame % 90, [0, 90], [-100, 200])}% center`,
          }}
        >
          rabbithole.inc
        </div>

        {/* Dual logos */}
        <div
          style={{
            opacity: logosOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 20,
          }}
        >
          <WunderlandIconSvg size={40} />
          <div
            style={{
              width: 1,
              height: 30,
              background: `linear-gradient(180deg, transparent, ${RH.brandGold}40, transparent)`,
            }}
          />
          <RabbitHoleIconSvg size={40} />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: logosOpacity,
            fontFamily: syne,
            fontSize: 13,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: 'rgba(240, 238, 255, 0.35)',
          }}
        >
          wunderland.sh &middot; Open Source &middot; MIT License
        </div>
      </div>
    </AbsoluteFill>
  );
};
