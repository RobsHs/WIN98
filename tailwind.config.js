/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        win: [
          '"MS Sans Serif"',
          '"Microsoft Sans Serif"',
          "Tahoma",
          "Arial",
          "sans-serif",
        ],
        mono: ['"Lucida Console"', '"Courier New"', "Courier", "monospace"],
      },
      colors: {
        winBg: "#c0c0c0",
        winLight: "#ffffff",
        winLightGray: "#dfdfdf",
        winDarkGray: "#808080",
        winBlack: "#000000",
        winDesktop: "#008080",
        winNavy: "#000080",
      },
    },
  },
  plugins: [],
};
