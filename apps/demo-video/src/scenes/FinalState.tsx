import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { W } from '../theme/colors';
import { syne, inter } from '../theme/fonts';
import { FloatingParticles } from '../components/FloatingParticles';
import { ShineText } from '../components/ShineText';
import { GlassCard } from '../components/GlassCard';

const FEATURES = [
  { text: 'Real-time dashboard', color: W.primaryLight, icon: '📊' },
  { text: 'API keys verified', color: W.emerald, icon: '🔑' },
  { text: 'Channels live', color: W.cyan, icon: '📡' },
  { text: '12 quick actions', color: W.accent, icon: '⚡' },
];

export const FinalState: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Subtitle entrance
  const subOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [20, 42], [15, 0], { extrapolateRight: 'clamp' });

  // Dashboard screenshot — cinematic scale entrance
  const dashScale = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 22, stiffness: 60 },
  });
  const dashOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Feature cards — staggered at bottom
  const cardAnims = FEATURES.map((_, i) => {
    const start = 120 + i * 18;
    const opacity = interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateRight: 'clamp',
    });
    const y = interpolate(frame, [start, start + 15], [25, 0], {
      extrapolateRight: 'clamp',
    });
    const scale = spring({
      frame: Math.max(0, frame - start),
      fps,
      config: { damping: 18, stiffness: 100 },
    });
    return { opacity, y, scale };
  });

  // Bottom message — "Full control. Full autonomy. Your choice."
  const endOpacity = interpolate(frame, [250, 280], [0, 1], { extrapolateRight: 'clamp' });
  const endY = interpolate(frame, [250, 285], [12, 0], { extrapolateRight: 'clamp' });

  // Gold glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.06) * 0.5 + 0.5, [0, 1], [0.04, 0.12]);

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={12} />

      {/* Gold glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 800,
          height: 500,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(245, 158, 11, ${glowPulse}) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          zIndex: 1,
          width: 1400,
        }}
      >
        {/* Section title */}
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: syne,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '0.06em',
            color: W.textPrimary,
            textAlign: 'center',
          }}
        >
          <ShineText startFrame={5}>This Is What You Get</ShineText>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily: inter,
            fontSize: 22,
            color: W.textSecondary,
            textAlign: 'center',
          }}
        >
          A complete command center for your AI agent
        </div>

        {/* Dashboard screenshot */}
        <div
          style={{
            opacity: dashOpacity,
            transform: `scale(${Math.min(dashScale, 1)})`,
            borderRadius: 12,
            overflow: 'hidden',
            border: `1px solid ${W.borderGlow}`,
            boxShadow: `0 0 60px rgba(99, 102, 241, 0.15), 0 0 120px rgba(139, 92, 246, 0.08)`,
            marginTop: 4,
          }}
        >
          <Img
            src={staticFile('tui-dashboard.png')}
            style={{ width: 900, height: 'auto', display: 'block' }}
          />
        </div>

        {/* Feature cards row */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {FEATURES.map((feat, i) => {
            const anim = cardAnims[i];
            return (
              <div
                key={i}
                style={{
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px) scale(${Math.min(anim.scale, 1)})`,
                }}
              >
                <GlassCard glowColor={feat.color} style={{ padding: '12px 20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: inter,
                      fontSize: 15,
                      fontWeight: 600,
                      color: feat.color,
                      letterSpacing: '0.03em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {feat.text}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Closing statement */}
        <div
          style={{
            opacity: endOpacity,
            transform: `translateY(${endY}px)`,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 28,
            color: W.accent,
            letterSpacing: '0.04em',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Full control. Full autonomy. Your choice.
        </div>
      </div>
    </AbsoluteFill>
  );
};
