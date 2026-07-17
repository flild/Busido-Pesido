import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Базовая палитра (V13/V14)
        matcha: "#4E6B2E",
        forest: "#2F3F17",
        soldier: "#1E2B0E",
        snow: "#F7F3EF",
        fog: "#E6DACF",
        oat: "#D8D3B3",
        espresso: "#571F0B",
        caramel: "#C68E6B",
        rose: "#E14D75",
        berry: "#F07296",
        ice: "#6F8FBF",
        coal: "#141414",
        white: "#FFFFFF",
        
        // Алиасы для обратной совместимости (пока не выпилим всё)
        ink: "#141414",
        paper: "#F7F3EF",
        green: "#2F3F17",
        purple: "#4E6B2E",
        pink: "#C68E6B",
        blue: "#6F8FBF",
      },
      fontFamily: {
        sans: [
          '"Avenir Next"',
          "Avenir",
          '"Segoe UI"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      backgroundImage: {
        // Сложные градиенты из твоего V14
        "gradient-dopamine": "linear-gradient(110deg, #4E6B2E, #C68E6B 32%, #F07296 58%, #E14D75 75%, #6F8FBF)",
        "gradient-warm": "linear-gradient(135deg, #C68E6B, #571F0B)",
        "gradient-rose": "linear-gradient(135deg, #F07296, #E14D75)",
        "gradient-green": "linear-gradient(135deg, #4E6B2E, #2F3F17, #1E2B0E)",
        "gradient-ice": "linear-gradient(135deg, #F7F3EF, #6F8FBF)",
      },
      keyframes: {
        floatBlob: {
          "to": { transform: "translate3d(18px, -14px, 0) rotate(12deg)" },
        },
        pulseHint: {
          "70%": { boxShadow: "0 0 0 9px rgba(225, 77, 117, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(225, 77, 117, 0)" },
        },
      },
      animation: {
        "float-blob": "floatBlob 11s ease-in-out infinite alternate",
        "pulse-hint": "pulseHint 1.7s infinite",
      },
      screens: {
        // Кастомные брейкпоинты для твоего max-width подхода
        "tablet": { max: "1080px" },
        "mobile": { max: "760px" },
      },
    },
  },
  plugins: [],
};

export default config;