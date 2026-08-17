import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wall: '#EDEAE2',
        'wall-dim': '#E3DFD4',
        ink: '#211F1C',
        'ink-soft': '#524D44',
        moss: '#4A5D4E',
        brass: '#9C7A4A',
        line: '#D8D3C7',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-work-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;
