import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { syne } from '../theme/fonts';

interface Props {
  target: number;
  suffix?: string;
  startFrame: number;
  color: string;
  label: string;
}

export const AnimatedCounter: React.FC<Props> = ({
  target,
  suffix = '',
  startFrame,
  color,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  const progress = spring({
    frame: elapsed,
    fps,
    config: { damping: 50, stiffness: 200, mass: 0.5 },
  });

  const displayValue = Math.round(interpolate(progress, [0, 1], [0, target]));
  const opacity = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(elapsed, [0, 15], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: syne,
          fontWeight: 700,
          fontSize: 64,
          color,
          lineHeight: 1,
        }}
      >
        {displayValue}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: syne,
          fontSize: 14,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: 'rgba(240, 238, 255, 0.5)',
          marginTop: 8,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
};
