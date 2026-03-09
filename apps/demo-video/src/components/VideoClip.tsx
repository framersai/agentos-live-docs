import React from 'react';
import {
  OffthreadVideo,
  Easing,
  interpolate,
  useCurrentFrame,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { AOS } from '../theme/colors';

export interface VideoKeyframe {
  frame: number;
  scale: number;
  x: number;
  y: number;
}

interface VideoClipProps {
  src: string;
  keyframes: VideoKeyframe[];
  startFrom?: number;
  endAt?: number;
  playbackRate?: number;
  borderRadius?: number;
  chrome?: boolean;
  /** Padding inset (px) from the AbsoluteFill edges */
  inset?: number;
}

export const VideoClip: React.FC<VideoClipProps> = ({
  src,
  keyframes,
  startFrom,
  endAt,
  playbackRate,
  borderRadius = 12,
  chrome = true,
  inset = 24,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  const frames = sorted.map((k) => k.frame);
  const scales = sorted.map((k) => k.scale);
  const xs = sorted.map((k) => k.x);
  const ys = sorted.map((k) => k.y);

  const easing = Easing.inOut(Easing.cubic);

  const scale = interpolate(frame, frames, scales, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const tx = interpolate(frame, frames, xs, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const ty = interpolate(frame, frames, ys, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

  // Scene entrance/exit fade
  const TRANS = 15;
  const opacity = interpolate(
    frame,
    [0, TRANS, durationInFrames - TRANS, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const blur = interpolate(
    frame,
    [0, TRANS, durationInFrames - TRANS, durationInFrames],
    [4, 0, 0, 4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: inset,
        left: inset,
        right: inset,
        bottom: inset + 60, // leave room for captions
        opacity,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {/* Subtle border wrapper */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: borderRadius + 2,
          padding: 1,
          background: 'rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Inner card */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius,
            overflow: 'hidden',
            background: AOS.bgVoid,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* macOS chrome bar */}
          {chrome && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: AOS.surface,
                borderBottom: `1px solid ${AOS.borderGlass}`,
                flexShrink: 0,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            </div>
          )}

          {/* Video container with zoom/pan */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
                transformOrigin: 'center center',
              }}
            >
              <OffthreadVideo
                src={staticFile(src)}
                startFrom={startFrom}
                endAt={endAt}
                playbackRate={playbackRate}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
