import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { W } from '../theme/colors';
import { syne, inter } from '../theme/fonts';
import { GlassCard } from '../components/GlassCard';
import { ShineText } from '../components/ShineText';

// ── Intricate gradient SVG icons ───────────────────────────────────

// 3 distinct personality profiles to cycle through
const HEXACO_PROFILES = [
  { label: 'The Analyst', values: [0.9, 0.3, 0.4, 0.7, 0.95, 0.85] }, // high H, C, O
  { label: 'The Socialite', values: [0.5, 0.85, 0.95, 0.4, 0.3, 0.6] }, // high E, X
  { label: 'The Creative', values: [0.65, 0.5, 0.6, 0.9, 0.55, 0.95] }, // high A, O
];

/** Lerp between two value arrays based on t (0–1) */
const lerpValues = (a: number[], b: number[], t: number): number[] =>
  a.map((v, i) => v + (b[i] - v) * t);

/** Get interpolated HEXACO values for a given frame (cycles through 3 profiles) */
const getHexacoValues = (frame: number, cycleFrames: number = 80): number[] => {
  const totalCycle = cycleFrames * 3;
  const pos = frame % totalCycle;
  const profileIdx = Math.floor(pos / cycleFrames);
  const nextIdx = (profileIdx + 1) % 3;
  const t = (pos % cycleFrames) / cycleFrames;
  // Smooth easing
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return lerpValues(HEXACO_PROFILES[profileIdx].values, HEXACO_PROFILES[nextIdx].values, eased);
};

/** Mini radar icon for the HEXACO card */
const HexacoIcon: React.FC<{ progress: number; frame?: number }> = ({ progress, frame = 0 }) => {
  // 6 HEXACO axes at 60° intervals
  const cx = 12,
    cy = 12,
    R = 10;
  const angles = [0, 1, 2, 3, 4, 5].map((i) => ((i * 60 - 90) * Math.PI) / 180);
  const vertex = (a: number, r: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;

  // Animated radar values — cycles through 3 personality profiles
  const values = getHexacoValues(frame);
  const radarPts = angles.map((a, i) => vertex(a, R * values[i] * progress)).join(' ');

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fh-hexaco-lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Grid rings */}
      {[0.33, 0.66, 1.0].map((s, i) => (
        <polygon
          key={i}
          points={angles.map((a) => vertex(a, R * s)).join(' ')}
          fill="none"
          stroke="#818cf8"
          strokeWidth="0.3"
          opacity={0.2}
        />
      ))}
      {/* Axes */}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * R}
          y2={cy + Math.sin(a) * R}
          stroke="#818cf8"
          strokeWidth="0.3"
          opacity={0.3}
        />
      ))}
      {/* Filled radar */}
      <polygon
        points={radarPts}
        fill="url(#fh-hexaco-lg)"
        fillOpacity={0.3}
        stroke="url(#fh-hexaco-lg)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Dots at vertices */}
      {angles.map((a, i) => (
        <circle
          key={i}
          cx={cx + Math.cos(a) * R * values[i] * progress}
          cy={cy + Math.sin(a) * R * values[i] * progress}
          r="1.2"
          fill="#a78bfa"
          fillOpacity={0.8}
        />
      ))}
    </svg>
  );
};

