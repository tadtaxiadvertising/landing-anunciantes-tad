/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        taxi: {
          400: '#FFD700',
          500: '#FFC700',
          600: '#FFB700',
        }
      }
    }
  },
  plugins: [],
}
