import React from 'react';

interface Props {
  type: string;
  size?: number;
  color?: string;
  drawProgress?: number; // 0 = hidden, 1 = fully drawn
}

export const EcosystemIconSvg: React.FC<Props> = ({
  type,
  size = 28,
  color = '#818cf8',
  drawProgress = 1,
}) => {
  const id = `eco-${type}`;
  const dash = 200;
  const offset = dash * (1 - drawProgress);

  const common = {
    strokeDasharray: dash,
    strokeDashoffset: offset,
  };

  switch (type) {
    // ─── LLM Providers ─────────────────────────────────────────────

    case 'openai':
      // Hexagonal aperture iris
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
          </defs>
          <path
            d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
            fill={`url(#${id}-rg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-rg)`}
            strokeWidth="1.2"
            {...common}
          />
          <path
            d="M12 2L16 9.5H8L12 2Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.7}
            {...common}
          />
          <path
            d="M20 7L16 14.5L16 9.5L20 7Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.6}
            {...common}
          />
          <path
            d="M20 17L12 14.5H16L20 17Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.5}
            {...common}
          />
          <path
            d="M12 22L8 14.5H12L12 22Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.6}
            {...common}
          />
          <path
            d="M4 17L8 9.5L8 14.5L4 17Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.5}
            {...common}
          />
          <path
            d="M4 7L12 9.5H8L4 7Z"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            opacity={0.7}
            {...common}
          />
          <circle
            cx="12"
            cy="12"
            r="2.5"
            fill="#34d399"
            fillOpacity={0.3}
            stroke="#34d399"
            strokeWidth="0.8"
          />
        </svg>
      );

    case 'anthropic':
      // Layered safety shield with chevrons
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L21 6V13C21 17.5 17 21 12 22C7 21 3 17.5 3 13V6L12 2Z"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.12}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            strokeLinejoin="round"
            {...common}
          />
          <path
            d="M12 5L18 8V13C18 16 15.5 18.5 12 19.5C8.5 18.5 6 16 6 13V8L12 5Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            opacity={0.5}
          />
          <path
            d="M8.5 12L11 14.5L15.5 10"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
        </svg>
      );

    case 'ollama':
      // Llama head silhouette
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path
            d="M8 3C6 3 5 5 5 7V10C4 10 3 11 3 12V16C3 18 5 20 7 20H9C10 20 11 19 11 18V15H13V18C13 19 14 20 15 20H17C19 20 21 18 21 16V12C21 11 20 10 19 10V7C19 5 18 3 16 3C15 3 14 4 14 5V8H10V5C10 4 9 3 8 3Z"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            strokeLinejoin="round"
            {...common}
          />
          <circle cx="9" cy="11" r="1" fill="#f97316" />
          <circle cx="15" cy="11" r="1" fill="#f97316" />
        </svg>
      );

    case 'groq':
      // Lightning bolt on chip
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.12}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          {/* Circuit traces */}
          <line x1="2" y1="9" x2="5" y2="9" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          <line x1="2" y1="12" x2="5" y2="12" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          <line x1="2" y1="15" x2="5" y2="15" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          <line x1="19" y1="9" x2="22" y2="9" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          <line x1="19" y1="12" x2="22" y2="12" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          <line x1="19" y1="15" x2="22" y2="15" stroke="#06b6d4" strokeWidth="0.8" opacity={0.5} />
          {/* Lightning bolt */}
          <path
            d="M13 7L10 12H14L11 17"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
        </svg>
      );

    case 'mistral':
      // Wind spiral
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M3 8H16C18.2 8 20 6.2 20 4"
            fill="none"
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.5"
            strokeLinecap="round"
            {...common}
          />
          <path
            d="M3 12H19C20.7 12 22 13.3 22 15C22 16.7 20.7 18 19 18"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.7}
            {...common}
          />
          <path
            d="M3 16H14C15.7 16 17 17.3 17 19C17 20.7 15.7 22 14 22"
            fill="none"
            stroke="#ec4899"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.5}
            {...common}
          />
        </svg>
      );

    case 'google':
      // 4-color diamond
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L17 7H12V2Z" fill="#4285F4" fillOpacity={0.8} />
          <path d="M17 7L22 12L17 17V7Z" fill="#EA4335" fillOpacity={0.8} />
          <path d="M12 17L17 17L12 22V17Z" fill="#FBBC05" fillOpacity={0.8} />
          <path d="M2 12L7 7V17L2 12Z" fill="#34A853" fillOpacity={0.8} />
          <path d="M7 7H12V12L7 7Z" fill="#4285F4" fillOpacity={0.4} />
          <path d="M12 12V17H17L12 12Z" fill="#EA4335" fillOpacity={0.4} />
          <path d="M7 17H12V22L7 17Z" fill="#FBBC05" fillOpacity={0.4} />
          <path d="M7 7L12 12L7 17V7Z" fill="#34A853" fillOpacity={0.4} />
          <path
            d="M2 12L7 7H7L12 12L7 17L2 12Z"
            fill="none"
            stroke="#34A853"
            strokeWidth="0.5"
            opacity={0.5}
          />
        </svg>
      );

    case 'deepseek':
      // Deep ocean waves
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.1}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          <path
            d="M4 10Q7 7 10 10T16 10T22 10"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={0.8}
          />
          <path
            d="M2 13Q5 10 8 13T14 13T20 13"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.6}
          />
          <path
            d="M4 16Q7 13 10 16T16 16T22 16"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.4}
          />
        </svg>
      );

    // ─── Messaging Channels ────────────────────────────────────────

    case 'telegram':
      // Paper plane
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${id}-rg`} cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={`url(#${id}-rg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-rg)`}
            strokeWidth="1"
            {...common}
          />
          <path
            d="M5 12L10 14L18 6"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
          <path
            d="M10 14L11 19L14 15L18 6"
            fill="#0ea5e9"
            fillOpacity={0.3}
            stroke="#0ea5e9"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M10 14L14 15" fill="none" stroke="#0ea5e9" strokeWidth="0.8" />
        </svg>
      );

    case 'discord':
      // Game controller chat bubble
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#5865F2" />
            </linearGradient>
          </defs>
          <path
            d="M4 4H20C21 4 22 5 22 6V16C22 17 21 18 20 18H14L10 21V18H4C3 18 2 17 2 16V6C2 5 3 4 4 4Z"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            strokeLinejoin="round"
            {...common}
          />
          <circle cx="9" cy="11" r="1.5" fill="#5865F2" fillOpacity={0.6} />
          <circle cx="15" cy="11" r="1.5" fill="#5865F2" fillOpacity={0.6} />
          <path
            d="M8 7.5C8 7.5 9.5 7 12 7C14.5 7 16 7.5 16 7.5"
            fill="none"
            stroke="#5865F2"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.5}
          />
          <path
            d="M8 14.5C8 14.5 9.5 15.5 12 15.5C14.5 15.5 16 14.5 16 14.5"
            fill="none"
            stroke="#5865F2"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.5}
          />
        </svg>
      );

    case 'whatsapp':
      // Phone in speech bubble
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </radialGradient>
          </defs>
          <path
            d="M12 2C6.5 2 2 6.5 2 12C2 14 2.6 15.8 3.6 17.3L2 22L6.8 20.4C8.2 21.3 10 21.8 12 21.8C17.5 21.8 22 17.3 22 11.8C22 6.5 17.5 2 12 2Z"
            fill={`url(#${id}-rg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-rg)`}
            strokeWidth="1.2"
            {...common}
          />
          <path
            d="M9 8C9 7.5 9.5 7 10 7H14C14.5 7 15 7.5 15 8V16C15 16.5 14.5 17 14 17H10C9.5 17 9 16.5 9 16V8Z"
            fill="none"
            stroke="#25D366"
            strokeWidth="1"
            opacity={0.7}
          />
          <line
            x1="11"
            y1="15.5"
            x2="13"
            y2="15.5"
            stroke="#25D366"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'slack':
      // Hash with 4 colors
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Vertical bars */}
          <rect x="8" y="3" width="2.5" height="8" rx="1.25" fill="#E01E5A" fillOpacity={0.8} />
          <rect x="13.5" y="3" width="2.5" height="8" rx="1.25" fill="#36C5F0" fillOpacity={0.8} />
          {/* Horizontal bars */}
          <rect x="3" y="8" width="8" height="2.5" rx="1.25" fill="#2EB67D" fillOpacity={0.8} />
          <rect x="3" y="13.5" width="8" height="2.5" rx="1.25" fill="#ECB22E" fillOpacity={0.8} />
          {/* Extended pieces */}
          <rect x="13.5" y="13" width="8" height="2.5" rx="1.25" fill="#E01E5A" fillOpacity={0.6} />
          <rect x="13.5" y="8" width="8" height="2.5" rx="1.25" fill="#2EB67D" fillOpacity={0.6} />
          <rect x="8" y="13" width="2.5" height="8" rx="1.25" fill="#36C5F0" fillOpacity={0.6} />
          <rect x="13.5" y="13" width="2.5" height="8" rx="1.25" fill="#ECB22E" fillOpacity={0.6} />
        </svg>
      );

    case 'email':
      // Envelope with seal
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="2"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.12}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          <path
            d="M2 5L12 13L22 5"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
          <circle
            cx="18"
            cy="15"
            r="3"
            fill="#f59e0b"
            fillOpacity={0.25}
            stroke="#f59e0b"
            strokeWidth="0.8"
          />
          <path
            d="M17 15L18 16L19.5 14"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'signal':
      // Shield with lock
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A76F0" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L20 6V12C20 17 16.5 20.5 12 22C7.5 20.5 4 17 4 12V6L12 2Z"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.12}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            strokeLinejoin="round"
            {...common}
          />
          <rect
            x="9.5"
            y="11"
            width="5"
            height="4"
            rx="1"
            fill="none"
            stroke="#3A76F0"
            strokeWidth="1"
          />
          <path
            d="M10.5 11V9.5C10.5 8.5 11.2 7.5 12 7.5C12.8 7.5 13.5 8.5 13.5 9.5V11"
            fill="none"
            stroke="#3A76F0"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="12" cy="13" r="0.7" fill="#3A76F0" />
        </svg>
      );

    case 'twitter':
      // Stylized X
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.08}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1"
            {...common}
          />
          <path
            d="M7 7L11 12L7 17"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
            {...common}
          />
          <path
            d="M17 7L13 12L17 17"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
            {...common}
          />
          <line x1="11" y1="12" x2="13" y2="12" stroke="#cbd5e1" strokeWidth="1" opacity={0.5} />
        </svg>
      );

    case 'reddit':
      // Antenna circle alien head
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#FF4500" />
            </radialGradient>
          </defs>
          <circle
            cx="12"
            cy="14"
            r="8"
            fill={`url(#${id}-rg)`}
            fillOpacity={0.15}
            stroke={`url(#${id}-rg)`}
            strokeWidth="1.2"
            {...common}
          />
          <circle cx="9" cy="13" r="1.2" fill="#FF4500" fillOpacity={0.6} />
          <circle cx="15" cy="13" r="1.2" fill="#FF4500" fillOpacity={0.6} />
          <path
            d="M9.5 16C10 17 11 17.5 12 17.5C13 17.5 14 17 14.5 16"
            fill="none"
            stroke="#FF4500"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Antenna */}
          <line
            x1="12"
            y1="6"
            x2="16"
            y2="3"
            stroke="#FF4500"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle
            cx="16.5"
            cy="2.5"
            r="1.2"
            fill="#FF4500"
            fillOpacity={0.4}
            stroke="#FF4500"
            strokeWidth="0.6"
          />
        </svg>
      );

    case 'matrix':
      // Connected dot grid
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Connection lines */}
          <line x1="6" y1="6" x2="12" y2="6" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="12" y1="6" x2="18" y2="6" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="6" y1="12" x2="12" y2="12" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="12" y1="12" x2="18" y2="12" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="6" y1="18" x2="12" y2="18" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="12" y1="18" x2="18" y2="18" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="6" y1="6" x2="6" y2="12" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="12" y1="6" x2="12" y2="12" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="18" y1="6" x2="18" y2="12" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="6" y1="12" x2="6" y2="18" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="12" y1="12" x2="12" y2="18" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          <line x1="18" y1="12" x2="18" y2="18" stroke="#10b981" strokeWidth="0.6" opacity={0.4} />
          {/* Diagonal connections */}
          <line x1="6" y1="6" x2="12" y2="12" stroke="#10b981" strokeWidth="0.4" opacity={0.3} />
          <line x1="12" y1="12" x2="18" y2="18" stroke="#10b981" strokeWidth="0.4" opacity={0.3} />
          {/* Dots */}
          <circle cx="6" cy="6" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.5} />
          <circle cx="12" cy="6" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.7} />
          <circle cx="18" cy="6" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.5} />
          <circle cx="6" cy="12" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.7} />
          <circle cx="12" cy="12" r="2.5" fill={`url(#${id}-lg)`} fillOpacity={0.9} />
          <circle cx="18" cy="12" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.7} />
          <circle cx="6" cy="18" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.5} />
          <circle cx="12" cy="18" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.7} />
          <circle cx="18" cy="18" r="2" fill={`url(#${id}-lg)`} fillOpacity={0.5} />
        </svg>
      );

    // ─── Skills / Tools ────────────────────────────────────────────

    case 'web-scraper':
      // Globe with magnifying glass
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <circle
            cx="10"
            cy="10"
            r="8"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.1}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          {/* Globe lines */}
          <ellipse
            cx="10"
            cy="10"
            rx="3.5"
            ry="8"
            fill="none"
            stroke="#818cf8"
            strokeWidth="0.6"
            opacity={0.4}
          />
          <line x1="2" y1="10" x2="18" y2="10" stroke="#818cf8" strokeWidth="0.6" opacity={0.4} />
          <line x1="10" y1="2" x2="10" y2="18" stroke="#818cf8" strokeWidth="0.6" opacity={0.4} />
          {/* Magnifying glass */}
          <circle cx="16" cy="16" r="3" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <line
            x1="18.5"
            y1="18.5"
            x2="22"
            y2="22"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'deep-research':
      // Stacked documents with spark
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          {/* Back doc */}
          <rect
            x="6"
            y="2"
            width="14"
            height="18"
            rx="2"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.08}
            stroke="#06b6d4"
            strokeWidth="0.8"
            opacity={0.4}
          />
          {/* Front doc */}
          <rect
            x="4"
            y="4"
            width="14"
            height="18"
            rx="2"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.12}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          {/* Text lines */}
          <line x1="7" y1="9" x2="15" y2="9" stroke="#06b6d4" strokeWidth="0.8" opacity={0.4} />
          <line x1="7" y1="12" x2="13" y2="12" stroke="#06b6d4" strokeWidth="0.8" opacity={0.4} />
          <line x1="7" y1="15" x2="14" y2="15" stroke="#06b6d4" strokeWidth="0.8" opacity={0.4} />
          {/* Sparkle */}
          <path
            d="M19 3L19.5 5L21 5.5L19.5 6L19 8L18.5 6L17 5.5L18.5 5L19 3Z"
            fill="#06b6d4"
            fillOpacity={0.7}
          />
        </svg>
      );

    case 'coding-agent':
      // Terminal brackets </>
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="3"
            width="20"
            height="18"
            rx="3"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.1}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          {/* Terminal header dots */}
          <circle cx="5.5" cy="6" r="0.8" fill="#ff5f56" fillOpacity={0.6} />
          <circle cx="8" cy="6" r="0.8" fill="#ffbd2e" fillOpacity={0.6} />
          <circle cx="10.5" cy="6" r="0.8" fill="#27c93f" fillOpacity={0.6} />
          {/* </> brackets */}
          <path
            d="M8 11L5 14L8 17"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
          <path
            d="M16 11L19 14L16 17"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...common}
          />
          <line
            x1="13"
            y1="10"
            x2="11"
            y2="18"
            stroke="#d97706"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.6}
          />
        </svg>
      );

    case 'summarize':
      // Document with sparkle star
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-lg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            fill={`url(#${id}-lg)`}
            fillOpacity={0.1}
            stroke={`url(#${id}-lg)`}
            strokeWidth="1.2"
            {...common}
          />
          {/* Compressed text lines */}
          <line x1="7" y1="7" x2="17" y2="7" stroke="#10b981" strokeWidth="0.8" opacity={0.5} />
          <line x1="7" y1="10" x2="14" y2="10" stroke="#10b981" strokeWidth="0.8" opacity={0.4} />
          <line x1="7" y1="13" x2="15" y2="13" stroke="#10b981" strokeWidth="0.8" opacity={0.3} />
          {/* Arrow pointing down (summarize) */}
          <path
            d="M12 15V19M12 19L10 17M12 19L14 17"
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sparkle */}
          <path
            d="M18 2L18.5 4L20 4.5L18.5 5L18 7L17.5 5L16 4.5L17.5 4L18 2Z"
            fill="#10b981"
            fillOpacity={0.8}
          />
        </svg>
      );

    default:
      // Fallback: generic gradient circle with initial
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={`url(#${id}-rg)`}
            stroke={color}
            strokeWidth="1.2"
            {...common}
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill={color}
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {type.charAt(0).toUpperCase()}
          </text>
        </svg>
      );
  }
};
