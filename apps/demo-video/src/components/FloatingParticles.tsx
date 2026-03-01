import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';

interface Props {
  count?: number;
  color?: string;
}

// Deterministic pseudo-random
const seed = (n: number) => {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const FloatingParticles: React.FC<Props> = ({ count = 25, color = W.primaryLight }) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: seed(i * 3) * 100,
        y: seed(i * 7 + 1) * 100,
        size: 2 + seed(i * 11 + 2) * 4,
        speed: 0.3 + seed(i * 13 + 3) * 0.5,
        phase: seed(i * 17 + 4) * Math.PI * 2,
        opacity: 0.1 + seed(i * 19 + 5) * 0.2,
      })),
    [count]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const yOffset = interpolate((frame * p.speed + p.phase * 30) % 200, [0, 200], [20, -40]);
        const opacity = interpolate(
          (frame * p.speed + p.phase * 30) % 200,
          [0, 40, 160, 200],
          [0, p.opacity, p.opacity, 0]
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              opacity,
              transform: `translateY(${yOffset}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
