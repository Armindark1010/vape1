/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        vapor: {
          950: '#09090B',
          900: '#101014',
          850: '#141419',
          800: '#1a1a21',
          700: '#26262f',
          600: '#3a3a46',
        },
        neon: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          green: '#34d399',
          mint: '#6ee7b7',
          ice: '#67e8f9',
          blue: '#38bdf8',
          pink: '#f472b6',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', '-apple-system', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 24px rgba(168, 85, 247, 0.35), 0 0 64px rgba(168, 85, 247, 0.15)',
        'neon-green': '0 0 24px rgba(52, 211, 153, 0.35), 0 0 64px rgba(52, 211, 153, 0.15)',
        'neon-ice': '0 0 24px rgba(103, 232, 249, 0.35), 0 0 64px rgba(103, 232, 249, 0.15)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1.5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(168,85,247,.5)' },
          '50%': { opacity: '.75', boxShadow: '0 0 36px rgba(168,85,247,.8)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
}
