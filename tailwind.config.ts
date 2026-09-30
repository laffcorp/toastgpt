import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050508',
        coil: '#ff6a1a',
        oled: '#7cffb2',
        chrome: '#c9d2dc',
        guilt: '#ff4d6d'
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        coil: '0 0 40px rgba(255,106,26,0.35)',
        oled: '0 0 24px rgba(124,255,178,0.28)'
      }
    }
  },
  plugins: []
};

export default config;
