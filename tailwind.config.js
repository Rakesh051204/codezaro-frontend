module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        microsoft: {
          blue: "#0078D4",
          blueHover: "#106EBE",
          darkBg: "#1F1F1F",
          darkCard: "#2D2D2D",
          darkBorder: "#3D3D3D",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};