import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        script: ["'Dancing Script'", "cursive"],
      },
      colors: {
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        parchment: {
          50:  "#fdf8f0",
          100: "#f9edda",
          200: "#f2d9b3",
          300: "#e8be82",
          400: "#dc9e4f",
        },
        ink: {
          900: "#1a1209",
          800: "#2d2010",
          700: "#3d2e18",
          600: "#4f3d22",
          500: "#6b5535",
        },
      },
      keyframes: {
        "float":       { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "fade-up":     { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "shimmer":     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "glow-pulse":  { "0%,100%": { boxShadow: "0 0 20px rgba(251,191,36,0.3)" }, "50%": { boxShadow: "0 0 50px rgba(251,191,36,0.7)" } },
        "fire-pulse":  { "0%,100%": { textShadow: "0 0 20px rgba(251,146,60,0.8)" }, "50%": { textShadow: "0 0 40px rgba(251,146,60,1),0 0 60px rgba(251,146,60,0.5)" } },
        "cross-glow":  { "0%,100%": { opacity: "0.06" }, "50%": { opacity: "0.12" } },
      },
      animation: {
        "float":       "float 6s ease-in-out infinite",
        "fade-up":     "fade-up 0.7s ease-out forwards",
        "shimmer":     "shimmer 3s linear infinite",
        "glow-pulse":  "glow-pulse 3s ease-in-out infinite",
        "fire-pulse":  "fire-pulse 2s ease-in-out infinite",
        "cross-glow":  "cross-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
