import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { jetbrainsMono } from '../theme/fonts';

/**
 * Subtle bottom-right watermark: tiny logo + "wunderland.sh"
 * Fades in at start, fades out at end of its Sequence.
 */
export const Watermark: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 20, durationInFrames - 25, durationInFrames],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        right: 36,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <Img
        src={staticFile('wunderland-icon.png')}
        style={{ width: 22, height: 22, borderRadius: 4 }}
      />
      <span
        style={{
          fontFamily: jetbrainsMono,
          fontSize: 12,
          letterSpacing: '0.06em',
          color: 'rgba(240, 238, 255, 0.6)',
        }}
      >
        wunderland.sh
      </span>
    </div>
  );
};
