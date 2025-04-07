/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        Main: "#a7a28f",
        Main_hover: "#8f8a7a",
      },
      keyframes: {
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(100px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "rotate-360": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "bounce-diagonal": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(4px, -4px)" },
        },
        "bounce-twice": {
          "0%, 100%": { transform: "translateY(0)" },
          "10%": { transform: "translateY(-10px)" },
          "20%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-10px)" },
          "40%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(0)" },
        },
        "text-shimmer": {
          "0%": {
            textShadow: "0 0 0 rgba(255, 255, 255, 0)",
          },
          "50%": {
            textShadow:
              "0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)",
          },
          "100%": {
            textShadow: "0 0 0 rgba(255, 255, 255, 0)",
          },
        },
        "text-shimmer-dark": {
          "0%": {
            textShadow: "0 0 0 rgba(0, 0, 0, 0)",
          },
          "50%": {
            textShadow:
              "0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.4)",
          },
          "100%": {
            textShadow: "0 0 0 rgba(0, 0, 0, 0)",
          },
        },
        "text-glow": {
          "0%": {
            textShadow:
              "0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)",
          },
          "100%": {
            textShadow:
              "0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)",
          },
        },
        "scroll-wheel": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 2s cubic-bezier(0.22, 1, 0.36, 1)",
        "spin-once": "rotate-360 0.3s ease-in-out",
        "bounce-diagonal": "bounce-diagonal 0.5s ease-in-out infinite",
        "bounce-twice": "bounce-twice 5s ease-in-out infinite",
        "text-shimmer": "text-shimmer 1.5s ease-in-out infinite",
        "text-shimmer-dark": "text-shimmer-dark 1.5s ease-in-out infinite",
        "text-glow": "text-glow 1s ease-in-out forwards",
        "text-glow-dark": "text-glow-dark 1s ease-in-out forwards",
        "scroll-wheel": "scroll-wheel 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
