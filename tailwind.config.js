/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#133E87',
        brandGreen: '#27AE60',
        danger: "#FF2442",
        warning: "#FF683A"
      }
    },
  },
  plugins: [],
}