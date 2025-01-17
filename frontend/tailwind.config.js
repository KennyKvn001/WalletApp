/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          900: '#2D3B2D',
          800: '#3A4D3A',
          // ... add more shades as needed
        },
        'sage': {
          100: '#E6EAE6',
          // ... add more shades as needed
        },
      },
    },
  },
  plugins: [],
}

