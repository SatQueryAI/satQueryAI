/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#06090e',
          900: '#0a0e14',
          850: '#0f151e',
          800: '#141c26',
          750: '#1a2432',
          700: '#222f40',
          600: '#33445c',
          border: '#1c2838',
          borderLight: '#2a3a4e',
          active: '#0e2233',
        },
        geo: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          sky: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'reticle': '0 0 0 1px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
