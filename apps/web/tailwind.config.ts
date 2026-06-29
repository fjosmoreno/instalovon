import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ───── Violet Dusk palette (locked) ─────
        primary: {
          DEFAULT: "#502D55",
          soft: "#935073",
          deep: "#3A1F3E",
          ink: "#221629",
          surface: "#1F1726",
          mute: "#14101A",
        },
        cream: {
          DEFAULT: "#F8F4E9",
          soft: "#F6DBC0",
          deep: "#E8DEC5",
        },
        ink: {
          50: "#F8F4E9",
          100: "#E8DDE5",
          200: "#C5B8D1",
          300: "#8A748D",
          400: "#5C4D5F",
          500: "#3F2E42",
          600: "#2A1F2C",
          700: "#221629",
          800: "#1F1726",
          900: "#14101A",
          950: "#0B0810",
        },
        whisper: "rgba(248, 244, 233, 0.05)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Cal Sans",
          "Inter Display",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 30px 90px -20px rgba(147, 80, 115, 0.45)",
        "glow-sm": "0 8px 30px -10px rgba(147, 80, 115, 0.45)",
        "glow-lg": "0 50px 160px -30px rgba(80, 45, 85, 0.65)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -20px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "violet-dusk":
          "radial-gradient(120% 80% at 0% 0%, rgba(147, 80, 115, 0.25), transparent 55%), radial-gradient(80% 60% at 100% 0%, rgba(80, 45, 85, 0.30), transparent 60%), radial-gradient(70% 50% at 50% 100%, rgba(246, 219, 192, 0.10), transparent 60%), linear-gradient(180deg, #14101A 0%, #0B0810 100%)",
        "dusk-soft":
          "radial-gradient(100% 60% at 50% 0%, rgba(147, 80, 115, 0.18), transparent 60%), linear-gradient(180deg, #14101A 0%, #1F1726 100%)",
        "gradient-brand":
          "linear-gradient(135deg, #935073 0%, #502D55 50%, #3A1F3E 100%)",
        "gradient-cream":
          "linear-gradient(90deg, #F6DBC0 0%, #F8F4E9 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer-soft": {
          "0%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer-soft 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
