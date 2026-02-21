import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'obsidian-bg': '#121212',
        'obsidian-fg': '#ffffff',
        'obsidian-sidebar': '#1a1a1a',
        'obsidian-border': '#2d2d2d',
        'obsidian-accent': '#7c3aed',
        'obsidian-hover': '#2d2d2d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
