import React from 'react';
import { W } from '../theme/colors';
import { jetbrainsMono } from '../theme/fonts';

interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  opacity?: number;
  scale?: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  title = 'terminal',
  children,
  opacity = 1,
  scale = 1,
}) => {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: '#0c0a20',
        border: `1px solid ${W.borderGlow}`,
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: jetbrainsMono,
        boxShadow: `0 0 40px rgba(99, 102, 241, 0.12), 0 0 80px rgba(139, 92, 246, 0.06)`,
        width: '100%',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 14px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ color: W.textTertiary, fontSize: 11, marginLeft: 8 }}>{title}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
};
