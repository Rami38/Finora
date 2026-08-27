/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces — near-black, not pure black, so cards can lift off it.
        base: '#0B0E14',
        surface: '#12161F',
        'surface-hover': '#181D29',
        border: '#232838',
        // Brand accent — indigo, matches the Finora mark.
        accent: {
          DEFAULT: '#6C5CE7',
          hover: '#7B6DF0',
          muted: '#2A2455',
        },
        // Semantic colors for income/expense/savings, kept distinct from accent.
        income: '#2ECC8F',
        expense: '#FF6B6B',
        savings: '#4FC3E8',
        muted: '#8B93A7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
