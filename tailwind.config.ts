import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#7B1E1E",
        gold: "#D4AF37",
        sandal: "#F8F1E5",
        saffron: "#FF9933",
        beige: "#F5F5DC",
        "header-yellow": "#FDE047",
        "text-dark": "#2B2113",
        "light-green": "#b8e6d5"
      },
      fontFamily: {
        heading: ["var(--app-font-heading)", "Georgia", "serif"],
        body: ["var(--app-font-body)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft-gold": "0 12px 30px rgba(212, 175, 55, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;

