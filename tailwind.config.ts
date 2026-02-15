import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d7f0ff",
          200: "#b4e5ff",
          300: "#7fd4ff",
          400: "#3bb8ff",
          500: "#0094e6",
          600: "#0074bc",
          700: "#005c97",
          800: "#014f7a",
          900: "#064365"
        }
      }
    }
  },
  plugins: []
};

export default config;
