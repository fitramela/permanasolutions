/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        xl: "1280px",
        "2xl": "1334px",
      },
    },

    extend: {
      colors: {
        primary: "#05638B",
        secondary: "#04BCBC",

        primaryLight: "#0D7DB1",
        secondaryLight: "#38D9D9",

        background: "#FFFFFF",
        surface: "#F8FAFC",
        muted: "#6B7280",

        border: "#E5E7EB",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,.08)",
        navbar: "0 2px 10px rgba(0,0,0,.05)",
        button: "0 8px 20px rgba(4,188,188,.25)",
        hero: "0 20px 60px rgba(5,99,139,.18)",
      },

      borderRadius: {
        xl: "20px",
        "2xl": "30px",
        "3xl": "40px",
        pill: "9999px",
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg,#05638B 0%,#04BCBC 100%)",

        "hero-gradient":
          "linear-gradient(135deg,#05638B 0%,#04BCBC 100%)",

        "section-gradient":
          "linear-gradient(180deg,#ffffff 0%,#f5fbfc 100%)",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
      },
    },
  },

  plugins: [],

plugins: [scrollbarHide],
};