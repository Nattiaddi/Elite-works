/** @type {import('tailwindcss').Config} */
module.exports = {
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
      colors: {
        // The core branding colors
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#B8962E',
        },
        obsidian: {
          DEFAULT: '#0A0A0A',
          soft: '#111111', // For cards and section backgrounds
          muted: '#1A1A1A', // For borders or lighter backgrounds
        },
      },
      backgroundImage: {
        // A premium gradient for buttons or text
        'gold-gradient': 'linear-gradient(to right, #D4AF37, #F3E5AB, #B8962E)',
      },
      fontFamily: {
        // Recommended fonts for a premium feel
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Good for high-end headings
      },
    },
  },
  plugins: [],
}