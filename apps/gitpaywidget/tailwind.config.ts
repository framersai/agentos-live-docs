import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        gpw: {
          primary: '#8b5cf6',
          secondary: '#ec4899',
          tertiary: '#7c3aed',
          accent: '#fbbf24',
          ink: {
            50: '#f5f3ff',
            100: '#ede9fe',
            600: '#4c1d95',
            900: '#2e1065',
          },
        },
      },
      fontFamily: {
        display: ['Caveat', 'cursive'],
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gpw-card': '0 25px 70px rgba(124, 58, 237, 0.15)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.8s ease forwards',
      },
      backgroundImage: {
        'gpw-gradient': 'linear-gradient(120deg, #8b5cf6 0%, #ec4899 60%, #fbbf24 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
export default config;
