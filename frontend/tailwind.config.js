/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      },
      colors: {
        primary: {
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
        gray: {
          850: '#182134',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: { // Added 'md' here
        'xs': '0.75rem',   /* 12px */
        'sm': '0.875rem',  /* 14px */
        'md': '1rem',      /* 16px, equivalent to text-base */
        'base': '1rem',    /* 16px (Tailwind default) */
        'lg': '1.125rem',  /* 18px */
        'xl': '1.25rem',   /* 20px */
        // Add other sizes as needed
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'voice-pulse': 'voice-pulse 2s infinite ease-in-out',
        'loading-dots': 'loading-dots 1.4s ease-in-out infinite both', // Note: keyframe name is 'loading-dots' but main.css uses 'dot-loader-anim'
        'shimmer': 'shimmer 2s infinite linear',
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'bounce-subtle': 'bounce-subtle 1.5s infinite ease-in-out',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
      },
      keyframes: {
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
        'voice-pulse': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'loading-dots': { // For animate-loading-dots
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' }, // Original uses scale(0)
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        // Ensure 'dot-loader-anim' from main.css @layer utilities is consistent or defined here if used as animate-dot-loader-anim
        'dot-loader-anim': { // As defined in main.css @layer utilities for .dots-loader
            '0%, 80%, 100%': { transform: 'scale(0.5)', opacity: '0.5' },
            '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'wiggle': {
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
  ],
}