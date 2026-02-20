/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dccfff',
          300: '#c4a8ff',
          400: '#a875ff',
          500: '#8b3dff',
          600: '#7c1aff',
          700: '#6d0aeb',
          800: '#5b0cc5',
          900: '#4c0ea1',
          950: '#2d046e',
        },
        fire: { 400: '#fb923c', 500: '#f97316', 600: '#ea580c' },
        water: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
        earth: { 400: '#a3e635', 500: '#84cc16', 600: '#65a30d' },
        wind: { 400: '#67e8f9', 500: '#22d3ee', 600: '#06b6d4' },
        light: { 400: '#fde047', 500: '#eab308', 600: '#ca8a04' },
        shadow: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 0.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'coin-fly': 'coinFly 1s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        coinFly: {
          '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '100%': { opacity: 0, transform: 'translateY(-60px) scale(0.5)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 61, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 61, 255, 0.8), 0 0 40px rgba(139, 61, 255, 0.3)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
