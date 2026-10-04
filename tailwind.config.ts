import type { Config } from "tailwindcss";

// PeoplePulse design tokens — PRD §17–18, implementation plan AD-11.
// Values mirror design.html (visual reference only; this config is authoritative for the app).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
        ink: "#17212B",
        paper: "#F8FAF9",
        "signal-teal": "#0F766E",
        success: "#15803D",
        warning: "#D97706",
        error: "#DC2626",
        border: "#E5E7EB",
        muted: "#64748B",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
