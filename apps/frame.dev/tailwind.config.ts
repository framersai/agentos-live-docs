import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paper-inspired palette
        paper: {
          50: '#fdfcfb',
          100: '#f9f6f2',
          200: '#f2ede5',
          300: '#e8dfd2',
          400: '#d4c4a8',
          500: '#bca584',
          600: '#9f8565',
          700: '#7f6a4f',
          800: '#6a5a44',
          900: '#5a4d3b',
        },
        ink: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c5c6ca',
          300: '#a0a2a8',
          400: '#7b7e86',
          500: '#60636b',
          600: '#4c4f56',
          700: '#3f4146',
          800: '#35363b',
          900: '#2e2f33',
          950: '#1a1b1d',
        },
        frame: {
          green: '#00C896',
          'green-light': '#00E6A8',
          'green-dark': '#00A67C',
        }
      },
      fontFamily: {
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ink-spread': 'inkSpread 1.5s ease-out forwards',
        'paper-fold': 'paperFold 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'frame-appear': 'frameAppear 1s ease-out',
        'pane-glow': 'paneGlow 2s ease-in-out infinite',
      },
      keyframes: {
        inkSpread: {
          '0%': { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: '0'
          },
          '100%': { 
            clipPath: 'circle(100% at 50% 50%)',
            opacity: '1'
          }
        },
        paperFold: {
          '0%': { transform: 'perspective(1000px) rotateX(-90deg)', opacity: '0' },
          '100%': { transform: 'perspective(1000px) rotateX(0)', opacity: '1' }
        },
        frameAppear: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        paneGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 200, 150, 0.1)',
            borderColor: 'rgba(0, 200, 150, 0.2)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 200, 150, 0.2)',
            borderColor: 'rgba(0, 200, 150, 0.4)'
          }
        }
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"%3E%3Cfilter id=\"paper\"%3E%3CfeTurbulence baseFrequency=\"0.04\" numOctaves=\"5\" /%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23paper)\" opacity=\"0.02\" /%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
export default config
