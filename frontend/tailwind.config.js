/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        teko: ["Teko", "sans-serif"],
        amita: ["Amita", "cursive"],
        lora: ["Lora", "serif"],
        satisfy: ["Satisfy", "cursive"],
        serif: ["DM Serif Text", "serif"],
        cinzel: ["Cinzel", "serif"],
      },
      colors: {
        gold: "#EAB303",
        lightBlue: "#F4F5FF",
      },
    },
  },
  plugins: [],
};
