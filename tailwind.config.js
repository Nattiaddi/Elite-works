/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // የቅንጦት ወርቃማ ቀለሞች
        gold: {
          50: '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // ዋናው ወርቃማ
          600: '#ca8a04',
          700: '#a16207',
        }
      }
    },
  },
  plugins: [],
}