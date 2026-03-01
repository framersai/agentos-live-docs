import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  children: React.ReactNode;
  /** Frame when the entrance starts */
  startFrame: number;
  style?: React.CSSProperties;
}

/**
 * Elegant scene title: blur-to-focus entrance, gradient text, animated underline.
 * No cheesy shine sweep. Clean and cinematic.
 */
export const ShineText: React.FC<Props> = ({ children, startFrame, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;

  // Phase 1: Blur-to-focus + scale entrance (frames 0–18)
  const entranceProgress = spring({
    frame: Math.max(0, localFrame + 4),
    fps,
    config: { damping: 22, stiffness: 90, mass: 0.6 },
    durationInFrames: 22,
  });

  const opacity = interpolate(localFrame, [-4, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scale from 1.12 → 1.0 (zoom out into place)
  const scale = interpolate(entranceProgress, [0, 1], [1.12, 1.0]);

  // Blur: 12px → 0px
  const blur = interpolate(entranceProgress, [0, 1], [12, 0]);

  // Letter-spacing tightens as it settles
  const tracking = interpolate(entranceProgress, [0, 1], [0.14, 0.06]);

  // Phase 2: Underline draw-in (starts 6 frames after text appears)
  const underlineProgress = interpolate(localFrame, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle glow pulse after entrance
  const glowIntensity =
    localFrame > 10 ? interpolate(Math.sin((localFrame - 10) * 0.06), [-1, 1], [0.08, 0.2]) : 0;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Main text with gradient + blur entrance */}
      <span
        style={{
          display: 'inline-block',
          opacity,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          letterSpacing: `${tracking}em`,
          background:
            'linear-gradient(135deg, #e0d4ff 0%, #f0eeff 25%, #ffffff 50%, #c4b5fd 75%, #e0d4ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
        }}
      >
        {children}
      </span>

      {/* Ambient glow behind text */}
      <span
        style={{
          position: 'absolute',
          inset: '-8px -16px',
          background: `radial-gradient(ellipse, rgba(99, 102, 241, ${glowIntensity}) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Animated underline */}
      <span
        style={{
          position: 'absolute',
          bottom: -6,
          left: `${50 - underlineProgress * 50}%`,
          width: `${underlineProgress * 100}%`,
          height: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), rgba(245, 158, 11, 0.5), rgba(167, 139, 250, 0.6), transparent)',
          borderRadius: 1,
          opacity: opacity * 0.7,
          pointerEvents: 'none',
        }}
      />
    </span>
  );
};