/** Large animated HEXACO radar chart for showcase */
const HexacoRadar: React.FC<{ progress: number; opacity: number; frame: number }> = ({
  progress,
  opacity,
  frame,
}) => {
  const cx = 120,
    cy = 120,
    R = 100;
  const labels = ['H', 'E', 'X', 'A', 'C', 'O'];
  const fullLabels = [
    'Honesty',
    'Emotionality',
    'Extraversion',
    'Agreeableness',
    'Conscientiousness',
    'Openness',
  ];
  const values = getHexacoValues(frame);
  const colors = ['#818cf8', '#c084fc', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4'];
  const angles = [0, 1, 2, 3, 4, 5].map((i) => ((i * 60 - 90) * Math.PI) / 180);
  const vertex = (a: number, r: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  const ptStr = (a: number, r: number) => `${vertex(a, r)[0]},${vertex(a, r)[1]}`;

  const radarPts = angles.map((a, i) => ptStr(a, R * values[i] * progress)).join(' ');

  return (
    <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 40 }}>
      <svg width="240" height="240" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="hex-radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hex-radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1.0].map((s, i) => (
          <polygon
            key={i}
            points={angles.map((a) => ptStr(a, R * s)).join(' ')}
            fill="none"
            stroke="#818cf8"
            strokeWidth={i === 3 ? 0.8 : 0.4}
            opacity={0.15 + i * 0.05}
          />
        ))}
        {/* Axes with labels */}
        {angles.map((a, i) => {
          const [lx, ly] = vertex(a, R + 16);
          return (
            <g key={i}>
              <line
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(a) * R}
                y2={cy + Math.sin(a) * R}
                stroke={colors[i]}
                strokeWidth="0.6"
                opacity={0.4}
              />
              <text
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                fill={colors[i]}
                fontSize="12"
                fontWeight="700"
                fontFamily="Syne, sans-serif"
                opacity={progress}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
        {/* Filled radar shape */}
        <polygon
          points={radarPts}
          fill="url(#hex-radar-fill)"
          stroke="url(#hex-radar-stroke)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Animated vertex dots */}
        {angles.map((a, i) => {
          const [vx, vy] = vertex(a, R * values[i] * progress);
          return (
            <g key={i}>
              <circle cx={vx} cy={vy} r="4" fill={colors[i]} fillOpacity={0.3} />
              <circle cx={vx} cy={vy} r="2.5" fill={colors[i]} />
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Active profile label */}
        {(() => {
          const cycleFrames = 80;
          const profileIdx = Math.floor((frame % (cycleFrames * 3)) / cycleFrames);
          const profile = HEXACO_PROFILES[profileIdx];
          return (
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                color: '#a78bfa',
                marginBottom: 4,
                opacity: progress,
                letterSpacing: '0.05em',
              }}
            >
              {profile.label}
            </div>
          );
        })()}
        {labels.map((l, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: progress }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[i] }} />
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                color: colors[i],
                width: 18,
              }}
            >
              {l}
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                color: 'rgba(240,238,255,0.5)',
              }}
            >
              {fullLabels[i]}
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: colors[i],
                marginLeft: 'auto',
              }}
            >
              {values[i].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityIcon: React.FC<{ progress: number; frame?: number }> = ({ progress }) => {
  const dash = 200;
  const offset = dash * (1 - progress);
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fh-sec-lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <radialGradient id="fh-sec-rg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#be123c" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      {/* 5 concentric shield layers */}
      <path
        d="M12 1L22 5.5V12C22 18 17.5 22 12 23C6.5 22 2 18 2 12V5.5L12 1Z"
        fill="url(#fh-sec-rg)"
        stroke="url(#fh-sec-lg)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      <path
        d="M12 3.5L19.5 7V12C19.5 16.5 16 19.5 12 20.5C8 19.5 4.5 16.5 4.5 12V7L12 3.5Z"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="0.6"
        opacity={0.5}
      />
      <path
        d="M12 5.5L17.5 8.5V12C17.5 15.5 15 17.5 12 18.5C9 17.5 6.5 15.5 6.5 12V8.5L12 5.5Z"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="0.5"
        opacity={0.35}
      />
      <path
        d="M12 7.5L15.5 9.5V12C15.5 14 14 15.5 12 16C10 15.5 8.5 14 8.5 12V9.5L12 7.5Z"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="0.4"
        opacity={0.25}
      />
      <path
        d="M12 9L14 10V12C14 13 13 14 12 14.5C11 14 10 13 10 12V10L12 9Z"
        fill="#f43f5e"
        fillOpacity={0.15}
        stroke="#f43f5e"
        strokeWidth="0.3"
        opacity={0.2}
      />
      {/* Lock in center */}
      <rect
        x="10"
        y="11.5"
        width="4"
        height="3"
        rx="0.5"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="1"
      />
      <path
        d="M10.8 11.5V10.5C10.8 9.5 11.3 9 12 9C12.7 9 13.2 9.5 13.2 10.5V11.5"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="0.5" fill="#f43f5e" />
    </svg>
  );
};

