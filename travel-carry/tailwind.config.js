module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add your file paths
  ],
  theme: {
    extend: {
      animation: {
        airplane: "airplane-fly 3s linear infinite",
        date: "date-move 5s linear infinite", // New animation for dates
      },
      keyframes: {
        "airplane-fly": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "date-move": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(50%)", opacity: "1" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
