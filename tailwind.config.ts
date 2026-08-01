import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // MIDG3 pink brand palette
        blush: '#fff5fa',
        midg: {
          50: '#fff1f8',
          100: '#ffe4f1',
          200: '#ffc9e4',
          300: '#ff9ecd',
          400: '#ff5fac',
          500: '#ff2d8e', // primary hot pink
          600: '#ed0f74',
          700: '#c60660',
          800: '#a30852',
          900: '#870b47',
        },
        plum: '#3d0a2a',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(237, 15, 116, 0.25)',
        card: '0 6px 20px -8px rgba(61, 10, 42, 0.18)',
        glow: '0 0 0 4px rgba(255, 45, 142, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heart: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        heart: 'heart 0.35s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
