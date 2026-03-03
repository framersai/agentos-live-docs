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
import { RH, W } from '../theme/colors';
import { syne, inter, jetbrainsMono } from '../theme/fonts';
import { FloatingParticles } from '../components/FloatingParticles';

const TITLE_WORDS = ['Start', 'Building', 'Wunderbots'];

export const RabbitholeCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Gold glow pulse ───────────────────────────────────────────────
  const glowPulse = interpolate(Math.sin(frame * 0.08) * 0.5 + 0.5, [0, 1], [0.08, 0.22]);

  // ── Title: word-by-word spring entrance (0–30) ────────────────────
  const titleAnims = TITLE_WORDS.map((_, i) => {
    const stagger = 5 + i * 8;
    const wordScale = spring({
      frame: Math.max(0, frame - stagger),
      fps,
      config: { damping: 16, stiffness: 120 },
    });
    const wordOpacity = interpolate(frame, [stagger, stagger + 10], [0, 1], {
      extrapolateRight: 'clamp',
    });
    const wordY = interpolate(frame, [stagger, stagger + 14], [35, 0], {
      extrapolateRight: 'clamp',
    });
    return { scale: wordScale, opacity: wordOpacity, y: wordY };
  });

  // ── Cinematic horizontal line (25–50) ─────────────────────────────
  const lineWidth = interpolate(frame, [25, 55], [0, 500], { extrapolateRight: 'clamp' });
  const lineOpacity = interpolate(frame, [25, 35], [0, 0.5], { extrapolateRight: 'clamp' });

  // ── Left column: Wunderland (35–60) ───────────────────────────────
  const wlIconScale = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const wlIconOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
  const wlFloat = Math.sin(frame * 0.04) * 3;

  const wlTextOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' });
  const wlTextY = interpolate(frame, [50, 68], [18, 0], { extrapolateRight: 'clamp' });

  // ── Divider (55–70) ───────────────────────────────────────────────
  const divHeight = interpolate(frame, [55, 75], [0, 120], { extrapolateRight: 'clamp' });
  const divOpacity = interpolate(frame, [55, 70], [0, 0.5], { extrapolateRight: 'clamp' });

  // ── Right column: Rabbithole (65–90) ──────────────────────────────
  const rhIconScale = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const rhIconOpacity = interpolate(frame, [65, 80], [0, 1], { extrapolateRight: 'clamp' });
  const rhFloat = Math.sin((frame + 40) * 0.04) * 3;

  const rhTextOpacity = interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' });
  const rhTextY = interpolate(frame, [80, 98], [18, 0], { extrapolateRight: 'clamp' });

  // ── Bottom tagline (110–140) ──────────────────────────────────────
  const tagOpacity = interpolate(frame, [110, 135], [0, 1], { extrapolateRight: 'clamp' });
  const tagY = interpolate(frame, [110, 140], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles count={20} color={RH.brandGold} />

      {/* Gold radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 700,
          height: 700,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(245, 158, 11, ${glowPulse}) 0%, rgba(217, 119, 6, ${glowPulse * 0.4}) 30%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          zIndex: 1,
        }}
      >
        {/* ── Title: word-by-word spring ── */}
        <div style={{ display: 'flex', gap: 16 }}>
          {TITLE_WORDS.map((word, i) => {
            const anim = titleAnims[i];
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: inter,
                  fontWeight: 600,
                  fontSize: 56,
                  letterSpacing: '0.02em',
                  lineHeight: 1.3,
                  paddingBottom: 6,
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px) scale(${Math.min(anim.scale, 1)})`,
                  background:
                    'linear-gradient(180deg, #f0eeff 0%, #e0d4ff 40%, #c4b5fd 80%, #a78bfa 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* ── Cinematic line sweep ── */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${RH.brandGold}80, rgba(167, 139, 250, 0.4), transparent)`,
            opacity: lineOpacity,
            marginTop: -12,
            marginBottom: -8,
          }}
        />

        {/* ── Two columns ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 70 }}>
          {/* Free / Open Source */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* Wunderland icon with glow */}
            <div
              style={{
                position: 'relative',
                opacity: wlIconOpacity,
                transform: `scale(${wlIconScale}) translateY(${wlFloat}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  background: `radial-gradient(circle, rgba(167, 139, 250, 0.2), transparent 65%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
              <Img src={staticFile('wunderland-icon.png')} style={{ width: 72, height: 72 }} />
            </div>

            <div
              style={{
                opacity: wlTextOpacity,
                transform: `translateY(${wlTextY}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: syne,
                  fontWeight: 700,
                  fontSize: 20,
                  color: W.primaryLight,
                  letterSpacing: '0.05em',
                }}
              >
                Fully Free &amp; Open Source
              </div>
              <div
                style={{
                  fontFamily: jetbrainsMono,
                  fontSize: 18,
                  background: `linear-gradient(135deg, ${W.primaryLight}, ${W.cyan})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                wunderland.sh
              </div>
              <div
                style={{
                  fontFamily: syne,
                  fontSize: 12,
                  color: W.textTertiary,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Self-host with Ollama &middot; Fully Offline
              </div>
            </div>
          </div>

          {/* Divider — animated height */}
          <div
            style={{
              width: 1,
              height: divHeight,
              opacity: divOpacity,
              background: `linear-gradient(180deg, transparent, ${RH.brandGold}60, transparent)`,
            }}
          />

          {/* Cloud Platform */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* Rabbithole icon with gold glow */}
            <div
              style={{
                position: 'relative',
                opacity: rhIconOpacity,
                transform: `scale(${rhIconScale}) translateY(${rhFloat}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  background: `radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 65%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
              <Img
                src={staticFile('rabbithole-icon.png')}
                style={{ width: 72, height: 72, borderRadius: 14 }}
              />
            </div>

            <div
              style={{
                opacity: rhTextOpacity,
                transform: `translateY(${rhTextY}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: syne,
                  fontWeight: 700,
                  fontSize: 20,
                  color: RH.brandGoldLight,
                  letterSpacing: '0.05em',
                }}
              >
                Cloud Platform
              </div>
              <div
                style={{
                  fontFamily: jetbrainsMono,
                  fontSize: 18,
                  background: `linear-gradient(90deg, ${RH.brandGoldDark}, ${RH.brandGold}, ${RH.brandGoldLight}, ${RH.brandGold}, ${RH.brandGoldDark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% auto',
                  backgroundPosition: `${interpolate(frame % 90, [0, 90], [-100, 200])}% center`,
                }}
              >
                rabbithole.inc
              </div>
              <div
                style={{
                  fontFamily: syne,
                  fontSize: 12,
                  color: 'rgba(240, 238, 255, 0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Managed Hosting &middot; Dashboard &middot; Analytics
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            fontFamily: syne,
            fontSize: 13,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: 'rgba(240, 238, 255, 0.35)',
            marginTop: 12,
          }}
        >
          MIT License
        </div>
      </div>
    </AbsoluteFill>
  );
};
