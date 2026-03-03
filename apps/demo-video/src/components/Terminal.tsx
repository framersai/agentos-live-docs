import React from 'react';
import { W } from '../theme/colors';
import { jetbrainsMono } from '../theme/fonts';

interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  opacity?: number;
  scale?: number;
  /** Maximum body height before scrolling kicks in (px) */
  maxBodyHeight?: number;
  /** Pixels to scroll content up (simulates auto-scroll) */
  scrollOffset?: number;
  /** Total content height for scrollbar thumb calculation */
  totalContentHeight?: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  title = 'terminal',
  children,
  opacity = 1,
  scale = 1,
  maxBodyHeight = 480,
  scrollOffset = 0,
  totalContentHeight = 0,
}) => {
  const showScrollbar = scrollOffset > 0 && totalContentHeight > maxBodyHeight;
  const trackHeight = maxBodyHeight - 16; // padding offset
  const thumbHeight = Math.max(
    24,
    totalContentHeight > 0 ? (maxBodyHeight / totalContentHeight) * trackHeight : 0
  );
  const thumbTop =
    totalContentHeight > maxBodyHeight
      ? (scrollOffset / (totalContentHeight - maxBodyHeight)) * (trackHeight - thumbHeight)
      : 0;

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

      {/* Body — clipped viewport with scroll offset */}
      <div
        style={{
          position: 'relative',
          maxHeight: maxBodyHeight,
          overflow: 'hidden',
          fontSize: 18,
          lineHeight: 2.0,
        }}
      >
        {/* Scrollable content */}
        <div
          style={{
            padding: '16px 20px',
            transform: `translateY(${-scrollOffset}px)`,
          }}
        >
          {children}
        </div>

        {/* Scrollbar track + thumb */}
        {showScrollbar && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 4,
              width: 4,
              height: trackHeight,
              borderRadius: 2,
              background: 'rgba(99, 102, 241, 0.08)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: thumbTop,
                width: 4,
                height: thumbHeight,
                borderRadius: 2,
                background: 'rgba(99, 102, 241, 0.35)',
                boxShadow: '0 0 6px rgba(99, 102, 241, 0.2)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
