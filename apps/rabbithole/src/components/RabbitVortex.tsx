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

    // Generate tunnel rings - perspective depth effect
    const tunnelRings = Array.from({ length: 20 }, (_, i) => {
        const depth = i / 20;
        const scale = 1 - depth * 0.85; // Rings get smaller towards center
        const radius = 240 * scale;
        const z = depth * 400; // Z-depth for perspective
        const opacity = 0.08 + (1 - depth) * 0.25;
        const rotation = time * (15 + i * 3) + i * 18;
        const strokeWidth = 1.5 * scale + 0.5;
        const hueShift = Math.sin(time * 0.5 + depth * 2) * 20;

        return { radius, opacity, rotation, depth, strokeWidth, hueShift, z, i };
    });

    // Floating energy particles in the tunnel
    const particles = Array.from({ length: 32 }, (_, i) => {
        const particleTime = time + i * 0.3;
        const angle = (i / 32) * Math.PI * 2 + particleTime * 0.4;
        const depthPhase = (particleTime * 0.3 + i * 0.1) % 1;
        const radius = 60 + (1 - depthPhase) * 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.4; // Elliptical for perspective
        const particleOpacity = (1 - depthPhase) * 0.6;
        const particleSize = 1.5 + (1 - depthPhase) * 2.5;

        return { x, y, opacity: particleOpacity, size: particleSize, i };
    });

    // Rabbit floating animation
    const rabbitY = Math.sin(time * 1.2) * 6;
    const rabbitRotation = Math.sin(time * 0.6) * 2;
    const glowIntensity = isHovered ? 1.4 : 1;
    const earWiggle = Math.sin(time * 2) * 3;

    // Theme-aware colors
    const hoverGlow = isLight
        ? 'drop-shadow(0 0 60px rgba(139, 105, 20, 0.35))'
        : 'drop-shadow(0 0 60px rgba(0, 245, 255, 0.4))';

    const bgColor = isLight ? '#f8f6f2' : '#030305';

    // Tunnel ring colors shift to warm gold in light mode
    const ringHue = isLight ? 38 : 185;  // gold vs cyan
    const ringSecondaryHue = isLight ? 28 : 280;

    // Holographic gradient colors
    const holoColors = isLight
        ? { a: '#c9a227', b: '#8b6914', c: '#e8d48a' }
        : { a: '#00f5ff', b: '#8b5cf6', c: '#ff00f5' };

    // Particle colors
    const particleColors = isLight
        ? ['#c9a227', '#8b6914', '#b8860b']
        : ['#00f5ff', '#8b5cf6', '#ff00f5'];

    // Rabbit fill - dark rabbit on light bg, light rabbit on dark bg
    const rabbitColors = isLight
        ? { start: '#2a1f3d', mid: '#1a1625', end: '#12101a' }
        : { start: '#e8f4ff', mid: '#d0e8ff', end: '#b8dbff' };

    const eyeColor = isLight ? '#f8f6f2' : '#1a1a2e';
    const eyeShineColor = isLight ? '#c9a227' : '#fff';

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
                filter: isHovered ? hoverGlow : 'none'
            }}
        >
            <defs>
                {/* Deep tunnel gradient */}
                <radialGradient id="tunnelDepth" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={isLight ? '#1a1625' : '#000'} stopOpacity={isLight ? 0.6 : 1} />
                    <stop offset="30%" stopColor={isLight ? '#2a1f3d' : '#020208'} stopOpacity={isLight ? 0.4 : 0.95} />
                    <stop offset="60%" stopColor={isLight ? '#3d3555' : '#050510'} stopOpacity={isLight ? 0.2 : 0.8} />
                    <stop offset="100%" stopColor={isLight ? '#f8f6f2' : '#0a0a18'} stopOpacity="0" />
                </radialGradient>

                {/* Luminescent glow */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Strong rabbit glow */}
                <filter id="rabbitGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation={4 * glowIntensity} result="blur1" />
                    <feGaussianBlur stdDeviation={10 * glowIntensity} result="blur2" />
                    <feGaussianBlur stdDeviation={20 * glowIntensity} result="blur3" />
                    <feMerge>
                        <feMergeNode in="blur3" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Holographic gradient - animated */}
                <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={holoColors.a}>
                        <animate attributeName="stop-color" values={`${holoColors.a};${holoColors.b};${holoColors.c};${holoColors.a}`} dur="6s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor={holoColors.b}>
                        <animate attributeName="stop-color" values={`${holoColors.b};${holoColors.c};${holoColors.a};${holoColors.b}`} dur="6s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor={holoColors.c}>
                        <animate attributeName="stop-color" values={`${holoColors.c};${holoColors.a};${holoColors.b};${holoColors.c}`} dur="6s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>

                {/* Rabbit body fill */}
                <linearGradient id="rabbitFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={rabbitColors.start} />
                    <stop offset="50%" stopColor={rabbitColors.mid} />
                    <stop offset="100%" stopColor={rabbitColors.end} />
                </linearGradient>

                {/* Inner ear pink */}
                <linearGradient id="earPink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isLight ? '#c9a227' : '#ffb8d0'} />
                    <stop offset="100%" stopColor={isLight ? '#8b6914' : '#ff8ab8'} />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="500" height="500" fill={bgColor} />

            {/* INFINITE TUNNEL VORTEX */}
            <g>
                {/* Outer glow ring */}
                <circle
                    cx="250"
                    cy="250"
                    r="245"
                    fill="none"
                    stroke="url(#holoGradient)"
                    strokeWidth="2"
                    opacity="0.3"
                />

                {/* Tunnel rings - creates depth illusion */}
                {tunnelRings.map(({ radius, opacity, rotation, strokeWidth, hueShift, i }) => (
                    <g key={i} transform={`rotate(${rotation}, 250, 250)`}>
                        {/* Main ring */}
                        <ellipse
                            cx="250"
                            cy="250"
                            rx={radius}
                            ry={radius * 0.35}
                            fill="none"
                            stroke={`hsl(${ringHue + hueShift}, ${isLight ? '70%' : '100%'}, ${isLight ? '45%' : '65%'})`}
                            strokeWidth={strokeWidth}
                            opacity={opacity}
                            filter="url(#glow)"
                        />
                        {/* Secondary dashed ring for texture */}
                        {i % 2 === 0 && (
                            <ellipse
                                cx="250"
                                cy="250"
                                rx={radius * 0.92}
                                ry={radius * 0.32}
                                fill="none"
                                stroke={`hsl(${ringSecondaryHue + hueShift}, ${isLight ? '60%' : '80%'}, ${isLight ? '40%' : '60%'})`}
                                strokeWidth={strokeWidth * 0.5}
                                strokeDasharray="8 16"
                                opacity={opacity * 0.5}
                            />
                        )}
                    </g>
                ))}

                {/* Spiral energy beams */}
                {Array.from({ length: 6 }, (_, i) => {
                    const angle = (i / 6) * 360 + time * 20;
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <line
                            key={`beam-${i}`}
                            x1="250"
                            y1="250"
                            x2={250 + Math.cos(rad) * 240}
                            y2={250 + Math.sin(rad) * 85}
                            stroke="url(#holoGradient)"
                            strokeWidth="1"
                            opacity={0.1 + Math.sin(time * 2 + i) * 0.08}
                            strokeDasharray="4 12 8 16"
                        />
                    );
                })}

                {/* Central void */}
                <ellipse cx="250" cy="250" rx="35" ry="12" fill={isLight ? '#1a1625' : '#000'} opacity={isLight ? 0.7 : 0.95} />
                <ellipse
                    cx="250"
                    cy="250"
                    rx="40"
                    ry="14"
                    fill="none"
                    stroke="url(#holoGradient)"
                    strokeWidth="1.5"
                    opacity="0.6"
                >
                    <animate attributeName="rx" values="38;42;38" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="13;15;13" dur="2s" repeatCount="indefinite" />
                </ellipse>

                {/* Tunnel depth gradient overlay */}
                <circle cx="250" cy="250" r="250" fill="url(#tunnelDepth)" />
            </g>

            {/* FLOATING PARTICLES */}
            <g filter="url(#glow)">
                {particles.map(({ x, y, opacity, size, i }) => (
                    <circle
                        key={`p-${i}`}
                        cx={250 + x}
                        cy={250 + y}
                        r={size}
                        fill={particleColors[i % 3]}
                        opacity={opacity}
                    />
                ))}
            </g>

            {/* CUTE BUNNY - Side profile, falling into vortex */}
            <g
                filter="url(#rabbitGlow)"
                transform={`translate(250, ${200 + rabbitY}) rotate(${rabbitRotation})`}
                style={{ transition: 'transform 0.15s ease-out' }}
            >
                {/* Bunny body - round and cute */}
                <g transform="translate(-35, -45)">
                    {/* Back body/tail area */}
                    <ellipse
                        cx="55"
                        cy="65"
                        rx="28"
                        ry="22"
                        fill="url(#rabbitFill)"
                        opacity="0.95"
                    />

                    {/* Fluffy tail */}
                    <circle
                        cx="78"
                        cy="65"
                        r="8"
                        fill="url(#rabbitFill)"
                    />
                    <circle
                        cx="80"
                        cy="63"
                        r="4"
                        fill={isLight ? '#c9a227' : '#fff'}
                        opacity={isLight ? 0.3 : 0.6}
                    />

                    {/* Main body - chubby */}
                    <ellipse
                        cx="40"
                        cy="60"
                        rx="24"
                        ry="20"
                        fill="url(#rabbitFill)"
                    />

                    {/* Front chest - fluffy */}
                    <ellipse
                        cx="22"
                        cy="58"
                        rx="14"
                        ry="16"
                        fill="url(#rabbitFill)"
                    />

                    {/* Head - round and cute */}
                    <ellipse
                        cx="15"
                        cy="38"
                        rx="18"
                        ry="16"
                        fill="url(#rabbitFill)"
                    />

                    {/* Cheek fluff */}
                    <ellipse
                        cx="8"
                        cy="44"
                        rx="8"
                        ry="6"
                        fill={isLight ? '#c9a227' : '#fff'}
                        opacity={isLight ? 0.2 : 0.4}
                    />

                    {/* Long ear - back, with wiggle */}
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
                            opacity="0.7"
                            transform="rotate(15, 28, 10)"
                        />
                    </g>

                    {/* Long ear - front, with wiggle */}
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
                            opacity="0.7"
                            transform="rotate(-10, 8, 7)"
                        />
                    </g>

                    {/* Eye - large and cute */}
                    <ellipse
                        cx="8"
                        cy="36"
                        rx="5"
                        ry="5.5"
                        fill={eyeColor}
                    />
                    {/* Eye shine */}
                    <circle cx="6" cy="34" r="2" fill={eyeShineColor} opacity="0.9" />
                    <circle cx="10" cy="37" r="1" fill={eyeShineColor} opacity="0.6" />

                    {/* Cute nose - small pink triangle */}
                    <ellipse
                        cx="-1"
                        cy="42"
                        rx="3"
                        ry="2.5"
                        fill="#ffb8d0"
                    />

                    {/* Whiskers */}
                    <g stroke={isLight ? 'rgba(139,105,20,0.4)' : 'rgba(255,255,255,0.5)'} strokeWidth="0.8" strokeLinecap="round">
                        <line x1="-4" y1="40" x2="-18" y2="36" />
                        <line x1="-4" y1="43" x2="-20" y2="43" />
                        <line x1="-4" y1="46" x2="-18" y2="50" />
                    </g>

                    {/* Mouth - cute smile line */}
                    <path
                        d="M -1 45 Q 3 48 6 45"
                        stroke="#e8a0b8"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.6"
                    />

                    {/* Front paws - tucked in, falling pose */}
                    <ellipse
                        cx="12"
                        cy="72"
                        rx="6"
                        ry="4"
                        fill="url(#rabbitFill)"
                    />
                    <ellipse
                        cx="24"
                        cy="74"
                        rx="5"
                        ry="3.5"
                        fill="url(#rabbitFill)"
                    />

                    {/* Back legs - stretched behind */}
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

                {/* Floating energy sparkles around bunny */}
                {[0, 1, 2, 3, 4].map((i) => {
                    const sparkleAngle = (i / 5) * Math.PI * 2 + time * 1.5;
                    const sparkleRadius = 50 + Math.sin(time * 2 + i) * 8;
                    return (
                        <circle
                            key={`sparkle-${i}`}
                            cx={Math.cos(sparkleAngle) * sparkleRadius}
                            cy={Math.sin(sparkleAngle) * sparkleRadius * 0.5}
                            r={1.5 + Math.sin(time * 3 + i) * 0.5}
                            fill={i % 2 === 0 ? particleColors[0] : particleColors[2]}
                            opacity={0.6 + Math.sin(time * 2 + i) * 0.3}
                        />
                    );
                })}
            </g>
        </svg>
    );
}
