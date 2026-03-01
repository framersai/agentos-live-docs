import React from 'react';
import { W } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  glowColor?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glowColor = W.primary, style }) => {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 0 24px ${glowColor}20, 0 0 48px ${glowColor}10`,
        ...style,
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${glowColor}10, ${glowColor}06, transparent)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};
