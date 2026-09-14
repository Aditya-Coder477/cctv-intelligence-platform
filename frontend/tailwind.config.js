/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          950: "#060d1b",
          900: "#0b1528",
          850: "#0f1c35",
          800: "#132442",
          700: "#1e3a6a",
          600: "#274c8b",
          500: "#3262b2",
          400: "#5b8be0",
        },
      },
    },
  },
  plugins: [],
}
