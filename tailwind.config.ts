import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#102a43", teal: "#087e8b", mint: "#e8f7f5", paper: "#f7fafc" }, boxShadow: { soft: "0 18px 50px rgba(16,42,67,.08)" } } },
  plugins: [],
};
export default config;
