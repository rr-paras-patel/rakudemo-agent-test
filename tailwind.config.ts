import type { Config } from "tailwindcss";

const slate = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => [n, `rgb(var(--slate-${n}) / <alpha-value>)`]),
);

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate,
        surface: "rgb(var(--surface) / <alpha-value>)",
        raku: {
          50: "#fff1f2",
          100: "#ffe0e3",
          400: "#fb7185",
          500: "#e11d48",
          600: "#be123c",
          700: "#9f1239",
        },
      },
      boxShadow: { card: "0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.06)" },
    },
  },
  plugins: [],
};
export default config;
