/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' based on your preference
  theme: {
    extend: {
      colors: {
        primary: { // As per your existing definition
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: { // Defined using HSL and your CSS variable --accent-hue
          300: 'hsl(var(--accent-hue), 70%, 70%)',
          400: 'hsl(var(--accent-hue), 75%, 60%)',
          500: 'hsl(var(--accent-hue), 80%, 50%)',
          600: 'hsl(var(--accent-hue), 85%, 45%)',
        },
        gray: { // Your custom gray shade
          850: '#182134',
          // Adding 950 for dark:via-gray-950, assuming it should be a neutral dark gray
          // If you prefer it to be bluish like slate, define it under slate instead.
          950: 'rgb(20, 20, 25)', // A very dark neutral gray
        },
        slate: { // Extending slate for non-standard shades used
          // Assuming --neutral-hue is similar to slate's hue
          750: 'rgb(38, 50, 64)', // For dark:bg-slate-750
          950: 'hsl(var(--neutral-hue), 25%, 10%)', // For dark:via-slate-950 (if preferred over gray.950)
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',    /* 12px */
        'sm': '0.875rem',   /* 14px */
        'md': '1rem',       /* 16px */
        'base': '1rem',     /* 16px (Tailwind default) */
        'lg': '1.125rem',   /* 18px */
        'xl': '1.25rem',    /* 20px */
      },
      spacing: {
        '18': '4.5rem', // Your custom spacing
      },
      animation: {
        // Animations from your main.css utilities layer
        'pulse-subtle': 'pulse-subtle-anim 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-bg': 'gradient-bg-anim 10s ease infinite',
        // Animations from your previously provided config
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'voice-pulse': 'voicePulseKeyframes 2s infinite ease-in-out',
        'loading-dots': 'loadingDotsKeyframes 1.4s ease-in-out infinite both',
        'dot-loader': 'dotLoaderAnimKeyframes 1.4s ease-in-out infinite both', // if you want animate-dot-loader
        'shimmer': 'shimmerKeyframes 2s infinite linear',
        'gradient-shift': 'gradientShiftKeyframes 10s ease infinite',
        'bounce-subtle': 'bounceSubtleKeyframes 1.5s infinite ease-in-out',
        'wiggle': 'wiggleKeyframes 1.5s ease-in-out infinite',
      },
      keyframes: {
        // Keyframes for animations from main.css utilities layer
        'pulse-subtle-anim': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.6' },
        },
        'gradient-bg-anim': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Keyframes from your previously provided config (ensure names match animation values)
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        voicePulseKeyframes: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        loadingDotsKeyframes: { // Keyframes for 'loading-dots' animation
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' }, // As per one of your definitions
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        dotLoaderAnimKeyframes: { // Keyframes for 'dot-loader' animation (from main.css & your config)
           '0%, 80%, 100%': { transform: 'scale(0.5)', opacity: '0.5' },
           '40%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmerKeyframes: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradientShiftKeyframes: { // Used by 'gradient-shift' animation
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceSubtleKeyframes: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        wiggleKeyframes: {
          '0%, 100%': { transform: 'rotateZ(0)' },
          '15%': { transform: 'rotateZ(-8deg)' },
          '30%': { transform: 'rotateZ(6deg)' },
          '45%': { transform: 'rotateZ(-6deg)' },
          '60%': { transform: 'rotateZ(4deg)' },
          '75%': { transform: 'rotateZ(-2deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add any other Tailwind plugins you might be using
  ],
}