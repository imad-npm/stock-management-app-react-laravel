/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        'light-gray': 'var(--color-light-gray)',
        danger: '#ef4444',
        warning: '#f97316',
      },
    },
  },
  plugins: [],
}