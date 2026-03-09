import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import { AOS } from '../../theme/colors';
import { syne, inter } from '../../theme/fonts';
import { FloatingParticles } from '../../components/FloatingParticles';

export const WbClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Title
  const titleDelay = 15;
  const titleOpacity = interpolate(frame, [titleDelay, titleDelay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [titleDelay, titleDelay + 15], [25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL pill
  const urlDelay = 40;
  const urlSpring = spring({
    frame: frame - urlDelay,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  // Sub-links
  const links = [
    { label: 'GitHub', color: AOS.primaryLight },
    { label: 'Docs', color: AOS.cyan },
    { label: 'Marketplace', color: AOS.emerald },
  ];

  // Exit
  const exitOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: AOS.bgGradient,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
      }}
    >
      <FloatingParticles count={15} color={AOS.primaryLight} />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 20 }}>
        <Img src={staticFile('agentos-icon.png')} style={{ width: 64, height: 64 }} />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: syne,
          fontWeight: 700,
          fontSize: 48,
          color: AOS.textPrimary,
          letterSpacing: '0.03em',
          textAlign: 'center',
        }}
      >
        Try the AgentOS Workbench
      </div>

      {/* URL pill */}
      <div
        style={{
          marginTop: 24,
          opacity: urlSpring,
          transform: `scale(${urlSpring}) translateY(${(1 - urlSpring) * 12}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 28px',
            borderRadius: 24,
            background: `linear-gradient(135deg, ${AOS.primary}30, ${AOS.accent}20)`,
            border: `1px solid ${AOS.borderGlow}`,
            fontFamily: inter,
            fontSize: 22,
            fontWeight: 600,
            color: AOS.primaryLight,
            letterSpacing: '0.02em',
          }}
        >
          agentos.sh
        </div>
      </div>

      {/* Sub-links */}
      <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
        {links.map((link, i) => {
          const delay = 60 + i * 10;
          const lSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 16, stiffness: 100 },
          });

          return (
            <div
              key={link.label}
              style={{
                opacity: lSpring,
                transform: `translateY(${(1 - lSpring) * 10}px)`,
                fontFamily: inter,
                fontSize: 15,
                fontWeight: 500,
                color: link.color,
                letterSpacing: '0.03em',
              }}
            >
              {link.label}
            </div>
          );
        })}
      </div>

      {/* Open source tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontFamily: inter,
          fontSize: 14,
          color: AOS.textTertiary,
          letterSpacing: '0.04em',
        }}
      >
        Open Source &middot; MIT Licensed &middot; Built by Frame.dev
      </div>
    </AbsoluteFill>
  );
};
