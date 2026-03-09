// Wunderland palette
export const W = {
  bgVoid: '#0f0b2e',
  bgSurface: '#130f35',
  bgElevated: '#1a1545',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  primaryDeep: '#3730a3',
  accent: '#f59e0b',
  accentLight: '#fbbf24',
  accentDark: '#d97706',
  emerald: '#10b981',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  textPrimary: '#f0eeff',
  textSecondary: 'rgba(240, 238, 255, 0.75)',
  textTertiary: 'rgba(240, 238, 255, 0.50)',
  borderGlass: 'rgba(255, 255, 255, 0.08)',
  borderGlow: 'rgba(99, 102, 241, 0.35)',
  // Sleek gradient backgrounds
  bgGradient:
    'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.10) 0%, transparent 60%), ' +
    'radial-gradient(ellipse at 50% 100%, rgba(6, 182, 212, 0.06) 0%, transparent 50%), ' +
    'radial-gradient(ellipse at 50% 40%, #1a1545 0%, #0f0b2e 50%, #060418 100%)',
} as const;

// AgentOS palette
export const AOS = {
  bgVoid: '#0c0c0f',
  bgSurface: '#141418',
  bgElevated: '#1c1c22',
  bgGradient:
    'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 60%), ' +
    'radial-gradient(ellipse at 50% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 50%), ' +
    'radial-gradient(ellipse at 50% 40%, #141418 0%, #0c0c0f 50%, #080809 100%)',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  accent: '#8b5cf6',
  accentLight: '#a78bfa',
  tertiary: '#ec4899',
  warm: '#f97316',
  cyan: '#06b6d4',
  emerald: '#10b981',
  rose: '#f43f5e',
  textPrimary: '#f0eeff',
  textSecondary: 'rgba(240, 238, 255, 0.75)',
  textTertiary: 'rgba(240, 238, 255, 0.50)',
  borderGlass: 'rgba(255, 255, 255, 0.08)',
  borderGlow: 'rgba(99, 102, 241, 0.25)',
  surface: 'rgba(99, 102, 241, 0.08)',
  surfaceBorder: 'rgba(99, 102, 241, 0.15)',
  gradientAccent: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
} as const;

// Rabbithole palette
export const RH = {
  void: '#030305',
  obsidian: '#1a1625',
  deepObsidian: '#08050a',
  holoCyan: '#00f5ff',
  holoMagenta: '#ff00f5',
  holoGold: '#ffd700',
  holoViolet: '#8b5cf6',
  holoEmerald: '#10ffb0',
  brandGold: '#c9a227',
  brandGoldLight: '#e8d48a',
  brandGoldDark: '#8b6914',
} as const;
