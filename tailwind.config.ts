import type { Config } from "tailwindcss";

/**
 * Record Lab Modern — design tokens.
 * Loaded by Tailwind v4 through `@config` in src/app/globals.css.
 *
 * NOTE: the orange accent is exposed as `brand` (not `accent`) because
 * shadcn already owns `accent` / `bg-accent` as a neutral hover surface.
 */
const config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F0",
        ink: "#1C2B33",
        "ink-soft": "#4B5A63",
        line: "#E5DECB",
        brand: {
          DEFAULT: "#C2410C",
          hover: "#9A3412",
          ink: "#7C2D12",
          soft: "#FDE8D8",
        },
        "doc-red": "#B3261E",
      },
      fontFamily: {
        display: ["var(--font-rl-display)", "Georgia", "serif"],
        body: ["var(--font-app-sans)", "system-ui", "sans-serif"],
        label: ["var(--font-app-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        panel: "1.75rem",
        card: "1.5rem",
        modal: "2rem",
        menu: "1rem",
        input: "14px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(28,43,51,.04), 0 16px 48px -20px rgba(28,43,51,.22)",
        card: "0 1px 2px rgba(28,43,51,.04), 0 10px 28px -16px rgba(28,43,51,.16)",
        small: "0 1px 2px rgba(28,43,51,.06), 0 4px 12px -6px rgba(28,43,51,.12)",
        primary: "0 8px 20px -8px rgba(194,65,12,.75), inset 0 1px 0 rgba(255,255,255,.2)",
        menu: "0 18px 50px -16px rgba(28,43,51,.4)",
        modal: "0 30px 80px -20px rgba(28,43,51,.5)",
        toast: "0 18px 40px -12px rgba(0,0,0,.5)",
        tile: "0 6px 14px -6px rgba(194,65,12,.6)",
      },
    },
  },
} satisfies Config;

export default config;
