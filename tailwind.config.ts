import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        cream: "#fffbeb",
        brand: {
          green: "#059669",
          "green-dark": "#047857",
          "green-light": "#d1fae5",
          orange: "#f97316",
          "orange-dark": "#ea580c",
          "orange-light": "#ffedd5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
