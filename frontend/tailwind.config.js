/* tailwindcss-intellisense-disable */
// File: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

/**
 * @file tailwind.config.js
 * @description Tailwind CSS configuration for the "Ephemeral Harmony" design system.
 * Integrates with SCSS-driven CSS custom properties for dynamic theming.
 * Defines core typography, extended shadows for neomorphic/holographic effects,
 * and new animations, providing a rich utility set for the application.
 * @version 2.0.0
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Relies on a 'dark' class on the html element, managed by ThemeManager.ts
  theme: {
    extend: {
      colors: {
        // Base color definitions that will be overridden by CSS custom properties from SCSS themes
        // These act as fallbacks or defaults if CSS vars are not loaded (should not happen in practice)
        'primary': 'hsl(var(--color-accent-primary-h, 260) var(--color-accent-primary-s, 75%) var(--color-accent-primary-l, 60%) / <alpha-value>)',
        'primary-focus': 'hsl(var(--color-accent-primary-h, 260) calc(var(--color-accent-primary-s, 75%) + 5%) calc(var(--color-accent-primary-l, 60%) + 8%) / <alpha-value>)',
        'primary-content': 'hsl(var(--color-text-on-primary-h, 0) var(--color-text-on-primary-s, 0%) var(--color-text-on-primary-l, 100%) / <alpha-value>)', // For text on primary backgrounds

        'secondary': 'hsl(var(--color-accent-secondary-h, 180) var(--color-accent-secondary-s, 80%) var(--color-accent-secondary-l, 55%) / <alpha-value>)',
        'secondary-focus': 'hsl(var(--color-accent-secondary-h, 180) calc(var(--color-accent-secondary-s, 80%) + 5%) calc(var(--color-accent-secondary-l, 55%) + 8%) / <alpha-value>)',
        'secondary-content': 'hsl(var(--color-text-on-secondary-h, 220) var(--color-text-on-secondary-s, 15%) var(--color-text-on-secondary-l, 10%) / <alpha-value>)',

        'accent': 'hsl(var(--color-accent-primary-h, 260) var(--color-accent-primary-s, 75%) var(--color-accent-primary-l, 60%) / <alpha-value>)', // Alias for primary by default

        'neutral': 'hsl(var(--color-bg-secondary-h, 220) var(--color-bg-secondary-s, 15%) var(--color-bg-secondary-l, 88%) / <alpha-value>)', // A generic neutral
        'neutral-focus': 'hsl(var(--color-bg-secondary-h, 220) var(--color-bg-secondary-s, 15%) var(--color-bg-secondary-l, 80%) / <alpha-value>)',

        'base-100': 'hsl(var(--color-bg-primary-h, 0) var(--color-bg-primary-s, 0%) var(--color-bg-primary-l, 100%) / <alpha-value>)',       // Primary background
        'base-200': 'hsl(var(--color-bg-secondary-h, 0) var(--color-bg-secondary-s, 0%) var(--color-bg-secondary-l, 95%) / <alpha-value>)',     // Secondary background (cards, surfaces)
        'base-300': 'hsl(var(--color-bg-tertiary-h, 0) var(--color-bg-tertiary-s, 0%) var(--color-bg-tertiary-l, 90%) / <alpha-value>)',      // Tertiary background (elevated elements)
        'base-content': 'hsl(var(--color-text-primary-h, 0) var(--color-text-primary-s, 0%) var(--color-text-primary-l, 10%) / <alpha-value>)', // Primary text color

        'info': 'hsl(var(--color-info-h, 190) var(--color-info-s, 80%) var(--color-info-l, 55%) / <alpha-value>)',
        'success': 'hsl(var(--color-success-h, 145) var(--color-success-s, 70%) var(--color-success-l, 45%) / <alpha-value>)',
        'warning': 'hsl(var(--color-warning-h, 40) var(--color-warning-s, 95%) var(--color-warning-l, 55%) / <alpha-value>)',
        'error': 'hsl(var(--color-error-h, 0) var(--color-error-s, 85%) var(--color-error-l, 58%) / <alpha-value>)',

        // Glassmorphism colors (to be defined by themes)
        'glass-bg': 'var(--color-bg-glass, hsla(220, 25%, 95%, 0.5))', // Fallback
        'glass-border': 'var(--color-border-glass, hsla(220, 25%, 80%, 0.3))', // Fallback

        // Voice visualization specific colors
        'voice-user': 'hsl(var(--color-voice-user-h, 270) var(--color-voice-user-s, 90%) var(--color-voice-user-l, 70%) / <alpha-value>)',
        'voice-ai': 'hsl(var(--color-voice-ai-h, 180) var(--color-voice-ai-s, 90%) var(--color-voice-ai-l, 60%) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans, Inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        mono: ['var(--font-mono, JetBrains Mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        display: ['var(--font-display, Lexend Deca)', 'var(--font-sans, Inter)', 'sans-serif'], // Lexend Deca as primary display
      },
      borderRadius: {
        'xs': 'var(--radius-xs, 0.125rem)',
        'sm': 'var(--radius-sm, 0.25rem)',
        'md': 'var(--radius-md, 0.375rem)',
        'lg': 'var(--radius-lg, 0.5rem)',
        'xl': 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
        '3xl': 'var(--radius-3xl, 1.5rem)',
        'full': 'var(--radius-full, 9999px)',
        'holo': 'var(--radius-holo, 0.625rem)', // Custom radius for holographic elements
      },
      spacing: { // Matches SCSS variables
        'spacing-unit': 'var(--spacing-unit, 0.25rem)', // 4px
        'header-h': 'var(--header-height, 4.5rem)',
        'footer-h': 'var(--footer-height, 3.5rem)',
        'chat-log-h': 'var(--chat-log-height, 200px)',
      },
      height: {
        'header': 'var(--header-height, 4.5rem)',
        'footer': 'var(--footer-height, 3.5rem)',
      },
      minHeight: {
        'header': 'var(--header-height, 4.5rem)',
        'footer': 'var(--footer-height, 3.5rem)',
      },
      boxShadow: {
        // Neomorphic shadows (theme-dependent via CSS vars in SCSS)
        'neo-sm': 'var(--shadow-neo-sm)',
        'neo-md': 'var(--shadow-neo-md)',
        'neo-lg': 'var(--shadow-neo-lg)',
        'neo-inset-sm': 'var(--shadow-neo-inset-sm)',
        'neo-inset-md': 'var(--shadow-neo-inset-md)',
        // Holographic glows
        'holo-glow-sm': '0 0 8px 1px var(--color-accent-glow, hsla(180, 90%, 60%, 0.4))',
        'holo-glow-md': '0 0 15px 3px var(--color-accent-glow, hsla(180, 90%, 60%, 0.5))',
        'holo-glow-lg': '0 0 25px 5px var(--color-accent-glow, hsla(180, 90%, 60%, 0.6))',
        // Standard shadows for depth (can also be theme-dependent)
        'depth-sm': '0 2px 4px hsla(var(--shadow-color-h, 0) var(--shadow-color-s, 0%) var(--shadow-color-l, 0%) / var(--shadow-opacity-sm, 0.05))',
        'depth-md': '0 5px 10px hsla(var(--shadow-color-h, 0) var(--shadow-color-s, 0%) var(--shadow-color-l, 0%) / var(--shadow-opacity-md, 0.1))',
        'depth-lg': '0 10px 20px hsla(var(--shadow-color-h, 0) var(--shadow-color-s, 0%) var(--shadow-color-l, 0%) / var(--shadow-opacity-lg, 0.15))',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
      animation: {
        // Core UI
        'fade-in': 'fadeIn var(--duration-smooth) var(--ease-out-quad) forwards',
        'fade-out': 'fadeOut var(--duration-smooth) var(--ease-out-quad) forwards',
        'slide-in-up': 'slideInUp var(--duration-movement) var(--ease-out-expo) forwards',
        'slide-in-down': 'slideInDown var(--duration-movement) var(--ease-out-expo) forwards',
        'subtle-pulse': 'subtlePulse var(--duration-pulse-slow) var(--ease-in-out-sine) infinite',
        'subtle-glow': 'subtleGlow var(--duration-pulse-medium) var(--ease-in-out-sine) infinite alternate',
        // Holographic & Ephemeral
        'holo-shimmer': 'holoShimmer var(--duration-pulse-long) linear infinite',
        'ephemeral-appear': 'ephemeralAppear var(--duration-movement) var(--ease-out-quint) forwards',
        'ephemeral-vanish': 'ephemeralVanish var(--duration-movement) var(--ease-in-quint) forwards',
        // Voice Visualization
        'voice-aura-pulse': 'voiceAuraPulse var(--duration-pulse-medium) var(--ease-out-sine) infinite',
        'voice-light-streak': 'voiceLightStreak var(--duration-pulse-fast) linear infinite',
      },
      keyframes: {
        fadeIn: { 'from': { opacity: '0' }, 'to': { opacity: '1' } },
        fadeOut: { 'from': { opacity: '1' }, 'to': { opacity: '0' } },
        slideInUp: { 'from': { opacity: '0', transform: 'translateY(20px)' }, 'to': { opacity: '1', transform: 'translateY(0)' } },
        slideInDown: { 'from': { opacity: '0', transform: 'translateY(-20px)' }, 'to': { opacity: '1', transform: 'translateY(0)' } },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 'var(--opacity-start, 1)' },
          '50%': { transform: 'scale(var(--scale-pulse, 1.02))', opacity: 'var(--opacity-pulse, 0.85)' },
        },
        subtleGlow: { // For text or small elements
          'from': { textShadow: '0 0 4px var(--color-accent-glow)' },
          'to': { textShadow: '0 0 10px var(--color-accent-glow), 0 0 1px var(--color-accent-glow)' },
        },
        holoShimmer: { // For background gradients or borders
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        ephemeralAppear: {
          'from': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          'to': { opacity: 'var(--opacity-final, 0.85)', transform: 'scale(1) translateY(0)' }
        },
        ephemeralVanish: {
          'from': { opacity: 'var(--opacity-start, 0.85)', transform: 'scale(1) translateY(0)' },
          'to': { opacity: '0', transform: 'scale(0.9) translateY(-10px)' }
        },
        voiceAuraPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { opacity: 'var(--voice-pulse-opacity, 0.5)' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        voiceLightStreak: { // Example for more dynamic visualization
          '0%': { transform: 'translateY(-100%)', opacity: '0.7' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      backgroundImage: {
        'holo-grid-pattern': 'var(--bg-holo-grid-pattern)', // Defined in SCSS
        'noise-texture': 'var(--bg-noise-texture)', // Defined in SCSS
      },
      transitionTimingFunction: {
        'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-in-out-sine': 'cubic-bezier(0.37, 0, 0.63, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    plugin(function ({ addUtilities, theme, e }) {
      const iconSizes = {
        '.icon-xs': { width: theme('spacing')['3.5'], height: theme('spacing')['3.5'] },
        '.icon-sm': { width: theme('spacing')['4'], height: theme('spacing')['4'] },
        '.icon-base': { width: theme('spacing')['5'], height: theme('spacing')['5'] },
        '.icon-lg': { width: theme('spacing')['6'], height: theme('spacing')['6'] },
        '.icon-xl': { width: theme('spacing')['8'], height: theme('spacing')['8'] },
      };
      addUtilities(iconSizes);

      const motionSafeUtilities = {
        '.motion-safe-transition': { '@media (prefers-reduced-motion: no-preference)': { transitionProperty: theme('transitionProperty.DEFAULT'), transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'), transitionDuration: theme('transitionDuration.DEFAULT') } },
      };
      addUtilities(motionSafeUtilities);
    }),
  ],
};