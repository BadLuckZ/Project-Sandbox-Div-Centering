const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
      },
      colors: {
        black: "var(--Project-Sandbox-Black)",
        "secondary-black": {
          900: "var(--Project-Sandbox-Secondary-Black-900)",
          700: "var(--Project-Sandbox-Secondary-Black-700)",
          300: "var(--Project-Sandbox-Secondary-Black-300)",
        },
        "primary-red": {
          700: "var(--Project-Sandbox-Primary-Red-700)",
        },
        danger: "var(--Project-Sandbox-Danger)",
        white: "var(--Project-Sandbox-White)",
      },
    },
  },
  plugins: [],
};
