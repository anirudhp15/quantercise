/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