const ExtensionsIcon: React.FC<{ progress: number; frame?: number }> = ({ progress }) => {
  const dash = 200;
  const offset = dash * (1 - progress);
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fh-ext-lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="fh-ext-lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="fh-ext-lg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="fh-ext-lg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      {/* Top-left: emerald */}
      <path
        d="M3 3H9.5V7.5C9.5 7.5 8 7 8 8.5C8 10 9.5 9.5 9.5 9.5V11H3V3Z"
        fill="url(#fh-ext-lg1)"
        fillOpacity={0.25}
        stroke="url(#fh-ext-lg1)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      {/* Top-right: cyan */}
      <path
        d="M13 3H21V11H17.5C17.5 11 18 9.5 16.5 9.5C15 9.5 15.5 11 15.5 11H13V9.5C13 9.5 14.5 10 14.5 8.5C14.5 7 13 7.5 13 7.5V3Z"
        fill="url(#fh-ext-lg2)"
        fillOpacity={0.25}
        stroke="url(#fh-ext-lg2)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      {/* Bottom-left: amber */}
      <path
        d="M3 13H7.5C7.5 13 7 14.5 8.5 14.5C10 14.5 9.5 13 9.5 13H11V21H3V13Z"
        fill="url(#fh-ext-lg3)"
        fillOpacity={0.25}
        stroke="url(#fh-ext-lg3)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      {/* Bottom-right: rose */}
      <path
        d="M13 13H15.5C15.5 13 15 14.5 16.5 14.5C18 14.5 17.5 13 17.5 13H21V21H13V17.5C13 17.5 14.5 18 14.5 16.5C14.5 15 13 15.5 13 15.5V13Z"
        fill="url(#fh-ext-lg4)"
        fillOpacity={0.25}
        stroke="url(#fh-ext-lg4)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

const MemoryIcon: React.FC<{ progress: number; frame?: number }> = ({ progress }) => {
  const dash = 200;
  const offset = dash * (1 - progress);
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fh-mem-lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id="fh-mem-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* Brain outline */}
      <path
        d="M12 2C8 2 5 5 5 8C3 9 2 11 2 13C2 16 4 18 6 18.5C7 20.5 9 22 12 22C15 22 17 20.5 18 18.5C20 18 22 16 22 13C22 11 21 9 19 8C19 5 16 2 12 2Z"
        fill="url(#fh-mem-rg)"
        stroke="url(#fh-mem-lg)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      {/* Brain hemisphere divide */}
      <path d="M12 4V20" stroke="#06b6d4" strokeWidth="0.6" opacity={0.3} />
      {/* Circuit traces - left */}
      <path d="M6 9H9L10 10" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
      <path d="M5 13H8L9 12" fill="none" stroke="#0891b2" strokeWidth="0.8" opacity={0.5} />
      <path d="M7 16H9L10 15" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity={0.4} />
      {/* Circuit traces - right */}
      <path d="M18 9H15L14 10" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity={0.5} />
      <path d="M19 13H16L15 12" fill="none" stroke="#0891b2" strokeWidth="0.8" opacity={0.5} />
      <path d="M17 16H15L14 15" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity={0.4} />
      {/* Memory chip nodes */}
      <circle cx="6" cy="9" r="1" fill="#06b6d4" fillOpacity={0.6} />
      <circle cx="5" cy="13" r="1" fill="#0891b2" fillOpacity={0.6} />
      <circle cx="7" cy="16" r="1" fill="#06b6d4" fillOpacity={0.5} />
      <circle cx="18" cy="9" r="1" fill="#2563eb" fillOpacity={0.6} />
      <circle cx="19" cy="13" r="1" fill="#0891b2" fillOpacity={0.6} />
      <circle cx="17" cy="16" r="1" fill="#2563eb" fillOpacity={0.5} />
      {/* Central processing node */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="url(#fh-mem-lg)"
        fillOpacity={0.3}
        stroke="url(#fh-mem-lg)"
        strokeWidth="0.8"
      />
      <circle cx="12" cy="12" r="0.8" fill="#06b6d4" fillOpacity={0.8} />
    </svg>
  );
};

const FEATURES = [
  {
    title: 'HEXACO Personality',
    desc: 'Six-factor personality model drives mood, posting style, and decision-making.',
    color: W.primaryLight,
    Icon: HexacoIcon,
  },
  {
    title: '5-Tier Security',
    desc: 'Pre-LLM classification, dual-LLM audit, HMAC signing, cost guards.',
    color: W.rose,
    Icon: SecurityIcon,
  },
  {
    title: '51+ Extensions',
    desc: '28 channels, 13 LLM providers, 23+ tools, browser automation, voice.',
    color: W.emerald,
    Icon: ExtensionsIcon,
  },
  {
    title: 'Unlimited Memory',
    desc: 'Semantic, episodic, GraphRAG, dynamic time-based mood decay.',
    color: W.cyan,
    Icon: MemoryIcon,
  },
];

export const FeatureHighlights: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{ background: W.bgGradient, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 400,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.06), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section title — standardized */}
      <div
        style={{
          position: 'absolute',
          top: 55,
          left: 0,
          right: 0,
          zIndex: 2,
          textAlign: 'center',
          opacity: titleOpacity,
          fontFamily: syne,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: '0.06em',
          color: W.textPrimary,
        }}
      >
        <ShineText startFrame={8}>Power Your Wunderbots</ShineText>
      </div>

      <div style={{ width: 1200, zIndex: 1, marginTop: 80 }}>
        {/* Cards grid — art deco cyberpunk */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
          }}
        >
          {FEATURES.map((feat, i) => {
            const staggerStart = 30 + i * 18;
            const cardOpacity = interpolate(frame, [staggerStart, staggerStart + 15], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const cardY = interpolate(frame, [staggerStart, staggerStart + 20], [50, 0], {
              extrapolateRight: 'clamp',
            });
            const cardScale = spring({
              frame: Math.max(0, frame - staggerStart),
              fps,
              config: { damping: 20, stiffness: 100 },
            });
            const iconProgress = interpolate(frame, [staggerStart, staggerStart + 30], [0, 1], {
              extrapolateRight: 'clamp',
            });
            // Animated border glow
            const borderGlow = interpolate(
              frame,
              [staggerStart + 10, staggerStart + 20, staggerStart + 40],
              [0, 0.6, 0.25],
              { extrapolateRight: 'clamp' }
            );
            // Corner bracket draw-in
            const cornerLen = interpolate(frame, [staggerStart + 5, staggerStart + 25], [0, 28], {
              extrapolateRight: 'clamp',
            });

            const CARD_W = 265;
            const CARD_H = 220;
            const cornerStyle = (top: boolean, left: boolean): React.CSSProperties => ({
              position: 'absolute',
              width: cornerLen,
              height: cornerLen,
              borderColor: `${feat.color}${Math.round(borderGlow * 255)
                .toString(16)
                .padStart(2, '0')}`,
              borderStyle: 'solid',
              borderWidth: 0,
              ...(top ? { top: -1 } : { bottom: -1 }),
              ...(left ? { left: -1 } : { right: -1 }),
              ...(top && left
                ? { borderTopWidth: 2, borderLeftWidth: 2 }
                : top && !left
                  ? { borderTopWidth: 2, borderRightWidth: 2 }
                  : !top && left
                    ? { borderBottomWidth: 2, borderLeftWidth: 2 }
                    : { borderBottomWidth: 2, borderRightWidth: 2 }),
              pointerEvents: 'none',
            });

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px) scale(${Math.min(cardScale, 1)})`,
                  width: CARD_W,
                }}
              >
                {/* Card with art deco corners */}
                <div
                  style={{
                    position: 'relative',
                    width: CARD_W,
                    height: CARD_H,
                    padding: 28,
                    background: `linear-gradient(145deg, ${feat.color}08, rgba(15, 11, 46, 0.8))`,
                    border: `1px solid ${feat.color}20`,
                    borderRadius: 2,
                    boxShadow: `0 0 ${30 + borderGlow * 40}px ${feat.color}${Math.round(
                      borderGlow * 30
                    )
                      .toString(16)
                      .padStart(2, '0')}, inset 0 1px 0 ${feat.color}15`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Ornate corner brackets */}
                  <div style={cornerStyle(true, true)} />
                  <div style={cornerStyle(true, false)} />
                  <div style={cornerStyle(false, true)} />
                  <div style={cornerStyle(false, false)} />

                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${feat.color}12`,
                      border: `1px solid ${feat.color}20`,
                      marginBottom: 16,
                    }}
                  >
                    <feat.Icon progress={iconProgress} frame={frame} />
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: syne,
                      fontWeight: 700,
                      fontSize: 17,
                      color: feat.color,
                      letterSpacing: '0.04em',
                      marginBottom: 8,
                    }}
                  >
                    {feat.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontFamily: inter,
                      fontSize: 12,
                      color: W.textSecondary,
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {feat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── HEXACO Radar Chart showcase ── */}
        {(() => {
          const radarStart = 110;
          const radarOpacity = interpolate(frame, [radarStart, radarStart + 20], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const radarProgress = interpolate(frame, [radarStart, radarStart + 40], [0, 1], {
            extrapolateRight: 'clamp',
          });
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 28,
              }}
            >
              <HexacoRadar progress={radarProgress} opacity={radarOpacity} frame={frame} />
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
