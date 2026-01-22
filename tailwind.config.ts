import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0a0f2c",
        indigoDeep: "#0c1440",
        neon: "#6ee7ff",
        cyanGlow: "#7df9ff"
      },
      boxShadow: {
        glow: "0 0 15px rgba(110, 231, 255, 0.18)",
        card: "0 18px 60px rgba(9, 17, 54, 0.45)"
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(125, 249, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125, 249, 255, 0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

