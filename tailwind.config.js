/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0f',
        surface: '#1a1a2e',
        border: '#2a2a4a',
        brand: '#7b61ff',
        accent: '#00d4aa',
      },
    },
  },
  plugins: [],
};
