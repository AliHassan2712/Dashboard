import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@uploadthing/react/dist**",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          background: {
            light: "#fafafa",
            dark: "#09090b",
          },
          card: {
            light: "#ffffff",
            dark: "#18181b",
          },
          border: {
            light: "#e4e4e7",
            dark: "#27272a",
          },
          text: {
            primary: {
              light: "#18181b",
              dark: "#fafafa",
            },
            secondary: {
              light: "#71717a",
              dark: "#a1a1aa",
            },
            muted: {
              light: "#a1a1aa",
              dark: "#71717a",
            },
          },
        },
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        success: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      boxShadow: {
        premium:
          "0 1px 2px rgba(24, 24, 27, 0.06), 0 8px 24px rgba(24, 24, 27, 0.08)",
        "premium-dark":
          "0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #8b5cf6 0%, #6366f1 45%, #06b6d4 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(6, 182, 212, 0.12) 100%)",
      },
    },
  },
  plugins: [],
};

export default withUt(config);
