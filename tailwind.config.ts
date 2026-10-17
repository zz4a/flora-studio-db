import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: { extend: { fontFamily: { display: ["Cormorant Garamond", "Georgia", "serif"], sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"] }, boxShadow: { botanical: "0 12px 36px rgba(33,45,31,.10)" } } },
  plugins: [],
};
export default config;
