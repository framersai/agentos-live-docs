import React from 'react';
import { interpolate } from 'remotion';
import { jetbrainsMono } from '../theme/fonts';
import { TypingAnimation } from './TypingAnimation';

// Colors matching the real CLI screenshots
export const C = {
  gold: '#f59e0b',
  cyan: '#06b6d4',
  green: '#10b981',
  purple: '#a78bfa',
  white: '#f0eeff',
  muted: 'rgba(240, 238, 255, 0.50)',
  dimmed: 'rgba(240, 238, 255, 0.35)',
  yellowWarn: '#fbbf24',
  rose: '#f43f5e',
} as const;

type Seg = { t: string; c?: string; b?: boolean };

export type Line =
  | { type: 'blank'; start: number }
  | { type: 'typed'; start: number; text: string; dur: number; prefix?: Seg[]; color?: string }
  | { type: 'rich'; start: number; segs: Seg[] };

export const RichLine: React.FC<{
  line: Line;
  frame: number;
  offset: number;
}> = ({ line, frame, offset }) => {
  const lf = frame - offset;

  if (line.type === 'blank') return <div style={{ height: 6 }} />;
  if (lf < line.start) return null;

  const mono = { fontFamily: jetbrainsMono };

  if (line.type === 'typed') {
    const prefixNode = line.prefix ? (
      <>
        {line.prefix.map((s, i) => (
          <span key={i} style={{ color: s.c, fontWeight: s.b ? 700 : undefined }}>
            {s.t}
          </span>
        ))}
      </>
    ) : undefined;

    // Gold glow for typed lines
    const glowOpacity = interpolate(lf, [line.start - 2, line.start + 4], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'relative',
          marginLeft: -12,
          marginRight: -12,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: 4,
          ...mono,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 50%, transparent 100%)',
            borderRadius: 4,
            opacity: glowOpacity,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            bottom: 4,
            width: 2,
            background: `rgba(245,158,11,${0.5 * glowOpacity})`,
            borderRadius: 1,
            boxShadow: `0 0 8px rgba(245,158,11,${0.3 * glowOpacity})`,
            pointerEvents: 'none',
          }}
        />
        <TypingAnimation
          text={line.text}
          startFrame={offset + line.start}
          typingDuration={line.dur}
          prefix={prefixNode}
          color={line.color}
        />
      </div>
    );
  }

  // Rich segmented line — fade in
  const opacity = interpolate(lf, [line.start, line.start + 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, ...mono }}>
      {line.segs.map((s, i) => (
        <span key={i} style={{ color: s.c ?? C.white, fontWeight: s.b ? 700 : undefined }}>
          {s.t}
        </span>
      ))}
    </div>
  );
};
