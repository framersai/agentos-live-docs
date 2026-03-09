import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AOS } from '../theme/colors';
import { inter } from '../theme/fonts';

interface SceneBadgeProps {
  label: string;
  color?: string;
}

export const SceneBadge: React.FC<SceneBadgeProps> = ({ label, color = AOS.primaryLight }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slide in from left
  const enterX = interpolate(frame, [20, 40], [-180, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slide out
  const exitX = interpolate(frame, [durationInFrames - 25, durationInFrames - 10], [0, -180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [durationInFrames - 25, durationInFrames - 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = enterX + exitX;
  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: 44,
        zIndex: 20,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 18px',
          borderRadius: 8,
          background:
            'linear-gradient(180deg, rgba(10, 8, 32, 0.85) 0%, rgba(6, 4, 24, 0.92) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${AOS.borderGlow}`,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px ${color}15`,
        }}
      >
        {/* Colored dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        <span
          style={{
            fontFamily: inter,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: AOS.textSecondary,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
