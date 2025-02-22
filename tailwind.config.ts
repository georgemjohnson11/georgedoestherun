import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // Enable dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkBackground: "#1a202c", // Dark mode background color
        darkForeground: "#a0aec0", // Dark mode foreground color
      },
    },
  },
  plugins: [],
} satisfies Config;