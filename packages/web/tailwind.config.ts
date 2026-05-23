import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bold sticker palette
        cream: '#FFF6E5',
        ink: '#0C0C0C',
        'ink-muted': '#3A3A3A',
        // High-saturation accent colors
        cyan: '#7DDCFF',
        pink: '#FF7AB6',
        lime: '#C7F356',
        yellow: '#FFD43B',
        blue: '#5C7BFF',
        red: '#FF6B5A',
        // Category colors
        travel: '#BA7517',
        'travel-bg': '#FAEEDA',
        food: '#993C1D',
        'food-bg': '#FAECE7',
        adventure: '#534AB7',
        'adventure-bg': '#EEEDFE',
        wellness: '#0F6E56',
        'wellness-bg': '#E1F5EE',
        culture: '#7A4FB0',
        'culture-bg': '#F1EAF7',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Space Grotesk"', 'sans-serif'],
        ui: ['"Geist"', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      boxShadow: {
        sticker: '4px 4px 0px rgba(12, 12, 12, 1)',
        'sticker-sm': '2px 2px 0px rgba(12, 12, 12, 1)',
        'sticker-lg': '6px 6px 0px rgba(12, 12, 12, 1)',
      },
      borderWidth: {
        sticker: '2.5px',
      },
    },
  },
  plugins: [],
}

export default config
