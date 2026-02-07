'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface RabbitVortexProps {
  size?: number;
  className?: string;
}

export default function RabbitVortex({ size = 500, className = '' }: RabbitVortexProps) {
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [time, setTime] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Animation loop
  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Generate tunnel rings - deeper perspective with accelerating compression
  const tunnelRings = Array.from({ length: 24 }, (_, i) => {
    const depth = i / 24;
    // Exponential compression — rings bunch up towards center for depth illusion
    const compressed = Math.pow(depth, 1.6);
    const scale = 1 - compressed * 0.92;
    const radius = 240 * scale;
    const opacity = isLight ? 0.12 + (1 - depth) * 0.2 : 0.04 + (1 - depth) * 0.22;
    const rotation = time * (8 + i * 2.5) + i * 15;
    const strokeWidth = (1.8 * scale + 0.3) * (isLight ? 0.8 : 1);

    // Obsidian iridescence — subtle color shift along depth
    const hueShift = Math.sin(time * 0.3 + depth * 3) * 15;

    return { radius, opacity, rotation, depth, strokeWidth, hueShift, i };
  });

  // Floating energy particles — spiral descent into the void
  const particles = Array.from({ length: 28 }, (_, i) => {
    const particleTime = time + i * 0.35;
    const angle = (i / 28) * Math.PI * 2 + particleTime * 0.5;
    const depthPhase = (particleTime * 0.25 + i * 0.08) % 1;
    const radius = 40 + (1 - depthPhase) * 200;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.35;
    const particleOpacity = (1 - depthPhase) * (isLight ? 0.5 : 0.45);
    const particleSize = 1 + (1 - depthPhase) * 2;

    return { x, y, opacity: particleOpacity, size: particleSize, i };
  });

  // Rabbit floating animation
  const rabbitY = Math.sin(time * 1.2) * 6;
  const rabbitRotation = Math.sin(time * 0.6) * 2;
  const glowIntensity = isHovered ? 1.4 : 1;
  const earWiggle = Math.sin(time * 2) * 3;

  // --- OBSIDIAN DARK palette ---
  // Deep volcanic glass with subtle prismatic reflections
  const darkPalette = {
    bg: '#030305',
    voidCenter: '#000000',
    voidEdge: '#08060e',
    // Obsidian reflects faint spectral colors at edges
    ringPrimary: (hue: number) => `hsl(${260 + hue}, 20%, ${18 + Math.sin(time * 0.4) * 4}%)`,
    ringSecondary: (hue: number) => `hsl(${200 + hue}, 15%, ${14 + Math.sin(time * 0.5) * 3}%)`,
    // Faint iridescent edge highlights
    ringHighlight: (depth: number) => {
      const h = 180 + depth * 180 + Math.sin(time * 0.6) * 30;
      return `hsl(${h}, 40%, 55%)`;
    },
    particle: ['#8b92a0', '#6b7080', '#a0a8b8'],
    rabbitBody: { start: '#e0e4ec', mid: '#c8cdd8', end: '#b0b6c4' },
    rabbitEye: '#0a0a12',
    rabbitShine: '#fff',
    whisker: 'rgba(200,205,220,0.5)',
    sparkle: ['#c0c8d8', '#9ba4b8'],
    hoverGlow: 'drop-shadow(0 0 50px rgba(100, 110, 140, 0.3))',
  };

  // --- LUMINESCENT LIGHT palette ---
  // Pearlescent, opalescent warmth — like light through mother-of-pearl
  const lightPalette = {
    bg: '#faf8f4',
    voidCenter: '#d4c8aa',
    voidEdge: '#e8e0cc',
    ringPrimary: (hue: number) => `hsl(${38 + hue}, 55%, ${60 + Math.sin(time * 0.4) * 8}%)`,
    ringSecondary: (hue: number) => `hsl(${28 + hue}, 45%, ${55 + Math.sin(time * 0.5) * 6}%)`,
    ringHighlight: (depth: number) => {
      const h = 30 + depth * 40 + Math.sin(time * 0.6) * 15;
      return `hsl(${h}, 60%, 65%)`;
    },
    particle: ['#c9a227', '#b8860b', '#daa520'],
    rabbitBody: { start: '#2a1f3d', mid: '#1a1625', end: '#12101a' },
    rabbitEye: '#f8f6f2',
    rabbitShine: '#c9a227',
    whisker: 'rgba(139,105,20,0.4)',
    sparkle: ['#c9a227', '#e8d48a'],
    hoverGlow: 'drop-shadow(0 0 50px rgba(139, 105, 20, 0.3))',
  };

  const p = isLight ? lightPalette : darkPalette;

  // Holographic gradient colors
  const holoColors = isLight
    ? { a: '#c9a227', b: '#daa520', c: '#e8d48a' }
    : { a: '#4a4860', b: '#5a5878', c: '#3a3850' };

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 500 500"
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'filter 0.3s ease',
        filter: isHovered ? p.hoverGlow : 'none',
      }}
    >
      <defs>
        {/* Deep tunnel gradient — vignette that draws eye to center */}
        <radialGradient id="tunnelDepth" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.voidCenter} stopOpacity={isLight ? 0.25 : 0.95} />
          <stop offset="25%" stopColor={p.voidEdge} stopOpacity={isLight ? 0.15 : 0.7} />
          <stop offset="55%" stopColor={p.bg} stopOpacity={isLight ? 0.05 : 0.4} />
          <stop offset="100%" stopColor={p.bg} stopOpacity="0" />
        </radialGradient>

        {/* Obsidian reflection — subtle prismatic surface sheen */}
        {!isLight && (
          <radialGradient id="obsidianSheen" cx="35%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1a1828" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#0e0c18" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#030305" stopOpacity="0" />
          </radialGradient>
        )}

        {/* Pearl sheen for light mode */}
        {isLight && (
          <radialGradient id="pearlSheen" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#f5f0e0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#faf8f4" stopOpacity="0" />
          </radialGradient>
        )}

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isLight ? 2 : 3} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft glow for light mode rings */}
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Rabbit glow */}
        <filter id="rabbitGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={3 * glowIntensity} result="blur1" />
          <feGaussianBlur stdDeviation={8 * glowIntensity} result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated holographic gradient */}
        <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={holoColors.a}>
            <animate
              attributeName="stop-color"
              values={`${holoColors.a};${holoColors.b};${holoColors.c};${holoColors.a}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor={holoColors.b}>
            <animate
              attributeName="stop-color"
              values={`${holoColors.b};${holoColors.c};${holoColors.a};${holoColors.b}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={holoColors.c}>
            <animate
              attributeName="stop-color"
              values={`${holoColors.c};${holoColors.a};${holoColors.b};${holoColors.c}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        {/* Rabbit body fill */}
        <linearGradient id="rabbitFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.rabbitBody.start} />
          <stop offset="50%" stopColor={p.rabbitBody.mid} />
          <stop offset="100%" stopColor={p.rabbitBody.end} />
        </linearGradient>

        {/* Inner ear */}
        <linearGradient id="earPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#c9a227' : '#8a7aa0'} />
          <stop offset="100%" stopColor={isLight ? '#8b6914' : '#6b5a80'} />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="500" height="500" fill={p.bg} />

      {/* Surface sheen layer */}
      {!isLight && <rect width="500" height="500" fill="url(#obsidianSheen)" />}
      {isLight && <rect width="500" height="500" fill="url(#pearlSheen)" />}

      {/* INFINITE TUNNEL VORTEX */}
      <g>
        {/* Outer boundary — faint rim */}
        <circle
          cx="250"
          cy="250"
          r="242"
          fill="none"
          stroke="url(#holoGradient)"
          strokeWidth={isLight ? 1 : 0.8}
          opacity={isLight ? 0.25 : 0.15}
        />

        {/* Tunnel rings — depth-compressed ellipses */}
        {tunnelRings.map(({ radius, opacity, rotation, depth, strokeWidth, hueShift, i }) => (
          <g key={i} transform={`rotate(${rotation}, 250, 250)`}>
            {/* Main ring */}
            <ellipse
              cx="250"
              cy="250"
              rx={radius}
              ry={radius * 0.35}
              fill="none"
              stroke={p.ringPrimary(hueShift)}
              strokeWidth={strokeWidth}
              opacity={opacity}
              filter={isLight ? 'url(#softGlow)' : undefined}
            />
            {/* Iridescent highlight edge — obsidian reflection / pearl shimmer */}
            {i % 3 === 0 && (
              <ellipse
                cx="250"
                cy="250"
                rx={radius + 1}
                ry={radius * 0.35 + 0.5}
                fill="none"
                stroke={p.ringHighlight(depth)}
                strokeWidth={isLight ? 0.6 : 0.4}
                opacity={isLight ? 0.3 : 0.12}
                strokeDasharray="12 24 6 18"
              />
            )}
            {/* Secondary texture ring */}
            {i % 2 === 0 && (
              <ellipse
                cx="250"
                cy="250"
                rx={radius * 0.93}
                ry={radius * 0.32}
                fill="none"
                stroke={p.ringSecondary(hueShift)}
                strokeWidth={strokeWidth * 0.4}
                strokeDasharray="6 14"
                opacity={opacity * 0.4}
              />
            )}
          </g>
        ))}

        {/* Spiral descent beams — faint guide lines into the void */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * 360 + time * 15;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={`beam-${i}`}
              x1="250"
              y1="250"
              x2={250 + Math.cos(rad) * 240}
              y2={250 + Math.sin(rad) * 84}
              stroke="url(#holoGradient)"
              strokeWidth="0.8"
              opacity={
                isLight
                  ? 0.08 + Math.sin(time * 1.5 + i) * 0.05
                  : 0.05 + Math.sin(time * 1.5 + i) * 0.04
              }
              strokeDasharray="3 14 6 20"
            />
          );
        })}

        {/* Central void — the abyss */}
        <ellipse
          cx="250"
          cy="250"
          rx="32"
          ry="11"
          fill={isLight ? '#b8a882' : '#000'}
          opacity={isLight ? 0.5 : 0.95}
        />
        <ellipse
          cx="250"
          cy="250"
          rx="37"
          ry="13"
          fill="none"
          stroke="url(#holoGradient)"
          strokeWidth={isLight ? 1 : 1.2}
          opacity={isLight ? 0.35 : 0.4}
        >
          <animate attributeName="rx" values="35;39;35" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="12;14;12" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Tunnel depth overlay */}
        <circle cx="250" cy="250" r="250" fill="url(#tunnelDepth)" />
      </g>

      {/* FLOATING PARTICLES */}
      <g filter={isLight ? 'url(#softGlow)' : 'url(#glow)'}>
        {particles.map(({ x, y, opacity, size, i }) => (
          <circle
            key={`p-${i}`}
            cx={250 + x}
            cy={250 + y}
            r={size}
            fill={p.particle[i % 3]}
            opacity={opacity}
          />
        ))}
      </g>

      {/* CUTE BUNNY — falling into the vortex */}
      <g
        filter="url(#rabbitGlow)"
        transform={`translate(250, ${200 + rabbitY}) rotate(${rabbitRotation})`}
        style={{ transition: 'transform 0.15s ease-out' }}
      >
        <g transform="translate(-35, -45)">
          {/* Back body/tail area */}
          <ellipse cx="55" cy="65" rx="28" ry="22" fill="url(#rabbitFill)" opacity="0.95" />

          {/* Fluffy tail */}
          <circle cx="78" cy="65" r="8" fill="url(#rabbitFill)" />
          <circle
            cx="80"
            cy="63"
            r="4"
            fill={isLight ? '#c9a227' : '#c8cdd8'}
            opacity={isLight ? 0.25 : 0.4}
          />

          {/* Main body */}
          <ellipse cx="40" cy="60" rx="24" ry="20" fill="url(#rabbitFill)" />

          {/* Front chest */}
          <ellipse cx="22" cy="58" rx="14" ry="16" fill="url(#rabbitFill)" />

          {/* Head */}
          <ellipse cx="15" cy="38" rx="18" ry="16" fill="url(#rabbitFill)" />

          {/* Cheek fluff */}
          <ellipse
            cx="8"
            cy="44"
            rx="8"
            ry="6"
            fill={isLight ? '#c9a227' : '#c8cdd8'}
            opacity={isLight ? 0.15 : 0.25}
          />

          {/* Back ear with wiggle */}
          <g transform={`rotate(${-5 + earWiggle * 0.5}, 20, 25)`}>
            <ellipse
              cx="28"
              cy="8"
              rx="6"
              ry="22"
              fill="url(#rabbitFill)"
              transform="rotate(15, 28, 8)"
            />
            <ellipse
              cx="28"
              cy="10"
              rx="3"
              ry="16"
              fill="url(#earPink)"
              opacity="0.6"
              transform="rotate(15, 28, 10)"
            />
          </g>

          {/* Front ear with wiggle */}
          <g transform={`rotate(${earWiggle}, 8, 25)`}>
            <ellipse
              cx="8"
              cy="5"
              rx="5"
              ry="24"
              fill="url(#rabbitFill)"
              transform="rotate(-10, 8, 5)"
            />
            <ellipse
              cx="8"
              cy="7"
              rx="2.5"
              ry="18"
              fill="url(#earPink)"
              opacity="0.6"
              transform="rotate(-10, 8, 7)"
            />
          </g>

          {/* Eye */}
          <ellipse cx="8" cy="36" rx="5" ry="5.5" fill={p.rabbitEye} />
          <circle cx="6" cy="34" r="2" fill={p.rabbitShine} opacity="0.9" />
          <circle cx="10" cy="37" r="1" fill={p.rabbitShine} opacity="0.6" />

          {/* Nose */}
          <ellipse cx="-1" cy="42" rx="3" ry="2.5" fill={isLight ? '#d4a0b0' : '#c0a0b8'} />

          {/* Whiskers */}
          <g stroke={p.whisker} strokeWidth="0.8" strokeLinecap="round">
            <line x1="-4" y1="40" x2="-18" y2="36" />
            <line x1="-4" y1="43" x2="-20" y2="43" />
            <line x1="-4" y1="46" x2="-18" y2="50" />
          </g>

          {/* Mouth */}
          <path
            d="M -1 45 Q 3 48 6 45"
            stroke={isLight ? '#c09090' : '#a08898'}
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          {/* Front paws */}
          <ellipse cx="12" cy="72" rx="6" ry="4" fill="url(#rabbitFill)" />
          <ellipse cx="24" cy="74" rx="5" ry="3.5" fill="url(#rabbitFill)" />

          {/* Back legs */}
          <ellipse
            cx="58"
            cy="78"
            rx="10"
            ry="6"
            fill="url(#rabbitFill)"
            transform="rotate(-15, 58, 78)"
          />
          <ellipse
            cx="48"
            cy="80"
            rx="8"
            ry="5"
            fill="url(#rabbitFill)"
            transform="rotate(-10, 48, 80)"
          />
        </g>

        {/* Sparkles around bunny */}
        {[0, 1, 2, 3, 4].map((i) => {
          const sparkleAngle = (i / 5) * Math.PI * 2 + time * 1.5;
          const sparkleRadius = 50 + Math.sin(time * 2 + i) * 8;
          return (
            <circle
              key={`sparkle-${i}`}
              cx={Math.cos(sparkleAngle) * sparkleRadius}
              cy={Math.sin(sparkleAngle) * sparkleRadius * 0.5}
              r={1.5 + Math.sin(time * 3 + i) * 0.5}
              fill={p.sparkle[i % 2]}
              opacity={0.5 + Math.sin(time * 2 + i) * 0.3}
            />
          );
        })}
      </g>
    </svg>
  );
}
