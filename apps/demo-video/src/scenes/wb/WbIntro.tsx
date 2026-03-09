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
import { ShineText } from '../../components/ShineText';
import { FloatingParticles } from '../../components/FloatingParticles';

export const WbIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title stagger after logo
  const titleDelay = 20;
  const titleOpacity = interpolate(frame, [titleDelay, titleDelay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [titleDelay, titleDelay + 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle stagger
  const subDelay = 45;
  const subOpacity = interpolate(frame, [subDelay, subDelay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [subDelay, subDelay + 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pill tags
  const pills = ['Streaming', 'Multi-Agent', 'Personas', 'Evaluation', 'Planning'];
  const pillColors = [AOS.cyan, AOS.emerald, AOS.primaryLight, AOS.accent, AOS.tertiary];

  // Exit fade
  const exitOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
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
      <FloatingParticles count={20} color={AOS.primaryLight} />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 24,
        }}
      >
        <Img src={staticFile('agentos-icon.png')} style={{ width: 80, height: 80 }} />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <ShineText
          startFrame={titleDelay}
          style={{
            fontFamily: syne,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: '0.04em',
            color: AOS.textPrimary,
          }}
        >
          AgentOS Workbench
        </ShineText>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          marginTop: 12,
          fontFamily: inter,
          fontSize: 24,
          fontWeight: 400,
          color: AOS.textSecondary,
          letterSpacing: '0.02em',
        }}
      >
        See it in action.
      </div>

      {/* Feature pills */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 40,
        }}
      >
        {pills.map((pill, i) => {
          const pillDelay = 65 + i * 8;
          const pSpring = spring({
            frame: frame - pillDelay,
            fps,
            config: { damping: 16, stiffness: 100 },
          });
          const pOpacity = interpolate(frame, [pillDelay, pillDelay + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={pill}
              style={{
                opacity: pOpacity,
                transform: `scale(${pSpring}) translateY(${(1 - pSpring) * 15}px)`,
                padding: '6px 16px',
                borderRadius: 20,
                background: `${pillColors[i]}18`,
                border: `1px solid ${pillColors[i]}40`,
                fontFamily: inter,
                fontSize: 14,
                fontWeight: 600,
                color: pillColors[i],
                letterSpacing: '0.03em',
              }}
            >
              {pill}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
