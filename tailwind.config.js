/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing:{
        "18":"150px"
      },
      colors:{
        background: "#FFFAF5",
        OrangeButton: "#E16A00",
        TextColor: "#241400",
        FooterBackground: "#391F00"
      }
    },
  },
  plugins: [],
}

