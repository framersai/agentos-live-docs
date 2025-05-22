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
        '18': '4.5rem', // Defines 18 for w-18, h-18, p-18, m-18, etc. (Value: 72px)
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
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        // Animations from main.css, now usable as utilities e.g., animate-voice-pulse
        'voice-pulse': 'voice-pulse 2s infinite ease-in-out',
        'loading-dots': 'loading-dots 1.4s ease-in-out infinite both',
        'shimmer': 'shimmer 2s infinite linear', // Adjusted duration and timing
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
        'loading-dots': {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': { // A common shimmer effect
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
    // Consider adding require('@tailwindcss/forms') for better default form styling if needed
  ],
}