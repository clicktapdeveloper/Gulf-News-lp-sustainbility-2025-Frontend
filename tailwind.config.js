// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)',
        borderc: 'var(--border-color)',
        whitec: 'var(--white-color)',
        cardc: 'var(--card-color)',
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      spacing: {
        section: 'var(--space-y)',
        'mobile-padding': '1rem',
        'tablet-padding': '1.5rem',
        'desktop-padding': '2.5rem',
        'standard-mobile-padding': '18px',
        'standard-tablet-padding': '24px',
        'standard-desktop-padding': '90px',
      },
      fontSize: {
        h1: 'var(--h1-size)',
        h4: 'var(--h4-size)',
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
        '7xl': 'var(--text-7xl)',
        '8xl': 'var(--text-8xl)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}