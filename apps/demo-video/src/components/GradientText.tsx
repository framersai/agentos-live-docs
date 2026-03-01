import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface Props {
  children: string;
  from?: string;
  to?: string;
  /** Multi-stop gradient string — overrides from/to if provided */
  gradient?: string;
  style?: React.CSSProperties;
  shimmer?: boolean;
}

export const GradientText: React.FC<Props> = ({
  children,
  from = '#818cf8',
  to = '#fbbf24',
  gradient,
  style,
  shimmer = false,
}) => {
  const frame = useCurrentFrame();
  const shimmerOffset = shimmer ? interpolate(frame % 180, [0, 180], [-100, 200]) : 0;

  const bg = gradient ?? `linear-gradient(135deg, ${from}, ${to})`;

  return (
    <span
      style={{
        background: bg,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: shimmer ? '200% auto' : undefined,
        backgroundPosition: shimmer ? `${shimmerOffset}% center` : undefined,
        paddingBottom: '0.25em',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
