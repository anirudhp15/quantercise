/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "text-green-400",
    "text-blue-400",
    "text-purple-400",
    "text-sky-400",
    "text-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-sky-400",
    "bg-yellow-400",
    "border-green-400",
    "border-blue-400",
    "border-purple-400",
    "border-sky-400",
    "border-yellow-400",
  ],
  theme: {
    extend: {
      colors: {
        "sky-100": "#ebf8ff",
        "sky-200": "#bee3f8",
        "sky-300": "#90cdf4",
        "sky-400": "#38bdf8",
        "sky-500": "#0ea5e9",
        "sky-600": "#0284c7",
        "sky-700": "#0369a1",
        "cyan-400": "#0ed7b5",
        "cyan-500": "#06b6d4",
        github: "#",
        "github-hover": "#6e5494",
        linkedin: "#",
        "linkedin-hover": "#0A66C2",
        youtube: "#",
        "youtube-hover": "#FF0000",
        instagram: "#",
        "instagram-hover": "#E1306C",
        twitter: "#",
        "twitter-hover": "#1DA1F2",
      },
      fontFamily: {
        script: ["Dancing Script", "cursive"],
      },
      transitionProperty: {
        height: "height, max-height, padding, margin, opacity",
      },
      maxHeight: {
        0: "0",
        xl: "36rem", // or '1000px' or any max height you think the drawer will need
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        purple: "0 4px 14px 0 rgba(34, 16, 84, 0.39)",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        gradient: "gradient 6s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
