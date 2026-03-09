import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { inter } from '../theme/fonts';
import { CAPTIONS, CaptionEntry } from '../data/captions';

const ENTER = 10;
const EXIT = 10;
const WORD_STAGGER = 3; // frames between each word appearing

interface CaptionOverlayProps {
  captions?: CaptionEntry[];
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({ captions = CAPTIONS }) => {
  const frame = useCurrentFrame();

  const active: CaptionEntry | undefined = captions.find((c) => frame >= c.from && frame < c.to);

  if (!active) return null;

  const localFrame = frame - active.from;
  const duration = active.to - active.from;

  // Overall container entrance/exit
  const containerOpacity = interpolate(
    localFrame,
    [0, ENTER, duration - EXIT, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Slight scale-up on entrance
  const scale = interpolate(localFrame, [0, ENTER], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit drift
  const translateY = interpolate(localFrame, [duration - EXIT, duration], [0, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Underline reveal — grows from 0% to 100% width during entrance
  const underlineWidth = interpolate(localFrame, [2, ENTER + 4], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underlineOpacity = interpolate(localFrame, [duration - EXIT, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Word-by-word reveal
  const words = active.text.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 72,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: containerOpacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 0.35em',
          fontFamily: inter,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '0.015em',
          lineHeight: 1.4,
          padding: '14px 36px 16px',
          borderRadius: 10,
          background:
            'linear-gradient(180deg, rgba(10, 8, 32, 0.78) 0%, rgba(6, 4, 24, 0.85) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        }}
      >
        {words.map((word, i) => {
          const wordDelay = i * WORD_STAGGER;
          const wordOpacity = interpolate(localFrame, [wordDelay, wordDelay + 5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const wordY = interpolate(localFrame, [wordDelay, wordDelay + 5], [8, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: W.textPrimary,
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.2)',
              }}
            >
              {word}
            </span>
          );
        })}

        {/* Animated underline accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            height: 2,
            width: `${underlineWidth * 0.5}%`,
            transform: 'translateX(-50%)',
            opacity: underlineOpacity * 0.6,
            background: `linear-gradient(90deg, transparent, ${W.primaryLight}, ${W.accent}, ${W.primaryLight}, transparent)`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};
