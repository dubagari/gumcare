/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#53C6E2",
        secondary: "#EFEEF8",
        accent: "#FF7A3D",
      },
    },
  },
  plugins: [],
};
