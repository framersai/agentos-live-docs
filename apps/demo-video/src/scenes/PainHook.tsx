import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { W } from '../theme/colors';
import { inter } from '../theme/fonts';
import { FloatingParticles } from '../components/FloatingParticles';
import { ShineText } from '../components/ShineText';

const LINES = [
  {
    text: 'You tried the other frameworks.',
    frame: 5,
    color: W.textPrimary,
    size: 52,
    gradient: true,
  },
  {
    text: 'OpenClaw. AutoGPT. CrewAI.',
    frame: 55,
    color: W.textSecondary,
    size: 44,
    gradient: false,
  },
];

export const PainHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle ambient glow
  const glowPulse = interpolate(Math.sin(frame * 0.06) * 0.5 + 0.5, [0, 1], [0.04, 0.12]);

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={10} />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 600,
          height: 400,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(99, 102, 241, ${glowPulse}) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 1,
        }}
      >
        {LINES.map((line, i) => {
          const lineOpacity = interpolate(frame, [line.frame, line.frame + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const lineY = interpolate(frame, [line.frame, line.frame + 18], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const lineScale = spring({
            frame: Math.max(0, frame - line.frame),
            fps,
            config: { damping: 22, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: lineOpacity,
                transform: `translateY(${lineY}px) scale(${Math.min(lineScale, 1)})`,
              }}
            >
              {line.gradient ? (
                <ShineText
                  startFrame={line.frame}
                  style={{
                    fontFamily: inter,
                    fontWeight: 700,
                    fontSize: line.size,
                    color: line.color,
                  }}
                >
                  {line.text}
                </ShineText>
              ) : (
                <div
                  style={{
                    fontFamily: inter,
                    fontWeight: 600,
                    fontSize: line.size,
                    color: line.color,
                    letterSpacing: '0.02em',
                  }}
                >
                  {line.text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
