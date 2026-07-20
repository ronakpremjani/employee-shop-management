/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFEDD5',
        },
        darkbg: {
          DEFAULT: '#000000',
          card: '#0A0A0A',
          border: '#171717',
        }
      },
    },
  },
  plugins: [],
}
