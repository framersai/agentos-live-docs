import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface Props {
  children: string;
  from?: string;
  to?: string;
  style?: React.CSSProperties;
  shimmer?: boolean;
}

export const GradientText: React.FC<Props> = ({
  children,
  from = '#818cf8',
  to = '#fbbf24',
  style,
  shimmer = false,
}) => {
  const frame = useCurrentFrame();
  const shimmerOffset = shimmer ? interpolate(frame % 180, [0, 180], [-100, 200]) : 0;

  return (
    <span
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: shimmer ? '200% auto' : undefined,
        backgroundPosition: shimmer ? `${shimmerOffset}% center` : undefined,
        paddingBottom: '0.1em',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
