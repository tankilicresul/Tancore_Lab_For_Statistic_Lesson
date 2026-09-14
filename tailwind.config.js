/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        tancore: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8c1a',
          500: '#ff7a00', // Vibrant TanCoreLab Orange from image
          600: '#e56d00',
          700: '#cc6100',
          800: '#994900',
        }
      }
    },
  },
  plugins: [],
}
