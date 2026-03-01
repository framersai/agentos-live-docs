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

// ── Cinematic title reveal ──────────────────────────────────────────

const PILLS = [
  { label: 'HEXACO Personality', color: W.primaryLight },
  { label: 'Graph-Based RAG', color: W.emerald },
  { label: '5-Tier Security', color: W.cyan },
  { label: 'Infinite Memory', color: W.accent },
];

// ── Art deco ornamental SVG components ──────────────────────────────

/** Concentric rotating rings behind the logo */
const ConcentricRings: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const rot1 = frame * 0.12;
  const rot2 = -frame * 0.08;
  const rot3 = frame * 0.05;
  const dashDraw = interpolate(frame, [0, 50], [800, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashDraw2 = interpolate(frame, [10, 60], [600, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashDraw3 = interpolate(frame, [20, 70], [500, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width="360"
      height="360"
      viewBox="0 0 360 360"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id="ring-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="ring-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="ring-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Outer ring — dashed octagonal */}
      <g transform={`rotate(${rot1}, 180, 180)`}>
        <polygon
          points="180,10 290,55 340,165 340,195 290,305 180,350 70,305 20,195 20,165 70,55"
          fill="none"
          stroke="url(#ring-grad-1)"
          strokeWidth="0.8"
          strokeDasharray="12 8"
          strokeDashoffset={dashDraw}
        />
      </g>
      {/* Middle ring — hexagonal with tick marks */}
      <g transform={`rotate(${rot2}, 180, 180)`}>
        <polygon
          points="180,40 270,80 310,170 310,190 270,280 180,320 90,280 50,190 50,170 90,80"
          fill="none"
          stroke="url(#ring-grad-2)"
          strokeWidth="0.6"
          strokeDasharray="20 6 4 6"
          strokeDashoffset={dashDraw2}
        />
        {/* Decorative tick marks at vertices */}
        {[40, 80, 170, 280, 320, 190].map((y, idx) => {
          const pts = [
            [180, 40],
            [270, 80],
            [310, 170],
            [310, 190],
            [270, 280],
            [180, 320],
            [90, 280],
            [50, 190],
            [50, 170],
            [90, 80],
          ];
          const p = pts[idx % pts.length];
          return <circle key={idx} cx={p[0]} cy={p[1]} r="2" fill="#f59e0b" fillOpacity={0.4} />;
        })}
      </g>
      {/* Inner ring — circular with fine dashes */}
      <g transform={`rotate(${rot3}, 180, 180)`}>
        <circle
          cx="180"
          cy="180"
          r="100"
          fill="none"
          stroke="url(#ring-grad-3)"
          strokeWidth="0.5"
          strokeDasharray="3 7"
          strokeDashoffset={dashDraw3}
        />
      </g>
      {/* Cross-hairs */}
      <line x1="180" y1="60" x2="180" y2="80" stroke="#818cf8" strokeWidth="0.4" opacity={0.25} />
      <line x1="180" y1="280" x2="180" y2="300" stroke="#818cf8" strokeWidth="0.4" opacity={0.25} />
      <line x1="60" y1="180" x2="80" y2="180" stroke="#818cf8" strokeWidth="0.4" opacity={0.25} />
      <line x1="280" y1="180" x2="300" y2="180" stroke="#818cf8" strokeWidth="0.4" opacity={0.25} />
    </svg>
  );
};

/** Art deco corner bracket for the title */
const ArtDecoCorner: React.FC<{
  len: number;
  opacity: number;
  flip?: 'h' | 'v' | 'hv';
}> = ({ len, opacity, flip }) => {
  const scaleX = flip === 'h' || flip === 'hv' ? -1 : 1;
  const scaleY = flip === 'v' || flip === 'hv' ? -1 : 1;
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      style={{
        opacity,
        transform: `scale(${scaleX}, ${scaleY})`,
      }}
    >
      <defs>
        <linearGradient id={`adc-${flip || 'none'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Main L bracket */}
      <path
        d={`M 2 ${Math.max(2, 50 - len)} L 2 2 L ${Math.min(len, 48)} 2`}
        fill="none"
        stroke={`url(#adc-${flip || 'none'})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Inner decorative line */}
      <path
        d={`M 7 ${Math.max(7, 50 - len * 0.6)} L 7 7 L ${Math.min(len * 0.6, 43)} 7`}
        fill="none"
        stroke="#818cf8"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Corner diamond ornament */}
      <polygon points="2,2 6,0 10,2 6,4" fill="#f59e0b" fillOpacity={0.5} />
    </svg>
  );
};

/** Ornate divider with diamond center */
const OrnateDivider: React.FC<{ width: number; opacity: number; frame: number }> = ({
  width,
  opacity,
  frame,
}) => {
  const shimmerX = interpolate(frame, [65, 95], [-100, width + 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const halfW = width / 2;
  const diamondScale = interpolate(frame, [62, 72], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width, height: 20, opacity }}>
      <svg
        width={width}
        height="20"
        viewBox={`0 0 ${width} 20`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="ornate-line-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="80%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="ornate-line-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="20%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Left line */}
        <line x1="0" y1="10" x2={halfW - 18} y2="10" stroke="url(#ornate-line-l)" strokeWidth="1" />
        {/* Right line */}
        <line
          x1={halfW + 18}
          y1="10"
          x2={width}
          y2="10"
          stroke="url(#ornate-line-r)"
          strokeWidth="1"
        />
        {/* Fine inner lines */}
        <line
          x1={halfW * 0.3}
          y1="10"
          x2={halfW - 22}
          y2="10"
          stroke="#818cf8"
          strokeWidth="0.3"
          opacity={0.25}
        />
        <line
          x1={halfW + 22}
          y1="10"
          x2={width - halfW * 0.3}
          y2="10"
          stroke="#818cf8"
          strokeWidth="0.3"
          opacity={0.25}
        />
        {/* Small dots along the line */}
        {[-0.6, -0.35, 0.35, 0.6].map((ratio, idx) => (
          <circle
            key={idx}
            cx={halfW + halfW * ratio}
            cy="10"
            r="1.5"
            fill="#818cf8"
            fillOpacity={0.3}
          />
        ))}
        {/* Center diamond */}
        <g transform={`translate(${halfW}, 10) scale(${diamondScale})`}>
          <polygon points="0,-8 8,0 0,8 -8,0" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <polygon points="0,-4.5 4.5,0 0,4.5 -4.5,0" fill="#f59e0b" fillOpacity={0.3} />
          <circle cx="0" cy="0" r="1.5" fill="#f59e0b" fillOpacity={0.7} />
        </g>
      </svg>
      {/* Shimmer sweep */}
      <div
        style={{
          position: 'absolute',
          top: 5,
          left: shimmerX - 40,
          width: 80,
          height: 10,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/** Flanking decorative vertical lines */
const DecoFlank: React.FC<{ frame: number; side: 'left' | 'right' }> = ({ frame, side }) => {
  const heightPx = interpolate(frame, [35, 80], [0, 200], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [35, 55, 470, 510], [0, 0.3, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashOffset = frame * 0.4;

  return (
    <div
      style={{
        position: 'absolute',
        [side]: 80,
        top: '50%',
        transform: 'translateY(-50%)',
        height: heightPx,
        width: 30,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <svg width="30" height={heightPx} viewBox={`0 0 30 ${heightPx}`}>
        <defs>
          <linearGradient id={`flank-g-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Main vertical line */}
        <line
          x1="15"
          y1="0"
          x2="15"
          y2={heightPx}
          stroke={`url(#flank-g-${side})`}
          strokeWidth="1"
        />
        {/* Dashed accent */}
        <line
          x1="10"
          y1="0"
          x2="10"
          y2={heightPx}
          stroke="#818cf8"
          strokeWidth="0.4"
          strokeDasharray="4 12"
          strokeDashoffset={dashOffset}
          opacity={0.3}
        />
        <line
          x1="20"
          y1="0"
          x2="20"
          y2={heightPx}
          stroke="#a78bfa"
          strokeWidth="0.4"
          strokeDasharray="4 12"
          strokeDashoffset={-dashOffset}
          opacity={0.2}
        />
        {/* Small diamonds along the line */}
        {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
          const y = heightPx * ratio;
          return (
            <polygon
              key={idx}
              points={`15,${y - 3} 18,${y} 15,${y + 3} 12,${y}`}
              fill="#f59e0b"
              fillOpacity={0.25}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1: Logo (0–40) ──────────────────────────────────────────
  const iconScale = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const iconOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const iconFloat = Math.sin(frame * 0.035) * 5;
  // Gold glow matching gold-light logo
  const glowPulse = interpolate(Math.sin(frame * 0.07) * 0.5 + 0.5, [0, 1], [0.12, 0.3]);

  // Rings fade in with logo, subtle
  const ringsOpacity = interpolate(frame, [5, 35], [0, 0.45], { extrapolateRight: 'clamp' });

  // ── Phase 2: Title smooth fade-in (30–60) ──────────────────────
  const titleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  // Rainbow gradient shimmer sweep across the whole word (65–105)
  const shimmerPos = interpolate(frame, [65, 105], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmerOpacity = interpolate(frame, [65, 70, 100, 105], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmerActive = frame >= 65 && frame <= 108;

  // Art deco corner brackets for title
  const cornerLen = interpolate(frame, [55, 78], [0, 45], { extrapolateRight: 'clamp' });
  const cornerOpacity = interpolate(frame, [55, 68, 470, 510], [0, 0.7, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3: Tagline word-by-word (65–110) ────────────────────────
  const taglineWords = [
    { text: 'Build your own', color: W.textSecondary, bold: false },
    { text: 'Wunderbots', color: W.primaryLight, bold: true },
    { text: '—', color: W.textTertiary, bold: false },
    { text: 'open-source fork of', color: W.textSecondary, bold: false },
    { text: 'OpenClaw', color: W.textPrimary, bold: true },
  ];
  const tagline2Words = [
    { text: 'with guardrails, smarter agentic decisions,', color: W.textSecondary, bold: false },
    { text: 'and infinite memory', color: W.textSecondary, bold: false },
  ];
  const tagline3Words = [
    { text: 'Fully offline with', color: W.textPrimary, bold: false },
    { text: 'Ollama', color: W.emerald, bold: true, glow: true },
    { text: '\u00B7', color: W.textTertiary, bold: false },
    { text: 'zero cost', color: W.accent, bold: true, glow: true },
    { text: '\u00B7', color: W.textTertiary, bold: false },
    { text: 'automated setup', color: W.cyan, bold: true, glow: true },
  ] as const;

  // ── Phase 4: Pills with spring entrance (180–240) ─────────────────
  const pillAnimations = PILLS.map((_, i) => {
    const stagger = 180 + i * 12;
    const pillScale = spring({
      frame: Math.max(0, frame - stagger),
      fps,
      config: { damping: 14, stiffness: 100 },
    });
    const pillOpacity = interpolate(frame, [stagger, stagger + 10], [0, 1], {
      extrapolateRight: 'clamp',
    });
    const pillY = interpolate(frame, [stagger, stagger + 15], [25, 0], {
      extrapolateRight: 'clamp',
    });
    const glowScale = interpolate(frame, [stagger, stagger + 8, stagger + 25], [0, 1.4, 1.0], {
      extrapolateRight: 'clamp',
    });
    return { scale: pillScale, opacity: pillOpacity, y: pillY, glowScale };
  });

  // ── Phase 5: Subtitle (260–300) ───────────────────────────────────
  const subOpacity = interpolate(frame, [260, 290], [0, 1], { extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [260, 295], [15, 0], { extrapolateRight: 'clamp' });

  // ── Ornate divider (60–90) ──────────────────────────────────────
  const dividerWidth = interpolate(frame, [60, 95], [0, 700], { extrapolateRight: 'clamp' });
  const dividerOpacity = interpolate(frame, [60, 70, 470, 510], [0, 0.7, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      <FloatingParticles />

      {/* ── Decorative side flanks ── */}
      <DecoFlank frame={frame} side="left" />
      <DecoFlank frame={frame} side="right" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          zIndex: 1,
          maxWidth: 1400,
        }}
      >
        {/* ── Animated Logo Icon with concentric rings ── */}
        <div
          style={{
            position: 'relative',
            opacity: iconOpacity,
            transform: `scale(${iconScale}) translateY(${iconFloat}px)`,
            marginBottom: 4,
            width: 360,
            height: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Concentric rotating geometric rings */}
          <ConcentricRings frame={frame} opacity={ringsOpacity} />
          {/* Gold glow behind icon */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 280,
              height: 280,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(245, 158, 11, ${glowPulse}) 0%, rgba(217, 119, 6, ${glowPulse * 0.3}) 35%, transparent 65%)`,
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <Img
            src={staticFile('wunderland-icon.png')}
            style={{ width: 130, height: 130, position: 'relative', zIndex: 1 }}
          />
        </div>

        {/* ── Title: cinematic reveal + gradient sweep ── */}
        <div style={{ position: 'relative' }}>
          {/* Art deco corner brackets */}
          <div style={{ position: 'absolute', left: -50, top: -20 }}>
            <ArtDecoCorner len={cornerLen} opacity={cornerOpacity} />
          </div>
          <div style={{ position: 'absolute', right: -50, top: -20 }}>
            <ArtDecoCorner len={cornerLen} opacity={cornerOpacity} flip="h" />
          </div>
          <div style={{ position: 'absolute', left: -50, bottom: -18 }}>
            <ArtDecoCorner len={cornerLen} opacity={cornerOpacity} flip="v" />
          </div>
          <div style={{ position: 'absolute', right: -50, bottom: -18 }}>
            <ArtDecoCorner len={cornerLen} opacity={cornerOpacity} flip="hv" />
          </div>

          {/* Single cohesive title — gradient */}
          <div
            style={{
              position: 'relative',
              opacity: titleOpacity,
              fontFamily: syne,
              fontWeight: 700,
              fontSize: 88,
              letterSpacing: '0.06em',
              background:
                'linear-gradient(135deg, #c4b5fd 0%, #818cf8 18%, #a78bfa 35%, #e0d4ff 50%, #fbbf24 70%, #f59e0b 85%, #c4b5fd 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            WUNDERLAND
            {/* Rainbow gradient shimmer sweep */}
            {shimmerActive && (
              <>
                {/* Rainbow prismatic band */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(100deg, transparent ${shimmerPos - 28}%, rgba(244,63,94,${shimmerOpacity * 0.25}) ${shimmerPos - 20}%, rgba(245,158,11,${shimmerOpacity * 0.3}) ${shimmerPos - 14}%, rgba(16,185,129,${shimmerOpacity * 0.3}) ${shimmerPos - 8}%, rgba(6,182,212,${shimmerOpacity * 0.35}) ${shimmerPos - 2}%, rgba(99,102,241,${shimmerOpacity * 0.35}) ${shimmerPos + 2}%, rgba(167,139,250,${shimmerOpacity * 0.3}) ${shimmerPos + 8}%, rgba(244,63,94,${shimmerOpacity * 0.2}) ${shimmerPos + 14}%, transparent ${shimmerPos + 22}%)`,
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                  }}
                />
                {/* Bright white core highlight on top */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(100deg, transparent ${shimmerPos - 8}%, rgba(255,255,255,${shimmerOpacity * 0.4}) ${shimmerPos - 2}%, rgba(255,255,255,${shimmerOpacity * 0.7}) ${shimmerPos}%, rgba(255,255,255,${shimmerOpacity * 0.4}) ${shimmerPos + 2}%, transparent ${shimmerPos + 8}%)`,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* ── Ornate divider with diamond center ── */}
        <div style={{ marginTop: -4, marginBottom: -2 }}>
          <OrnateDivider width={dividerWidth} opacity={dividerOpacity} frame={frame} />
        </div>

        {/* ── Tagline: word-by-word fade ── */}
        <div style={{ textAlign: 'center', lineHeight: 1.9 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {taglineWords.map((word, i) => {
              const stagger = 68 + i * 6;
              const wordOpacity = interpolate(frame, [stagger, stagger + 10], [0, 1], {
                extrapolateRight: 'clamp',
              });
              const wordY = interpolate(frame, [stagger, stagger + 12], [12, 0], {
                extrapolateRight: 'clamp',
              });
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: inter,
                    fontSize: 22,
                    fontWeight: word.bold ? 600 : 400,
                    color: word.color,
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    display: 'inline-block',
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            {tagline2Words.map((word, i) => {
              const stagger = 100 + i * 8;
              const wordOpacity = interpolate(frame, [stagger, stagger + 10], [0, 1], {
                extrapolateRight: 'clamp',
              });
              const wordY = interpolate(frame, [stagger, stagger + 12], [12, 0], {
                extrapolateRight: 'clamp',
              });
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: inter,
                    fontSize: 22,
                    fontWeight: word.bold ? 600 : 400,
                    color: word.color,
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    display: 'inline-block',
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
              marginTop: 10,
            }}
          >
            {tagline3Words.map((word, i) => {
              const stagger = 130 + i * 6;
              const wordOpacity = interpolate(frame, [stagger, stagger + 10], [0, 1], {
                extrapolateRight: 'clamp',
              });
              const wordY = interpolate(frame, [stagger, stagger + 12], [12, 0], {
                extrapolateRight: 'clamp',
              });
              const hasGlow = 'glow' in word && word.glow;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: inter,
                    fontSize: 26,
                    fontWeight: word.bold ? 700 : 400,
                    color: word.color,
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    display: 'inline-block',
                    textShadow: hasGlow
                      ? `0 0 20px ${word.color}80, 0 0 40px ${word.color}30`
                      : undefined,
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── Feature pills: spring entrance with art deco borders ── */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {PILLS.map((pill, i) => {
            const anim = pillAnimations[i];
            // Art deco corner tick marks on pills
            const tickLen = interpolate(frame, [180 + i * 12 + 5, 180 + i * 12 + 18], [0, 8], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px) scale(${Math.min(anim.scale, 1)})`,
                }}
              >
                {/* Glow bloom behind pill */}
                <div
                  style={{
                    position: 'absolute',
                    inset: -8,
                    background: `radial-gradient(ellipse, ${pill.color}25, transparent 70%)`,
                    borderRadius: 20,
                    transform: `scale(${anim.glowScale})`,
                    pointerEvents: 'none',
                  }}
                />
                {/* Art deco corner accents */}
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    width: tickLen,
                    height: tickLen,
                    borderTop: `1px solid ${pill.color}60`,
                    borderLeft: `1px solid ${pill.color}60`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: tickLen,
                    height: tickLen,
                    borderTop: `1px solid ${pill.color}60`,
                    borderRight: `1px solid ${pill.color}60`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    left: -2,
                    width: tickLen,
                    height: tickLen,
                    borderBottom: `1px solid ${pill.color}60`,
                    borderLeft: `1px solid ${pill.color}60`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: tickLen,
                    height: tickLen,
                    borderBottom: `1px solid ${pill.color}60`,
                    borderRight: `1px solid ${pill.color}60`,
                    pointerEvents: 'none',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    fontFamily: syne,
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    padding: '8px 20px',
                    borderRadius: 2,
                    color: pill.color,
                    background: `linear-gradient(135deg, ${pill.color}12, ${pill.color}08)`,
                    border: `1px solid ${pill.color}25`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  {pill.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Subtitle ── */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily: syne,
            fontSize: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: W.textTertiary,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Built on <span style={{ color: W.emerald }}>AgentOS.sh</span>
          {'  \u00B7  '}
          <span style={{ color: W.primaryLight }}>Free &amp; Open Source</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
