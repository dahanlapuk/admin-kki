/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C82333",
          50: "#FCE8EA",
          100: "#F9D1D5",
          200: "#F3A3AB",
          300: "#ED7581",
          400: "#E74757",
          500: "#C82333",
          600: "#A01C29",
          700: "#78151F",
          800: "#500E14",
          900: "#28070A",
        },
        secondary: {
          DEFAULT: "#353A40",
          50: "#E8E9EA",
          100: "#D1D3D5",
          200: "#A3A7AB",
          300: "#757B81",
          400: "#474F57",
          500: "#353A40",
          600: "#2A2E33",
          700: "#202326",
          800: "#15171A",
          900: "#0B0C0D",
        },
        accent: "#F0F1F1",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
