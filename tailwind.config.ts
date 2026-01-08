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
        darkNavy: "#1a1f3a",
        navy: "#2d3561",
        gold: "#d4af37",
        lightGold: "#f4e4bc",
      },
    },
  },
  plugins: [],
};
export default config;
