/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: "'Lato','san-sarif'",
      },
    },
  },
  daisyui: {
    themes: ["light"], // Explicitly set the theme to light
  },
  plugins: [require("daisyui")],
};
