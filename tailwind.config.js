/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#030712" /* Darker background */,
        secondary: "#94a3b8" /* Muted text color */,
        tertiary: "#0f172a" /* Slightly lighter background for cards */,
        "black-100": "#1e293b" /* Darker accent for sections */,
        "black-200": "#0f172a" /* Darker accent for cards */,
        "white-100": "#f1f5f9" /* Slightly off-white for text */,
        accent: "#8b5cf6" /* Main purple accent */,
        "accent-dark": "#7c3aed" /* Darker purple for hover states */,
        "accent-light": "#a78bfa" /* Lighter purple for highlights */,
        "dark-border": "#1e293b" /* Dark border color */,
      },
      boxShadow: {
        glow: "0 4px 12px rgba(139, 92, 246, 0.25)",
        "glow-lg": "0 8px 20px rgba(139, 92, 246, 0.3)",
        subtle: "0 2px 6px rgba(0, 0, 0, 0.15)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
      keyframes: {
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(15px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.05" },
          "50%": { opacity: "0.2" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shine: "shine 5s linear infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-reverse": "float-reverse 5s ease-in-out infinite",
        "pulse-slow": "pulse-slow 7s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};
