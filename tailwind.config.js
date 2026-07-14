/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#dc2626', // Color base (lo ajustaremos al extraer la paleta exacta del logo)
          600: '#b91c1c',
          900: '#7f1d1d',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#27272a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}