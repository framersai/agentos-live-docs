import React from 'react';

interface Props {
  size?: number;
  opacity?: number;
  strokeDashoffset?: number;
}

export const WunderlandIconSvg: React.FC<Props> = ({
  size = 120,
  opacity = 1,
  strokeDashoffset = 0,
}) => {
  const id = 'vid-wl';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`grad-indigo-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id={`grad-amber-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id={`grad-frame-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#0f0b2e" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id={`grad-mirror-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#312e81" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#4338ca" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={`grad-shimmer-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`grad-reflect-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <polygon
        points="50,2 84,18 98,50 84,82 50,98 16,82 2,50 16,18"
        fill={`url(#grad-frame-${id})`}
      />
      <polygon
        points="50,2 84,18 98,50 84,82 50,98 16,82 2,50 16,18"
        fill="none"
        stroke={`url(#grad-indigo-${id})`}
        strokeWidth="1.5"
        strokeDasharray="400"
        strokeDashoffset={strokeDashoffset}
      />
      <polygon
        points="50,10 76,22 88,50 76,78 50,90 24,78 12,50 24,22"
        fill={`url(#grad-mirror-${id})`}
      />
      <polygon
        points="50,10 76,22 88,50 76,78 50,90 24,78 12,50 24,22"
        fill="none"
        stroke={`url(#grad-indigo-${id})`}
        strokeWidth="2"
        strokeDasharray="300"
        strokeDashoffset={strokeDashoffset * 0.75}
      />

      <path
        d="M24,28 L34,50 L50,32 L66,50 L76,28"
        fill="none"
        stroke={`url(#grad-indigo-${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset={strokeDashoffset * 0.5}
      />

      <line x1="16" y1="50" x2="84" y2="50" stroke={`url(#grad-shimmer-${id})`} strokeWidth="2.5" />

      <path
        d="M24,72 L34,50 L50,68 L66,50 L76,72"
        fill="none"
        stroke={`url(#grad-reflect-${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset={strokeDashoffset * 0.5}
      />

      <line x1="50" y1="2" x2="50" y2="10" stroke={`url(#grad-amber-${id})`} strokeWidth="2" />
      <line x1="50" y1="90" x2="50" y2="98" stroke={`url(#grad-amber-${id})`} strokeWidth="2" />
      <line x1="2" y1="50" x2="12" y2="50" stroke={`url(#grad-amber-${id})`} strokeWidth="2" />
      <line x1="88" y1="50" x2="98" y2="50" stroke={`url(#grad-amber-${id})`} strokeWidth="2" />
    </svg>
  );
};
