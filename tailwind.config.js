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
          950: '#070709',
          900: '#0e0e14',
          850: '#14141e',
          800: '#1c1c28',
          700: '#29293a',
          600: '#3e3e56',
        },
        neon: {
          purple: '#c084fc',
          violet: '#a855f7',
          green: '#34d399',
          emerald: '#10b981',
          ice: '#38bdf8',
          cyan: '#22d3ee',
          pink: '#f472b6',
          rose: '#fb7185',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', '-apple-system', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 24px rgba(168, 85, 247, 0.35), 0 0 50px rgba(168, 85, 247, 0.15)',
        'neon-green': '0 0 24px rgba(52, 211, 153, 0.35), 0 0 50px rgba(52, 211, 153, 0.15)',
        'neon-ice': '0 0 24px rgba(56, 189, 248, 0.35), 0 0 50px rgba(56, 189, 248, 0.15)',
        'neon-pink': '0 0 24px rgba(244, 114, 182, 0.35), 0 0 50px rgba(244, 114, 182, 0.15)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
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
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 20px rgba(168,85,247,.45)' },
          '50%': { opacity: '.85', transform: 'scale(1.02)', boxShadow: '0 0 35px rgba(168,85,247,.75)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 16s linear infinite',
      },
    },
  },
  plugins: [],
}
